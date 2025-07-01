import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const mockUsers = [
	{
		id: "1",
		name: "Admin User",
		email: "admin@credifit.com",
		password: "admin123",
		role: "admin",
	},
	{
		id: "2",
		name: "Regular User",
		email: "user@credifit.com",
		password: "user123",
		role: "user",
	},
];

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = mockUsers.find(
					(u) => u.email === credentials.email && u.password === credentials.password,
				);

				if (user) {
					return {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
					};
				}

				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.sub;
				session.user.role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/entrar",
	},
	session: {
		strategy: "jwt",
	},
});

export { handler as GET, handler as POST };
