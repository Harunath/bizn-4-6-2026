import React from "react";
import prisma, { FranchiseType } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import Link from "next/link";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (
		!session ||
		!session?.user ||
		session.user.franchiseType != FranchiseType.REGIONAL_FRANCHISE
	) {
		return <div>Unauthorized</div>;
	}
	console.log("Session user:", session.user);
	const chapterFranchise = await prisma.franchise.findMany({
		where: {
			parentFranchiseAdminId: session.user.id,
			franchiseType: FranchiseType.CHAPTER_FRANCHISE,
		},
		include: {
			franchiseAdmin: true,
			chapters: true,
		},
	});

	return (
		<div>
			Chapter franchise page
			<div className="p-2 bg-blue-500 w-fit text-neutral-100 border border-gray-700 rounded mb-4">
				<Link href="/register-chapter-franchise">New Chapter Franchises</Link>
			</div>
			{chapterFranchise.length > 0 ? (
				chapterFranchise.map((franchise) => (
					<div key={franchise.id} className="p-4 mb-4 border rounded shadow">
						<h3>{franchise.businessName}</h3>
						{franchise.franchiseAdmin ? (
							<>
								<p>
									Admin:{" "}
									{franchise.franchiseAdmin.firstName +
										" " +
										franchise.franchiseAdmin.lastName}
								</p>
								{franchise.chapters.length > 0 ? (
									<p>
										Chapter:{" "}
										{franchise.chapters[0]?.name +
											" " +
											franchise.chapters[0]?.code}
									</p>
								) : (
									<Link
										href={`./chapter-franchise/${franchise.id}/create-chapter`}
										className="text-blue-500 hover:text-blue-700 transition duration-300">
										Create chapter
									</Link>
								)}
							</>
						) : (
							<>
								<Link
									href={`./chapter-franchise/${franchise.id}`}
									className="text-blue-500 hover:text-blue-700 transition duration-300">
									Assign Admin
								</Link>
							</>
						)}
					</div>
				))
			) : (
				<p>No chapter franchises found.</p>
			)}
		</div>
	);
};

export default page;
