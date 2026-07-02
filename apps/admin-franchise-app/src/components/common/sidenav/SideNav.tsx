"use client";

import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import SideNavItem from "./SideNavItem";
import { NavItem } from "./types";

export default function SideNav({ navItems }: { navItems: NavItem[] }) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`border-r bg-white transition-all duration-300 text-neutral-950
      ${collapsed ? "w-20" : "w-72"}`}>
			<div className="flex h-16 items-center justify-between px-4 border-b">
				{!collapsed && <h1 className="font-bold text-lg">Admin</h1>}

				<button onClick={() => setCollapsed(!collapsed)}>
					<LuMenu />
				</button>
			</div>

			<nav className="py-3">
				{navItems.map((item) => (
					<SideNavItem
						key={item.id}
						item={item}
						collapsed={collapsed}
						depth={0}
					/>
				))}
			</nav>
		</aside>
	);
}
