import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import Navbar from "../../components/common/NavBar";
import BackButton from "@repo/ui/BackButton";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	if (!session || !session.user || !session.user.chapterId) {
		// If no session or user data, you can choose to redirect or show an error
		redirect("/logout"); // Redirect to login page if not authenticated
	}
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			personalDetails: true,
			businessDetails: true,
			chapterId: true,
			contactDetails: true,
		},
	});
	if (!user) {
		redirect("/logout");
	}
	if (!user.personalDetails || !user.businessDetails || !user.contactDetails) {
		redirect("/complete-profile");
	}
	const links = [
		{ name: "Dashboard", href: "/dashboard" },
		{ name: "Profile", href: "/profile" },
	];

	return (
		<div className="min-h-screen w-screen bg-neutral-50 text-neutral-950">
			<Navbar links={links} />
			<div className="pt-16 px-2">
				<BackButton />
				{children}
			</div>
		</div>
	);
}
