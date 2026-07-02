"use client";

import Link from "next/link";
import { useState } from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { NavItem } from "./types";

interface Props {
	item: NavItem;
	collapsed: boolean;
	depth: number;
}

export default function SideNavItem({ item, collapsed, depth }: Props) {
	const [open, setOpen] = useState(true);

	const hasChildren = item.children?.length;

	return (
		<>
			<div
				className="flex items-center justify-between px-3 py-2 hover:bg-neutral-200 cursor-pointer"
				style={{
					paddingLeft: `${depth * 18 + 12}px`,
				}}
				onClick={() => {
					if (hasChildren) setOpen(!open);
				}}>
				<div className="flex items-center gap-3">
					{item.icon && <item.icon size={18} />}

					{!collapsed &&
						(item.href ? (
							<Link href={item.href}>{item.title}</Link>
						) : (
							<span>{item.title}</span>
						))}
				</div>

				{!collapsed &&
					hasChildren &&
					(open ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />)}
			</div>

			{hasChildren &&
				open &&
				item.children!.map((child) => (
					<SideNavItem
						key={child.id}
						item={child}
						collapsed={collapsed}
						depth={depth + 1}
					/>
				))}
		</>
	);
}
