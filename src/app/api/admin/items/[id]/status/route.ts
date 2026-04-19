import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { itemService } from "@/server/items/itemService";

const UpdateStatusBody = z.object({
	status: z.enum(["lost", "claimed", "approved_claim"]),
});

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
	lost: ["claimed"],
	claimed: ["approved_claim", "lost"],
	approved_claim: [],
}; 

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
			return NextResponse.json({ error: "Item id is required" }, { status: 400 });
		}

		const body = await req.json();
		const parsed = UpdateStatusBody.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
		}

		const currentItem = await itemService.getItemsById(id);
		if (!currentItem) {
			return NextResponse.json({ error: "Item not found" }, { status: 404 });
		}

		const nextStatus = parsed.data.status;
		if (currentItem.status === nextStatus) {
			return NextResponse.json(currentItem, { status: 200 });
		}

		const allowedNextStatuses = ALLOWED_TRANSITIONS[currentItem.status] ?? [];
		if (!allowedNextStatuses.includes(nextStatus)) {
			return NextResponse.json(
				{
					error: `Invalid status transition from ${currentItem.status} to ${nextStatus}`,
				},
				{ status: 400 }
			);
		}

		const updatedItem = await itemService.updateItemStatus(id, nextStatus);
		if (!updatedItem) {
			return NextResponse.json({ error: "Item not found" }, { status: 404 });
		}

		return NextResponse.json(updatedItem, { status: 200 });
	} catch (error) {
		console.error("Error updating item status:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};
