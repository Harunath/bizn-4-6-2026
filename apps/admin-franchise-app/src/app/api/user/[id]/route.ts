import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@repo/db/client";
import { FASessionOrThrow } from "../../../../lib/auth/Role";

const updateUserSchema = z.object({
	firstname: z.string().min(1).optional(),
	lastname: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().min(7).optional(),
	chapterId: z.string().optional(),
});

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await FASessionOrThrow();
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			personalDetails: true,
			businessDetails: true,
		},
		omit: { password: true },
	});
	if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

	return Response.json({
		ok: true,
		user,
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	await FASessionOrThrow();
	const { id } = await params;
	if (!id)
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	const body = await req.json();
	const data = updateUserSchema.parse(body);

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			firstname: true,
			email: true,
			phone: true,
			chapterId: true,
		},
	});
	if (!user)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	const updated = await prisma.user.update({
		where: { id },
		data: {
			firstname: data.firstname ? data.firstname : user.firstname,
			email: data.email ? data.email : user.email,
			phone: data.phone ? data.phone : user.phone,
			chapterId: data.chapterId ? data.chapterId : user.chapterId,
		},
	});

	return NextResponse.json({ ok: true, id: updated.id });
}
