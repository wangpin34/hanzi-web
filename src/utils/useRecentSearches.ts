import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";
import { supabase } from "./supabase";

const STORAGE_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 8;

function loadFromLocalStorage(): string[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((v): v is string => typeof v === "string")
			: [];
	} catch {
		return [];
	}
}

function saveToLocalStorage(searches: string[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

function clearLocalStorage() {
	localStorage.removeItem(STORAGE_KEY);
}

async function loadFromSupabase(userId: string): Promise<string[]> {
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

async function saveToSupabase(userId: string, query: string) {
	await supabase
		.from("user_hanzi_history")
		.insert({ hanzi: query, created_by: userId });
}

async function migrateLocalToSupabase(userId: string, localItems: string[]) {
	if (localItems.length === 0) return;

	const remote = await loadFromSupabase(userId);
	const remoteSet = new Set(remote);
	const toUpload = localItems.filter((item) => !remoteSet.has(item));

	if (toUpload.length > 0) {
		await supabase
			.from("user_hanzi_history")
			.insert(toUpload.map((hanzi) => ({ hanzi, created_by: userId })));
	}

	clearLocalStorage();
}

function dedup(items: string[]): string[] {
	const seen = new Set<string>();
	return items.filter((item) => {
		if (seen.has(item)) return false;
		seen.add(item);
		return true;
	});
}

export function useRecentSearches() {
	const { user } = useAuth();
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const migratedRef = useRef(false);

	useEffect(() => {
		if (user) {
			const localItems = loadFromLocalStorage();

			loadFromSupabase(user.id).then((remoteItems) => {
				const merged = dedup([...remoteItems, ...localItems]).slice(
					0,
					MAX_RECENT_SEARCHES,
				);
				setRecentSearches(merged);
			});

			if (localItems.length > 0 && !migratedRef.current) {
				migratedRef.current = true;
				migrateLocalToSupabase(user.id, localItems);
			}
		} else {
			setRecentSearches(loadFromLocalStorage());
		}
	}, [user]);

	const addRecentSearch = useCallback(
		(query: string) => {
			setRecentSearches((prev) => {
				const next = [query, ...prev.filter((item) => item !== query)].slice(
					0,
					MAX_RECENT_SEARCHES,
				);

				if (user) {
					saveToSupabase(user.id, query);
				} else {
					saveToLocalStorage(next);
				}

				return next;
			});
		},
		[user],
	);

	return { recentSearches, addRecentSearch };
}
