"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingAnimation from "./LoadingAnimation";

const BizLoading = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [route, setRoute] = useState<string | null>(null);

	useEffect(() => {
		if (status === "loading") return;

		if (status === "unauthenticated") {
			router.push("/login");
			return;
		}

		if (session?.user) {
			const getUser = async () => {
				const res = await fetch(`/api/user/${session.user.id}`);
				if (!res.ok) {
					router.push("/logout");
				}
				const data = await res.json();
				console.log("User data:", data.data);
				if (data.message == "success") {
					setRoute(data.data.chapterId ? "/dashboard" : "/logout");
				}
			};
			getUser();
		}
	}, [status, session, router]);

	if (!route) return <LoadingAnimation />;

	return (
		<div className="h-screen w-screen relative bg-red-600 text-white flex justify-center items-center">
			<div className="text-center px-4 flex flex-col items-center space-y-4 md:space-y-6">
				<h3 className="text-4xl md:text-7xl font-bold">
					<span className="text-white">
						{session?.user?.firstname || "User"}
					</span>
				</h3>

				<p className="text-lg md:text-xl text-black font-medium">Welcome to</p>

				<h1 className="text-xl md:text-2xl font-medium text-white">
					<span className="inline-flex items-center">
						<span className="font-extrabold mr-1">BIZ</span>-
						<span className="text-white font-extrabold">NETWORK</span>
						<span className="text-white text-sm align-top ml-1">®</span>
					</span>
				</h1>
			</div>

			{/* Page transition animation */}
			<motion.div
				initial={{
					width: "100vw",
					height: "100vh",
					x: 0,
				}}
				animate={{
					x: "100vw",
					width: 0,
					transition: {
						duration: 2,
						ease: "easeInOut",
					},
				}}
				onAnimationComplete={() => {
					if (route) router.push(route);
				}}
				className="absolute inset-0 bg-white z-50"
			/>
		</div>
	);
};

export default BizLoading;
