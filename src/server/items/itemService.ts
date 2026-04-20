import { itemRepository } from "./itemRepository";
import { uploadMultipleFiles } from "@/storgae/s3Service";
import { logAction } from "@/util/helper";

type CreateItemInput = {
    name: string;
    description: string;
    category: "electronics" | "clothing" | "accessories" | "documents" | "other";
    registeredById: string;
    files: File[];
};

type UpdateItemInput = {
    id: string;
    name?: string;
    description?: string;
    category?: "electronics" | "clothing" | "accessories" | "documents" | "other";
    updatedById: string;
    files?: File[];
};

type ItemStatus = "lost" | "claimed" | "approved_claim";

/**
 * DocBlock for ItemService:
 * - Get all endpoints (support pagination and filtering)
 * - Get item by id endpoint
 * - Create item endpoint
 * - Update item endpoint
 * - Delete item endpoint
 */
class ItemService {
    constructor ( private itemRepo: typeof itemRepository) {}
    // get items by its Id with its attached files
    async getItemsById(id: string) {
        const item = await this.itemRepo.getItemById(id);
        await logAction(null, "ITEM_FETCHED_BY_ID", `itemId=${id}; found=${Boolean(item)}`);
        return item;
    }
    // create a new item with its attached files
    async createItem(input: CreateItemInput) {
        const uploadedUrls = await uploadMultipleFiles(input.files, "items", true);

        const fileRows = uploadedUrls.map((url, index) => {
            const originalFile = input.files[index];
            const parsedUrl = new URL(url);
            const s3Key = parsedUrl.pathname.replace(/^\//, "");

            return {
                fileName: originalFile.name,
                fileType: originalFile.type || null,
                fileUrl: url,
                s3Key,
                uploadedById: input.registeredById,
            };
        });

        const createdItem = await this.itemRepo.createItemWithFiles(
            {
                name: input.name,
                description: input.description,
                category: input.category,
                registeredById: input.registeredById,
            },
            fileRows
        );

        await logAction(
            input.registeredById,
            createdItem ? "ITEM_CREATED" : "ITEM_CREATE_FAILED",
            `name=${input.name}; category=${input.category}; files=${input.files.length}`
        );

        return createdItem;
    }
    // update an existing item with the option to add more files, but not delete existing files for simplicity and audit trail purposes
    async updateItem(input: UpdateItemInput) {
        const files = input.files ?? [];
        let fileRows: Array<{
            fileName: string;
            fileType: string | null;
            fileUrl: string;
            s3Key: string;
            uploadedById: string;
        }> = [];

        if (files.length > 0) {
            const uploadedUrls = await uploadMultipleFiles(files, "items", true);

            fileRows = uploadedUrls.map((url, index) => {
                const originalFile = files[index];
                const parsedUrl = new URL(url);
                const s3Key = parsedUrl.pathname.replace(/^\//, "");

                return {
                    fileName: originalFile.name,
                    fileType: originalFile.type || null,
                    fileUrl: url,
                    s3Key,
                    uploadedById: input.updatedById,
                };
            });
        }

        const updatedItem = await this.itemRepo.updateItemWithFiles(
            input.id,
            {
                name: input.name,
                description: input.description,
                category: input.category,
            },
            fileRows
        );

        await logAction(
            input.updatedById,
            updatedItem ? "ITEM_UPDATED" : "ITEM_UPDATE_FAILED",
            `itemId=${input.id}; files=${files.length}`
        );

        return updatedItem;
    }
    // delete an item by its Id, this will not delete the attached files in S3 for audit trail purposes, but will mark the files as inactive in the database so they won't be accessible anymore
    async deleteItem(id: string) {
        const deletedItem = await this.itemRepo.deleteItemById(id);
        await logAction(null, deletedItem ? "ITEM_DELETED" : "ITEM_DELETE_FAILED", `itemId=${id}`);
        return deletedItem;
    }
    // update item status, this is used when admin approves a claim and the item status needs to be updated to "approved_claim"
    async updateItemStatus(id: string, status: ItemStatus) {
        const updatedStatus = await this.itemRepo.updateItemStatus(id, status);
        await logAction(
            null,
            updatedStatus ? "ITEM_STATUS_UPDATED" : "ITEM_STATUS_UPDATE_FAILED",
            `itemId=${id}; status=${status}`
        );
        return updatedStatus;
    }
}

export const itemService = new ItemService(itemRepository);