import prisma from "@repo/db/client";

export async function getChapterMembers(chapterId: string, take = 5) {
	return prisma.user.findMany({
		where: {
			chapterId: chapterId,
			deleted: false,
			deactivated: false,
		},

		take,

		orderBy: {
			createdAt: "desc",
		},

		select: {
			id: true,
			firstname: true,
			lastname: true,
			email: true,
			phone: true,
			profileImage: true,
			createdAt: true,

			businessDetails: {
				select: {
					businessName: true,
					companyLogoUrl: true,
				},
			},

			categoryAssignment: {
				select: {
					category: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});
}
