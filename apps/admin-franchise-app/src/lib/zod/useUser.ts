import { z } from "zod";

export const createUserSchema = z.object({
	firstname: z.string().min(1),
	lastname: z.string().min(1),

	email: z.string().email(),

	phone: z.string().min(10),

	chapterId: z.string().min(1),

	membershipEndDate: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
