/** biome-ignore-all lint/suspicious/noTsIgnore: <explanation> */

import { client } from "@/utils/api";
import { Flex, Grid, Separator, Text } from "@radix-ui/themes";
import useSWR from "swr";
import Bishun from "./bishun";
import Char from "./bishun/char";
import Pinyin from "./pinyin";
import Play from "./play";
import useCharData from "./useCharData";

interface HanziInfo {
	char: string;
	definitions: string;
	definitions_en: string[] | string;
	pinyin: string[];
	sentences: string[];
	words: Array<{ word: string; definition: string }>;
}

export default function Hanzi({ hanzi }: { hanzi: string }) {
	const charData = useCharData(hanzi);
	const {
		data: info,
		error,
		isLoading,
	} = useSWR<HanziInfo>(
		hanzi ? `/hanzi/${hanzi}` : null,
		//@ts-ignore
		client.get,
	);
	if (!charData) return null;

	return (
		<Flex
			className="w-full"
			justify="center"
			align="center"
			data-name="hanzi"
			data-value={hanzi}
			direction="column"
		>
			<Flex
				gap="2"
				direction="column"
				align="center"
				className="w-full bg-[var(--primary)] px-6 py-4 text-white"
			>
				<Flex gap="1" align="center" justify="center" className="w-content">
					<Char
						strokes={charData.strokes}
						outline
						size={60}
						strokeColor="var(--gray-1)"
					/>
					<Separator orientation="vertical" size="4" className="opacity-30" />
					<Pinyin hanzi={hanzi} />
					<Separator orientation="vertical" size="4" className="opacity-30" />
					{charData.radStrokes ? (
						<Char
							strokes={charData.radStrokes.map((n) => charData.strokes[n])}
							size={40}
							strokeColor="var(--gray-1)"
						/>
					) : (
						<Text size="1" className="text-white/80">
							独体字
						</Text>
					)}
				</Flex>

				<Grid columns="2" gap="8" align="center">
					<Play hanzi={hanzi} />
					<Bishun hanzi={hanzi} charData={charData} />
				</Grid>
			</Flex>
			<Flex px="8" py="3" direction="column" className="w-full max-w-2xl">
				<Text size="2">{info?.definitions}。</Text>
				<Flex direction="column" gap="2" mt="3" align="start">
					{info?.words?.map((w, i) => (
						<Flex key={i} gap="4">
							<Text
								className="rounded-full bg-gray-200 text-gray-800 w-6 h-6 text-center leading-6"
								size="2"
							>
								{i + 1}
							</Text>
							<Text size="2">
								{w.definition}: {w.word}
							</Text>
						</Flex>
					))}
					<Text size="2">{info?.sentences?.join("； ")}</Text>
				</Flex>
			</Flex>
		</Flex>
	);
}
