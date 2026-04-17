import { z } from "zod";
import { itemService } from "@/server/items/itemService";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const Item = z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(["electronics", "clothing", "accessories", "documents", "other"])
});

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const body = {
            name: formData.get("name"),
            description: formData.get("description"),
            category: formData.get("category"),
        };

        const parsed = Item.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const files = formData
            .getAll("files")
            .filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (files.length === 0) {
            return NextResponse.json({ error: "At least one file is required" }, { status: 400 });
        }

        const newItem = await itemService.createItem({
            ...parsed.data,
            registeredById: session.user.id,
            files,
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Error creating item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};