import s3Client from "@/storgae/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logAction } from "@/util/helper";


const SPACE_NAME = process.env.SPACE_BUCKET_NAME!;

const normalizeObjectKey = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        try {
            const parsed = new URL(trimmed);
            const key = parsed.pathname.replace(/^\/+/, "");
            return key || null;
        } catch {
            return null;
        }
    }

    return trimmed;
};

/**
 * Flow DocBlock:
 * The type of items is divided into 2 categories: "items" (public) and "claims" (private).
 * 
 * 1. When uploading, we convert the Web API File into a Node.js Buffer, generate a unique filename, and send a PutObjectCommand to S3.
 * 2. For public files (items), we return the full CDN URL immediately so it can be stored in Drizzle and displayed on the frontend.
 * 3. For private files (claims), we return the S3 Object Key, which is stored in Drizzle. When the user wants to view it, we generate a presigned URL on demand.
 * 
 * The idea is that for claims, we never store or expose the actual S3 URL or credentials. Instead, we only store a reference (the key) and generate secure, temporary URLs when needed. This way, even if someone tries to guess the URL, they won't be able to access the file without going through our backend logic.
 * The reasons why items can be public are:
 * - They are meant to be displayed on the marketplace, so they need to be easily accessible.
 * - The content is not sensitive, so there are no privacy concerns.
 * - Using public-read ACL allows for faster delivery via CDN without the overhead of generating presigned URLs.
 */

/**
 * Uploads multiple Web API File objects to DigitalOcean Spaces concurrently.
 * * @param files Array of standard Web File objects
 * @param folder The target folder in the bucket ("items" or "claims")
 * @param isPublic Whether the files should be publicly readable via CDN
 * @returns Array of URLs (for public) or Object Keys (for private)
 */
export async function uploadMultipleFiles(
    files: File[], 
    folder: "items" | "claims", 
    isPublic: boolean = true
): Promise<string[]> {
    try {
        const uploadPromises = files.map(async (file) => {
            //  Web File to Node.js Buffer
            // The S3 library expects a Node Buffer for file contents
            // normally files are of JS File type, which is a web API
            // so we need to convert it into a web buffer first to get rid of meta data then convert it into a node buffer
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique filename to prevent guessing for ACL security purposes
            const extension = file.name.split('.').pop();
            const uniqueFileName = `${crypto.randomUUID()}.${extension}`;
            const key = `${folder}/${uniqueFileName}`;

            // Prepare the upload command
            const command = new PutObjectCommand({
                Bucket: SPACE_NAME,
                Key: key,
                Body: buffer,
                ACL: isPublic ? "public-read" : "private", // decide between public or private based on the folder type and use ACL to set permissions at upload time, which is more secure than making it public later
                ContentType: file.type,
            });

            //Fire the upload
            await s3Client.send(command);

            // Return the appropriate reference
            if (isPublic) {
                // Return the full public CDN URL and save to drizzle

                return `https://${SPACE_NAME}.${process.env.SPACE_REGION}.cdn.digitaloceanspaces.com/${key}`;
            }

            // If private, return the key to presign later when the user wants to access it
            return key;
        });

        // Execute all uploads at the exact same time
        const uploadedReferences = await Promise.all(uploadPromises);

        await logAction(
            null,
            "S3_FILES_UPLOADED",
            `folder=${folder}; public=${isPublic}; count=${uploadedReferences.length}`
        );

        return uploadedReferences;
    } catch (error) {
        await logAction(
            null,
            "S3_FILES_UPLOAD_FAILED",
            `folder=${folder}; public=${isPublic}; count=${files.length}`
        );

        throw error;
    }
}

/**
 * Generates a temporary, secure URL for a private file (like a claim proof).
 * * @param key The exact path stored in the database (e.g., "claims/123-abc.jpg")
 * @param expiresInSeconds How long the URL is valid for (default: 5 minutes)
 * @returns A temporary signed URL
 */
export async function getSecurePresignedUrl(
    key: string, 
    expiresInSeconds: number = 300
): Promise<string> {
    // Since we store a whole path for public file, and only key for private file
    // We need to normalize the key because the library is very strict about the format
    // there is no prefix "/" and no empty space nor "https://" allowed, otherwise it will throw error and fail to generate the presigned url
    const normalizedKey = normalizeObjectKey(key);

    if (!normalizedKey) {
        throw new Error("INVALID_OBJECT_KEY");
    }

    try {
        const command = new GetObjectCommand({
            Bucket: SPACE_NAME,
            Key: normalizedKey,
        });

        // Ask DigitalOcean to generate a cryptographic signature for this specific file
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresInSeconds
        });

        await logAction(
            null,
            "S3_PRESIGNED_URL_GENERATED",
            `key=${normalizedKey}; expires in seconds=${expiresInSeconds}`
        );

        return signedUrl;
    } catch (error) {
        await logAction(
            null,
            "S3_PRESIGNED_URL_FAILED",
            `key=${normalizedKey}; expires in seconds=${expiresInSeconds}`
        );

        throw error;
    }
}