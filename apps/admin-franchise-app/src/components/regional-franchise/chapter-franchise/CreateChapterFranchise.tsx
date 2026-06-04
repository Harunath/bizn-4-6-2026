"use client";

import React, { useState } from "react";

const CreateChapterFranchise = () => {
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		businessName: "",
		motto: "",
		gstNumber: "",
		panNumber: "",
		logo: "",
		address: "",

		startDate: "",
		endDate: "",

		regionId: "",
		parentFranchiseAdminId: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);

		try {
			const res = await fetch("/api/regional-franchise/chapter-franchise", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...form,
					address: form.address ? { fullAddress: form.address } : null,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message);
				return;
			}

			alert("Chapter Franchise created successfully");

			setForm({
				businessName: "",
				motto: "",
				gstNumber: "",
				panNumber: "",
				logo: "",
				address: "",
				startDate: "",
				endDate: "",
				regionId: "",
				parentFranchiseAdminId: "",
			});
		} catch (error) {
			console.error(error);
			alert("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-3xl rounded-xl border p-6 text-neutral-950">
			<h2 className="mb-6 text-2xl font-semibold">Create Chapter Franchise</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					name="businessName"
					value={form.businessName}
					onChange={handleChange}
					placeholder="Business Name"
					className="w-full rounded border p-3"
				/>

				<input
					name="motto"
					value={form.motto}
					onChange={handleChange}
					placeholder="Motto"
					className="w-full rounded border p-3"
				/>

				<textarea
					name="address"
					value={form.address}
					onChange={handleChange}
					placeholder="Address"
					className="w-full rounded border p-3"
				/>

				<input
					name="logo"
					value={form.logo}
					onChange={handleChange}
					placeholder="Logo URL"
					className="w-full rounded border p-3"
				/>

				<input
					type="date"
					name="startDate"
					value={form.startDate}
					onChange={handleChange}
					className="w-full rounded border p-3"
				/>

				<input
					type="date"
					name="endDate"
					value={form.endDate}
					onChange={handleChange}
					className="w-full rounded border p-3"
				/>

				<button
					type="submit"
					disabled={loading}
					className="rounded bg-black px-6 py-3 text-white disabled:opacity-50">
					{loading ? "Creating..." : "Create Chapter Franchise"}
				</button>
			</form>
		</div>
	);
};

export default CreateChapterFranchise;
