import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Mock proposals storage (same reference)
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const session = await getServerSession();

		if (!session || session.user?.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { status } = await request.json();
		const proposalId = params.id;

		const proposalIndex = mockProposals.findIndex((p) => p.id === proposalId);

		if (proposalIndex === -1) {
			return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
		}

		mockProposals[proposalIndex].status = status;

		return NextResponse.json(mockProposals[proposalIndex]);
	} catch (error) {
		console.error("Error updating proposal:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
