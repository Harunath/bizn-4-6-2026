"use client";

import { useEffect, useState } from "react";

// interface UserType {
// 	firstname: string;
// 	lastname: string;
// 	email: string;
// 	phone: string;
// 	chapterId: string;
// 	membershipEndDate: string;
// }

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
				setChapters(data);
			} catch (error) {
				console.error("Error fetching chapters:", error);
			}
		};
		fetchChapters();
	}, []);
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			setLoading(true);

			const res = await fetch(`/api/regional-franchise/add-member`, {
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

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<input
				placeholder="First Name"
				value={form.firstname}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						firstname: e.target.value,
					}))
				}
			/>

			<input
				placeholder="Last Name"
				value={form.lastname}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						lastname: e.target.value,
					}))
				}
			/>

			<input
				placeholder="Email"
				type="email"
				value={form.email}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						email: e.target.value,
					}))
				}
			/>

			<input
				placeholder="Phone"
				value={form.phone}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						phone: e.target.value,
					}))
				}
			/>
			<select>
				<option value="">Select Chapter</option>
				{chapters.map((chapter: ChapterType) => (
					<option key={chapter.id} value={chapter.id}>
						{chapter.name}
					</option>
				))}
			</select>
			<input
				placeholder="Chapter Id"
				value={form.chapterId}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						chapterId: e.target.value,
					}))
				}
			/>

			<input
				type="date"
				value={form.membershipEndDate}
				onChange={(e) =>
					setForm((p) => ({
						...p,
						membershipEndDate: e.target.value,
					}))
				}
			/>

			<button disabled={loading}>
				{loading ? "Creating..." : "Create User"}
			</button>
		</form>
	);
}
