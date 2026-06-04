import React from "react";

const page = async ({
	params,
}: {
	params: Promise<{
		id: string;
	}>;
}) => {
	const slug = await params;
	return (
		<>
			<div className="text-2xl font-bold">chapter id : {slug.id}</div>
			<p>Chapter members</p>
		</>
	);
};

export default page;
