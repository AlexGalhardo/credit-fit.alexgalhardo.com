export interface CompanyInterface {
	id: string;
	name: string;
	email: string;
	cnpj: string;
	legalName: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface EmployeeInterface {
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

enum ProposalStatus {
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

export interface ProposalInterface {
	id: string;
	status: ProposalStatus;
	companyCnpj: string;
	employeeCpf: string;
	totalLoanAmount: number;
	numberOfInstallments: number;
	installmentAmount: number;
	firstDueDate: string;
	installmentsPaid: number;
	companyName: string;
	employerEmail: string;
	employeeCreditScore: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
	company: CompanyInterface;
	employee: EmployeeInterface;
}

export interface ApiResponseInterface {
	success: boolean;
	data: ProposalInterface[];
}
