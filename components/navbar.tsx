"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import { SessionWithRole } from "@/types/session";

export function Navbar() {
	const { data: session } = useSession() as { data: SessionWithRole };

	if (!session) return null;

	return (
		<nav className="bg-teal-600 text-white px-4 py-3">
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
					Credit Fit
				</Link>

				<div className="flex items-center gap-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="text-white hover:bg-teal-700 flex items-center gap-2">
								<User className="w-4 h-4" />
								{session.user?.name}
								<ChevronDown className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => signOut()}>Sair</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}
