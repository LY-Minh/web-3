import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { agreementService } from "@/server/agreements/agreementService";

export const GET = async (req: NextRequest) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const agreements = await agreementService.getAllAgreements(session.user.id);

		return NextResponse.json(agreements, { status: 200 });
	} catch (error) {
		console.error("Error fetching agreements:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};


