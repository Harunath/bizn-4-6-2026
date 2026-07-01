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
			billingAddress,
			phone,
			mobile,
			website,
			links,
			houseNo,
			pager,
			voiceMail,
		} = body;

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

		const contactDetails = await prisma.contactDetails.upsert({
			where: {
				userId: id,
			},
			update: {
				billingAddress,
				phone,
				mobile,
				website,
				links,
				houseNo,
				pager,
				voiceMail,
			},
			create: {
				userId: id,
				billingAddress,
				phone,
				mobile,
				website,
				links: links ?? [],
				houseNo,
				pager,
				voiceMail,
			},
		});

		return NextResponse.json({
			success: true,
			data: contactDetails,
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
