import Link from "next/link";
import React from "react";

const ProfileCompleted = () => {
	return (
		<div>
			Profile Completed! click here to go to dashboard
			<Link href="/dashboard" className="text-blue-500 underline">
				Go to Dashboard
			</Link>
		</div>
	);
};

export default ProfileCompleted;
