import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/auth";
import { userProfileService } from "@/server/userProfile/userProfileService";

const EditUserProfileBody = z
	.object({
		name: z.string().trim().min(1).max(120).optional(),
		email: z.string().trim().email().optional(),
		contactNumber: z.string().trim().min(1).max(30).nullable().optional(),
		bio: z.string().trim().max(1000).nullable().optional(),
	})
	.strict();

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (session.user.role !== "student") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { userId } = await params;
		if (!userId) {
			return NextResponse.json({ error: "User id is required" }, { status: 400 });
		}

		if (userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const profile = await userProfileService.getUserProfile(userId);

		if (!profile) {
			return NextResponse.json({ error: "User profile not found" }, { status: 404 });
		}

		return NextResponse.json(profile, { status: 200 });
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (session.user.role !== "student") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { userId } = await params;
		if (!userId) {
			return NextResponse.json({ error: "User id is required" }, { status: 400 });
		}

		if (userId !== session.user.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await req.json();
		const parsed = EditUserProfileBody.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Invalid request body",
					details: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const hasAtLeastOneField =
			parsed.data.name !== undefined ||
			parsed.data.email !== undefined ||
			parsed.data.contactNumber !== undefined ||
			parsed.data.bio !== undefined;

		if (!hasAtLeastOneField) {
			return NextResponse.json(
				{ error: "At least one field is required" },
				{ status: 400 }
			);
		}

		const existingProfile = await userProfileService.getUserProfile(userId);

		if (!existingProfile) {
			return NextResponse.json({ error: "User profile not found" }, { status: 404 });
		}

		await userProfileService.updateUserProfile(userId, {
			name: parsed.data.name ?? existingProfile.name ?? "",
			email: parsed.data.email ?? existingProfile.email,
			contactNumber: parsed.data.contactNumber ?? existingProfile.contactNumber ?? null,
			bio: parsed.data.bio ?? existingProfile.bio ?? null,
		});

		const updatedProfile = await userProfileService.getUserProfile(userId);

		return NextResponse.json(updatedProfile, { status: 200 });
	} catch (error) {
		console.error("Error updating user profile:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
};
