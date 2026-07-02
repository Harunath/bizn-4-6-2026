import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import WithRole from "../../hoc/WithRole";
import Navbar from "../../components/common/NavBar";
import { FranchiseType } from "@repo/db/client";
import BackButton from "@repo/ui/BackButton";
import SideNav from "../../components/common/sidenav/SideNav";
export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	const links = [
		{ name: "Dashboard", href: "/chapter-franchise/dashboard" },
		{ name: "profile", href: "/chapter-franchise/profile" },
	];
	const navItems = [
		{
			id: "dashboard",
			title: "Dashboard",
			href: "/chapter-franchise/dashboard",
		},
		{
			id: "chapters-leaders",
			title: "Chapters Leaders",
			href: "/chapter-franchise/chapters-leaders",
		},
		{
			id: "user-list",
			title: "User List",
			href: "/chapter-franchise/user-list",
		},
		{
			id: "profile",
			title: "Profile",
			href: "/chapter-franchise/profile",
		},
		{
			id: "settings",
			title: "Settings",
			children: [
				{
					id: "general",
					title: "General",
					href: "/chapter-franchise/settings/general",
				},
				{
					id: "security",
					title: "Security",
					href: "/chapter-franchise/settings/security",
				},
			],
		},
	];

	return (
		<WithRole allowedRole={FranchiseType.CHAPTER_FRANCHISE} session={session}>
			<div className=" w-screen bg-neutral-50 text-neutral-950 min-h-screen">
				<Navbar links={links} />
				<div className="pt-16 px-2 flex">
					<SideNav navItems={navItems} />
					<div className="flex-1 p-4">
						<BackButton />
						{children}
					</div>
				</div>
			</div>
		</WithRole>
	);
}
