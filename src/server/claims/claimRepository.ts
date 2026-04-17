import { claimsTable, itemsTable } from "@/db/schema/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

type CreateClaimParams = {
    itemId: string;
    studentId: string;
    proofDescription: string;
};

type ClaimReviewParams = {
    status: "approved" | "rejected";
    adminId: string;
};

class ClaimRepository {
    async createClaimWithStatusUpdate(claim: CreateClaimParams) {
        return db.transaction(async (tx) => {
            const [createdClaim] = await tx
                .insert(claimsTable)
                .values(claim)
                .returning();

            if (!createdClaim) {
                return null;
            }

            // Update item status to "claimed"
            await tx
                .update(itemsTable)
                .set({
                    status: "claimed",
                    updatedAt: new Date(),
                })
                .where(eq(itemsTable.id, claim.itemId));

            return createdClaim;
        });
    }

    async getClaimById(id: string) {
        const [claim] = await db
            .select()
            .from(claimsTable)
            .where(eq(claimsTable.id, id))
            .limit(1);

        return claim ?? null;
    }

    async getAllClaims() {
        return db.select().from(claimsTable);
    }

    async getClaimsByStudentId(studentId: string) {
        return db
            .select()
            .from(claimsTable)
            .where(eq(claimsTable.studentId, studentId));
    }

    async getClaimsByItemId(itemId: string) {
        return db
            .select()
            .from(claimsTable)
            .where(eq(claimsTable.itemId, itemId));
    }

    async reviewClaim(
        id: string,
        reviewParams: ClaimReviewParams
    ) {
        return db.transaction(async (tx) => {
            const [claim] = await tx
                .select()
                .from(claimsTable)
                .where(eq(claimsTable.id, id))
                .limit(1);

            if (!claim) {
                return null;
            }

            const [updatedClaim] = await tx
                .update(claimsTable)
                .set({
                    status: reviewParams.status,
                    reviewedById: reviewParams.adminId,
                    updatedAt: new Date(),
                })
                .where(eq(claimsTable.id, id))
                .returning();

            // Update item status based on claim review
            const itemStatus = reviewParams.status === "approved" ? "approved_claim" : "lost";
            await tx
                .update(itemsTable)
                .set({
                    status: itemStatus,
                    updatedAt: new Date(),
                })
                .where(eq(itemsTable.id, claim.itemId));

            return updatedClaim ?? null;
        });
    }


}

export const claimRepository = new ClaimRepository();
