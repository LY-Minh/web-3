import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import {
    itemRepository,
    ITEM_CATEGORY_VALUES,
    type ItemCategory,
    type ItemStatus,
} from "@/server/items/itemRepository";

const STUDENT_VISIBLE_STATUSES: ItemStatus[] = ["lost", "claimed"];

const parseMultiValue = (searchParams: URLSearchParams, key: string) =>
    searchParams
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim().toLowerCase())
        .filter((value) => value.length > 0);

const isItemCategory = (value: string): value is ItemCategory =>
    ITEM_CATEGORY_VALUES.includes(value as ItemCategory);

const isStudentVisibleStatus = (value: string): value is ItemStatus =>
    STUDENT_VISIBLE_STATUSES.includes(value as ItemStatus);

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

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("q") ?? searchParams.get("search") ?? undefined;
        const rawCategories = parseMultiValue(searchParams, "category");
        const rawStatuses = parseMultiValue(searchParams, "status");

        const categories = rawCategories.filter(isItemCategory);
        const requestedStatuses = rawStatuses.filter(isStudentVisibleStatus);

        if (categories.length !== rawCategories.length) {
            const invalidCategories = rawCategories.filter((value) => !isItemCategory(value));
            return NextResponse.json(
                {
                    error: `Invalid category filter: ${invalidCategories.join(", ")}`,
                },
                { status: 400 }
            );
        }

        if (requestedStatuses.length !== rawStatuses.length) {
            const invalidStatuses = rawStatuses.filter((value) => !isStudentVisibleStatus(value));
            return NextResponse.json(
                {
                    error: `Invalid status filter for student view: ${invalidStatuses.join(", ")}`,
                },
                { status: 400 }
            );
        }

        const statuses: ItemStatus[] =
            requestedStatuses.length > 0 ? requestedStatuses : STUDENT_VISIBLE_STATUSES;

        const claimableItems = await itemRepository.getAllItems({
            search,
            categories,
            statuses,
        });

        return NextResponse.json(claimableItems, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
