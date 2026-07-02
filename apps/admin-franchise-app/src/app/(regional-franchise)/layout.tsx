import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth"; // Your NextAuth config
import WithRole from "../../hoc/WithRole";
import Navbar from "../../components/common/NavBar";
import { FranchiseType } from "@repo/db/client";
import BackButton from "@repo/ui/BackButton";
import SideNav from "../../components/common/sidenav/SideNav";

const navItems = [
	{
		id: "dashboard",
		title: "Dashboard",
		href: "/regional-franchise/dashboard",
	},
	{
		id: "chapters",
		title: "Chapters",
		children: [
			{
				id: "chapter-list",
				title: "Chapter List",
				href: "/regional-franchise/chapters",
			},
			{
				id: "create-chapter",
				title: "Create Chapter",
				href: "/regional-franchise/chapter-franchise/register-chapter-franchise",
			},
			{
				id: "chapter-franchise",
				title: "Chapter Franchise",
				href: "/regional-franchise/chapter-franchise",
			},
		],
	},
	{
		id: "create-user",
		title: "Create User",
		href: "/regional-franchise/create-user",
	},
	{
		id: "profile",
		title: "Profile",
		href: "/regional-franchise/profile",
	},
	{
		id: "settings",
		title: "Settings",
		children: [
			{
				id: "general",
				title: "General",
				href: "/regional-franchise/settings/general",
			},
			{
				id: "security",
				title: "Security",
				href: "/regional-franchise/settings/security",
			},
		],
	},
];

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession(authOptions); // Fetch session on the server
	const links = [
		{ name: "Dashboard", href: "/regional-franchise/dashboard" },
		{ name: "profile", href: "/regional-franchise/profile" },
	];

	return (
		<WithRole allowedRole={FranchiseType.REGIONAL_FRANCHISE} session={session}>
			<div className=" w-screen bg-neutral-50 text-neutral-950 min-h-screen">
				<Navbar links={links} />
				<div className="pt-16 px-2 flex">
					<SideNav navItems={navItems} />

					<div className="flex-1 p-4">
						{" "}
						<BackButton />
						{children}
					</div>
				</div>
			</div>
		</WithRole>
	);
}
