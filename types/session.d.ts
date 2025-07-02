export type SessionUserWithRole = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
	salary?: string | null;
	cpf?: string | null;
	companyCnpj?: string | null;
};

export type SessionWithRole = {
	user?: SessionUserWithRole;
	[key: string]: any;
} | null;
