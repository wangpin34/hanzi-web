import { supabase } from "@/utils/supabase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth/callback")({
	component: AuthCallback,
});

function AuthCallback() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");

		if (code) {
			supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
				if (error) {
					setError(error.message);
				} else {
					navigate({ to: "/" });
				}
			});
			return;
		}

		const hash = window.location.hash;
		if (hash) {
			const hashParams = new URLSearchParams(hash.substring(1));
			const errorDescription = hashParams.get("error_description");
			if (errorDescription) {
				setError(errorDescription);
				return;
			}
		}

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN") {
				navigate({ to: "/" });
			}
		});

		return () => subscription.unsubscribe();
	}, [navigate]);

	if (error) {
		return (
			<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
				<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
					<div className="island-shell w-full max-w-md rounded-2xl p-8 text-center">
						<h1 className="display-title mb-4 text-2xl font-bold text-[var(--sea-ink)]">
							登录失败
						</h1>
						<p className="mb-6 text-[var(--sea-ink-soft)]">{error}</p>
						<a
							href="/login"
							className="text-sm text-[var(--lagoon-deep)] hover:underline"
						>
							返回登录
						</a>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
				<div className="island-shell w-full max-w-md rounded-2xl p-8 text-center">
					<h1 className="display-title mb-4 text-2xl font-bold text-[var(--sea-ink)]">
						正在登录…
					</h1>
					<p className="text-[var(--sea-ink-soft)]">请稍候</p>
				</div>
			</section>
		</main>
	);
}
