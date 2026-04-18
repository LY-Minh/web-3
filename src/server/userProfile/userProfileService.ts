import { userProfileRepository } from "./userProfileRepository";
import { logAction } from "@/util/helper";

type UserProfileInput = {
	name: string;
	email: string;
	contactNumber: string | null;
	bio: string | null;
};

class UserProfileService {
	constructor(private repo: typeof userProfileRepository) {}

	async getUserProfile(userId: string) {
		const profile = await this.repo.getUserProfile(userId);
		await logAction(
			userId,
			"USER_PROFILE_FETCHED",
			`found=${Boolean(profile)}`
		);

		return profile;
	}

	async createUserProfile(userId: string, profileData: UserProfileInput) {
		const [createdProfile] = await this.repo.createUserProfile(userId, profileData);

		await logAction(
			userId,
			createdProfile ? "USER_PROFILE_CREATED" : "USER_PROFILE_CREATE_FAILED",
			null
		);

		return createdProfile ?? null;
	}

	async updateUserProfile(userId: string, profileData: UserProfileInput) {
		const [updatedProfile] = await this.repo.updateUserProfile(userId, profileData);

		await logAction(
			userId,
			updatedProfile ? "USER_PROFILE_UPDATED" : "USER_PROFILE_UPDATE_FAILED",
			null
		);

		return updatedProfile ?? null;
	}

	async upsertUserProfile(userId: string, profileData: UserProfileInput) {
		const existingProfile = await this.repo.getUserProfile(userId);

		if (existingProfile) {
			return this.updateUserProfile(userId, profileData);
		}

		return this.createUserProfile(userId, profileData);
	}
}

export const userProfileService = new UserProfileService(userProfileRepository);
