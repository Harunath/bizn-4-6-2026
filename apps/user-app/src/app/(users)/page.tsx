import { redirect } from "next/navigation";

export default function FreePageRedirect() {
	redirect("/dashboard");
}
