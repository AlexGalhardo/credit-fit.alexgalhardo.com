import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export type CompanyFormDataType = z.infer<typeof createCompanySchema>;
export type EmployeeFormDataType = z.infer<typeof createEmployeeSchema>;

export const createCompanySchema = z.object({
	legalName: z.string().min(8, "A razão social da empresa deve ter no mínimo 8 caracteres"),
	name: z.string().min(4, "O nome fantasia da empresa deve ter no mínimo 4 caracteres"),
	email: z.string().email("Formato de e-mail inválido"),
	cpf: z.string().refine((value) => cpf.isValid(value), {
		message: "CPF inválido",
	}),
	cnpj: z.string().refine((value) => cnpj.isValid(value), {
		message: "CNPJ inválido",
	}),
});

export const createEmployeeSchema = z
	.object({
		fullName: z
			.string()
			.min(4, "O nome deve ter no mínimo 4 caracteres")
			.max(32, "O nome deve ter no máximo 32 caracteres"),
		email: z.string().email("E-mail inválido"),
		cpf: z.string().refine((val) => cpf.isValid(val), { message: "CPF inválido" }),
		salary: z
			.number()
			.int()
			.min(100000, "O salário deve ser no mínimo R$ 1.000,00")
			.max(9999999, "O salário deve ser no máximo R$ 99.999,99"),
		currentlyEmployed: z.boolean(),
		companyCnpj: z
			.string()
			.optional()
			.refine((val) => (val ? cnpj.isValid(val) : true), { message: "CNPJ inválido" }),
	})
	.superRefine((data, ctx) => {
		if (!data.companyCnpj && data.currentlyEmployed !== false) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "currentlyEmployed deve ser false se companyCnpj não for fornecido",
				path: ["currentlyEmployed"],
			});
		}
	});
