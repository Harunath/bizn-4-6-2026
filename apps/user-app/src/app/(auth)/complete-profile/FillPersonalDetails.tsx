"use client";

import { PersonalDetails } from "@repo/db/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const titles = ["None", "Mr", "Mrs", "Ms", "Dr"];
const genders = ["None", "Male", "Female", "Other"];

export default function FillPersonalDetails({
	personalDetails,
	userId,
}: {
	personalDetails: PersonalDetails | null;
	userId: string;
}) {
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		title: personalDetails?.title ?? "None",
		firstname: personalDetails?.firstname ?? "",
		lastname: personalDetails?.lastname ?? "",
		suffix: personalDetails?.suffix ?? "",
		displayname: personalDetails?.displayname ?? "",
		gender: personalDetails?.gender ?? "None",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submit = async () => {
		setLoading(true);

		try {
			const res = await fetch(`/api/user/${userId}/personal-details`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!data.success) {
				alert(data.message);
				return;
			}

			window.location.reload();
		} finally {
			setLoading(false);
		}
	};

	if (personalDetails) {
		return (
			<div className="flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-4 text-green-700">
				<FaCheckCircle className="text-xl" />
				<div>
					<p className="font-semibold">Personal Details Completed</p>
					<p className="text-sm">{personalDetails.displayname}</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-2xl border bg-white p-8 shadow-sm">
			<h2 className="mb-6 text-2xl font-bold">Personal Details</h2>

			<div className="grid gap-5 md:grid-cols-2">
				<div>
					<label className="mb-2 block text-sm font-medium">Title</label>

					<select
						name="title"
						value={form.title}
						onChange={handleChange}
						className="w-full rounded-lg border p-3">
						{titles.map((t) => (
							<option key={t}>{t}</option>
						))}
					</select>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium">Gender</label>

					<select
						name="gender"
						value={form.gender}
						onChange={handleChange}
						className="w-full rounded-lg border p-3">
						{genders.map((g) => (
							<option key={g}>{g}</option>
						))}
					</select>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium">First Name</label>

					<input
						name="firstname"
						value={form.firstname}
						onChange={handleChange}
						className="w-full rounded-lg border p-3"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium">Last Name</label>

					<input
						name="lastname"
						value={form.lastname}
						onChange={handleChange}
						className="w-full rounded-lg border p-3"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium">Suffix</label>

					<input
						name="suffix"
						value={form.suffix}
						onChange={handleChange}
						className="w-full rounded-lg border p-3"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium">Display Name</label>

					<input
						name="displayname"
						value={form.displayname}
						onChange={handleChange}
						className="w-full rounded-lg border p-3"
					/>
				</div>
			</div>

			<div className="mt-8 flex justify-end">
				<button
					onClick={submit}
					disabled={loading}
					className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving..." : "Save Details"}
				</button>
			</div>
		</motion.div>
	);
}
