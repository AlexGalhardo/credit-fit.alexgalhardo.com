import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// Mock registration - in a real app, you'd save to database
		console.log("New user registration:", { name, email });

		// Simulate successful registration
		return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
	}
}
