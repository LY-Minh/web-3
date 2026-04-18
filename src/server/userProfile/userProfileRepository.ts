
import { db } from "@/db";
import { userProfilesTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { userTable } from "@/db/schema/auth-schema";

type CreateEditUserProfile = {
    name: string;
    email: string;
    contactNumber: string | null;
    bio: string | null;
};

class UserProfileRepository {
    async getUserProfile(userId: string) : Promise<
        (CreateEditUserProfile & {
            name: string | null;
            email: string;
        }) | null
    > {
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

    async createUserProfile(userId: string, profileData: CreateEditUserProfile) {
        return await this.updateUserProfile(userId, profileData);
    }

    async updateUserProfile(userId: string, profileData: CreateEditUserProfile) {
        return await db.transaction(async (tx) => {
            const [updatedUser] = await tx
                .update(userTable)
                .set({
                    name: profileData.name,
                    email: profileData.email,
                    updatedAt: new Date(),
                })
                .where(eq(userTable.id, userId))
                .returning({ id: userTable.id });

            if (!updatedUser) {
                return [];
            }

            const [updatedProfile] = await tx
                .update(userProfilesTable)
                .set({
                    contactNumber: profileData.contactNumber,
                    bio: profileData.bio,
                    updatedAt: new Date(),
                })
                .where(eq(userProfilesTable.userId, userId))
                .returning();

            if (updatedProfile) {
                return [updatedProfile];
            }

            return await tx
                .insert(userProfilesTable)
                .values({
                    userId,
                    contactNumber: profileData.contactNumber,
                    bio: profileData.bio,
                })
                .returning();
        });
    }
}

export const userProfileRepository = new UserProfileRepository();