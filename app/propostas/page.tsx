"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Eye,
	EyeOff,
	ChevronDown,
	ChevronUp,
	Clock,
	CheckCircle,
	XCircle,
	User,
	Building,
	CreditCard,
} from "lucide-react";
import { SessionWithRoleType } from "@/types/session";
import LoadingScreen from "@/components/loading-screen";
import { ApiResponseInterface, ProposalInterface } from "@/types/interfaces";

export default function PropostasPage() {
	const { data: session, status } = useSession() as { data: SessionWithRoleType; status: string };
	const router = useRouter();
	const [proposals, setProposals] = useState<ProposalInterface[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
	const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/entrar");
		} else if (session?.user?.role !== "admin") {
			router.push("/nova-proposta");
		}
	}, [status, session, router]);

	useEffect(() => {
		if (session?.user?.role === "admin") {
			fetchAllProposals();
		}
	}, [session]);

	const fetchAllProposals = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals`);
			if (response.ok) {
				const data: ApiResponseInterface = await response.json();
				setProposals(data.data);
			}
		} catch (error) {
			console.error("Erro ao buscar propostas:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return (amount / 100).toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const toggleCardExpansion = (cardId: string) => {
		const newExpanded = new Set(expandedCards);
		if (newExpanded.has(cardId)) {
			newExpanded.delete(cardId);
		} else {
			newExpanded.add(cardId);
		}
		setExpandedCards(newExpanded);
	};

	const toggleCardVisibility = (cardId: string) => {
		const newHidden = new Set(hiddenCards);
		if (newHidden.has(cardId)) {
			newHidden.delete(cardId);
		} else {
			newHidden.add(cardId);
		}
		setHiddenCards(newHidden);
	};

	const getProposalNumber = (index: number, status: string) => {
		return `${status === "APPROVED" ? "EMPRÉSTIMO ATIVO" : status === "REJECTED" ? "PROPOSTA REJEITADA" : "PROPOSTA PENDENTE"} ${String(index + 1).padStart(2, "0")}`;
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "APPROVED":
				return {
					icon: <CheckCircle className="w-4 h-4 text-green-600" />,
					badge: "bg-green-100 text-green-800",
					badgeText: "Crédito Aprovado",
					color: "green",
				};
			case "REJECTED":
				return {
					icon: <XCircle className="w-4 h-4 text-red-600" />,
					badge: "bg-red-100 text-red-800",
					badgeText: "Proposta Rejeitada",
					color: "red",
				};
			default:
				return {
					icon: <Clock className="w-4 h-4 text-yellow-600" />,
					badge: "bg-yellow-100 text-yellow-800",
					badgeText: "Análise Pendente",
					color: "yellow",
				};
		}
	};

	const groupedProposals = {
		approved: proposals.filter((p) => p.status === "APPROVED"),
		rejected: proposals.filter((p) => p.status === "REJECTED"),
	};

	if (status === "loading" || loading) return <LoadingScreen />;

	if (!session || session.user?.role !== "admin") return null;

	const ProposalCard = ({
		proposal,
		index,
		status,
	}: { proposal: ProposalInterface; index: number; status: string }) => {
		const isExpanded = expandedCards.has(proposal.id);
		const isHidden = hiddenCards.has(proposal.id);
		const proposalNumber = getProposalNumber(index, status);
		const statusConfig = getStatusConfig(status);

		return (
			<Card className="w-full border-l-4 border-l-gray-200 hover:border-l-blue-500 transition-colors duration-200">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{statusConfig.icon}
							<div>
								<CardTitle className="text-sm font-semibold text-gray-900">{proposalNumber}</CardTitle>
								<p className="text-xs text-gray-500 mt-1">{proposal.company.name}</p>
							</div>
						</div>
						<Button variant="ghost" size="sm" onClick={() => toggleCardExpansion(proposal.id)}>
							{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
						</Button>
					</div>
				</CardHeader>

				{isExpanded && (
					<CardContent className="pt-0">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Badge className={statusConfig.badge}>{statusConfig.badgeText}</Badge>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => toggleCardVisibility(proposal.id)}
									className="text-gray-500"
								>
									{isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									<span className="ml-1 text-xs">{isHidden ? "Mostrar" : "Ocultar"}</span>
								</Button>
							</div>

							{!isHidden && (
								<div className="space-y-4">
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-2 mb-3">
											<Building className="w-4 h-4 text-blue-600" />
											<h4 className="font-semibold text-gray-900">Dados da Empresa</h4>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">
													Nome da Empresa
												</p>
												<p className="text-sm text-gray-900">{proposal.company.name}</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">CNPJ</p>
												<p className="text-sm text-gray-900">{proposal.companyCnpj}</p>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-2 mb-3">
											<User className="w-4 h-4 text-purple-600" />
											<h4 className="font-semibold text-gray-900">Dados do Funcionário</h4>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">Nome Completo</p>
												<p className="text-sm text-gray-900">{proposal.employee.fullName}</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">Email</p>
												<p className="text-sm text-gray-900">{proposal.employee.email}</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">CPF</p>
												<p className="text-sm text-gray-900">{proposal.employeeCpf}</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">
													Score de Crédito
												</p>
												<p className="text-sm text-gray-900 font-semibold">
													{proposal.employeeCreditScore} pontos
												</p>
											</div>
										</div>
									</div>

									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-2 mb-3">
											<CreditCard className="w-4 h-4 text-green-600" />
											<h4 className="font-semibold text-gray-900">Detalhes do Empréstimo</h4>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">Valor Total</p>
												<p className="text-lg font-bold text-green-600">
													{formatCurrency(proposal.totalLoanAmount)}
												</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">
													Valor da Parcela
												</p>
												<p className="text-lg font-bold text-blue-600">
													{formatCurrency(proposal.installmentAmount)}
												</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">
													Número de Parcelas
												</p>
												<p className="text-sm text-gray-900">
													{proposal.numberOfInstallments}x
												</p>
											</div>
											<div>
												<p className="text-xs font-medium text-gray-600 mb-1">
													Primeiro Vencimento
												</p>
												<p className="text-sm text-gray-900">
													{formatDate(proposal.firstDueDate)}
												</p>
											</div>
										</div>
									</div>

									{status === "APPROVED" && (
										<div className="bg-green-50 rounded-lg p-4">
											<div className="flex items-center gap-2 mb-2">
												<CheckCircle className="w-4 h-4 text-green-600" />
												<h4 className="font-semibold text-green-800">Status do Pagamento</h4>
											</div>
											<div className="flex items-center gap-4">
												<div>
													<p className="text-xs font-medium text-green-600 mb-1">
														Parcelas Pagas
													</p>
													<p className="text-sm text-green-800">
														{proposal.installmentsPaid} de {proposal.numberOfInstallments}
													</p>
												</div>
												<div className="flex-1 bg-green-200 rounded-full h-2">
													<div
														className="bg-green-600 h-2 rounded-full transition-all duration-300"
														style={{
															width: `${(proposal.installmentsPaid / proposal.numberOfInstallments) * 100}%`,
														}}
													/>
												</div>
											</div>
										</div>
									)}

									<div className="pt-2 border-t">
										<div className="flex items-center justify-between">
											<div className="text-xs text-gray-500">
												Criado em {formatDate(proposal.createdAt)}
											</div>
											<Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
												Ver Detalhes Completos
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				)}
			</Card>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<Navbar />

			<div className="max-w-7xl mx-auto p-6">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Painel de Propostas</h1>
					<div className="mt-4 flex gap-4">
						<div className="bg-white rounded-lg p-4 shadow-sm border">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Aprovadas: {groupedProposals.approved.length}
								</span>
							</div>
						</div>
						<div className="bg-white rounded-lg p-4 shadow-sm border">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-red-500 rounded-full"></div>
								<span className="text-sm font-medium">
									Rejeitadas: {groupedProposals.rejected.length}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="space-y-3">
							{groupedProposals.approved.map((proposal, index) => (
								<ProposalCard key={proposal.id} proposal={proposal} index={index} status="APPROVED" />
							))}

							{groupedProposals.approved.length === 0 && (
								<div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
									<CheckCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
									<p className="text-lg font-medium">Nenhuma proposta aprovada</p>
									<p className="text-sm">Propostas aprovadas aparecerão aqui</p>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-3">
							{groupedProposals.rejected.map((proposal, index) => (
								<ProposalCard key={proposal.id} proposal={proposal} index={index} status="REJECTED" />
							))}

							{groupedProposals.rejected.length === 0 && (
								<div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
									<XCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
									<p className="text-lg font-medium">Nenhuma proposta rejeitada</p>
									<p className="text-sm">Propostas rejeitadas aparecerão aqui</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
