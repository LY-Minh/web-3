import { claimsTable, filesTable, itemsTable, pickupAgreementsTable } from "@/db/schema/schema";
import { userTable } from "@/db/schema/auth-schema";
import { db } from "@/db";
import { and, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const studentUser = alias(userTable, "claim_student_user");
const reviewerUser = alias(userTable, "claim_reviewer_user");

type CreateClaimParams = {
    itemId: string;
    studentId: string;
    proofDescription: string;
};

type CreateClaimFileParams = {
    fileName: string;
    fileType: string | null;
    fileUrl: string;
    s3Key: string;
    uploadedById: string;
};

type ClaimReviewParams = {
    status: "approved" | "rejected";
    adminId: string;
};


class ClaimRepository {
    // create a claim and its file, also update the item status to "claimed"
    async createClaimWithStatusUpdate(
        claim: CreateClaimParams,
        files: CreateClaimFileParams[] = []
    ) {
        // get the item
        return db.transaction(async (tx) => {
            const [item] = await tx
                .select()
                .from(itemsTable)
                .where(eq(itemsTable.id, claim.itemId))
                .limit(1);
        // guard clause to handle error early
            if (!item) {
                throw new Error("ITEM_NOT_FOUND");
            }

            if (item.status === "approved_claim") {
                throw new Error("ITEM_NOT_CLAIMABLE");
            }
        // prevent duplicate claims for the same item by the same student
        // this can easily happen
            const [existingClaim] = await tx
                .select({ id: claimsTable.id })
                .from(claimsTable)
                .where(
                    and(
                        eq(claimsTable.itemId, claim.itemId),
                        eq(claimsTable.studentId, claim.studentId)
                    )
                )
                .limit(1);

            if (existingClaim) {
                throw new Error("DUPLICATE_CLAIM");
            }
        // create the claim record in the database with status to "pending" (db default value)
            const [createdClaim] = await tx
                .insert(claimsTable)
                .values(claim)
                .returning();

            if (!createdClaim) {
                return null;
            }   
        // in case there are files attached to the claim, create the file records in the database
            if (files.length > 0) {
                await tx.insert(filesTable).values(
                    files.map((file) => ({
                        ...file,
                        claimId: createdClaim.id,
                        itemId: null,
                        isActive: true,
                    }))
                );
            }

        // Update item status to "claimed"
            if (item.status === "lost") {
                await tx
                    .update(itemsTable)
                    .set({
                        status: "claimed",
                        updatedAt: new Date(),
                    })
                    .where(eq(itemsTable.id, claim.itemId));
            }

            return createdClaim;
        });
    }

    // get claim by id with its attached files 
    async getClaimByIdWithFiles(id: string) {
        // get the claim
        const [claim] = await db
            .select()
            .from(claimsTable)
            .where(eq(claimsTable.id, id))
            .limit(1);

        if (!claim) {
            return null;
        }
        // get the files attached to the claim
        const files = await db
            .select({
                id: filesTable.id,
                claimId: filesTable.claimId,
                fileName: filesTable.fileName,
                fileType: filesTable.fileType,
                fileUrl: filesTable.fileUrl,
                s3Key: filesTable.s3Key,
                uploadedAt: filesTable.uploadedAt,
            })
            .from(filesTable)
            .where(and(eq(filesTable.claimId, id), eq(filesTable.isActive, true)));
        // return the claim with its files
        return {
            ...claim,
            files,
        };
    }
    // get all claims with related data for admin dashboard
    async getAllClaims() {
        return db
            .select({
                id: claimsTable.id,
                itemId: claimsTable.itemId,
                studentId: claimsTable.studentId,
                proofDescription: claimsTable.proofDescription,
                status: claimsTable.status,
                reviewedById: claimsTable.reviewedById,
                createdAt: claimsTable.createdAt,
                updatedAt: claimsTable.updatedAt,
                itemName: itemsTable.name,
                itemCategory: itemsTable.category,
                itemStatus: itemsTable.status,
                studentName: studentUser.name,
                studentEmail: studentUser.email,
                reviewerName: reviewerUser.name,
            })
            .from(claimsTable)
            .innerJoin(itemsTable, eq(claimsTable.itemId, itemsTable.id))
            .innerJoin(studentUser, eq(claimsTable.studentId, studentUser.id))
            .leftJoin(reviewerUser, eq(claimsTable.reviewedById, reviewerUser.id))
            .orderBy(desc(claimsTable.createdAt));
    }
    // get all claims but limit to student id scope
    async getClaimsByStudentId(studentId: string) {
        return db
            .select()
            .from(claimsTable)
            .where(eq(claimsTable.studentId, studentId));
    }

    // custom function to check if a student has already made a claim for a specific item, used to prevent duplicate claims
    async hasClaimForItemByStudent(itemId: string, studentId: string) {
        const [claim] = await db
            .select({ id: claimsTable.id })
            .from(claimsTable)
            .where(
                and(
                    eq(claimsTable.itemId, itemId),
                    eq(claimsTable.studentId, studentId)
                )
            )
            .limit(1);

        return Boolean(claim);
    }
    // get all the necessary information to send email notification to student when their claim is reviewed
    async getClaimEmailContext(claimId: string) {
        const [context] = await db
            .select({
                studentName: studentUser.name,
                studentEmail: studentUser.email,
                itemName: itemsTable.name,
            })
            .from(claimsTable)
            .innerJoin(itemsTable, eq(claimsTable.itemId, itemsTable.id))
            .innerJoin(studentUser, eq(claimsTable.studentId, studentUser.id))
            .where(eq(claimsTable.id, claimId))
            .limit(1);

        return context ?? null;
    }
    // review claim function for admin
    async reviewClaim(
        id: string,
        reviewParams: ClaimReviewParams
    ) {
        return db.transaction(async (tx) => {
            // get the claim
            const [claim] = await tx
                .select()
                .from(claimsTable)
                .where(eq(claimsTable.id, id))
                .limit(1);

            if (!claim) {
                return null;
            }
            // update the claim status, also set the reviewedById and updatedAt timestamp
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
            // if the claim is approved, create an agreement record for it, otherwise make sure to delete any existing agreement for the claim
            // this is to ensure that double clicking or fetching via API multiple times won't create multiple agreements for the same claim
            if (reviewParams.status === "approved") {
                const [existingAgreement] = await tx
                    .select({ id: pickupAgreementsTable.id })
                    .from(pickupAgreementsTable)
                    .where(eq(pickupAgreementsTable.claimId, claim.id))
                    .limit(1);

                if (!existingAgreement) {
                    await tx.insert(pickupAgreementsTable).values({
                        claimId: claim.id,
                        itemId: claim.itemId,
                        studentId: claim.studentId,
                        adminId: reviewParams.adminId,
                        signedAt: null,
                    });
                }
            } else {
                await tx
                    .delete(pickupAgreementsTable)
                    .where(eq(pickupAgreementsTable.claimId, claim.id));
            }

            return updatedClaim ?? null;
        });
    }


}

export const claimRepository = new ClaimRepository();
