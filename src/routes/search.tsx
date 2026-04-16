import SearchHanzi from "@/components/search-hanzi";
import { useAuth } from "@/utils/auth-context";
import { supabase } from "@/utils/supabase";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MAX_RECENT_SEARCHES = 8;

export const Route = createFileRoute("/search")({
	component: SearchRoute,
});

function keepHanzi(str: string) {
	return str.replace(/[^\p{Script=Han}]/gu, "");
}

async function loadRemoteRecentSearches(userId: string): Promise<string[]> {
	const { data } = await supabase
		.from("user_hanzi_history")
		.select("hanzi")
		.eq("created_by", userId)
		.order("created_at", { ascending: false })
		.limit(MAX_RECENT_SEARCHES);

	return (data ?? [])
		.map((row) => row.hanzi)
		.filter((v): v is string => Boolean(v));
}

async function saveRemoteRecentSearch(userId: string, query: string) {
	await supabase
		.from("user_hanzi_history")
		.insert({ hanzi: query, created_by: userId });
}

function SearchRoute() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [input, setInput] = useState("");
	const [openSearch, setOpenSearch] = useState(false);
	const [recentSearches, setRecentSearches] = useState<Array<string>>([]);
	const [isRecentListVisible, setIsRecentListVisible] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const hanziInput = useMemo(() => Array.from(keepHanzi(input)), [input]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		if (!user) return;
		loadRemoteRecentSearches(user.id).then(setRecentSearches);
	}, [user]);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	}, []);

	const updateRecentSearches = useCallback(
		(value: string, fromRecent = false) => {
			const normalizedValue = keepHanzi(value);

			if (!normalizedValue) {
				return;
			}

			setRecentSearches((currentValues) => {
				const nextValues = [
					normalizedValue,
					...currentValues.filter((item) => item !== normalizedValue),
				].slice(0, MAX_RECENT_SEARCHES);

				return nextValues;
			});

			if (!fromRecent && user) {
				saveRemoteRecentSearch(user.id, normalizedValue);
			}
		},
		[user],
	);

	const submitSearch = useCallback(
		(value: string, fromRecent = false) => {
			const normalizedValue = keepHanzi(value);

			if (!normalizedValue) {
				return;
			}

			setInput(normalizedValue);
			updateRecentSearches(normalizedValue, fromRecent);
			setIsRecentListVisible(false);
			setOpenSearch(true);
		},
		[updateRecentSearches],
	);

	const returnToHome = useCallback(() => {
		setOpenSearch(false);
		void navigate({ to: "/" });
	}, [navigate]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key !== "Enter") {
				return;
			}

			e.preventDefault();

			submitSearch(input);
		},
		[input, submitSearch],
	);

	const handleRecentFocusChange = useCallback((isFocused: boolean) => {
		setIsRecentListVisible(isFocused);
	}, []);

	const handleRecentSelect = useCallback(
		(value: string) => {
			submitSearch(value, true);
		},
		[submitSearch],
	);

	const handleSearchDialogChange = useCallback((nextOpen: boolean) => {
		setOpenSearch(nextOpen);

		if (!nextOpen) {
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		}
	}, []);

	const showRecentSearches = isRecentListVisible && recentSearches.length > 0;
	const shellButtonClassName =
		"inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] text-[var(--sea-ink)] shadow-[inset_0_1px_0_var(--inset-glint),0_16px_32px_rgba(30,90,72,0.1),0_4px_12px_rgba(23,58,64,0.06)] transition-[background-color,color,border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-[color-mix(in_oklab,var(--lagoon-deep)_36%,var(--line))] focus-visible:-translate-y-px focus-visible:border-[color-mix(in_oklab,var(--lagoon-deep)_36%,var(--line))] focus-visible:outline-none max-sm:h-10 max-sm:w-10";

	return (
		<main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 pt-14 max-sm:min-h-[calc(100vh-5.5rem)]">
			<section className="mx-auto max-w-2xl rise-in">
				<div className="flex items-center gap-3 max-sm:gap-[0.55rem]">
					<button
						type="button"
						className={shellButtonClassName}
						onClick={returnToHome}
						aria-label="Back to home"
					>
						<ArrowLeftIcon height="18" width="18" />
					</button>
					<div
						className="relative flex-1"
						onFocusCapture={() => handleRecentFocusChange(true)}
						onBlurCapture={(event) => {
							const nextFocused = event.relatedTarget;

							if (
								nextFocused instanceof Node &&
								event.currentTarget.contains(nextFocused)
							) {
								return;
							}

							handleRecentFocusChange(false);
						}}
					>
						<TextField.Root
							ref={inputRef}
							placeholder="输入汉字"
							value={input}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							size="3"
							className="w-full"
						>
							<TextField.Slot>
								<MagnifyingGlassIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>

						{showRecentSearches ? (
							<div
								className="absolute inset-x-0 top-[calc(100%+0.6rem)] z-20 rounded-[1.1rem] border border-[var(--line)] bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] p-[0.7rem] shadow-[inset_0_1px_0_var(--inset-glint),0_26px_48px_rgba(23,58,64,0.14),0_8px_22px_rgba(23,58,64,0.08)] backdrop-blur-[10px] max-sm:top-[calc(100%+0.5rem)] max-sm:p-[0.55rem]"
								role="listbox"
								aria-label="Recent searches"
							>
								<div className="px-[0.45rem] pb-[0.55rem] pt-[0.2rem] text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
									Recent
								</div>
								<div className="flex flex-col gap-[0.3rem]">
									{recentSearches.map((value) => (
										<button
											key={value}
											type="button"
											className="inline-flex w-full items-center gap-3 rounded-[0.8rem] bg-transparent px-[0.8rem] py-3 text-left text-[var(--sea-ink)] transition-[background-color,color,border-color,transform] duration-180 ease-out hover:bg-[color-mix(in_oklab,var(--link-bg-hover)_88%,transparent_12%)] focus-visible:bg-[color-mix(in_oklab,var(--link-bg-hover)_88%,transparent_12%)] focus-visible:outline-none max-sm:gap-[0.65rem] max-sm:px-3 max-sm:py-[0.7rem]"
											onClick={() => handleRecentSelect(value)}
										>
											<MagnifyingGlassIcon height="14" width="14" />
											<span>{value}</span>
										</button>
									))}
								</div>
							</div>
						) : null}
					</div>
				</div>
			</section>

			<SearchHanzi
				chars={hanziInput}
				open={openSearch}
				onOpenChange={handleSearchDialogChange}
			/>
		</main>
	);
}
