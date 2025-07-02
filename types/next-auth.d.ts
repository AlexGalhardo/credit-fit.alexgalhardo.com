declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role?: string;
			salary?: number;
			cpf?: string | null;
			companyCnpj?: string | null;
		};
	}

	interface User {
		role?: string;
		salary?: number;
		cpf?: string | null;
		companyCnpj?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: string;
		salary?: number;
		cpf?: string | null;
		companyCnpj?: string | null;
	}
}
