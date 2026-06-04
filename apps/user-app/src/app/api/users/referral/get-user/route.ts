import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client"; // Adjust this path to your DB client location
import { authOptions } from "../../../../../lib/auth";
import { getServerSession } from "next-auth";

export const POST = async (req: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user?.id || !session.user?.chapterId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { finder } = await req.json();

		if (!finder || finder.trim().length < 2) {
			return NextResponse.json({ users: [] }); // Return empty list on short input
		}

		const chapterId = session.user.chapterId;
		if (!chapterId) {
			// Handle error or empty result
			return NextResponse.json(
				{ error: "Could not find the chapter" },
				{ status: 400 },
			);
		}

		const users = await prisma.user.findMany({
			where: {
				AND: [
					{
						OR: [
							{ firstname: { contains: finder, mode: "insensitive" } },
							{ lastname: { contains: finder, mode: "insensitive" } },
							{ email: { contains: finder, mode: "insensitive" } },
							{ phone: { contains: finder } },
						],
					},
				],
			},
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				phone: true,
				profileImage: true,
				chapterId: true,
				businessDetails: {
					select: {
						businessName: true,
						generalCategory: true,
						category: true,
					},
				},
				Chapter: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			take: 10,
		});
		return NextResponse.json({ data: users });
	} catch (error) {
		console.error("Error searching users:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
};
