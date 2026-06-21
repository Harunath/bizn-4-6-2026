import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../../../../lib/auth";
import { getChapterMembers } from "../../../actions/chapter-franchise/chapter-franchise-dashboard";

const page = async () => {
	const session = await getServerSession(authOptions); // Fetch session on the server
	if (!session || !session.user.id || !session.user.franchiseId) {
		return <p className="text-center text-red-500 mt-10">Unauthorized</p>;
	}

	const members = await getChapterMembers(session.user.franchiseId);

	const events = [
		{
			name: "Event 1",
			date: "2024-07-01",
			location: "New York",
			link: `/chapter-franchise/${session.user.franchiseId}/event1`,
		},
		{
			name: "Event 2",
			date: "2024-08-15",
			location: "Los Angeles",
			link: `/chapter-franchise/${session.user.franchiseId}/event2`,
		},
		{
			name: "Event 3",
			date: "2024-09-10",
			location: "Chicago",
			link: `/chapter-franchise/${session.user.franchiseId}/event3`,
		},
	];

	return (
		<div>
			<h1 className="text-5xl font-bold text-center mt-10">
				Chapter Franchise
			</h1>

			<div className=" grid grid-cols-1 md:grid-cols-2 items-center justify-center mt-10 gap-4">
				<div className="flex flex-col items-center justify-center border-2 bg-cyan-300 border-neutral-100 rounded-lg p-6">
					<div className="flex justify-around items-center w-full text-2xl font-semibold text-neutral-600 border-b-2 border-neutral-100 pb-2 mb-4">
						Members list
						<div className="text-sm bg-neutral-100 rounded px-2 text-blue-500 hover:text-red-500 transition-colors">
							<Link
								href={`/chapter-franchise/${session.user.franchiseId}/add-member`}>
								Add member
							</Link>
						</div>
					</div>
					<div className="text-neutral-500">
						<ul>
							{members.length == 0 ? (
								<div>No members</div>
							) : (
								members.map((member) => (
									<li key={member.id}>
										{member.firstname} {member.lastname}
									</li>
								))
							)}
						</ul>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center border-2 bg-cyan-300 border-neutral-100 rounded-lg p-6">
					<div className="flex justify-around items-center w-full text-2xl font-semibold text-neutral-600 border-b-2 border-neutral-100 pb-2 mb-4">
						Chapter Leaders
						<div className="text-sm bg-neutral-100 rounded px-2 text-blue-500 hover:text-red-500 transition-colors">
							<Link
								href={`/chapter-franchise/${session.user.franchiseId}/leaders`}>
								View leaders
							</Link>
						</div>
					</div>
					<div className="text-neutral-500">
						<ul>
							<li>John Doe</li>
							<li>Jane Smith</li>
							<li>Bob Johnson</li>
						</ul>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-3xl font-semibold text-center mt-10">
					Upcoming Events
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					{events.length === 0 ? (
						<p className="text-neutral-500">No upcoming events</p>
					) : (
						events.map((event, index) => (
							<div key={index} className="mb-4">
								<div className="flex flex-col items-center justify-center border-2 bg-cyan-300 border-neutral-100 rounded-lg p-6">
									<div className="flex justify-around items-center w-full text-2xl font-semibold text-neutral-600 border-b-2 border-neutral-100 pb-2 mb-4">
										{event.name}
										<div className="text-sm bg-neutral-100 rounded px-2 text-blue-500 hover:text-red-500 transition-colors">
											<Link href={event.link}>View</Link>
										</div>
									</div>
									<div className="text-neutral-500">
										<p>Date: {event.date}</p>
										<p>Location: {event.location}</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default page;
