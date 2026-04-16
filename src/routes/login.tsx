import { supabase } from "@/utils/supabase";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setLoading(true);
			setError(null);

			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			setLoading(false);

			if (error) {
				setError(error.message);
			} else {
				setSent(true);
			}
		},
		[email],
	);

	const handleOAuthLogin = useCallback(async (provider: "apple" | "google") => {
		setError(null);
		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
		if (error) {
			setError(error.message);
		}
	}, []);

	if (sent) {
		return (
			<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
				<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
					<div className="island-shell w-full max-w-md rounded-2xl p-8">
						<h1 className="display-title mb-4 text-2xl font-bold text-[var(--sea-ink)]">
							查看邮箱
						</h1>
						<p className="text-[var(--sea-ink-soft)]">
							登录链接已发送至 <strong>{email}</strong>
							，请点击邮件中的链接完成登录。
						</p>
						<button
							type="button"
							onClick={() => {
								setSent(false);
								setEmail("");
							}}
							className="mt-6 text-sm text-[var(--lagoon-deep)] hover:underline"
						>
							使用其他邮箱
						</button>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
				<div className="island-shell w-full max-w-md rounded-2xl p-8">
					<h1 className="display-title mb-2 text-2xl font-bold text-[var(--sea-ink)]">
						登录
					</h1>
					<p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
						输入邮箱地址，我们将发送一个登录链接到你的邮箱。
					</p>
					<form onSubmit={handleLogin} className="flex flex-col gap-4">
						<label className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-[var(--sea-ink)]">
								邮箱地址
							</span>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] outline-none transition placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon-deep)]"
							/>
						</label>
						{error && <p className="text-sm text-red-600">{error}</p>}
						<button
							type="submit"
							disabled={loading}
							className="rounded-xl bg-[var(--lagoon-deep)] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
						>
							{loading ? "发送中…" : "发送登录链接"}
						</button>
					</form>
					<div className="mt-6 flex items-center gap-3">
						<div className="h-px flex-1 bg-[var(--line)]" />
						<span className="text-xs text-[var(--sea-ink-soft)]">或</span>
						<div className="h-px flex-1 bg-[var(--line)]" />
					</div>
					<div className="mt-4 flex flex-col gap-3 hidden">
						<button
							type="button"
							onClick={() => handleOAuthLogin("apple")}
							className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
						>
							<svg
								viewBox="0 0 24 24"
								width="20"
								height="20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
							</svg>
							通过 Apple 登录
						</button>
						<button
							type="button"
							onClick={() => handleOAuthLogin("google")}
							className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
						>
							<svg
								viewBox="0 0 24 24"
								width="20"
								height="20"
								aria-hidden="true"
							>
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							通过 Google 登录
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
