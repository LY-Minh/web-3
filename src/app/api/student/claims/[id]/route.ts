import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { claimService } from "@/server/claims/claimService";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Claim id is required" }, { status: 400 });
        }

        const claim = await claimService.getClaimById(id);

        if (!claim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        // Ensure student can only see their own claim
        if (claim.studentId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(claim, { status: 200 });
    } catch (error) {
        console.error("Error fetching claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
