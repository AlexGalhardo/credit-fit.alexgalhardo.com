"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Clock, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Proposal {
	id: string;
	status: "pending" | "approved" | "rejected";
	amount: number;
	installments: number;
	installmentValue: number;
	company: string;
	dueDate: string;
	createdAt: string;
}

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [proposals, setProposals] = useState<Proposal[]>([]);
	const [hiddenProposals, setHiddenProposals] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/entrar");
		}
	}, [status, router]);

	useEffect(() => {
		if (session) {
			fetchProposals();
		}
	}, [session]);

	const fetchProposals = async () => {
		try {
			const response = await fetch("/api/proposals");
			if (response.ok) {
				const data = await response.json();
				setProposals(data);
			}
		} catch (error) {
			console.error("Erro ao buscar propostas:", error);
		}
	};

	const toggleProposalVisibility = (proposalId: string) => {
		const newHidden = new Set(hiddenProposals);
		if (newHidden.has(proposalId)) {
			newHidden.delete(proposalId);
		} else {
			newHidden.add(proposalId);
		}
		setHiddenProposals(newHidden);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <Clock className="w-5 h-5 text-orange-500" />;
			case "approved":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "rejected":
				return <Clock className="w-5 h-5 text-red-500" />;
			default:
				return <Clock className="w-5 h-5 text-gray-500" />;
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "pending":
				return "SOLICITAÇÃO DE EMPRÉSTIMO";
			case "approved":
				return "EMPRÉSTIMO CORRENTE";
			case "rejected":
				return "SOLICITAÇÃO DE EMPRÉSTIMO";
			default:
				return "SOLICITAÇÃO DE EMPRÉSTIMO";
		}
	};

	const getStatusSubtext = (status: string) => {
		switch (status) {
			case "approved":
				return "Crédito aprovado";
			case "rejected":
				return "Reprovado por score";
			default:
				return "";
		}
	};

	if (status === "loading") {
		return <div>Carregando...</div>;
	}

	if (!session) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="max-w-4xl mx-auto p-6">
				<div className="flex items-center gap-4 mb-6">
					<Button variant="ghost" size="sm">
						←
					</Button>
					<div>
						<div className="text-sm text-gray-500">Home / Crédito Consignado</div>
						<h1 className="text-2xl font-semibold text-teal-600">Crédito Consignado</h1>
					</div>
				</div>

				{proposals.length === 0 ? (
					<Card className="max-w-2xl mx-auto">
						<CardContent className="p-8 text-center">
							<div className="flex items-center gap-4 p-4 bg-orange-100 rounded-lg mb-6">
								<div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
									👤
								</div>
								<div className="text-left">
									<p className="text-gray-700">
										Você possui saldo para Crédito Consignado pela empresa Seguros Seguradora. Faça
										uma simulação! Digite quanto você precisa:
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<Button asChild className="bg-teal-600 hover:bg-teal-700">
									<Link href="/nova-proposta">Novo empréstimo</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="max-w-2xl mx-auto space-y-4">
						<div className="flex items-center gap-4 p-4 bg-orange-100 rounded-lg mb-6">
							<div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
								👤
							</div>
							<div className="text-left">
								<p className="text-gray-700">
									Você solicitou seu empréstimo! Agora aguarde as etapas de análises serem concluídas!
								</p>
							</div>
						</div>

						{proposals.map((proposal, index) => (
							<Card key={proposal.id} className="w-full">
								<Collapsible>
									<CollapsibleTrigger className="w-full">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<div className="flex items-center gap-3">
												{getStatusIcon(proposal.status)}
												<div className="text-left">
													<h3 className="font-semibold">
														{getStatusText(proposal.status)}{" "}
														{String(index + 1).padStart(2, "0")}
													</h3>
													{getStatusSubtext(proposal.status) && (
														<p className="text-sm text-gray-600">
															{getStatusSubtext(proposal.status)}
														</p>
													)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														toggleProposalVisibility(proposal.id);
													}}
												>
													{hiddenProposals.has(proposal.id) ? (
														<>
															<EyeOff className="w-4 h-4" /> Ocultar
														</>
													) : (
														<>
															<Eye className="w-4 h-4" /> Ocultar
														</>
													)}
												</Button>
												<ChevronDown className="w-4 h-4" />
											</div>
										</CardHeader>
									</CollapsibleTrigger>

									{!hiddenProposals.has(proposal.id) && (
										<CollapsibleContent>
											<CardContent className="pt-0">
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<p className="font-semibold">Empresa</p>
														<p className="text-gray-600">{proposal.company}</p>
													</div>
													<div>
														<p className="font-semibold">Próximo Vencimento</p>
														<p className="text-gray-600">{proposal.dueDate}</p>
													</div>
													<div>
														<p className="font-semibold">Número de parcelas</p>
														<p className="text-gray-600">{proposal.installments} x</p>
													</div>
													<div>
														<p className="font-semibold">Valor da Parcela</p>
														<p className="text-gray-600">
															R${" "}
															{proposal.installmentValue.toLocaleString("pt-BR", {
																minimumFractionDigits: 2,
															})}
														</p>
													</div>
													{proposal.status === "approved" && (
														<>
															<div>
																<p className="font-semibold">Total Financiado</p>
																<p className="text-gray-600">
																	R${" "}
																	{proposal.amount.toLocaleString("pt-BR", {
																		minimumFractionDigits: 2,
																	})}
																</p>
															</div>
															<div>
																<p className="font-semibold">Valor da parcela</p>
																<p className="text-gray-600">
																	R${" "}
																	{proposal.installmentValue.toLocaleString("pt-BR", {
																		minimumFractionDigits: 2,
																	})}
																</p>
															</div>
														</>
													)}
												</div>

												{proposal.status === "pending" && (
													<div className="mt-4">
														<Button variant="link" className="text-teal-600 p-0">
															Mais detalhes
														</Button>
													</div>
												)}
											</CardContent>
										</CollapsibleContent>
									)}
								</Collapsible>
							</Card>
						))}

						<div className="flex gap-4 pt-4">
							<Button variant="outline" className="flex-1 bg-transparent">
								Voltar
							</Button>
							<Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
								<Link href="/nova-proposta">Novo empréstimo</Link>
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
