import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { itemService } from "@/server/items/itemService";
import { auth } from "@/auth/auth";

const UpdateItemBody = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	category: z.enum(["electronics", "clothing", "accessories", "documents", "other"]).optional(),
});

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

		if (session.user.role !== "admin") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { id } = await params;
		if (!id) {
			return NextResponse.json({ error: "Item id is required" }, { status: 400 });
		}

		const item = await itemService.getItemsById(id);

		if (!item) {
			return NextResponse.json({ error: "Item not found" }, { status: 404 });
		}

		return NextResponse.json(item, { status: 200 });
	} catch (error) {
		console.error("Error fetching item:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
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

		const formData = await req.formData();
		const body = {
			name: formData.get("name")?.toString(),
			description: formData.get("description")?.toString(),
			category: formData.get("category")?.toString(),
		};

		const parsed = UpdateItemBody.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
		}

		const files = formData
			.getAll("files")
			.filter((entry): entry is File => entry instanceof File && entry.size > 0);

		const hasFieldsToUpdate = Object.values(parsed.data).some((value) => value !== undefined);
		if (!hasFieldsToUpdate && files.length === 0) {
			return NextResponse.json({ error: "No update payload provided" }, { status: 400 });
		}

		const updatedItem = await itemService.updateItem({
			id,
			...parsed.data,
			updatedById: session.user.id,
			files,
		});

		if (!updatedItem) {
			return NextResponse.json({ error: "Item not found" }, { status: 404 });
		}

		return NextResponse.json(updatedItem, { status: 200 });
	} catch (error) {
		console.error("Error updating item:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};

export const DELETE = async (
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

		const deletedItem = await itemService.deleteItem(id);

		if (!deletedItem) {
			return NextResponse.json({ error: "Item not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true, deletedItem }, { status: 200 });
	} catch (error) {
		console.error("Error deleting item:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};
