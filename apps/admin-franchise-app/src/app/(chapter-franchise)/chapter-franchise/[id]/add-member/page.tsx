import React from "react";
import CreateUserForm from "./CreateUserForm";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	if (!id) {
		return (
			<p className="text-center text-red-500 mt-10">Chapter ID is required</p>
		);
	}

	return (
		<div>
			<CreateUserForm chapterId={id} />
		</div>
	);
};

export default page;
