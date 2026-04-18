import { z } from "zod";
import { itemService } from "@/server/items/itemService";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import {
    itemRepository,
    ITEM_CATEGORY_VALUES,
    ITEM_STATUS_VALUES,
    type ItemCategory,
    type ItemStatus,
} from "@/server/items/itemRepository";

const Item = z.object({
    name: z.string(),
    description: z.string(),
    category: z.enum(["electronics", "clothing", "accessories", "documents", "other"])
});

const parseMultiValue = (searchParams: URLSearchParams, key: string) =>
    searchParams
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.length > 0);

const isItemCategory = (value: string): value is ItemCategory =>
    ITEM_CATEGORY_VALUES.includes(value as ItemCategory);

const isItemStatus = (value: string): value is ItemStatus =>
    ITEM_STATUS_VALUES.includes(value as ItemStatus);

export const GET = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("q") ?? searchParams.get("search") ?? undefined;
        const rawCategories = parseMultiValue(searchParams, "category");
        const rawStatuses = parseMultiValue(searchParams, "status");

        const categories = rawCategories.filter(isItemCategory);
        const statuses = rawStatuses.filter(isItemStatus);

        if (categories.length !== rawCategories.length) {
            const invalidCategories = rawCategories.filter((value) => !isItemCategory(value));
            return NextResponse.json(
                {
                    error: `Invalid category filter: ${invalidCategories.join(", ")}`,
                },
                { status: 400 }
            );
        }

        if (statuses.length !== rawStatuses.length) {
            const invalidStatuses = rawStatuses.filter((value) => !isItemStatus(value));
            return NextResponse.json(
                {
                    error: `Invalid status filter: ${invalidStatuses.join(", ")}`,
                },
                { status: 400 }
            );
        }

        const items = await itemRepository.getAllItems({
            search,
            categories,
            statuses,
        });

        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
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