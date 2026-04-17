import { claimRepository } from "./claimRepository";

type CreateClaimInput = {
    itemId: string;
    studentId: string;
    proofDescription: string;
};

type ReviewClaimInput = {
    claimId: string;
    status: "approved" | "rejected";
    adminId: string;
};

class ClaimService {
    constructor(private repo: typeof claimRepository) {}

    async fileClaim(input: CreateClaimInput) {
        return this.repo.createClaimWithStatusUpdate({
            itemId: input.itemId,
            studentId: input.studentId,
            proofDescription: input.proofDescription,
        });
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
