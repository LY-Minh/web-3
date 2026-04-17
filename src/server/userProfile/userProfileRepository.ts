
import { db } from "@/db";
import { userProfilesTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { userTable } from "@/db/schema/auth-schema";

type CreateOrEditUserProfile = {
    contactNumber: string | null;
    bio: string | null;
};

type GetUserProfileResult = CreateOrEditUserProfile & {
    name: string | null;
    email: string;
};
class UserProfileRepository {
    async getUserProfile(userId: string) : Promise<GetUserProfileResult | null> {
        const [profile] = await db
            .select({
                name: userTable.name,
                email: userTable.email,
                contactNumber: userProfilesTable.contactNumber,
                bio: userProfilesTable.bio,
            })
            .from(userTable)
            .leftJoin(userProfilesTable, eq(userProfilesTable.userId, userTable.id))
            .where(eq(userTable.id, userId))
            .limit(1);

        return profile ?? null;

    }

    async createUserProfile(userId: string, profileData: CreateOrEditUserProfile) {
       return await db.insert(userProfilesTable).values({
            ...profileData,
            userId,
        }).returning();
    
    }
    async updateUserProfile(userId: string, profileData: CreateOrEditUserProfile) {
        return await db
            .update(userProfilesTable)
            .set(profileData)
            .where(eq(userProfilesTable.userId, userId))
            .returning();
    }
}

export const userProfileRepository = new UserProfileRepository();