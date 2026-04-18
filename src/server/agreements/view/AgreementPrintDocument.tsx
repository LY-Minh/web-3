import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export type AgreementPrintData = {
	id: string;
	claimId: string;
	itemId: string;
	studentId: string;
	adminId: string;
	signedAt: Date | null;
	createdAt: Date;
	itemName: string;
	itemDescription: string | null;
	itemCategory: string;
	studentName: string;
	studentEmail: string;
	adminName: string;
	adminEmail: string;
	claimStatus: string;
	claimProofDescription: string;
};

type AgreementPrintDocumentProps = {
	agreement: AgreementPrintData;
	generatedAt: Date;
};

const styles = StyleSheet.create({
	page: {
		paddingTop: 32,
		paddingBottom: 32,
		paddingHorizontal: 36,
		fontFamily: "Helvetica",
		fontSize: 11,
		color: "#0f172a",
		lineHeight: 1.45,
	},
	header: {
		marginBottom: 18,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#dce3ea",
	},
	title: {
		fontSize: 18,
		fontWeight: 700,
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 10,
		color: "#475569",
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
		fontSize: 10,
		color: "#334155",
	},
	section: {
		marginTop: 14,
		padding: 12,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 6,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: 700,
		marginBottom: 8,
		color: "#0f172a",
	},
	row: {
		flexDirection: "row",
		marginBottom: 4,
	},
	label: {
		width: "36%",
		color: "#475569",
	},
	value: {
		width: "64%",
		fontWeight: 600,
	},
	paragraph: {
		marginTop: 6,
		fontSize: 10,
		color: "#334155",
	},
	signatureBlock: {
		marginTop: 18,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
	},
	signatureLine: {
		marginTop: 22,
		paddingTop: 4,
		borderTopWidth: 1,
		borderTopColor: "#94a3b8",
		fontSize: 10,
		color: "#475569",
	},
	footer: {
		marginTop: 20,
		fontSize: 9,
		color: "#64748b",
		textAlign: "center",
	},
});

const formatDateTime = (value: Date | null) => {
	if (!value) {
		return "Pending signature";
	}

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(value);
};

const formatDateOnly = (value: Date) =>
	new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(value);

export function AgreementPrintDocument({
	agreement,
	generatedAt,
}: AgreementPrintDocumentProps) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.title}>Lost & Found Pickup Agreement</Text>
					<Text style={styles.subtitle}>
						This agreement confirms release of a claimed item to the verified student.
					</Text>
					<View style={styles.metaRow}>
						<Text>Agreement ID: {agreement.id}</Text>
						<Text>Generated: {formatDateTime(generatedAt)}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Item Information</Text>
					<View style={styles.row}>
						<Text style={styles.label}>Item Name</Text>
						<Text style={styles.value}>{agreement.itemName}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Item ID</Text>
						<Text style={styles.value}>{agreement.itemId}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Category</Text>
						<Text style={styles.value}>{agreement.itemCategory}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Description</Text>
						<Text style={styles.value}>{agreement.itemDescription ?? "N/A"}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Claim Information</Text>
					<View style={styles.row}>
						<Text style={styles.label}>Claim ID</Text>
						<Text style={styles.value}>{agreement.claimId}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Claim Status</Text>
						<Text style={styles.value}>{agreement.claimStatus}</Text>
					</View>
					<Text style={styles.paragraph}>
						Proof Statement: {agreement.claimProofDescription}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Student Information</Text>
					<View style={styles.row}>
						<Text style={styles.label}>Student Name</Text>
						<Text style={styles.value}>{agreement.studentName}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Student ID</Text>
						<Text style={styles.value}>{agreement.studentId}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Student Email</Text>
						<Text style={styles.value}>{agreement.studentEmail}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Administrative Confirmation</Text>
					<View style={styles.row}>
						<Text style={styles.label}>Approved By</Text>
						<Text style={styles.value}>{agreement.adminName}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Admin Email</Text>
						<Text style={styles.value}>{agreement.adminEmail}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Agreement Created</Text>
						<Text style={styles.value}>{formatDateOnly(agreement.createdAt)}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Signed At</Text>
						<Text style={styles.value}>{formatDateTime(agreement.signedAt)}</Text>
					</View>

					<View style={styles.signatureBlock}>
						<Text>
							I verify that the student listed above has been identified and the item has
							 been released according to policy.
						</Text>
						<Text style={styles.signatureLine}>Admin Signature</Text>
					</View>
				</View>

				<Text style={styles.footer}>
					Campus Lost & Found System • This document is system-generated.
				</Text>
			</Page>
		</Document>
	);
}
