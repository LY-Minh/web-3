import { claimRepository } from "./claimRepository";
import { uploadMultipleFiles } from "@/storgae/s3Service";

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
        return this.repo.hasClaimForItemByStudent(itemId, studentId);
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

        return this.repo.createClaimWithStatusUpdate({
            itemId: input.itemId,
            studentId: input.studentId,
            proofDescription: input.proofDescription,
        }, fileRows);
    }

    async getClaimById(id: string) {
        return this.repo.getClaimById(id);
    }

    async getAllClaims() {
        return this.repo.getAllClaims();
    }

    async getClaimsByStudentId(studentId: string) {
        return this.repo.getClaimsByStudentId(studentId);
    }

    async getClaimsByItemId(itemId: string) {
        return this.repo.getClaimsByItemId(itemId);
    }

    async reviewClaim(input: ReviewClaimInput) {
        return this.repo.reviewClaim(input.claimId, {
            status: input.status,
            adminId: input.adminId,
        });
    }
}

export const claimService = new ClaimService(claimRepository);
