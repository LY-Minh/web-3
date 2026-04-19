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

	async getAllAgreements(adminId: string) {
		const agreements = await this.repo.getAllAgreements();

		await logAction(
			adminId,
			"AGREEMENTS_FETCHED_ALL",
			`count=${agreements.length}`
		);

		return agreements;
	}

	async getAgreementForPrint(agreementId: string, adminId: string) {
		const agreement = await this.repo.getAgreementForPrint(agreementId);

		await logAction(
			adminId,
			agreement ? "AGREEMENT_PRINT_FETCHED" : "AGREEMENT_PRINT_NOT_FOUND",
			`agreementId=${agreementId}`
		);

		return agreement;
	}

	async getAgreementPrintStream(agreementId: string, adminId: string) {
		let agreement = await this.repo.getAgreementForPrint(agreementId);

		if (!agreement) {
			await logAction(adminId, "AGREEMENT_PRINT_NOT_FOUND", `agreementId=${agreementId}`);
			return null;
		}

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
