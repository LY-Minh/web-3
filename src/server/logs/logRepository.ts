import { db } from "@/db";
import { userTable } from "@/db/schema/auth-schema";
import { logTable } from "@/db/schema/schema";
import { desc, eq } from "drizzle-orm";

class LogRepository {
    async getAllLogs() {
        return db
            .select({
                id: logTable.id,
                createdAt: logTable.createdAt,
                action: logTable.action,
                details: logTable.details,
                userId: logTable.userId,
                userName: userTable.name,
                userEmail: userTable.email,
                userRole: userTable.role,
            })
            .from(logTable)
            .leftJoin(userTable, eq(logTable.userId, userTable.id))
            .orderBy(desc(logTable.createdAt));
    }
}

export const logRepository = new LogRepository();
