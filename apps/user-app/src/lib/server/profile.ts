// lib/server/profile.ts
"use server";

import prisma from "@repo/db/client";
import { BusinessDetails } from "@repo/db/client";

// Wire types = Dates as string (safe to serialize to client)

export interface BusinessDetailsWire
	extends Omit<BusinessDetails, "createdAt" | "updatedAt"> {
	createdAt: string;
	updatedAt: string;
}

export interface ProfilePropsWire {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	chapterId: string;
	businessDetails: BusinessDetailsWire | null;

	emailVerified: boolean;
	phone: string;
	phoneVerified: boolean;
	registrationCompleted: boolean;
	profileImage: string | null;
	deleted: boolean;
	deactivated: boolean;
	membershipStartDate: string;
	membershipEndDate: string;

	createdAt: string;
	updatedAt: string;
}

export interface ContactDetailsWire {
	phone: string | null;
	createdAt: string;
	updatedAt: string;
	userId: string;
	mobile: string | null;
	website: string | null;
	links: string[];
	houseNo: string | null;
	pager: string | null;
	voiceMail: string | null;
}

export async function getProfileByUserId(userId: string): Promise<{
	user: ProfilePropsWire | null;
	contactDetails: ContactDetailsWire | null;
}> {
	const [user, contact] = await Promise.all([
		prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				chapterId: true,
				emailVerified: true,
				phone: true,
				phoneVerified: true,
				registrationCompleted: true,
				profileImage: true,
				deleted: true,
				deactivated: true,
				membershipStartDate: true,
				membershipEndDate: true,
				createdAt: true,
				updatedAt: true,
				businessDetails: true,
			},
		}),
		prisma.contactDetails.findUnique({
			where: { userId },
			select: {
				phone: true,
				createdAt: true,
				updatedAt: true,
				userId: true,
				mobile: true,
				website: true,
				links: true,
				houseNo: true,
				pager: true,
				voiceMail: true,
			},
		}),
	]);

	// Cast Dates -> ISO strings for wire types
	const toISO = (d: Date | null | undefined) => (d ? d.toISOString() : null);

	const userWire: ProfilePropsWire | null = user
		? {
				...user,
				membershipStartDate: toISO(user.membershipStartDate)!,
				membershipEndDate: toISO(user.membershipEndDate)!,
				createdAt: user.createdAt.toISOString(),
				updatedAt: user.updatedAt.toISOString(),
				businessDetails: user.businessDetails
					? {
							...user.businessDetails,
							createdAt: user.businessDetails.createdAt.toISOString(),
							updatedAt: user.businessDetails.updatedAt.toISOString(),
						}
					: null,
			}
		: null;

	const contactWire: ContactDetailsWire | null = contact
		? {
				...contact,
				createdAt: contact.createdAt.toISOString(),
				updatedAt: contact.updatedAt.toISOString(),
			}
		: null;

	return { user: userWire, contactDetails: contactWire };
}
