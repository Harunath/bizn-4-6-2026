"use client";

import { BusinessDetails } from "@repo/db/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";

export default function FillBusinessDetails({
	userId,
	businessDetails,
}: {
	userId: string;
	businessDetails: BusinessDetails | null;
}) {
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		businessName: businessDetails?.businessName ?? "",
		companyName: businessDetails?.companyName ?? "",
		panNumber: businessDetails?.panNumber ?? "",
		tanNumber: businessDetails?.tanNumber ?? "",
		gstNumber: businessDetails?.gstNumber ?? "",
		companyLogoUrl: businessDetails?.companyLogoUrl ?? "",
		gstRegisteredState: businessDetails?.gstRegisteredState ?? "",
		BusinessDescription: businessDetails?.BusinessDescription ?? "",
		keywords: businessDetails?.keywords ?? "",
		generalCategory: businessDetails?.generalCategory ?? "",
		categoryId: businessDetails?.categoryId ?? "",
		images: businessDetails?.images.length ? businessDetails.images : [""],
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const updateImage = (index: number, value: string) => {
		const images = [...form.images];
		images[index] = value;

		setForm((prev) => ({
			...prev,
			images,
		}));
	};

	const addImage = () => {
		setForm((prev) => ({
			...prev,
			images: [...prev.images, ""],
		}));
	};

	const removeImage = (index: number) => {
		setForm((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const submit = async () => {
		setLoading(true);

		try {
			const res = await fetch(`/api/user/${userId}/business-details`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...form,
					images: form.images.filter(Boolean),
				}),
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

	if (businessDetails) {
		return (
			<div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 p-4">
				<FaCheckCircle className="text-green-600 text-xl" />

				<div>
					<h3 className="font-semibold text-green-700">
						Business Details Completed
					</h3>

					<p className="text-sm text-green-600">
						{businessDetails.businessName}
					</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-2xl border bg-white p-8 shadow-sm">
			<h2 className="mb-6 text-2xl font-bold">Business Details</h2>

			<div className="grid gap-5 md:grid-cols-2">
				<input
					name="businessName"
					placeholder="Business Name"
					value={form.businessName}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="companyName"
					placeholder="Company Name"
					value={form.companyName}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="panNumber"
					placeholder="PAN Number"
					value={form.panNumber}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="tanNumber"
					placeholder="TAN Number"
					value={form.tanNumber}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="gstNumber"
					placeholder="GST Number"
					value={form.gstNumber}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="companyLogoUrl"
					placeholder="Company Logo URL"
					value={form.companyLogoUrl}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="gstRegisteredState"
					placeholder="GST Registered State"
					value={form.gstRegisteredState}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="generalCategory"
					placeholder="General Category"
					value={form.generalCategory}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				{/* <select
					name="categoryId"
					value={form.categoryId}
					onChange={handleChange}
					className="rounded-lg border p-3">
					<option value="">Select Business Category</option>

					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select> */}
			</div>

			<div className="mt-6">
				<textarea
					name="BusinessDescription"
					rows={5}
					value={form.BusinessDescription}
					onChange={handleChange}
					placeholder="Business Description"
					className="w-full rounded-lg border p-3"
				/>
			</div>

			<div className="mt-6">
				<input
					name="keywords"
					value={form.keywords}
					onChange={handleChange}
					placeholder="Keywords (comma separated)"
					className="w-full rounded-lg border p-3"
				/>
			</div>

			<div className="mt-6 space-y-3">
				<h3 className="font-semibold">Business Images</h3>

				{form.images.map((image, index) => (
					<div key={index} className="flex gap-2">
						<input
							value={image}
							onChange={(e) => updateImage(index, e.target.value)}
							placeholder="Image URL"
							className="flex-1 rounded-lg border p-3"
						/>

						<button
							type="button"
							onClick={() => removeImage(index)}
							className="rounded-lg bg-red-500 px-4 text-white">
							<FaTrash />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={addImage}
					className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2">
					<FaPlus />
					Add Image
				</button>
			</div>

			<div className="mt-8 flex justify-end">
				<button
					onClick={submit}
					disabled={loading}
					className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving..." : "Save Business Details"}
				</button>
			</div>
		</motion.div>
	);
}
