import { logTable } from "@/db/schema/schema";
import { db } from "@/db";

export const logAction = async (userId: string | null, action: string, details: string | null = null) => {
    try {
        await db.insert(logTable).values({
            userId,
            action,
            details,
        });
    } catch (error) {
        console.error("Failed to write log action:", error);
    }
};