import { itemRepository } from "./itemRepository";
import { uploadMultipleFiles } from "@/storgae/s3Service";

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
    getItemsById(id: string) {
        return this.itemRepo.getItemById(id);
    }

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

        return this.itemRepo.createItemWithFiles(
            {
                name: input.name,
                description: input.description,
                category: input.category,
                registeredById: input.registeredById,
            },
            fileRows
        );
    }

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

        return this.itemRepo.updateItemWithFiles(
            input.id,
            {
                name: input.name,
                description: input.description,
                category: input.category,
            },
            fileRows
        );
    }

    async deleteItem(id: string) {
        return this.itemRepo.deleteItemById(id);
    }
}

export const itemService = new ItemService(itemRepository);