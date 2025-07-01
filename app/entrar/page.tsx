"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputMask from "react-input-mask";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

const createCompanySchema = z.object({
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

const createEmployeeSchema = z
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
			.max(1200000, "O salário deve ser no máximo R$ 12.000,00"),
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

type CompanyFormData = z.infer<typeof createCompanySchema>;
type EmployeeFormData = z.infer<typeof createEmployeeSchema>;

const mockCompanies = [
	{ cnpj: "11444777000161", name: "Tech Solutions Ltda" },
	{ cnpj: "22555888000172", name: "Inovação Digital S.A." },
	{ cnpj: "33666999000183", name: "Consultoria Moderna Ltda" },
];

export default function SignUpPage() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const companyForm = useForm<CompanyFormData>({
		resolver: zodResolver(createCompanySchema),
		defaultValues: {
			legalName: "",
			name: "",
			email: "",
			cpf: "",
			cnpj: "",
		},
	});

	const employeeForm = useForm<EmployeeFormData>({
		resolver: zodResolver(createEmployeeSchema),
		defaultValues: {
			fullName: "",
			email: "",
			cpf: "",
			salary: 0,
			currentlyEmployed: false,
			companyCnpj: "",
		},
	});

	const handleCompanySubmit = async (data: CompanyFormData) => {
		setLoading(true);

		try {
			const response = await fetch("/api/auth/register-company", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				alert("Empresa criada com sucesso!");
				router.push("/entrar");
			} else {
				const error = await response.json();
				alert(error.message || "Erro ao criar empresa");
			}
		} catch (error) {
			console.error("Erro ao criar empresa:", error);
			alert("Erro ao criar empresa");
		} finally {
			setLoading(false);
		}
	};

	const handleEmployeeSubmit = async (data: EmployeeFormData) => {
		setLoading(true);

		const submitData = {
			...data,
			currentlyEmployed: data.companyCnpj !== "" && data.companyCnpj !== "none",
			companyCnpj: data.companyCnpj === "none" ? undefined : data.companyCnpj,
		};

		try {
			const response = await fetch("/api/auth/register-employee", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitData),
			});

			if (response.ok) {
				alert("Empregado criado com sucesso!");
				router.push("/entrar");
			} else {
				const error = await response.json();
				alert(error.message || "Erro ao criar empregado");
			}
		} catch (error) {
			console.error("Erro ao criar empregado:", error);
			alert("Erro ao criar empregado");
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (value: string) => {
		const numericValue = value.replace(/\D/g, "");
		const numberValue = parseInt(numericValue) || 0;
		return (numberValue / 100).toLocaleString("pt-BR", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const parseCurrency = (value: string) => {
		const numericValue = value.replace(/\D/g, "");
		return parseInt(numericValue) || 0;
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="max-w-md w-full mx-4">
				<div className="text-center mb-8">
					<div className="text-teal-600 text-2xl font-bold mb-2">Credit Fit</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Criar Conta</CardTitle>
						<CardDescription>Escolha o tipo de conta que deseja criar</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="empresa" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="empresa">Empresa</TabsTrigger>
								<TabsTrigger value="empregado">Empregado</TabsTrigger>
							</TabsList>

							<TabsContent value="empresa" className="space-y-4">
								<form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="legalName">Razão Social</Label>
										<Input
											id="legalName"
											{...companyForm.register("legalName")}
											placeholder="Razão social da empresa"
											minLength={8}
											maxLength={255}
										/>
										{companyForm.formState.errors.legalName && (
											<p className="text-red-500 text-sm">
												{companyForm.formState.errors.legalName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="name">Nome Fantasia</Label>
										<Input
											id="name"
											{...companyForm.register("name")}
											placeholder="Nome fantasia da empresa"
											minLength={4}
											maxLength={255}
										/>
										{companyForm.formState.errors.name && (
											<p className="text-red-500 text-sm">
												{companyForm.formState.errors.name.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="email-company">Email</Label>
										<Input
											id="email-company"
											type="email"
											{...companyForm.register("email")}
											placeholder="email@empresa.com"
											minLength={12}
											maxLength={48}
										/>
										{companyForm.formState.errors.email && (
											<p className="text-red-500 text-sm">
												{companyForm.formState.errors.email.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="cpf-company">CPF do Responsável</Label>
										<Controller
											name="cpf"
											control={companyForm.control}
											render={({ field }) => (
												<InputMask
													mask="999.999.999-99"
													value={field.value}
													onChange={(e: any) => {
														const value = e.target.value.replace(/\D/g, "");
														field.onChange(value);
													}}
												>
													{(inputProps: any) => (
														<Input
															{...inputProps}
															id="cpf-company"
															placeholder="000.000.000-00"
														/>
													)}
												</InputMask>
											)}
										/>
										{companyForm.formState.errors.cpf && (
											<p className="text-red-500 text-sm">
												{companyForm.formState.errors.cpf.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="cnpj">CNPJ</Label>
										<Controller
											name="cnpj"
											control={companyForm.control}
											render={({ field }) => (
												<InputMask
													mask="99.999.999/9999-99"
													value={field.value}
													onChange={(e: any) => {
														const value = e.target.value.replace(/\D/g, "");
														field.onChange(value);
													}}
												>
													{(inputProps: any) => (
														<Input
															{...inputProps}
															id="cnpj"
															placeholder="00.000.000/0001-00"
														/>
													)}
												</InputMask>
											)}
										/>
										{companyForm.formState.errors.cnpj && (
											<p className="text-red-500 text-sm">
												{companyForm.formState.errors.cnpj.message}
											</p>
										)}
									</div>

									<Button
										type="submit"
										className="w-full bg-teal-600 hover:bg-teal-700"
										disabled={loading}
									>
										{loading ? "Criando..." : "Criar Empresa"}
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="empregado" className="space-y-4">
								<form onSubmit={employeeForm.handleSubmit(handleEmployeeSubmit)} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="fullName">Nome Completo</Label>
										<Input
											id="fullName"
											{...employeeForm.register("fullName")}
											placeholder="Seu nome completo"
											minLength={4}
											maxLength={32}
										/>
										{employeeForm.formState.errors.fullName && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.fullName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="email-employee">Email</Label>
										<Input
											id="email-employee"
											type="email"
											{...employeeForm.register("email")}
											placeholder="seu@email.com"
											minLength={12}
											maxLength={48}
										/>
										{employeeForm.formState.errors.email && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.email.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="cpf-employee">CPF</Label>
										<Controller
											name="cpf"
											control={employeeForm.control}
											render={({ field }) => (
												<InputMask
													mask="999.999.999-99"
													value={field.value}
													onChange={(e: any) => {
														const value = e.target.value.replace(/\D/g, "");
														field.onChange(value);
													}}
												>
													{(inputProps: any) => (
														<Input
															{...inputProps}
															id="cpf-employee"
															placeholder="000.000.000-00"
														/>
													)}
												</InputMask>
											)}
										/>
										{employeeForm.formState.errors.cpf && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.cpf.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="salary">Salário</Label>
										<Controller
											name="salary"
											control={employeeForm.control}
											render={({ field }) => (
												<div className="relative">
													<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
														R$
													</span>
													<Input
														id="salary"
														className="pl-10"
														placeholder="1.000,00"
														value={formatCurrency(field.value.toString())}
														onChange={(e: any) => {
															const value = parseCurrency(e.target.value);
															field.onChange(value);
														}}
													/>
												</div>
											)}
										/>
										{employeeForm.formState.errors.salary && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.salary.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="company">Empresa</Label>
										<Controller
											name="companyCnpj"
											control={employeeForm.control}
											render={({ field }) => (
												<Select onValueChange={field.onChange} value={field.value}>
													<SelectTrigger>
														<SelectValue placeholder="Selecione sua empresa" />
													</SelectTrigger>
													<SelectContent>
														{mockCompanies.map((company) => (
															<SelectItem key={company.cnpj} value={company.cnpj}>
																{company.name}
															</SelectItem>
														))}
														<SelectItem value="none">
															Não sou empregado de nenhuma dessas empresas
														</SelectItem>
													</SelectContent>
												</Select>
											)}
										/>
										{employeeForm.formState.errors.companyCnpj && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.companyCnpj.message}
											</p>
										)}
										{employeeForm.formState.errors.currentlyEmployed && (
											<p className="text-red-500 text-sm">
												{employeeForm.formState.errors.currentlyEmployed.message}
											</p>
										)}
									</div>

									<Button
										type="submit"
										className="w-full bg-teal-600 hover:bg-teal-700"
										disabled={loading}
									>
										{loading ? "Criando..." : "Criar Conta"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>

						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								Já tem uma conta?{" "}
								<Link href="/entrar" className="text-teal-600 hover:underline">
									Entrar
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
