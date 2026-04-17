import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { claimService } from "@/server/claims/claimService";

const uuidLikeRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const FileClaim = z.object({
    itemId: z.string().regex(uuidLikeRegex, "Invalid UUID format"),
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

        if (session.user.role !== "student") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        const itemIdValue = formData.get("itemId");
        const proofDescriptionValue = formData.get("proofDescription");
        const reasonValue = formData.get("reason");
        const proofValue = formData.get("proof");

        const fallbackProofDescription = [reasonValue, proofValue]
            .filter((value): value is string => typeof value === "string")
            .map((value) => value.trim())
            .filter((value) => value.length > 0)
            .join("\n\n");

        const normalizedBody = {
            itemId: typeof itemIdValue === "string" ? itemIdValue.trim() : "",
            proofDescription:
                typeof proofDescriptionValue === "string" && proofDescriptionValue.trim().length > 0
                    ? proofDescriptionValue.trim()
                    : fallbackProofDescription,
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

        const files = [...formData.getAll("files"), ...formData.getAll("proofFiles")]
            .filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (files.length === 0) {
            return NextResponse.json(
                { error: "At least one proof file is required." },
                { status: 400 }
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
