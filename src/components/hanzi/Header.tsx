import { useAuth } from "@/utils/auth-context";
import { EnterIcon, PersonIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
	const { user, loading } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b border-[var(--hairline)] bg-[var(--surface-strong)] px-4 backdrop-blur-lg">
			<nav className="page-wrap flex items-center gap-x-3 gap-y-2 py-3 sm:py-4">
				<h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-base font-semibold text-[var(--ink)] no-underline"
					>
						<span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
						汉字学习
					</Link>
				</h2>

				<div className="ml-auto flex items-center gap-1.5 sm:gap-2">
					<ThemeToggle />

					{!loading && (
						<Link
							to={user ? "/profile" : "/login"}
							className="rounded-full p-2 text-[var(--ink-muted-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--ink)]"
							aria-label={user ? "个人资料" : "登录"}
						>
							{user ? (
								<PersonIcon width={20} height={20} />
							) : (
								<EnterIcon width={20} height={20} />
							)}
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
