import { filesTable, itemsTable } from "@/db/schema/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

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

class ItemRepository {
  
    async getAllItems() {
        return db.select().from(itemsTable);
    }
    async getItemById(id: string) {
        const [item] = await db
            .select()
            .from(itemsTable)
            .where(eq(itemsTable.id, id))
            .limit(1);
        return item ?? null;
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
}

export const itemRepository = new ItemRepository();