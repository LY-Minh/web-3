import { logTable } from "@/db/schema/schema";
import { db } from "@/db";

/**
 * Logging utility to record user actions and system events. This function can be called throughout the application to maintain an audit trail of important activities, such as item claims, profile updates, and admin actions.
 * @param userId 
 * @param action 
 * @param details 
 */
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