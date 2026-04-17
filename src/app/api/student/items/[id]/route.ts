import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { itemRepository } from "@/server/items/itemRepository";

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
            return NextResponse.json({ error: "Item id is required" }, { status: 400 });
        }

        const item = await itemRepository.getItemById(id);

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error("Error fetching item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
