"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();
	useEffect(() => {
		if (session && session.user) {
			const getUser = async () => {
				setLoading(true);

				const res = await fetch(`/api/user/${session.user.id}`);
				const data = await res.json();
				if (data.message == "success") {
					router.push("/");
				}
				setLoading(false);
			};
			getUser();
		}
	}, [session, router]);
	// const handleGoogleSignIn = async () => {
	// 	setLoading(true);
	// 	try {
	// 		await signIn("google", { callbackUrl: "/" });
	// 	} catch (error) {
	// 		console.error("Google sign-in failed: ", error);
	// 		setError("Google sign-in failed.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const handleCredentialsSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (result?.error) {
			setError(result.error);
		} else {
			router.push("/");
		}
		setLoading(false);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full bg-white overflow-hidden border shadow-lg">
				<div className="hidden md:block">
					<Image
						src="https://res.cloudinary.com/dsq4uyqbb/image/upload/v1741761028/ac695890-7f2c-492f-8365-e12189e69fd4_fz9dxr.webp"
						alt="Login Visual"
						className="h-full w-full object-cover"
						width={600}
						height={600}
					/>
				</div>

				<div className="p-8 md:p-12 flex flex-col justify-center">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-black">
							<span className="text-red-600">
								Biz
								<span className="text-black inline-flex items-center">
									-Network<span className="text-sm align-top">®</span>
								</span>
							</span>
						</h1>
					</div>

					<p className="mb-6 text-gray-600">Please enter your details</p>

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

					{/* <button
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 mb-4"
						disabled={loading}>
						<FcGoogle className="text-2xl" />
						{loading ? "Signing in..." : "Sign in with Google"}
					</button>

					<div className="relative my-4 text-center">
						<span className="bg-white px-2 text-gray-500 relative z-10">
							or
						</span>
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
					</div> */}

					<form onSubmit={handleCredentialsSignIn} className="space-y-4">
						<input
							type="email"
							placeholder="Email address"
							className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-red-600"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-red-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-3 flex items-center text-red-600">
								{showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
							</button>
						</div>

						<button
							type="submit"
							className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
							disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</form>
					<p className=" text-xs mt-2">
						Don&apos;t have an account?{" "}
						<Link className=" text-green-500 font-medium" href="/register">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
