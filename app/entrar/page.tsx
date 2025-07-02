"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

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
				router.push("/dashboard");
			} else {
				alert("Credenciais inválidas");
			}
		} catch (error) {
			console.error("Erro no login:", error);
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
								<strong>Admin:</strong> admin@credifit.com / admin123
							</p>
							<p className="text-xs text-gray-600">
								<strong>Usuário:</strong> user@credifit.com / user123
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
