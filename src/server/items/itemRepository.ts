import { filesTable, itemsTable } from "@/db/schema/schema";
import { db } from "@/db";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

export const ITEM_CATEGORY_VALUES = [
    "electronics",
    "clothing",
    "accessories",
    "documents",
    "other",
] as const;

export const ITEM_STATUS_VALUES = [
    "lost",
    "claimed",
    "approved_claim",
    "picked_up",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORY_VALUES)[number];
export type ItemStatus = (typeof ITEM_STATUS_VALUES)[number];

type GetAllItemsFilters = {
    search?: string;
    categories?: ItemCategory[];
    statuses?: ItemStatus[];
};

type CreateItemParams = {
    name: string;
    description: string;
    category: "electronics" | "clothing" | "accessories" | "documents" | "other";
    registeredById: string;
};

type CreateFileParams = {
    fileName: string;
    fileType: string | null;
    fileUrl: string;
    s3Key: string;
    uploadedById: string;
};

type UpdateItemParams = {
    name?: string;
    description?: string;
    category?: "electronics" | "clothing" | "accessories" | "documents" | "other";
};

type UpdateFileParams = CreateFileParams;

type ItemFileRecord = {
    id: string;
    itemId: string | null;
    fileName: string;
    fileType: string | null;
    fileUrl: string;
    uploadedAt: Date;
};

class ItemRepository {
    private async getActiveFilesByItemIds(itemIds: string[]) {
        const filesByItemId = new Map<string, ItemFileRecord[]>();

        if (itemIds.length === 0) {
            return filesByItemId;
        }

        const files = await db
            .select({
                id: filesTable.id,
                itemId: filesTable.itemId,
                fileName: filesTable.fileName,
                fileType: filesTable.fileType,
                fileUrl: filesTable.fileUrl,
                uploadedAt: filesTable.uploadedAt,
            })
            .from(filesTable)
            .where(and(inArray(filesTable.itemId, itemIds), eq(filesTable.isActive, true)))
            .orderBy(desc(filesTable.uploadedAt));

        for (const file of files) {
            if (!file.itemId) {
                continue;
            }

            const itemFiles = filesByItemId.get(file.itemId) ?? [];
            itemFiles.push(file);
            filesByItemId.set(file.itemId, itemFiles);
        }

        return filesByItemId;
    }
  
    async getAllItems(filters: GetAllItemsFilters = {}) {
        const search = filters.search?.trim();
        const categories = filters.categories ?? [];
        const statuses = filters.statuses ?? [];
        const whereClauses = [];

        if (search) {
            whereClauses.push(
                or(
                    sql`${itemsTable.name} % ${search}`,
                    ilike(itemsTable.name, `%${search}%`),
                    ilike(itemsTable.description, `%${search}%`)
                )
            );
        }

        if (categories.length > 0) {
            whereClauses.push(inArray(itemsTable.category, categories));
        }

        if (statuses.length > 0) {
            whereClauses.push(inArray(itemsTable.status, statuses));
        }

        let items;

        if (whereClauses.length > 0) {
            const filteredQuery = db.select().from(itemsTable).where(and(...whereClauses));

            if (search) {
                items = await filteredQuery.orderBy(
                    sql`similarity(${itemsTable.name}, ${search}) desc`,
                    desc(itemsTable.createdAt)
                );
            } else {
                items = await filteredQuery.orderBy(desc(itemsTable.createdAt));
            }
        } else {
            items = await db.select().from(itemsTable).orderBy(desc(itemsTable.createdAt));
        }

        const filesByItemId = await this.getActiveFilesByItemIds(items.map((item) => item.id));

        return items.map((item) => ({
            ...item,
            files: filesByItemId.get(item.id) ?? [],
        }));
    }

    async getItemById(id: string) {
        const [item] = await db
            .select()
            .from(itemsTable)
            .where(eq(itemsTable.id, id))
            .limit(1);

        if (!item) {
            return null;
        }

        const filesByItemId = await this.getActiveFilesByItemIds([item.id]);

        return {
            ...item,
            files: filesByItemId.get(item.id) ?? [],
        };
    }

    async createItemWithFiles(item: CreateItemParams, files: CreateFileParams[]) {
        return db.transaction(async (tx) => {
            const [createdItem] = await tx
                .insert(itemsTable)
                .values(item)
                .returning(); // Make sure to return the created item with all its fields, including the generated ID

            if (files.length > 0) {
                await tx.insert(filesTable).values(
                    files.map((file) => ({
                        ...file,
                        itemId: createdItem.id,
                        isActive: true,
                    }))
                );
            }

            return createdItem;
        });
    }

    async updateItemWithFiles(id: string, item: UpdateItemParams, files: UpdateFileParams[]) {
        return db.transaction(async (tx) => {
            const [updatedItem] = await tx
                .update(itemsTable)
                .set({
                    ...item,
                    updatedAt: new Date(),
                })
                .where(eq(itemsTable.id, id))
                .returning();

            if (!updatedItem) {
                return null;
            }

            if (files.length > 0) {
                await tx
                    .update(filesTable)
                    .set({ isActive: false })
                    .where(and(eq(filesTable.itemId, id), eq(filesTable.isActive, true)));

                await tx.insert(filesTable).values(
                    files.map((file) => ({
                        ...file,
                        itemId: id,
                        isActive: true,
                    }))
                );
            }

            return updatedItem;
        });
    }

    async deleteItemById(id: string) {
        return db.transaction(async (tx) => {
            const [existingItem] = await tx
                .select()
                .from(itemsTable)
                .where(eq(itemsTable.id, id))
                .limit(1);

            if (!existingItem) {
                return null;
            }

            await tx
                .update(filesTable)
                .set({
                    itemId: null,
                    isActive: false,
                })
                .where(eq(filesTable.itemId, id));

            const [deletedItem] = await tx
                .delete(itemsTable)
                .where(eq(itemsTable.id, id))
                .returning();

            return deletedItem ?? null;
        });
    }

    async updateItemStatus(id: string, status: ItemStatus) {
        const [updatedItem] = await db
            .update(itemsTable)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(itemsTable.id, id))
            .returning();

        return updatedItem ?? null;
    }
}

export const itemRepository = new ItemRepository();