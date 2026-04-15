import { useAuth } from "@/utils/auth-context";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/profile")({
	component: Profile,
});

function Profile() {
	const { user, loading, signOut } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate({ to: "/login" });
		}
	}, [loading, user, navigate]);

	if (loading) {
		return (
			<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
				<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
					<p className="text-[var(--sea-ink-soft)]">加载中…</p>
				</section>
			</main>
		);
	}

	if (!user) return null;

	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/" });
	};

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
				<div className="island-shell w-full max-w-md rounded-2xl p-8">
					<h1 className="display-title mb-6 text-2xl font-bold text-[var(--sea-ink)]">
						个人资料
					</h1>
					<div className="flex flex-col gap-4">
						<div>
							<span className="text-sm font-medium text-[var(--sea-ink-soft)]">
								邮箱
							</span>
							<p className="mt-1 text-[var(--sea-ink)]">{user.email}</p>
						</div>
						<div>
							<span className="text-sm font-medium text-[var(--sea-ink-soft)]">
								用户 ID
							</span>
							<p className="mt-1 break-all text-sm text-[var(--sea-ink)]">
								{user.id}
							</p>
						</div>
						<div>
							<span className="text-sm font-medium text-[var(--sea-ink-soft)]">
								上次登录
							</span>
							<p className="mt-1 text-sm text-[var(--sea-ink)]">
								{user.last_sign_in_at
									? new Date(user.last_sign_in_at).toLocaleString("zh-CN")
									: "—"}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={handleSignOut}
						className="mt-8 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
					>
						退出登录
					</button>
				</div>
			</section>
		</main>
	);
}
