import prisma from "@repo/db/client";
import { redirect } from "next/navigation";
import React from "react";
import CreateChapter from "./CreateChapter";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const franchise = await prisma.franchise.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			businessName: true,
			chapters: true,
			franchiseAdmin: true,
		},
	});
	if (!franchise || !franchise.franchiseAdmin) {
		redirect("/(regional-franchise)/regional-franchise/chapter-franchise");
	}
	if (franchise && franchise.chapters && franchise.chapters.length > 0) {
		return (
			<div>
				Chapter already created: {franchise.chapters[0]?.name} -{" "}
				{franchise.chapters[0]?.code}
			</div>
		);
	}
	return (
		<div>
			<CreateChapter
				franchiseId={franchise.id}
				adminId={franchise.franchiseAdmin?.id}
			/>
		</div>
	);
};

export default page;
