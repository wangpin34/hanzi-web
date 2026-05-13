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
}

export default function Hanzi({ hanzi }: { hanzi: string }) {
	const charData = useCharData(hanzi);
	const {
		data: info,
		error,
		isLoading,
	} = useSWR<HanziInfo>(
		hanzi ? `/hanzi/explain?hanzi=${hanzi}` : null,
		//@ts-ignore
		client.get,
	);
	if (!charData) return null;

	console.log(`info`, info);

	return (
		<Flex
			px="2"
			py="1"
			className="w-full"
			justify="center"
			align="center"
			data-name="hanzi"
			data-value={hanzi}
			direction="column"
		>
			<Flex gap="2" direction="column" align="center" className="w-content">
				<Flex gap="1" align="center" justify="center" className="w-content">
					<Char strokes={charData.strokes} outline size={60} />
					<Separator orientation="vertical" size="4" />
					<Pinyin hanzi={hanzi} />
					<Separator orientation="vertical" size="4" />
					{charData.radStrokes ? (
						<Char
							strokes={charData.radStrokes.map((n) => charData.strokes[n])}
							size={40}
						/>
					) : (
						<Text size="1">独体字</Text>
					)}
				</Flex>

				<Grid columns="2" gap="8" align="center">
					<Play hanzi={hanzi} />
					<Bishun hanzi={hanzi} charData={charData} />
				</Grid>
			</Flex>
			<Separator my="3" size="4" />
			<Flex>
				<Text>{info?.definitions}</Text>
			</Flex>
		</Flex>
	);
}
