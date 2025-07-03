"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionWithRole } from "@/types/session";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [errorLogin, setErrorLogin] = useState("");

	const { data: session } = useSession() as { data: SessionWithRole; status: string };

	useEffect(() => {
		if (session && session.user?.role === "admin") router.push("/propostas");
		else if (session && session.user?.role !== "admin") router.push("/nova-proposta");
	}, [session, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.ok) {
				router.push("/nova-proposta");
			} else {
				setErrorLogin("Credenciais inválidas");
			}
		} catch (error) {
			alert("Erro ao fazer login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="max-w-md w-full mx-4">
				<Card>
					<CardHeader>
						<CardTitle>Entrar</CardTitle>
						<CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="seu@email.com"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Senha</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Sua senha"
									required
								/>
							</div>

							<Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
								{loading ? "Entrando..." : "Entrar"}
							</Button>

							{errorLogin && <p className="text-red-500 mt-2 text-center font-bold">{errorLogin}</p>}
						</form>

						<div className="mt-4 text-center">
							<p className="text-sm text-gray-600">
								Não tem uma conta?{" "}
								<Link href="/criar-conta" className="text-teal-600 hover:underline">
									Criar conta
								</Link>
							</p>
						</div>

						<div className="mt-6 p-4 bg-gray-100 rounded-lg">
							<p className="text-sm font-semibold mb-2">Contas de teste:</p>
							<p className="text-xs text-gray-600">
								<strong>Admin:</strong> admin@gmail.com / admin123
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> empregado@gmail.com / Senha: empregado123 / Salário: R$ 15 mil
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> empregado-12@gmail.com / Senha: empregado123 / Salário: R$ 12
								mil
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> empregado-9@gmail.com / Senha: empregado123 / Salário: R$ 9
								mil
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> empregado-6@gmail.com / Senha: empregado123 / Salário: R$ 6
								mil
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> empregado-3@gmail.com / Senha: empregado123 / Salário: R$ 3
								mil
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
