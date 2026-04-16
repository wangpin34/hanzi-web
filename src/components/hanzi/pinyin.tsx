import { Text } from "@radix-ui/themes";
import { pinyin } from "pinyin-pro";
import { useMemo } from "react";

function getTonePosition(pinyin: string) {
	const vowels = ["a", "o", "e", "i", "u", "ü"];

	// 1. a
	if (pinyin.includes("a")) return pinyin.indexOf("a");

	// 2. o
	if (pinyin.includes("o")) return pinyin.indexOf("o");

	// 3. e
	if (pinyin.includes("e")) return pinyin.indexOf("e");

	// 4. iu / ui 特判
	if (pinyin.includes("iu")) return pinyin.indexOf("u");
	if (pinyin.includes("ui")) return pinyin.indexOf("i");

	// 5. fallback：第一个元音
	for (let i = 0; i < pinyin.length; i++) {
		if (vowels.includes(pinyin[i])) return i;
	}
}

export default function Pinyin({ hanzi }: { hanzi: string }) {
	const pinyinResult = useMemo(() => {
		return pinyin(hanzi);
	}, [hanzi]);

	return (
		<Text size="6" align="center">
			{pinyinResult}
		</Text>
	);
}
