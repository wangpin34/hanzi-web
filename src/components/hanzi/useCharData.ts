import HanziWriter from "hanzi-writer";
import { useEffect, useRef, useState } from "react";
import type { CharData } from "./types";

export default function useCharData(hanzi: string) {
	const hanziRef = useRef<string>(hanzi);
	const [charData, setCharData] = useState<CharData>();

	useEffect(() => {
		HanziWriter.loadCharacterData(hanziRef.current).then((data) => {
			setCharData(data as CharData);
		});
	}, []);

	return charData;
}
