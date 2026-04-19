import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { claimService } from "@/server/claims/claimService";

const FileClaim = z.object({
    itemId: z.string("Invalid UUID format"),
    proofDescription: z.string().trim().min(10, "Proof description must be at least 10 characters"),
});

const allowedClaimFormFields = new Set(["itemId", "proofDescription", "files"]);

export const GET = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "student") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const claims = await claimService.getClaimsByStudentId(session.user.id);
        return NextResponse.json(claims, { status: 200 });
    } catch (error) {
        console.error("Error fetching student claims:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "student") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        for (const key of formData.keys()) {
            if (!allowedClaimFormFields.has(key)) {
                return NextResponse.json(
                    { error: `Unsupported field: ${key}` },
                    { status: 400 }
                );
            }
        }

        const itemIdValue = formData.get("itemId");
        const proofDescriptionValue = formData.get("proofDescription");

        const normalizedBody = {
            itemId: typeof itemIdValue === "string" ? itemIdValue.trim() : "",
            proofDescription: typeof proofDescriptionValue === "string" ? proofDescriptionValue : "",
        };

        const parsed = FileClaim.safeParse(normalizedBody);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid request body",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const files = formData.getAll("files")
            .filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (files.length === 0) {
            return NextResponse.json(
                { error: "At least one proof file is required." },
                { status: 400 }
            );
        }

        const hasExistingClaim = await claimService.hasExistingClaim(
            parsed.data.itemId,
            session.user.id
        );

        if (hasExistingClaim) {
            return NextResponse.json(
                { error: "You have already filed a claim for this item." },
                { status: 409 }
            );
        }

        const claim = await claimService.fileClaim({
            itemId: parsed.data.itemId,
            studentId: session.user.id,
            proofDescription: parsed.data.proofDescription,
            files,
        });

        if (!claim) {
            return NextResponse.json({ error: "Failed to file claim" }, { status: 500 });
        }

        return NextResponse.json(claim, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "ITEM_NOT_FOUND") {
                return NextResponse.json({ error: "Item not found" }, { status: 404 });
            }

            if (error.message === "DUPLICATE_CLAIM") {
                return NextResponse.json(
                    { error: "You have already filed a claim for this item." },
                    { status: 409 }
                );
            }

            if (error.message === "ITEM_NOT_CLAIMABLE") {
                return NextResponse.json(
                    { error: "This item can no longer be claimed." },
                    { status: 409 }
                );
            }
        }

        console.error("Error filing claim:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
