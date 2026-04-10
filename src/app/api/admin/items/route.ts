import { itemService } from "@/server/items/itemService";
import { NextResponse } from "next/server";

export async  function GET() {
    const items = await itemService.getAllItems();
    return new NextResponse(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
    });
}

