import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { claimService } from "@/server/claims/claimService";

const ReviewClaim = z.object({
    status: z.enum(["approved", "rejected"]),
});

export const PATCH = async (
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

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Claim id is required" }, { status: 400 });
        }

        const body = await req.json();
        const parsed = ReviewClaim.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const updatedClaim = await claimService.reviewClaim({
            claimId: id,
            status: parsed.data.status,
            adminId: session.user.id,
        });

        if (!updatedClaim) {
            return NextResponse.json({ error: "Claim not found" }, { status: 404 });
        }

        return NextResponse.json(updatedClaim, { status: 200 });
    } catch (error) {
        console.error("Error reviewing claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
