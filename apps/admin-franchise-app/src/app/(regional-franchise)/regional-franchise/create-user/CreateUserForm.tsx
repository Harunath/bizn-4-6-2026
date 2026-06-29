"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ChapterType {
	id: string;
	name: string;
	code: string;
	regionId: string;
	description: string;
	updatedAt: string;
}

export default function CreateUserForm() {
	const [loading, setLoading] = useState(false);
	const [chapters, setChapters] = useState<ChapterType[]>([]);

	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		chapterId: "",
		membershipEndDate: "",
	});

	useEffect(() => {
		const fetchChapters = async () => {
			try {
				const response = await fetch("/api/regional-franchise/chapters");
				const data = await response.json();
				setChapters(data.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchChapters();
	}, []);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setLoading(true);

			const res = await fetch("/api/regional-franchise/add-member", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message);
				return;
			}

			alert("User created successfully");

			setForm({
				firstname: "",
				lastname: "",
				email: "",
				phone: "",
				chapterId: "",
				membershipEndDate: "",
			});
		} catch (error) {
			console.error(error);
			alert("Failed to create user");
		} finally {
			setLoading(false);
		}
	};

	const inputStyle =
		"w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mx-auto max-w-5xl">
			<div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 px-8 py-6">
					<h2 className="text-2xl font-bold text-gray-900">Create Member</h2>
					<p className="mt-1 text-sm text-gray-500">
						Add a new member to a chapter.
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
					{/* First Name */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							First Name
						</label>

						<input
							className={inputStyle}
							placeholder="Enter first name"
							value={form.firstname}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									firstname: e.target.value,
								}))
							}
						/>
					</div>

					{/* Last Name */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Last Name
						</label>

						<input
							className={inputStyle}
							placeholder="Enter last name"
							value={form.lastname}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									lastname: e.target.value,
								}))
							}
						/>
					</div>

					{/* Email */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Email Address
						</label>

						<input
							type="email"
							className={inputStyle}
							placeholder="john@example.com"
							value={form.email}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									email: e.target.value,
								}))
							}
						/>
					</div>

					{/* Phone */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Phone Number
						</label>

						<input
							className={inputStyle}
							placeholder="9876543210"
							value={form.phone}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									phone: e.target.value,
								}))
							}
						/>
					</div>

					{/* Chapter */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Chapter
						</label>

						<select
							className={inputStyle}
							value={form.chapterId}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									chapterId: e.target.value,
								}))
							}>
							<option value="">Select Chapter</option>

							{chapters.length === 0 && (
								<option disabled>Loading chapters...</option>
							)}

							{chapters.map((chapter) => (
								<option key={chapter.id} value={chapter.id}>
									{chapter.name}
								</option>
							))}
						</select>
					</div>

					{/* Membership */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Membership End Date
						</label>

						<input
							type="date"
							className={inputStyle}
							value={form.membershipEndDate}
							onChange={(e) =>
								setForm((p) => ({
									...p,
									membershipEndDate: e.target.value,
								}))
							}
						/>
					</div>

					{/* Button */}
					<div className="md:col-span-2 flex justify-end pt-2">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={loading}
							className="rounded-xl bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
							{loading ? "Creating Member..." : "Create Member"}
						</motion.button>
					</div>
				</form>
			</div>
		</motion.div>
	);
}
