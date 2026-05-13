import { supabase } from "@/utils/supabase";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		const { data: todos } = await supabase.from("todos").select();
		return { todos };
	},
});

function App() {
	const navigate = useNavigate();
	const { todos } = Route.useLoaderData();

	const goToSearch = useCallback(() => {
		void navigate({ to: "/search" });
	}, [navigate]);

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="rise-in grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
				<Link
					to="/search"
					className="inline-flex w-full max-w-[34rem] items-center justify-start gap-4 rounded-full border border-[var(--hairline)] bg-[var(--surface-strong)] px-5 py-4 text-[1.02rem] text-[var(--ink-muted-soft)] no-underline shadow-[0_24px_46px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.04)] transition-[background-color,color,border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-[color-mix(in_oklab,var(--primary-focus)_36%,var(--hairline))] hover:text-[var(--ink)] focus-visible:-translate-y-px focus-visible:border-[color-mix(in_oklab,var(--primary-focus)_36%,var(--hairline))] focus-visible:text-[var(--ink)] focus-visible:outline-none max-sm:px-4 max-sm:py-[0.95rem] max-sm:text-[0.98rem]"
					aria-label="输入汉字"
					onFocus={goToSearch}
				>
					<MagnifyingGlassIcon height="18" width="18" />
					<span>输入汉字</span>
				</Link>
			</section>
		</main>
	);
}
