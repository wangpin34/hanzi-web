import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { useCallback } from "react";
import type { PinyinSyllable } from "./usePinyin";
import usePinyin from "./usePinyin";

const ctx = new AudioContext();

const audioCache = new Map<string, AudioBuffer>();
async function loadAudio(url: string) {
	if (audioCache.has(url)) return audioCache.get(url);

	const res = await fetch(url);
	const buf = await res.arrayBuffer();
	const audioBuffer = await ctx.decodeAudioData(buf);

	audioCache.set(url, audioBuffer);
	return audioBuffer;
}

function playBuffer(buffer: AudioBuffer, startTime: number) {
	const source = ctx.createBufferSource();
	const gain = ctx.createGain();
	gain.gain.value = 1;
	source.connect(gain);
	gain.connect(ctx.destination);
	source.buffer = buffer;
	source.connect(ctx.destination);
	source.start(startTime);

	return buffer.duration;
}

async function playPinyinSequence(pinyinList: PinyinSyllable[], hanzi: string) {
	let currentTime = ctx.currentTime;
	const bufferList: AudioBuffer[] = [];

	try {
		await Promise.all(
			pinyinList.map(async (syllable) => {
				const { raw } = syllable;
				const buffer = await loadAudio(`/Pinyin-Female-Wav/${raw}.wav`);
				buffer && bufferList.push(buffer);
			}),
		);
		for (const buffer of bufferList) {
			playBuffer(buffer, currentTime);
			currentTime += buffer.duration * 0.95; // 稍微 overlap 更自然
		}
	} catch (e) {
		const utterance = new SpeechSynthesisUtterance(hanzi);
		utterance.lang = "zh";
		utterance.rate = 0.2;
		speechSynthesis.speak(utterance);
	}

	// for (const syllable of pinyinList) {
	// 	const { initial, final, tone, raw } = syllable;

	// 	const base = initial + final; // ni
	// 	//const toneFile = `tone${tone}.mp3`;

	// 	// 目前没有独立的声母，韵母资源，先整体播放
	// 	// const syllableBuffer = await loadAudio(`/Pinyin-Female-Wav/${base}.mp3`);
	// 	// const toneBuffer = await loadAudio(`/Pinyin-Female-Wav/${toneFile}`);
	// 	// 播放音节
	// 	// const d1 = playBuffer(syllableBuffer!, currentTime);
	// 	// currentTime += d1 * 0.95; // 稍微 overlap 更自然

	// 	// // 播放声调
	// 	// const d2 = playBuffer(toneBuffer!, currentTime);
	// 	//currentTime += d2 * 0.9;
	// 	const audioBuffer = await loadAudio(`/Pinyin-Female-Wav/${raw}.wav`);
	// 	bufferList.push(audioBuffer!);
	// }
}

export default function Play({ hanzi }: { hanzi: string }) {
	const pinyinResult = usePinyin(hanzi);
	const handlePlay = useCallback(async () => {
		await playPinyinSequence(pinyinResult, hanzi);
	}, [pinyinResult, hanzi]);

	return (
		<IconButton
			size="1"
			variant="ghost"
			radius="full"
			onClick={() => {
				// const utterance = new SpeechSynthesisUtterance(hanzi);
				// utterance.lang = "zh";
				// utterance.rate = 0.2;
				// speechSynthesis.speak(utterance);
				handlePlay();
			}}
		>
			<SpeakerLoudIcon className="w-8 h-8" />
		</IconButton>
	);
}
