export type SessionUserWithRoleType = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
	salary?: string | null;
	cpf?: string | null;
	companyCnpj?: string | null;
};

export type SessionWithRoleType = {
	user?: SessionUserWithRoleType;
	[key: string]: any;
} | null;
