"use client";

import { ContactDetails } from "@repo/db/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";

export default function FillContactDetails({
	contactDetails,
	userId,
}: {
	contactDetails: ContactDetails | null;
	userId: string;
}) {
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		phone: contactDetails?.phone ?? "",
		mobile: contactDetails?.mobile ?? "",
		website: contactDetails?.website ?? "",
		houseNo: contactDetails?.houseNo ?? "",
		pager: contactDetails?.pager ?? "",
		voiceMail: contactDetails?.voiceMail ?? "",
		billingAddress: JSON.stringify(
			contactDetails?.billingAddress ?? {},
			null,
			2,
		),
		links: contactDetails?.links.length ? contactDetails.links : [""],
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const updateLink = (index: number, value: string) => {
		const links = [...form.links];
		links[index] = value;
		setForm((prev) => ({ ...prev, links }));
	};

	const addLink = () => {
		setForm((prev) => ({
			...prev,
			links: [...prev.links, ""],
		}));
	};

	const removeLink = (index: number) => {
		setForm((prev) => ({
			...prev,
			links: prev.links.filter((_, i) => i !== index),
		}));
	};

	const submit = async () => {
		setLoading(true);

		try {
			const res = await fetch(`/api/user/${userId}/contact-details`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...form,
					billingAddress: form.billingAddress
						? JSON.parse(form.billingAddress)
						: null,
					links: form.links.filter(Boolean),
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

	if (contactDetails) {
		return (
			<div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-green-700">
				<FaCheckCircle className="text-xl" />
				<div>
					<h3 className="font-semibold">Contact Details Completed</h3>
					<p className="text-sm">
						{contactDetails.mobile ?? contactDetails.phone ?? "No phone"}
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
			<h2 className="mb-6 text-2xl font-bold">Contact Details</h2>

			<div className="grid gap-5 md:grid-cols-2">
				<input
					name="phone"
					placeholder="Phone"
					value={form.phone}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="mobile"
					placeholder="Mobile"
					value={form.mobile}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="website"
					placeholder="Website"
					value={form.website}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="houseNo"
					placeholder="House No"
					value={form.houseNo}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="pager"
					placeholder="Pager"
					value={form.pager}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>

				<input
					name="voiceMail"
					placeholder="Voice Mail"
					value={form.voiceMail}
					onChange={handleChange}
					className="rounded-lg border p-3"
				/>
			</div>

			<div className="mt-6">
				<label className="mb-2 block font-medium">Website / Social Links</label>

				<div className="space-y-3">
					{form.links.map((link, index) => (
						<div key={index} className="flex gap-2">
							<input
								value={link}
								onChange={(e) => updateLink(index, e.target.value)}
								placeholder="https://..."
								className="flex-1 rounded-lg border p-3"
							/>

							<button
								type="button"
								onClick={() => removeLink(index)}
								className="rounded-lg bg-red-500 px-4 text-white">
								<FaTrash />
							</button>
						</div>
					))}

					<button
						type="button"
						onClick={addLink}
						className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2">
						<FaPlus />
						Add Link
					</button>
				</div>
			</div>

			<div className="mt-6">
				<label className="mb-2 block font-medium">Billing Address (JSON)</label>

				<textarea
					name="billingAddress"
					rows={8}
					value={form.billingAddress}
					onChange={handleChange}
					className="w-full rounded-lg border p-3 font-mono"
				/>
			</div>

			<div className="mt-8 flex justify-end">
				<button
					onClick={submit}
					disabled={loading}
					className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Saving..." : "Save Contact Details"}
				</button>
			</div>
		</motion.div>
	);
}
