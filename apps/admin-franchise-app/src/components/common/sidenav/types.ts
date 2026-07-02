// import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export interface NavItem {
	id: string;
	title: string;
	icon?: IconType;
	href?: string;
	badge?: string;
	children?: NavItem[];
}
