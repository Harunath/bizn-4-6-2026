import React from "react";
import ChapterPage from "../../../../../components/regional-franchise/chapters/Chapter";
import Link from "next/link";

const page = async ({
	params,
}: {
	params: Promise<{
		chapterId: string;
	}>;
}) => {
	const slug = await params;
	return (
		<div>
			<p>Chapter : {slug.chapterId}</p>
			<div className="flex space-x-4 mb-4">
				<Link
					href={`/regional-franchise/chapters/${slug.chapterId}/members`}
					className="text-blue-600 hover:underline p-2 border border-blue-600 rounded">
					View Members
				</Link>
			</div>

			<div className=" relative">
				<ChapterPage chapterId={slug.chapterId} />
			</div>
		</div>
	);
};

export default page;
