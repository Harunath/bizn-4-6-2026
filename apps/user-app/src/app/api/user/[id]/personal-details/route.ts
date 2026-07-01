import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { GenderType, TitleTypes } from "@repo/db/client";

type Params = Promise<{
	id: string;
}>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
	try {
		const { id } = await params;

		const body = await req.json();

		const { title, firstname, lastname, suffix, displayname, gender } = body;

		if (!firstname || !lastname || !displayname) {
			return NextResponse.json(
				{
					success: false,
					message: "Required fields are missing.",
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

		const personalDetails = await prisma.personalDetails.upsert({
			where: {
				userId: id,
			},
			update: {
				title,
				firstname,
				lastname,
				suffix,
				displayname,
				gender,
			},
			create: {
				userId: id,
				title: title as TitleTypes,
				firstname,
				lastname,
				suffix,
				displayname,
				gender: gender as GenderType,
			},
		});

		return NextResponse.json({
			success: true,
			data: personalDetails,
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
