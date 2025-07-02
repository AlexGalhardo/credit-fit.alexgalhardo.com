"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ChevronDown, ChevronUp, Clock, CheckCircle } from "lucide-react";
import { SessionWithRole } from "@/types/session";
import LoadingScreen from "@/components/loading-screen";

interface Company {
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

interface Employee {
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

interface Proposal {
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

interface ApiResponse {
	success: boolean;
	data: Proposal[];
}

export default function PropostasPage() {
	const { data: session, status } = useSession() as { data: SessionWithRole; status: string };
	const router = useRouter();
	const [proposals, setProposals] = useState<Proposal[]>([]);
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
			const response = await fetch("http://localhost:3000/proposals");
			if (response.ok) {
				const data: ApiResponse = await response.json();
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
		return new Date(dateString).toLocaleDateString("pt-BR");
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
		return `${status === "approved" ? "EMPRÉSTIMO CORRENTE" : "SOLICITAÇÃO DE EMPRÉSTIMO"} ${String(index + 1).padStart(2, "0")}`;
	};

	const groupedProposals = {
		approved: proposals.filter((p) => p.status === "approved"),
		rejected: proposals.filter((p) => p.status === "rejected"),
	};

	if (status === "loading" || loading) return <LoadingScreen />;

	if (!session || session.user?.role !== "admin") return null;

	const ProposalCard = ({ proposal, index, status }: { proposal: Proposal; index: number; status: string }) => {
		const isExpanded = expandedCards.has(proposal.id);
		const isHidden = hiddenCards.has(proposal.id);
		const proposalNumber = getProposalNumber(index, status);

		return (
			<Card className="w-full">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{status === "approved" ? (
								<CheckCircle className="w-4 h-4 text-green-600" />
							) : (
								<Clock className="w-4 h-4 text-orange-600" />
							)}
							<CardTitle className="text-sm font-medium text-gray-700">{proposalNumber}</CardTitle>
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
								<Badge
									className={`${
										status === "approved"
											? "bg-green-100 text-green-800"
											: "bg-orange-100 text-orange-800"
									}`}
								>
									{status === "approved" ? "Crédito aprovado" : "Reprovado por score"}
								</Badge>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => toggleCardVisibility(proposal.id)}
									className="text-gray-500"
								>
									{isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
									<span className="ml-1 text-xs">Ocultar</span>
								</Button>
							</div>

							{!isHidden && (
								<>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm font-medium text-gray-700 mb-1">Empresa</p>
											<p className="text-sm text-gray-600">{proposal.company.name}</p>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700 mb-1">Próximo Vencimento</p>
											<p className="text-sm text-gray-600">{formatDate(proposal.firstDueDate)}</p>
										</div>
									</div>

									{status === "approved" ? (
										<>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm font-medium text-gray-700 mb-1">
														Total Financiado
													</p>
													<p className="text-sm text-gray-900 font-medium">
														{formatCurrency(proposal.totalLoanAmount)}
													</p>
												</div>
												<div>
													<p className="text-sm font-medium text-gray-700 mb-1">
														Valor da parcela
													</p>
													<p className="text-sm text-gray-900 font-medium">
														{formatCurrency(proposal.installmentAmount)}
													</p>
												</div>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-700 mb-1">
													Número de parcelas
												</p>
												<p className="text-sm text-gray-600">
													{proposal.numberOfInstallments} x
												</p>
											</div>
										</>
									) : (
										<div className="grid grid-cols-2 gap-4">
											<div>
												<p className="text-sm font-medium text-gray-700 mb-1">
													Número de parcelas
												</p>
												<p className="text-sm text-gray-600">
													{proposal.numberOfInstallments} x
												</p>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-700 mb-1">
													Valor da Parcela
												</p>
												<p className="text-sm text-gray-900 font-medium">
													{formatCurrency(proposal.installmentAmount)}
												</p>
											</div>
										</div>
									)}

									<div className="pt-2">
										<Button variant="link" className="text-teal-600 p-0 h-auto text-sm">
											Mais detalhes
										</Button>
									</div>
								</>
							)}
						</div>
					</CardContent>
				)}
			</Card>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="max-w-7xl mx-auto p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Painel de Propostas</h1>
					<p className="text-gray-600">Gerencie todas as propostas de empréstimo</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Aprovados</h2>
							<Badge variant="secondary">{groupedProposals.approved.length}</Badge>
						</div>

						<div className="space-y-3">
							{groupedProposals.approved.map((proposal, index) => (
								<ProposalCard key={proposal.id} proposal={proposal} index={index} status="approved" />
							))}

							{groupedProposals.approved.length === 0 && (
								<div className="text-center py-8 text-gray-500">Nenhuma proposta aprovada</div>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Rejeitados</h2>
							<Badge variant="secondary">{groupedProposals.rejected.length}</Badge>
						</div>

						<div className="space-y-3">
							{groupedProposals.rejected.map((proposal, index) => (
								<ProposalCard key={proposal.id} proposal={proposal} index={index} status="rejected" />
							))}

							{groupedProposals.rejected.length === 0 && (
								<div className="text-center py-8 text-gray-500">Nenhuma proposta rejeitada</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
