"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Proposal {
	id: string;
	userId: string;
	userName: string;
	userEmail: string;
	status: "pending" | "approved" | "rejected";
	amount: number;
	installments: number;
	installmentValue: number;
	company: string;
	dueDate: string;
	createdAt: string;
}

export default function PropostasPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [proposals, setProposals] = useState<Proposal[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/entrar");
		} else if (session?.user?.role !== "admin") {
			router.push("/dashboard");
		}
	}, [status, session, router]);

	useEffect(() => {
		if (session?.user?.role === "admin") {
			fetchAllProposals();
		}
	}, [session]);

	const fetchAllProposals = async () => {
		try {
			const response = await fetch("/api/admin/proposals");
			if (response.ok) {
				const data = await response.json();
				setProposals(data);
			}
		} catch (error) {
			console.error("Erro ao buscar propostas:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateProposalStatus = async (proposalId: string, newStatus: "approved" | "rejected") => {
		try {
			const response = await fetch(`/api/admin/proposals/${proposalId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				setProposals(proposals.map((p) => (p.id === proposalId ? { ...p, status: newStatus } : p)));
			}
		} catch (error) {
			console.error("Erro ao atualizar proposta:", error);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "approved":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "pending":
				return "Pendente";
			case "approved":
				return "Aprovado";
			case "rejected":
				return "Rejeitado";
			default:
				return "Desconhecido";
		}
	};

	const groupedProposals = {
		pending: proposals.filter((p) => p.status === "pending"),
		approved: proposals.filter((p) => p.status === "approved"),
		rejected: proposals.filter((p) => p.status === "rejected"),
	};

	if (status === "loading" || loading) {
		return <div>Carregando...</div>;
	}

	if (!session || session.user?.role !== "admin") {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<div className="max-w-7xl mx-auto p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Painel de Propostas</h1>
					<p className="text-gray-600">Gerencie todas as propostas de empréstimo</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Coluna Pendentes */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Pendentes</h2>
							<Badge variant="secondary">{groupedProposals.pending.length}</Badge>
						</div>

						<div className="space-y-3">
							{groupedProposals.pending.map((proposal) => (
								<Card key={proposal.id} className="border-l-4 border-l-yellow-400">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<CardTitle className="text-sm font-medium">{proposal.userName}</CardTitle>
											<Badge className={getStatusColor(proposal.status)}>
												{getStatusText(proposal.status)}
											</Badge>
										</div>
										<p className="text-xs text-gray-500">{proposal.userEmail}</p>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600">Valor:</span>
												<span className="font-medium">
													R${" "}
													{proposal.amount.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Parcelas:</span>
												<span>{proposal.installments}x</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Valor/Parcela:</span>
												<span>
													R${" "}
													{proposal.installmentValue.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}
												</span>
											</div>
										</div>

										<div className="flex gap-2 mt-4">
											<Button
												size="sm"
												className="flex-1 bg-green-600 hover:bg-green-700"
												onClick={() => updateProposalStatus(proposal.id, "approved")}
											>
												Aprovar
											</Button>
											<Button
												size="sm"
												variant="destructive"
												className="flex-1"
												onClick={() => updateProposalStatus(proposal.id, "rejected")}
											>
												Rejeitar
											</Button>
										</div>
									</CardContent>
								</Card>
							))}

							{groupedProposals.pending.length === 0 && (
								<div className="text-center py-8 text-gray-500">Nenhuma proposta pendente</div>
							)}
						</div>
					</div>

					{/* Coluna Aprovados */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Aprovados</h2>
							<Badge variant="secondary">{groupedProposals.approved.length}</Badge>
						</div>

						<div className="space-y-3">
							{groupedProposals.approved.map((proposal) => (
								<Card key={proposal.id} className="border-l-4 border-l-green-400">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<CardTitle className="text-sm font-medium">{proposal.userName}</CardTitle>
											<Badge className={getStatusColor(proposal.status)}>
												{getStatusText(proposal.status)}
											</Badge>
										</div>
										<p className="text-xs text-gray-500">{proposal.userEmail}</p>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600">Valor:</span>
												<span className="font-medium">
													R${" "}
													{proposal.amount.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Parcelas:</span>
												<span>{proposal.installments}x</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Empresa:</span>
												<span>{proposal.company}</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}

							{groupedProposals.approved.length === 0 && (
								<div className="text-center py-8 text-gray-500">Nenhuma proposta aprovada</div>
							)}
						</div>
					</div>

					{/* Coluna Rejeitados */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-900">Rejeitados</h2>
							<Badge variant="secondary">{groupedProposals.rejected.length}</Badge>
						</div>

						<div className="space-y-3">
							{groupedProposals.rejected.map((proposal) => (
								<Card key={proposal.id} className="border-l-4 border-l-red-400">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<CardTitle className="text-sm font-medium">{proposal.userName}</CardTitle>
											<Badge className={getStatusColor(proposal.status)}>
												{getStatusText(proposal.status)}
											</Badge>
										</div>
										<p className="text-xs text-gray-500">{proposal.userEmail}</p>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600">Valor:</span>
												<span className="font-medium">
													R${" "}
													{proposal.amount.toLocaleString("pt-BR", {
														minimumFractionDigits: 2,
													})}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Parcelas:</span>
												<span>{proposal.installments}x</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">Motivo:</span>
												<span className="text-red-600">Score baixo</span>
											</div>
										</div>
									</CardContent>
								</Card>
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
