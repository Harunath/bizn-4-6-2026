import NextAuth, { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import prisma, { FranchiseType } from "@repo/db/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Invalid email or password");
				}
				console.log("credentials :", credentials);
				const franchiseAdmin = await prisma.franchiseAdmin.findFirst({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						password: true,
						firstName: true,
						lastName: true,
						franchise: true,
					},
				});
				if (franchiseAdmin) {
					// Verify password
					const isValidPassword = await bcrypt.compare(
						credentials.password,
						franchiseAdmin.password,
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					return {
						id: franchiseAdmin.id,
						email: franchiseAdmin.email,
						firstName: franchiseAdmin.firstName,
						lastName: franchiseAdmin.lastName ? franchiseAdmin.lastName : "",
						isAdmin: false,
						isFranchiseAdmin: true,
						franchiseType: franchiseAdmin.franchise.franchiseType,
						franchiseId: franchiseAdmin.franchise.id,
						franchiseName: franchiseAdmin.franchise.businessName,
					};
				}
				// Find user in database
				const admin = await prisma.admin.findFirst({
					where: { email: credentials.email },
					select: {
						id: true,
						email: true,
						password: true,
						firstName: true,
						lastName: true,
					},
				});

				if (admin) {
					// Verify password
					const isValidPassword = await bcrypt.compare(
						credentials.password,
						admin.password,
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					return {
						id: admin.id,
						email: admin.email,
						firstName: admin.firstName,
						lastName: admin.lastName ? admin.lastName : "",
						isAdmin: true,
						isFranchiseAdmin: false,
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			const admin = await prisma.admin.findUnique({
				where: {
					email: user.email!,
				},
			});

			// If user doesn't exist, create a new record
			if (admin) {
				return true;
			}
			const franchiseAdmin = await prisma.franchiseAdmin.findUnique({
				where: {
					email: user.email!,
				},
			});
			if (franchiseAdmin) {
				return true;
			}
			return "/unauthorized";
		},
		async redirect({ baseUrl }) {
			return baseUrl + "/login";
		},
		async jwt({ token, user }) {
			if (user && user.email) {
				const admin = await prisma.admin.findFirst({
					where: { email: user.email },
					select: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
					},
				});
				if (admin) {
					token.id = admin?.id;
					token.email = admin?.email;
					token.firstName = admin?.firstName;
					token.lastName = admin?.lastName;
					token.isAdmin = true;
					token.isFranchiseAdmin = false;
				}
				const franchiseAdmin = await prisma.franchiseAdmin.findFirst({
					where: { email: user.email },
					select: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
						franchise: true,
					},
				});
				if (franchiseAdmin) {
					token.id = franchiseAdmin?.id;
					token.email = franchiseAdmin?.email;
					token.firstName = franchiseAdmin?.firstName;
					token.lastName = franchiseAdmin?.lastName;
					token.isAdmin = false;
					token.isFranchiseAdmin = true;
					token.franchiseType = franchiseAdmin.franchise.franchiseType;
					token.franchiseId = franchiseAdmin.franchise.id;
					token.franchiseName = franchiseAdmin.franchise.businessName;
				}
			}
			return token;
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.firstName = token.firstName as string;
				session.user.lastName = token.lastName as string;
				session.user.isAdmin = token.isAdmin as boolean;
				session.user.isFranchiseAdmin = token.isFranchiseAdmin as boolean;
				session.user.franchiseType = token.franchiseType as
					| FranchiseType
					| undefined;
				session.user.franchiseId = token.franchiseId as string | undefined;
				session.user.franchiseName = token.franchiseName as string | undefined;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
