import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";

type Params = Promise<{
	id: string;
}>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
	try {
		const { id } = await params;

		const body = await req.json();

		const {
			businessName,
			images,
			panNumber,
			tanNumber,
			gstNumber,
			companyName,
			companyLogoUrl,
			gstRegisteredState,
			BusinessDescription,
			keywords,
			generalCategory,
		} = body;

		if (!businessName) {
			return NextResponse.json(
				{
					success: false,
					message: "Business name is required.",
				},
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found.",
				},
				{ status: 404 },
			);
		}

		const businessDetails = await prisma.businessDetails.upsert({
			where: {
				userId: id,
			},
			update: {
				businessName,
				images,
				panNumber,
				tanNumber,
				gstNumber,
				companyName,
				companyLogoUrl,
				gstRegisteredState,
				BusinessDescription,
				keywords,
				generalCategory,
			},
			create: {
				userId: id,
				businessName,
				images: images ?? [],
				panNumber,
				tanNumber,
				gstNumber,
				companyName,
				companyLogoUrl,
				gstRegisteredState,
				BusinessDescription,
				keywords,
				generalCategory,
			},
		});

		return NextResponse.json({
			success: true,
			data: businessDetails,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong.",
			},
			{ status: 500 },
		);
	}
}
