import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@repo/db/client";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { firstname, lastname, email, phone, chapterId, membershipEndDate } =
			body;

		if (
			!firstname ||
			!lastname ||
			!email ||
			!phone ||
			!chapterId ||
			!membershipEndDate
		) {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields",
				},
				{ status: 400 },
			);
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{
						email,
					},
					{
						phone,
					},
				],
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: "User already exists",
				},
				{ status: 409 },
			);
		}

		const hashedPassword = await bcrypt.hash(phone, 10);

		const user = await prisma.user.create({
			data: {
				firstname,
				lastname,
				email,
				phone,

				password: hashedPassword,

				chapterId,

				membershipEndDate: new Date(membershipEndDate),

				emailVerified: false,
				phoneVerified: false,
				registrationCompleted: false,
			},
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				phone: true,
			},
		});

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong",
			},
			{ status: 500 },
		);
	}
}
