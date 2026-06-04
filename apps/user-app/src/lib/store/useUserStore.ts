// lib/store/useUserStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** ── Domain types ────────────────────────────────────────────────────────── */

export interface BusinessDetails {
	id: string;
	userId: string;
	businessName: string;
	images: string[];
	panNumber: string | null;
	panNumberVerified: boolean;
	tanNumber: string | null;
	gstNumber: string | null;
	gstNumberVerified: boolean;
	verified: boolean;
	companyName: string | null;
	companyLogoUrl: string | null;
	gstRegisteredState: string | null;
	BusinessDescription: string | null;
	keywords: string | null;
	generalCategory: string | null;
	categoryId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProfileProps {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	chapterId: string;
	businessDetails: BusinessDetails;

	emailVerified: boolean;
	phone: string;
	phoneVerified: boolean;
	registrationCompleted: boolean;
	profileImage: string | null;
	deleted: boolean;
	deactivated: boolean;
	membershipStartDate: Date;
	membershipEndDate: Date;

	createdAt: Date;
	updatedAt: Date;
}

export interface ContactDetails {
	phone: string | null;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	mobile: string | null;
	website: string | null;
	links: string[];
	houseNo: string | null;
	pager: string | null;
	voiceMail: string | null;
}

/** ── Store shape ─────────────────────────────────────────────────────────── */

export interface UserStore {
	user: ProfileProps | null;
	contactDetails: ContactDetails | null;
	loading: boolean;
	error: string | null;
	initialized: boolean;
	lastFetchedAt: number | null;

	setFromInitial: (user: ProfileProps, contact: ContactDetails | null) => void;
	setLoading: (value: boolean) => void;
	setError: (message: string | null) => void;
	reset: () => void;
}

/** ── Helpers: revive Date fields after persist ───────────────────────────── */

function reviveDate(value: unknown): Date | unknown {
	// naive ISO check; adjust if you ever store other date-like strings
	if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
		const d = new Date(value);
		if (!Number.isNaN(d.getTime())) return d;
	}
	return value;
}
function reviveDeep<T>(obj: T): T {
	if (obj == null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(reviveDeep) as unknown as T;

	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
		if (v && typeof v === "object") out[k] = reviveDeep(v);
		else out[k] = reviveDate(v);
	}
	return out as T;
}

/** ── Store ───────────────────────────────────────────────────────────────── */

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			contactDetails: null,
			loading: false,
			error: null,
			initialized: false,
			lastFetchedAt: null,

			setFromInitial: (user, contact) =>
				set({
					user,
					contactDetails: contact,
					initialized: true,
					lastFetchedAt: Date.now(),
				}),
			setLoading: (value) => set({ loading: value }),
			setError: (message) => set({ error: message }),
			reset: () =>
				set({
					user: null,
					contactDetails: null,
					loading: false,
					error: null,
					initialized: false,
					lastFetchedAt: null,
				}),
		}),
		{
			name: "bn-user",
			storage: createJSONStorage(() => sessionStorage),
			partialize: (s) => ({
				user: s.user,
				contactDetails: s.contactDetails,
				initialized: s.initialized,
				lastFetchedAt: s.lastFetchedAt,
			}),
			version: 1,
			migrate: (persisted) => {
				if (!persisted) return persisted as unknown as UserStore;
				// revive dates for user & contactDetails fields after hydration
				const p = persisted as Partial<UserStore>;
				if (p.user) p.user = reviveDeep<ProfileProps>(p.user);
				if (p.contactDetails)
					p.contactDetails = reviveDeep<ContactDetails>(p.contactDetails);
				return persisted as unknown as UserStore;
			},
		},
	),
);
