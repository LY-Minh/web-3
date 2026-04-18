import { db } from "@/db";
import { userTable } from "@/db/schema/auth-schema";
import { claimsTable, itemsTable, pickupAgreementsTable } from "@/db/schema/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const studentUser = alias(userTable, "student_user");
const adminUser = alias(userTable, "admin_user");

type CreateAgreementParams = {
	claimId: string;
	adminId: string;
	signedAt?: Date | null;
};

class AgreementRepository {
	async createAgreement(params: CreateAgreementParams) {
		return db.transaction(async (tx) => {
			const [claim] = await tx
				.select({
					id: claimsTable.id,
					itemId: claimsTable.itemId,
					studentId: claimsTable.studentId,
					status: claimsTable.status,
				})
				.from(claimsTable)
				.where(eq(claimsTable.id, params.claimId))
				.limit(1);

			if (!claim) {
				throw new Error("CLAIM_NOT_FOUND");
			}

			if (claim.status !== "approved") {
				throw new Error("CLAIM_NOT_APPROVED");
			}

			const [existingAgreement] = await tx
				.select({ id: pickupAgreementsTable.id })
				.from(pickupAgreementsTable)
				.where(eq(pickupAgreementsTable.claimId, params.claimId))
				.limit(1);

			if (existingAgreement) {
				throw new Error("AGREEMENT_ALREADY_EXISTS");
			}

			const [createdAgreement] = await tx
				.insert(pickupAgreementsTable)
				.values({
					claimId: claim.id,
					itemId: claim.itemId,
					studentId: claim.studentId,
					adminId: params.adminId,
					signedAt: params.signedAt ?? null,
				})
				.returning();

			if (!createdAgreement) {
				return null;
			}

			return createdAgreement;
		});
	}

	async getAllAgreements() {
		return db
			.select({
				id: pickupAgreementsTable.id,
				claimId: pickupAgreementsTable.claimId,
				itemId: pickupAgreementsTable.itemId,
				studentId: pickupAgreementsTable.studentId,
				adminId: pickupAgreementsTable.adminId,
				signedAt: pickupAgreementsTable.signedAt,
				createdAt: pickupAgreementsTable.createdAt,
				itemName: itemsTable.name,
				itemCategory: itemsTable.category,
				itemStatus: itemsTable.status,
				studentName: studentUser.name,
				studentEmail: studentUser.email,
				adminName: adminUser.name,
				adminEmail: adminUser.email,
				claimStatus: claimsTable.status,
				claimCreatedAt: claimsTable.createdAt,
			})
			.from(pickupAgreementsTable)
			.innerJoin(claimsTable, eq(pickupAgreementsTable.claimId, claimsTable.id))
			.innerJoin(itemsTable, eq(pickupAgreementsTable.itemId, itemsTable.id))
			.innerJoin(studentUser, eq(pickupAgreementsTable.studentId, studentUser.id))
			.innerJoin(adminUser, eq(pickupAgreementsTable.adminId, adminUser.id))
			.orderBy(desc(pickupAgreementsTable.createdAt));
	}

	async getAgreementForPrint(id: string) {
		const [agreement] = await db
			.select({
				id: pickupAgreementsTable.id,
				claimId: pickupAgreementsTable.claimId,
				itemId: pickupAgreementsTable.itemId,
				studentId: pickupAgreementsTable.studentId,
				adminId: pickupAgreementsTable.adminId,
				signedAt: pickupAgreementsTable.signedAt,
				createdAt: pickupAgreementsTable.createdAt,
				itemName: itemsTable.name,
				itemDescription: itemsTable.description,
				itemCategory: itemsTable.category,
				studentName: studentUser.name,
				studentEmail: studentUser.email,
				adminName: adminUser.name,
				adminEmail: adminUser.email,
				claimStatus: claimsTable.status,
				claimProofDescription: claimsTable.proofDescription,
			})
			.from(pickupAgreementsTable)
			.innerJoin(claimsTable, eq(pickupAgreementsTable.claimId, claimsTable.id))
			.innerJoin(itemsTable, eq(pickupAgreementsTable.itemId, itemsTable.id))
			.innerJoin(studentUser, eq(pickupAgreementsTable.studentId, studentUser.id))
			.innerJoin(adminUser, eq(pickupAgreementsTable.adminId, adminUser.id))
			.where(eq(pickupAgreementsTable.id, id))
			.limit(1);

		return agreement ?? null;
	}

	async markAgreementSignedOnFirstPrint(id: string, signedAt: Date) {
		const [updatedAgreement] = await db
			.update(pickupAgreementsTable)
			.set({ signedAt })
			.where(
				and(
					eq(pickupAgreementsTable.id, id),
					isNull(pickupAgreementsTable.signedAt)
				)
			)
			.returning({
				id: pickupAgreementsTable.id,
				signedAt: pickupAgreementsTable.signedAt,
			});

		return updatedAgreement ?? null;
	}
}

export const agreementRepository = new AgreementRepository();
