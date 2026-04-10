import { itemRepository } from "./itemRepository";

class ItemService {
    constructor ( private itemRepo: typeof itemRepository) {}
    async getAllItems() {
        return this.itemRepo.getAllItems();
    }
}

export const itemService = new ItemService(itemRepository);