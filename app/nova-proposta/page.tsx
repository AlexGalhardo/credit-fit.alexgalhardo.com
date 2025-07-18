"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SessionWithRoleType } from "@/types/session";
import LoadingScreen from "@/components/loading-screen";

export default function NovaPropostaPage() {
	const { data: session, status } = useSession() as { data: SessionWithRoleType; status: string };
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [amount, setAmount] = useState([1000]);
	const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [proposalResult, setProposalResult] = useState<{
		success: boolean;
		data?: any;
		message?: string;
	} | null>(null);

	const salary = Number(session?.user?.salary ?? 0);
	const maxAllowedAmount = (salary / 100) * 0.35;

	useEffect(() => {
		if (amount[0] > maxAllowedAmount) {
			setAmount([Math.floor(maxAllowedAmount) * 10]);
		}
	}, [amount, maxAllowedAmount]);

	useEffect(() => {
		if (status === "unauthenticated") router.push("/entrar");
		if (status === "authenticated" && session?.user?.role === "admin") router.push("/propostas");
	}, [status, router, session]);

	if (!session) return null;

	const installmentOptions = [
		{ installments: 1, value: amount[0] },
		{ installments: 2, value: amount[0] / 2 },
		{ installments: 3, value: amount[0] / 3 },
		{ installments: 4, value: amount[0] / 4 },
	];

	const handleSimulate = () => {
		setStep(2);
	};

	const handleSelectInstallment = (installments: number) => {
		setSelectedInstallments(installments);
		setStep(3);
	};

	const handleSubmitProposal = async () => {
		if (!selectedInstallments || loading) return;

		setLoading(true);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					companyCnpj: session?.user?.companyCnpj,
					employeeCpf: session?.user?.cpf,
					totalLoanAmount: amount[0] * 100,
					numberOfInstallments: selectedInstallments,
				}),
			});
			const data = await response.json();

			setProposalResult(data);
			setStep(4);
		} catch (error) {
			setProposalResult({
				success: false,
				message: "Erro ao criar proposta",
			});
			setStep(4);
		} finally {
			setLoading(false);
		}
	};

	if (status === "loading") return <LoadingScreen />;

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="max-w-4xl mx-auto p-6">
				<div className="flex items-center gap-4 mb-6">
					<div>
						<div className="text-sm text-gray-500">Home / Crédito Consignado</div>
						<h1 className="text-2xl font-semibold text-teal-600">Crédito Consignado</h1>
					</div>
				</div>

				<div className="max-w-2xl mx-auto">
					{step === 1 && (
						<Card>
							<CardContent className="p-8">
								<h2 className="text-xl font-semibold text-teal-600 mb-6">Simular Empréstimo</h2>

								<div className="flex items-center gap-4 p-4 bg-orange-100 rounded-lg mb-8">
									<div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
										👤
									</div>
									<div className="text-left">
										<p className="text-gray-700">
											Você possui saldo para Crédito Consignado pela empresa Seguros Seguradora.
											Faça uma simulação! Digite quanto você precisa (máximo 35% do seu salário):
										</p>
										<p className="text-sm text-gray-500 mt-1">
											Seu salário: R${" "}
											{(Number(session.user?.salary ?? 0) / 100).toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</p>
									</div>
								</div>

								<div className="text-center mb-8">
									<div className="text-3xl font-bold text-teal-600 mb-6">
										R$ {amount[0].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
									</div>

									<div className="px-4">
										<Slider
											value={amount}
											onValueChange={(val) => {
												if (val[0] <= maxAllowedAmount) {
													setAmount(val);
												} else {
													setAmount([Math.floor(maxAllowedAmount / 1000) * 1000]);
												}
											}}
											max={Math.floor(maxAllowedAmount / 1000) * 1000}
											min={1000}
											step={1000}
											className="w-full"
										/>
										<div className="flex justify-between text-sm text-gray-500 mt-2">
											<span>R$ 1.000</span>
											<span>R$ {Math.floor(maxAllowedAmount / 1000) * 1000}</span>
										</div>
									</div>
								</div>

								<div className="flex gap-4">
									<Button
										variant="outline"
										className="flex-1 bg-transparent"
										onClick={() => router.back()}
									>
										Voltar
									</Button>
									<Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleSimulate}>
										Simular empréstimo
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{step === 2 && (
						<Card>
							<CardContent className="p-8">
								<h2 className="text-xl font-semibold text-teal-600 mb-6">Simular Empréstimo</h2>

								<div className="flex items-center gap-4 p-4 bg-orange-100 rounded-lg mb-8">
									<div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
										👤
									</div>
									<div className="text-left">
										<p className="text-gray-700">
											Escolha a opção de parcelamento que melhor funcionar para você:
										</p>
									</div>
								</div>

								<div className="text-center mb-8">
									<div className="text-3xl font-bold text-teal-600 mb-6">
										R$ {amount[0].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
									</div>

									<p className="text-gray-600 mb-6">Divididas em:</p>

									<div className="grid grid-cols-2 gap-4">
										{installmentOptions.map((option) => (
											<button
												key={option.installments}
												onClick={() => handleSelectInstallment(option.installments)}
												className="p-4 border-l-4 border-orange-400 bg-gray-50 hover:bg-orange-50 text-left transition-colors"
											>
												<div className="text-sm text-gray-600">
													{option.installments}x de{" "}
													<span className="text-lg font-semibold text-teal-600">
														{option.value.toLocaleString("pt-BR", {
															style: "currency",
															currency: "BRL",
															minimumFractionDigits: 2,
														})}
													</span>
												</div>
											</button>
										))}
									</div>
								</div>

								<div className="flex gap-4">
									<Button
										variant="outline"
										className="flex-1 bg-transparent"
										onClick={() => setStep(1)}
									>
										Voltar
									</Button>
									<Button className="flex-1 bg-gray-300 text-gray-500" disabled>
										Seguinte
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{step === 3 && (
						<Card>
							<CardContent className="p-8">
								<h2 className="text-xl font-semibold text-teal-600 mb-6">Resumo da simulação</h2>

								<div className="flex items-center gap-4 p-4 bg-orange-100 rounded-lg mb-8">
									<div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
										👤
									</div>
									<div className="text-left">
										<p className="text-gray-700">
											Pronto! Agora você já pode solicitar o empréstimo e recebê-lo na sua Conta
											Credit Fit! Veja o resumo da simulação!
										</p>
									</div>
								</div>

								<div className="space-y-6 mb-8">
									<div className="flex justify-between">
										<span className="font-semibold">Valor a Creditar</span>
										<span>
											R$ {amount[0].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
										</span>
									</div>

									<div className="flex justify-between">
										<span className="font-semibold">Valor a financiar</span>
										<span>
											R$ {amount[0].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
										</span>
									</div>

									<div className="flex justify-between">
										<span className="font-semibold">Parcelamento</span>
										<span>
											{selectedInstallments} x R${" "}
											{(amount[0] / selectedInstallments!).toLocaleString("pt-BR", {
												minimumFractionDigits: 2,
											})}
										</span>
									</div>
								</div>

								<div className="flex gap-4">
									<Button
										variant="outline"
										className="flex-1 bg-transparent"
										onClick={() => setStep(2)}
									>
										Voltar
									</Button>
									<Button
										className="flex-1 bg-teal-600 hover:bg-teal-700"
										onClick={handleSubmitProposal}
										disabled={loading}
									>
										{loading ? "Solicitando..." : "Solicitar empréstimo"}
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{step === 4 && proposalResult && (
						<Card>
							<CardContent className="p-8">
								<h2 className="text-xl font-semibold text-teal-600 mb-6">Resultado da Proposta</h2>

								{proposalResult.success ? (
									<div className="space-y-6">
										<div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg mb-8">
											<div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
												✓
											</div>
											<div className="text-left">
												<p className="text-green-800 font-semibold">Empréstimo Aprovado!</p>
												<p className="text-green-700">
													Sua proposta foi aprovada e o empréstimo será concedido.
												</p>
											</div>
										</div>

										<div className="space-y-4 p-4 bg-green-50 rounded-lg">
											<div className="flex justify-between">
												<span className="font-semibold text-green-800">Score de Crédito</span>
												<span className="text-green-700">
													{proposalResult.data.employeeCreditScore}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="font-semibold text-green-800">
													Valor do Empréstimo
												</span>
												<span className="text-green-700">
													R${" "}
													{(proposalResult.data.totalLoanAmount / 100).toLocaleString(
														"pt-BR",
														{
															minimumFractionDigits: 2,
														},
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="font-semibold text-green-800">Parcelas</span>
												<span className="text-green-700">
													{proposalResult.data.numberOfInstallments} x R${" "}
													{(proposalResult.data.installmentAmount / 100).toLocaleString(
														"pt-BR",
														{
															minimumFractionDigits: 2,
														},
													)}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="font-semibold text-green-800">Status</span>
												<span className="text-green-700">{proposalResult.data.status}</span>
											</div>
											<div className="flex justify-between">
												<span className="font-semibold text-green-800">
													Primeiro Vencimento
												</span>
												<span className="text-green-700">
													{new Date(proposalResult.data.firstDueDate).toLocaleDateString(
														"pt-BR",
													)}
												</span>
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-6">
										<div className="flex items-center gap-4 p-4 bg-red-100 rounded-lg mb-8">
											<div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
												✗
											</div>
											<div className="text-left">
												<p className="text-red-800 font-semibold">Empréstimo Não Aprovado</p>
											</div>
										</div>

										<div className="space-y-4 p-4 bg-red-50 rounded-lg">
											<div className="flex justify-between">
												<span className="text-red-700">
													{proposalResult?.message ??
														"Seu crédito score ou seu salário atual não permitiu a aprovação desse emprestimo nesse momento."}
												</span>
											</div>
										</div>
									</div>
								)}

								<div className="flex gap-4 mt-8">
									<Button
										className="flex-1 bg-teal-600 hover:bg-teal-700"
										onClick={() => {
											setStep(1);
											setProposalResult(null);
											setSelectedInstallments(null);
										}}
									>
										Nova Simulação
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
