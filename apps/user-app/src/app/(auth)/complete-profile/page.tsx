import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";

import { authOptions } from "../../../lib/auth";

import FillPersonalDetails from "./FillPersonalDetails";
import FillContactDetails from "./FillContactDetails";
import FillBusinessDetails from "./FillBusinessDetails";
import ProfileCompleted from "./ProfileCompleted";

const CompleteProfilePage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id || !session.user.chapterId) {
		redirect("/logout");
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
			id: true,
			personalDetails: true,
			contactDetails: true,
			businessDetails: true,
		},
	});

	if (!user) {
		redirect("/logout");
	}

	// Step 1
	if (!user.personalDetails) {
		return (
			<FillPersonalDetails
				personalDetails={user.personalDetails}
				userId={user.id}
			/>
		);
	}

	// Step 2
	if (!user.contactDetails) {
		return (
			<FillContactDetails
				contactDetails={user.contactDetails}
				userId={user.id}
			/>
		);
	}

	// Step 3
	if (!user.businessDetails) {
		return (
			<FillBusinessDetails
				businessDetails={user.businessDetails}
				userId={user.id}
			/>
		);
	}

	// Everything completed
	return <ProfileCompleted />;
};

export default CompleteProfilePage;
