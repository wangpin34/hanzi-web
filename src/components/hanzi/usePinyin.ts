import { pinyin } from "pinyin-pro";
import { useMemo } from "react";

const INITIALS = [
	"zh",
	"ch",
	"sh",
	"b",
	"p",
	"m",
	"f",
	"d",
	"t",
	"n",
	"l",
	"g",
	"k",
	"h",
	"j",
	"q",
	"x",
	"r",
	"z",
	"c",
	"s",
];

const SPECIAL_SYLLABLES = ["zhi", "chi", "shi", "ri", "zi", "ci", "si"];

// 排序：优先匹配 zh/ch/sh
const SORTED_INITIALS = [...INITIALS].sort((a, b) => b.length - a.length);

function normalizeFinal(final: string) {
	// v → ü
	if (final.includes("v")) {
		final = final.replace(/v/g, "ü");
	}

	// j/q/x + u → ü
	// ju → jü, qu → qü, xu → xü（拼音规则）
	return final;
}

function restoreYW(base: string) {
	// 还原 y / w 开头的真实韵母
	if (base.startsWith("y")) {
		const rest = base.slice(1);

		if (rest === "") return { initial: "", final: "i" };

		if (rest.startsWith("u")) return { initial: "", final: rest }; // yu
		if (rest.startsWith("i")) return { initial: "", final: rest }; // yi

		return { initial: "", final: "i" + rest }; // ya → ia
	}

	if (base.startsWith("w")) {
		const rest = base.slice(1);

		if (rest === "") return { initial: "", final: "u" };

		return { initial: "", final: "u" + rest }; // wa → ua
	}

	return null;
}

export interface PinyinSyllable {
	initial: string; // 声母
	final: string; // 韵母
	tone: number; // 声调（1-5，5表示轻声）
	isSpecial: boolean; // 是否整体认读
	raw: string; // 原始拼音（带声调数字）
}

function splitPinyinPro(syllable: string) {
	// 提取声调
	const toneMatch = syllable.match(/[1-5]$/);
	const tone = toneMatch ? Number(toneMatch[0]) : 5;

	let base = syllable.replace(/[1-5]$/, "");

	// 统一 v → ü（先做）
	base = base.replace(/v/g, "ü");

	// 特殊整体认读
	const isSpecial = SPECIAL_SYLLABLES.includes(base);

	// y / w 特殊处理
	const yw = restoreYW(base);
	if (yw) {
		return {
			initial: yw.initial,
			final: normalizeFinal(yw.final),
			tone,
			isSpecial,
			raw: syllable,
		};
	}

	// 常规匹配声母
	let initial = "";
	let final = base;

	for (const i of SORTED_INITIALS) {
		if (base.startsWith(i)) {
			initial = i;
			final = base.slice(i.length);
			break;
		}
	}

	final = normalizeFinal(final);

	// j/q/x + u → ü（补充规则）
	if (["j", "q", "x"].includes(initial) && final.startsWith("u")) {
		final = "ü" + final.slice(1);
	}

	return {
		initial, //声母
		final, //韵母
		tone, //声调
		isSpecial, //是否整体认读
		raw: syllable, //原始拼音（带声调数字）
	} as PinyinSyllable;
}

export default function usePinyin(hanzi: string) {
	const pinyinResult = useMemo(() => {
		return pinyin(hanzi, {
			toneType: "num",
			type: "array",
		}).map(splitPinyinPro);
	}, [hanzi]);

	return pinyinResult;
}
