// src/app/api/admin/franchise-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcryptjs";

export async function POST(
	req: NextRequest,
	params: { params: Promise<{ id: string }> },
) {
	const { id } = await params.params;
	try {
		const body = await req.json();
		const {
			email,
			firstName,
			lastName,
			password,
			phone,
			nomineeName,
			nomineeRelation,
			nomineeContact,
		} = body;
		if (
			!id ||
			!email ||
			!firstName ||
			!lastName ||
			!password ||
			!phone ||
			!nomineeName ||
			!nomineeRelation ||
			!nomineeContact
		) {
			return NextResponse.json({ error: "Insuffecient data" }, { status: 404 });
		}
		// Check if franchise exists and has no admin
		const franchise = await prisma.franchise.findUnique({
			where: { id: id },
			include: { franchiseAdmin: true },
		});

		if (!franchise) {
			return NextResponse.json(
				{ error: "Franchise not found" },
				{ status: 404 },
			);
		}

		if (franchise.franchiseAdmin) {
			return NextResponse.json(
				{ error: "Franchise already has an admin" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
		const newAdmin = await prisma.franchiseAdmin.create({
			data: {
				email,
				firstName,
				lastName,
				password: hashedPassword,
				phone,
				nomineeName,
				nomineeRelation,
				nomineeContact,
				franchiseId: id,
			},
		});

		return NextResponse.json(newAdmin, { status: 201 });
	} catch (error) {
		console.error("[CREATE_ADMIN_ERROR]", error);
		return NextResponse.json(
			{ error: "Failed to create admin" },
			{ status: 500 },
		);
	}
}
