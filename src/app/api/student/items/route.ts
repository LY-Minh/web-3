import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { itemRepository } from "@/server/items/itemRepository";

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

        const items = await itemRepository.getAllItems();
        const claimableItems = items.filter(
            (item) => item.status === "lost" || item.status === "claimed"
        );

        return NextResponse.json(claimableItems, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
