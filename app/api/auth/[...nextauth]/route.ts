import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role?: string | undefined;
		salary?: number;
		cpf?: string | null;
		companyCnpj?: string | null;
	}
}

const authOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password are required");
				}

				try {
					const response = await fetch("http://localhost:3000/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || "Invalid credentials");
					}

					const {
						data: { id, name, email, role, salary, cpf, companyCnpj },
					} = await response.json();

					if (id && name && email && role && salary && cpf && companyCnpj) {
						return {
							id,
							name,
							email,
							salary,
							role,
							cpf,
							companyCnpj,
						};
					}

					throw new Error("Invalid credentials");
				} catch (error) {
					if (error instanceof Error) {
						throw error;
					}
					throw new Error("Authentication failed");
				}
			},
		}),
	],
	pages: {
		signIn: "/entrar",
		signOut: "/entrar",
		error: "/entrar",
	},
	session: {
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60,
	},
	callbacks: {
		async signIn({ account }: any) {
			if (account?.provider === "credentials") {
				return true;
			}
			return false;
		},

		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.salary = user.salary;
				token.cpf = user.cpf;
				token.companyCnpj = user.companyCnpj;
			}
			return token;
		},

		async session({ session, token }: any) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.salary = token.salary;
				session.user.cpf = token.cpf;
				session.user.companyCnpj = token.companyCnpj;
			}
			return session;
		},

		async redirect({ url, baseUrl }: any) {
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			else if (new URL(url).origin === baseUrl) return url;
			return `${baseUrl}/entrar`;
		},
	},
	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
