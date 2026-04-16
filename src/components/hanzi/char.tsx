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
				strokeColor: "#000",
			});
		} else {
			writer.current?.setCharacter(hanzi);
		}
	}, [hanzi]);

	return <div ref={containerRef}></div>;
}
