import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "auto";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}

	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "auto") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}

	document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	useEffect(() => {
		if (mode !== "auto") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");

		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);

	function selectMode(next: ThemeMode) {
		setMode(next);
		applyThemeMode(next);
		window.localStorage.setItem("theme", next);
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<IconButton
					variant="ghost"
					size="2"
					radius="full"
					aria-label="Theme"
					className="text-[var(--ink-muted-soft)]! hover:text-[var(--ink)]!"
				>
					{mode === "dark" ? (
						<MoonIcon width={18} height={18} />
					) : mode === "light" ? (
						<SunIcon width={18} height={18} />
					) : (
						<DesktopIcon width={18} height={18} />
					)}
				</IconButton>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content size="1" align="end">
				<DropdownMenu.Item onSelect={() => selectMode("light")}>
					<SunIcon /> Light
				</DropdownMenu.Item>
				<DropdownMenu.Item onSelect={() => selectMode("dark")}>
					<MoonIcon /> Dark
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onSelect={() => selectMode("auto")}>
					<DesktopIcon /> System
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
