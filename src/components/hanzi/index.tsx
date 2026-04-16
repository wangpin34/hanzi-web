import { Flex, Grid, Separator, Text } from "@radix-ui/themes";
import Bishun from "./bishun";
import Char from "./bishun/char";
import Pinyin from "./pinyin";
import Play from "./play";
import useCharData from "./useCharData";

export default function Hanzi({ hanzi }: { hanzi: string }) {
	const charData = useCharData(hanzi);

	if (!charData) return null;

	return (
		<Flex
			px="2"
			py="1"
			className="w-full"
			justify="center"
			align="center"
			data-name="hanzi"
			data-value={hanzi}
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
				<Separator my="3" size="4" />
				<Grid columns="2" gap="8" align="center">
					<Play hanzi={hanzi} />
					<Bishun hanzi={hanzi} charData={charData} />
				</Grid>
			</Flex>
		</Flex>
	);
}
