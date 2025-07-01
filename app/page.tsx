import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
			<div className="max-w-md w-full mx-4">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-6">
						<div className="text-white text-2xl font-bold"> Credit Fit</div>
					</div>
					<h1 className="text-4xl font-bold text-white mb-4">Crédito Consignado</h1>
					<p className="text-teal-100 text-lg">Simule seu empréstimo de forma rápida e segura</p>
				</div>

				<div className="space-y-4">
					<Button asChild className="w-full h-12 bg-white text-teal-700 hover:bg-gray-100 font-semibold">
						<Link href="/entrar">Entrar</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="w-full h-12 border-white text-white hover:bg-white hover:text-teal-700 font-semibold bg-transparent"
					>
						<Link href="/criar-conta">Criar Conta</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
