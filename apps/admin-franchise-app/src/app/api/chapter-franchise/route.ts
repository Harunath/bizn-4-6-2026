// src/app/api/admin/franchise/route.ts
import { NextResponse } from "next/server";
import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log(session);
		if (
			!session ||
			!session?.user ||
			session.user.franchiseType != FranchiseType.CHAPTER_FRANCHISE
		) {
			return NextResponse.json({ message: "unauthorized" }, { status: 403 });
		}
		const franchiseAdmin = await prisma.franchiseAdmin.findUnique({
			where: {
				id: session?.user.id,
			},
			include: {
				franchise: true,
			},
		});
		if (!franchiseAdmin || !franchiseAdmin.franchise) {
			return NextResponse.json(
				{ message: "Franchise not found" },
				{ status: 404 },
			);
		}
		franchiseAdmin.password = "";
		return NextResponse.json(
			{ message: "success", data: franchiseAdmin },
			{ status: 200 },
		);
	} catch (e) {
		console.log(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
