import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ chapterId: string }> },
) {
	try {
		const { chapterId } = await params;
		if (!chapterId) {
			return NextResponse.json(
				{ message: "chapterId is missing" },
				{ status: 400 },
			);
		}

		// Fetch only what the UI needs
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
			select: {
				id: true,
				name: true,
				code: true,
				description: true,
				images: true,
				regionId: true,
				updatedAt: true,
				region: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!chapter) {
			return NextResponse.json(
				{ message: "Chapter does not exist" },
				{ status: 404 },
			);
		}

		// Flatten for the client
		const data = {
			id: chapter.id,
			name: chapter.name,
			code: chapter.code,
			description: chapter.description,
			images: chapter.images,
			regionId: chapter.regionId,
			region: chapter.region, // { id, name }
			updatedAt: chapter.updatedAt,
		};

		return NextResponse.json({ message: "success", data }, { status: 200 });
	} catch (e) {
		console.error("[GET_CHAPTER_BY_ID]", e);
		return NextResponse.json(
			{ message: "Internal Service Error" },
			{ status: 500 },
		);
	}
}
