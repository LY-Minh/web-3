import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { claimService } from "@/server/claims/claimService";

const FileClaim = z.object({
    itemId: z.string().uuid(),
    proofDescription: z.string().min(10, "Proof description must be at least 10 characters"),
});

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = FileClaim.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const claim = await claimService.fileClaim({
            itemId: parsed.data.itemId,
            studentId: session.user.id,
            proofDescription: parsed.data.proofDescription,
        });

        if (!claim) {
            return NextResponse.json({ error: "Failed to file claim" }, { status: 500 });
        }

        return NextResponse.json(claim, { status: 201 });
    } catch (error) {
        console.error("Error filing claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
