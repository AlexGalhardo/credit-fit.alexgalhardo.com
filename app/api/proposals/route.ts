import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Mock proposals storage
const mockProposals: any[] = [
	{
		id: "1",
		userId: "2",
		userName: "Regular User",
		userEmail: "user@credifit.com",
		status: "approved",
		amount: 10000,
		installments: 2,
		installmentValue: 5000,
		company: "Seguros Seguradora",
		dueDate: "29/11/2022",
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		userId: "2",
		userName: "Regular User",
		userEmail: "user@credifit.com",
		status: "pending",
		amount: 15000,
		installments: 3,
		installmentValue: 5000,
		company: "Seguros Seguradora",
		dueDate: "29/12/2022",
		createdAt: new Date().toISOString(),
	},
];

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Filter proposals by user
		const userProposals = mockProposals.filter((p) => p.userId === session.user?.id);

		return NextResponse.json(userProposals);
	} catch (error) {
		console.error("Error fetching proposals:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { amount, installments, installmentValue } = await request.json();

		const newProposal = {
			id: Date.now().toString(),
			userId: session.user?.id,
			userName: session.user?.name,
			userEmail: session.user?.email,
			status: "pending",
			amount,
			installments,
			installmentValue,
			company: "Seguros Seguradora",
			dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
			createdAt: new Date().toISOString(),
		};

		mockProposals.push(newProposal);

		return NextResponse.json(newProposal, { status: 201 });
	} catch (error) {
		console.error("Error creating proposal:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
