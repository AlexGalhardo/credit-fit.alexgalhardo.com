"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SessionWithRole } from "@/types/session";
import LoadingScreen from "@/components/loading-screen";

export default function NovaPropostaPage() {
	const { data: session, status } = useSession() as { data: SessionWithRole; status: string };
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [amount, setAmount] = useState([1000]);
	const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/entrar");
		}

		if (status === "authenticated" && session?.user?.role === "admin") {
			router.push("/propostas");
		}
	}, [status, router]);

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
		if (!selectedInstallments) return;

		setLoading(true);
		try {
			const response = await fetch("/api/proposals", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: amount[0],
					installments: selectedInstallments,
					installmentValue: amount[0] / selectedInstallments,
				}),
			});

			if (response.ok) {
				router.push("/nova-proposta");
			} else {
				alert("Erro ao criar proposta");
			}
		} catch (error) {
			alert("Erro ao criar proposta");
		} finally {
			setLoading(false);
		}
	};

	if (status === "loading") return <LoadingScreen />;

	if (!session) return null;

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
											Faça uma simulação! Digite quanto você precisa:
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
											onValueChange={setAmount}
											max={12000}
											min={1000}
											step={1000}
											className="w-full"
										/>
										<div className="flex justify-between text-sm text-gray-500 mt-2">
											<span>R$ 1.000</span>
											<span>R$ 12.000</span>
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
				</div>
			</div>
		</div>
	);
}
