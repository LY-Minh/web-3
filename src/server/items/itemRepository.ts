import { itemsTable } from "@/db/schema/schema";
import { db } from "@/db";

class ItemRepository {
  
   async getAllItems() {
        return db.select().from(itemsTable);
    }
}

export const itemRepository = new ItemRepository();