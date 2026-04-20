import { claimRepository } from "./claimRepository";
import { getSecurePresignedUrl, uploadMultipleFiles } from "@/storgae/s3Service";
import { logAction } from "@/util/helper";
import { sendStatusUpdateEmail } from "@/mail/emailService";
type CreateClaimInput = {
    itemId: string;
    studentId: string;
    proofDescription: string;
    files: File[];
};

type ReviewClaimInput = {
    claimId: string;
    status: "approved" | "rejected";
    adminId: string;
};

class ClaimService {
    constructor(private repo: typeof claimRepository) {}
    // clean the claim file key to get the correct s3 key for generating presigned url, this is needed to handle the transition period where some claim files may have fileUrl as the s3 key and some may have the actual s3Key field
    private cleanClaimFileKey(file: { s3Key: string; fileUrl: string }) {
        const preferred = file.s3Key?.trim();
        if (preferred) {
            return preferred;
        }

        return file.fileUrl;
    }
    // helper function to help prevent potential duplicate claims for the same item by the same student
    async hasExistingClaim(itemId: string, studentId: string) {
        const exists = await this.repo.hasClaimForItemByStudent(itemId, studentId);
        await logAction(
            studentId,
            "CLAIM_EXISTENCE_CHECKED",
            `itemId=${itemId}; exists=${exists}`
        );
        return exists;
    }
    // endpoint for student to file a claim
    async fileClaim(input: CreateClaimInput) {
        const uploadedKeys = await uploadMultipleFiles(input.files, "claims", false);

        const fileRows = uploadedKeys.map((key, index) => {
            const originalFile = input.files[index];

            return {
                fileName: originalFile.name,
                fileType: originalFile.type || null,
                fileUrl: key,
                s3Key: key,
                uploadedById: input.studentId,
            };
        });

        const createdClaim = await this.repo.createClaimWithStatusUpdate({
            itemId: input.itemId,
            studentId: input.studentId,
            proofDescription: input.proofDescription,
        }, fileRows);

        await logAction(
            input.studentId,
            createdClaim ? "CLAIM_FILED" : "CLAIM_FILE_FAILED",
            `itemId=${input.itemId}; files=${input.files.length}`
        );

        return createdClaim;
    }

    // for view claim details with secure file access for both admin and student
    async getClaimDetailById(id: string) {
        const claim = await this.repo.getClaimByIdWithFiles(id);

        if (!claim) {
            await logAction(null, "CLAIM_FETCHED_BY_ID", `claimId=${id}; found=false`);
            return null;
        }

        const files = await Promise.all(
            claim.files.map(async (file) => {
                try {
                    const key = this.cleanClaimFileKey(file);
                    const accessUrl = await getSecurePresignedUrl(key);
                    return {
                        id: file.id,
                        claimId: file.claimId,
                        fileName: file.fileName,
                        fileType: file.fileType,
                        uploadedAt: file.uploadedAt,
                        accessUrl,
                    };
                } catch {
                    return {
                        id: file.id,
                        claimId: file.claimId,
                        fileName: file.fileName,
                        fileType: file.fileType,
                        uploadedAt: file.uploadedAt,
                        accessUrl: null,
                    };
                }
            })
        );

        const claimDetail = {
            ...claim,
            files,
        };

        await logAction(
            null,
            "CLAIM_FETCHED_BY_ID",
            `claimId=${id}; found=true; files=${files.length}`
        );

        return claimDetail;
    }
    // get all claims for admin dashboard
    async getAllClaims() {
        const claims = await this.repo.getAllClaims();
        await logAction(null, "CLAIMS_FETCHED_ALL", `count=${claims.length}`);
        return claims;
    }
    // get all claims for a specific student
    async getClaimsByStudentId(studentId: string) {
        const claims = await this.repo.getClaimsByStudentId(studentId);
        await logAction(studentId, "CLAIMS_FETCHED_BY_STUDENT", `count=${claims.length}`);
        return claims;
    }

    // endpoint for admin to review the claim and update the status
    async reviewClaim(input: ReviewClaimInput) {
        const reviewedClaim = await this.repo.reviewClaim(input.claimId, {
            status: input.status,
            adminId: input.adminId,
        });

        await logAction(
            input.adminId,
            reviewedClaim ? "CLAIM_REVIEWED" : "CLAIM_REVIEW_FAILED",
            `claimId=${input.claimId}; status=${input.status}`
        );

        if (reviewedClaim) {
            const emailContext = await this.repo.getClaimEmailContext(input.claimId);

            if (emailContext?.studentEmail) {
                await sendStatusUpdateEmail(
                    emailContext.studentEmail,
                    emailContext.studentName,
                    emailContext.itemName,
                    input.status
                );
            }
        }

        return reviewedClaim;
    }
}

export const claimService = new ClaimService(claimRepository);
