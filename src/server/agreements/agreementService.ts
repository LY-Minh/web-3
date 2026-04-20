import { renderToStream } from "@react-pdf/renderer";
import { logAction } from "@/util/helper";
import { agreementRepository } from "./agreementRepository";
import {
	AgreementPrintDocument,
	type AgreementPrintData,
} from "@/view/pdf/AgreementPrintDocument";

type CreateAgreementInput = {
	claimId: string;
	adminId: string;
	signedAt?: Date;
};

class AgreementService {
	constructor(private repo: typeof agreementRepository) {}
	// create agreement record in the database when admin approves a claim
	async createAgreement(input: CreateAgreementInput) {
		const createdAgreement = await this.repo.createAgreement({
			claimId: input.claimId,
			adminId: input.adminId,
			signedAt: input.signedAt,
		});

		await logAction(
			input.adminId,
			createdAgreement ? "AGREEMENT_CREATED" : "AGREEMENT_CREATE_FAILED",
			`claimId=${input.claimId}`
		);

		return createdAgreement;
	}
	// get all agreements with related data for admin dashboard
	async getAllAgreements(adminId: string) {
		const agreements = await this.repo.getAllAgreements();

		await logAction(
			adminId,
			"AGREEMENTS_FETCHED_ALL",
			`count=${agreements.length}`
		);

		return agreements;
	}
	// get agreement with related data for generating the agreement print document
	async getAgreementForPrint(agreementId: string, adminId: string) {
		const agreement = await this.repo.getAgreementForPrint(agreementId);

		await logAction(
			adminId,
			agreement ? "AGREEMENT_PRINT_FETCHED" : "AGREEMENT_PRINT_NOT_FOUND",
			`agreementId=${agreementId}`
		);

		return agreement;
	}
	// generate the agreement print document as a stream to be sent to client for download
	async getAgreementPrintStream(agreementId: string, adminId: string) {
		let agreement = await this.repo.getAgreementForPrint(agreementId);

		if (!agreement) {
			await logAction(adminId, "AGREEMENT_PRINT_NOT_FOUND", `agreementId=${agreementId}`);
			return null;
		}
		// only occurs for the first time when printing
		if (!agreement.signedAt) {
			await this.repo.markAgreementSignedOnFirstPrint(agreementId, new Date());
			const refreshedAgreement = await this.repo.getAgreementForPrint(agreementId);

			if (!refreshedAgreement) {
				await logAction(
					adminId,
					"AGREEMENT_PRINT_REFRESH_FAILED",
					`agreementId=${agreementId}`
				);
				return null;
			}

			agreement = refreshedAgreement;
		}
		// prepare a node stream that is essential to print the agreement
		const stream = await renderToStream(
			AgreementPrintDocument({
				agreement: agreement as AgreementPrintData,
				generatedAt: new Date(),
			})
		);

		await logAction(
			adminId,
			"AGREEMENT_PRINT_STREAM_GENERATED",
			`agreementId=${agreementId}`
		);

		return {
			stream,
			fileName: `agreement-${agreement.id}.pdf`,
			signedAt: agreement.signedAt,
		};
	}
}

export const agreementService = new AgreementService(agreementRepository);
