import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
    region: process.env.SPACE_REGION!,
    endpoint: process.env.SPACE_ORIGIN_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.SPACE_ACCESS_KEY!,
        secretAccessKey: process.env.SPACE_SECRET_KEY!,
    },
});

export default s3Client;