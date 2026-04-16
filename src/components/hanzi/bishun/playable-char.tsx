import { PlayIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import HanziWriter from "hanzi-writer";
import { useEffect, useRef } from "react";

export default function Char({ hanzi }: { hanzi: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const writer = useRef<HanziWriter | null>(null);
	useEffect(() => {
		if (!hanzi || hanzi.length > 1) return;
		if (!writer.current) {
			if (!containerRef.current) return;
			writer.current = HanziWriter.create(containerRef.current!, hanzi, {
				width: 80,
				height: 80,
				padding: 5,
			});
		} else {
			writer.current?.setCharacter(hanzi);
		}
	}, [hanzi]);

	return (
		<div className="group relative">
			<div ref={containerRef}></div>
			<div className="invisible group-hover:visible  rounded-full opacity-80 absolute top-0 left-0 bg-gray w-full h-full flex items-center justify-center">
				<IconButton
					onClick={() => writer.current?.animateCharacter()}
					variant="ghost"
					radius="full"
					size="2"
				>
					<PlayIcon className="w-8 h-8" />
				</IconButton>
			</div>
		</div>
	);
}
