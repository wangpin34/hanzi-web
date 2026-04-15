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
				</div>
			</section>
		</main>
	);
}
