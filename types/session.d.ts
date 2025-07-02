export type SessionUserWithRole = {
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
};

export type SessionWithRole = {
	user?: SessionUserWithRole;
	[key: string]: any;
} | null;
