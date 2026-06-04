import "next-auth";
declare module "next-auth" {
	interface User {
		id: string;
		email: string; // Explicitly define email as always available
		firstname: string;
		lastname: string;
		businessId: null | string;
		chapterId: string;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
