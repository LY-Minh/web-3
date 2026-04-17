import { claimRepository } from "./claimRepository";
import { uploadMultipleFiles } from "@/storgae/s3Service";
import { logAction } from "@/util/helper";

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

    async hasExistingClaim(itemId: string, studentId: string) {
        const exists = await this.repo.hasClaimForItemByStudent(itemId, studentId);
        await logAction(
            studentId,
            "CLAIM_EXISTENCE_CHECKED",
            `itemId=${itemId}; exists=${exists}`
        );
        return exists;
    }

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

    async getClaimById(id: string) {
        const claim = await this.repo.getClaimById(id);
        await logAction(null, "CLAIM_FETCHED_BY_ID", `claimId=${id}; found=${Boolean(claim)}`);
        return claim;
    }

    async getAllClaims() {
        const claims = await this.repo.getAllClaims();
        await logAction(null, "CLAIMS_FETCHED_ALL", `count=${claims.length}`);
        return claims;
    }

    async getClaimsByStudentId(studentId: string) {
        const claims = await this.repo.getClaimsByStudentId(studentId);
        await logAction(studentId, "CLAIMS_FETCHED_BY_STUDENT", `count=${claims.length}`);
        return claims;
    }

    async getClaimsByItemId(itemId: string) {
        const claims = await this.repo.getClaimsByItemId(itemId);
        await logAction(null, "CLAIMS_FETCHED_BY_ITEM", `itemId=${itemId}; count=${claims.length}`);
        return claims;
    }

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

        return reviewedClaim;
    }
}

export const claimService = new ClaimService(claimRepository);
