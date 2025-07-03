export interface Company {
	id: string;
	name: string;
	email: string;
	cpf: string;
	cnpj: string;
	legalName: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface Employee {
	id: string;
	fullName: string;
	email: string;
	cpf: string;
	salary: number;
	currentlyEmployed: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	companyCnpj: string | null;
}

export interface Proposal {
	id: string;
	status: "pending" | "approved" | "rejected";
	totalLoanAmount: number;
	numberOfInstallments: number;
	installmentAmount: number;
	firstDueDate: string;
	installmentsPaid: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	companyName: string;
	employerEmail: string;
	company: Company;
	employee: Employee;
}

export interface ApiResponse {
	success: boolean;
	data: Proposal[];
}
