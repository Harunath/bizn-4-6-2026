"use client";
import { Chapter, Region } from "@repo/db/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingAnimation from "../../common/LoadingAnimation";
import Link from "next/link";

interface ChapterType extends Chapter {
	region: Region | null;
}

const ChapterPage = ({ chapterId }: { chapterId: string }) => {
	const [chapter, setChapter] = useState<ChapterType | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		getChapter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chapterId]);

	const getChapter = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/regional-franchise/chapters/${chapterId}`);
			if (!res.ok) {
				toast.error("Failed to load chapter");
				return;
			}
			const result = await res.json();
			if (result?.message === "success" && result?.data) {
				setChapter(result.data as ChapterType);
			} else {
				toast.error("Unexpected response for chapter");
			}
		} catch (error) {
			console.error("[FETCH_CHAPTER]", error);
			toast.error("Something went wrong while loading chapter");
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <LoadingAnimation />;

	if (!chapter) {
		return (
			<div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
				<p className="text-sm text-gray-600">
					Chapter with id <span className="font-mono">{chapterId}</span> is not
					found.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Breadcrumbs */}
			<nav aria-label="Breadcrumb" className="text-sm">
				<ol className="flex flex-wrap items-center gap-1 text-gray-500">
					<li>
						<Link
							href="/regional-franchise/chapters"
							className="hover:text-gray-700">
							Chapters
						</Link>
					</li>
					<li className="px-1">/</li>
					<li className="text-gray-800 font-medium">{chapter.name}</li>
				</ol>
			</nav>

			{/* Chapter header card */}
			<section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							{chapter.name}
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Region:{" "}
							{chapter.region?.name ? (
								<span className="font-medium text-gray-700">
									{chapter.region.name}
								</span>
							) : (
								<span className="font-mono">{chapter.regionId}</span>
							)}
						</p>

						{/* Meta badges */}
						<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Code: {chapter.code}
							</span>
							<span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1">
								Updated: {new Date(chapter.updatedAt).toLocaleDateString()}
							</span>
						</div>

						{/* Description */}
						{chapter.description ? (
							<p className="mt-4 max-w-3xl text-sm text-gray-700">
								{chapter.description}
							</p>
						) : null}
					</div>

					{/* Optional banner image (first image if available) */}
					{Array.isArray(chapter.images) && chapter.images.length > 0 ? (
						<div className="ml-auto w-full max-w-xs overflow-hidden rounded-xl border border-gray-100">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={chapter.images[0]}
								alt={`${chapter.name} banner`}
								className="h-40 w-full object-cover"
							/>
						</div>
					) : null}
				</div>
			</section>
		</div>
	);
};

export default ChapterPage;
