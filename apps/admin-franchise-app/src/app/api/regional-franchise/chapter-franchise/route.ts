import { NextRequest, NextResponse } from "next/server";
import { FranchiseType } from "@prisma/client";
import prisma from "@repo/db/client";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { businessName, address, logo, motto, startDate, endDate } = body;

		if (!businessName) {
			return NextResponse.json(
				{ message: "Business name is required" },
				{ status: 400 },
			);
		}
		const session = await getServerSession(authOptions);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.REGIONAL_FRANCHISE
		) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}
		const franchise = await prisma.franchise.create({
			data: {
				businessName,
				address,
				logo,
				motto,
				startDate: new Date(startDate),
				endDate: new Date(endDate),

				franchiseType: FranchiseType.CHAPTER_FRANCHISE,

				parentFranchiseAdmin: {
					connect: {
						id: session.user.id,
					},
				},
			},
			include: {
				region: true,
				parentFranchiseAdmin: true,
			},
		});

		return NextResponse.json(
			{
				message: "Chapter Franchise created successfully",
				franchise,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ message: "Failed to create Chapter Franchise" },
			{ status: 500 },
		);
	}
}
