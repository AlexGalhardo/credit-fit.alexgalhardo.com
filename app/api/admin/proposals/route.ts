import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Mock proposals storage (same as in proposals/route.ts)
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

		if (!session || session.user?.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json(mockProposals);
	} catch (error) {
		console.error("Error fetching admin proposals:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
