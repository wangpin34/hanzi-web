import { useAuth } from "@/utils/auth-context";
import { PersonIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const { user, loading } = useAuth();

	return (
		<header className="sticky top-0 z-50 bg-[var(--primary)] px-4">
			<nav className="page-wrap flex items-center gap-x-3 gap-y-2 py-3 sm:py-4">
				<h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
					<Link
						to="/"
						className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white no-underline sm:px-4 sm:py-2"
					>
						<span className="h-2 w-2 rounded-full bg-white" />
						汉字学习
					</Link>
				</h2>

				<div className="ml-auto flex items-center gap-1.5 sm:gap-2">
					<ThemeToggle />

					{!loading && (
						<Link
							to={user ? "/profile" : "/login"}
							className="rounded-xl p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
							aria-label={user ? "个人资料" : "登录"}
						>
							<PersonIcon width={20} height={20} />
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
