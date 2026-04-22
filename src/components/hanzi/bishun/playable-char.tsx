import { PlayIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import classnames from "classnames";
import HanziWriter from "hanzi-writer";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Char({ hanzi }: { hanzi: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const writer = useRef<HanziWriter | null>(null);
	const [playing, setPlaying] = useState(false);
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

	const onPlay = useCallback(() => {
		setPlaying(true);
		writer.current?.animateCharacter({
			onComplete: () => {
				setPlaying(false);
			},
		});
	}, []);

	return (
		<div className="group relative">
			<div ref={containerRef}></div>
			<div
				className={classnames(
					"rounded-full opacity-80 absolute top-0 left-0 bg-gray w-full h-full flex items-center justify-center",
					{ invisible: playing },
				)}
			>
				<IconButton onClick={onPlay} variant="ghost" radius="full" size="2">
					<PlayIcon className="w-8 h-8" />
				</IconButton>
			</div>
		</div>
	);
}
