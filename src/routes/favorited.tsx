import { useAuth } from "@/utils/auth-context";
import { supabase } from "@/utils/supabase";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/favorited")({
	component: Favorited,
});

interface FavoritedRow {
	id: number;
	hanzi: string;
	created_at: string;
}

async function loadFavorited(userId: string): Promise<FavoritedRow[]> {
	const { data } = await supabase
		.from("user_hanzi_favorited")
		.select("id, hanzi, created_at")
		.eq("created_by", userId)
		.order("created_at", { ascending: true });

	return data ?? [];
}

function Favorited() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [items, setItems] = useState<FavoritedRow[]>([]);
	const [fetching, setFetching] = useState(true);

	useEffect(() => {
		if (!loading && !user) {
			navigate({ to: "/login" });
		}
	}, [loading, user, navigate]);

	useEffect(() => {
		if (!user) return;
		loadFavorited(user.id).then((rows) => {
			setItems(rows);
			setFetching(false);
		});
	}, [user]);

	if (loading || fetching) {
		return (
			<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
				<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
					<p className="text-[var(--ink-muted-soft)]">加载中…</p>
				</section>
			</main>
		);
	}

	if (!user) return null;

	if (items.length === 0) {
		return (
			<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
				<section className="grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
					<div className="flex flex-col items-center gap-3 text-[var(--ink-muted-soft)]">
						<HeartFilledIcon width="32" height="32" />
						<p>还没有收藏的汉字</p>
						<Link
							to="/search"
							className="text-[var(--primary)] no-underline hover:underline"
						>
							去搜索
						</Link>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 pt-14 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="rise-in mx-auto max-w-2xl">
				<h1 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--ink)]">
					我的收藏
				</h1>

				<div className="flex flex-wrap justify-center gap-x-1 gap-y-3 leading-loose">
					{items.map((item) => (
						<Link
							key={item.id}
							to="/search"
							search={{ q: item.hanzi }}
							className="inline-block text-[2.4rem] leading-[1.6] text-[var(--ink)] no-underline transition-colors duration-150 hover:text-[var(--primary)]"
						>
							{item.hanzi}
						</Link>
					))}
				</div>
			</section>
		</main>
	);
}
