import prisma from "@repo/db/client";
import React from "react";
import CreateChapterFranchiseAdmin from "../../../../../components/regional-franchise/chapter-franchise/CreateChapterFranchiseAdmin";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	if (!id) {
		return <div>Invalid franchise ID</div>;
	}
	const franchise = await prisma.franchise.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			businessName: true,
			franchiseAdmin: {
				select: {
					id: true,
				},
			},
		},
	});
	if (!franchise) {
		return <div>Franchise not found</div>;
	}
	if (franchise.franchiseAdmin) {
		return <div>Admin already assigned: {franchise.franchiseAdmin.id}</div>;
	}
	return (
		<div>
			<CreateChapterFranchiseAdmin chapterId={franchise.id} />
		</div>
	);
};

export default page;
