import { Flex, Grid } from "@radix-ui/themes";
import Bishun from "./bishun";
import Char from "./char";
import Pinyin from "./pinyin";
import Play from "./play";

export default function Hanzi({ hanzi }: { hanzi: string }) {
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
				<Grid columns="2" gap="1" align="center" className="w-content">
					<Char hanzi={hanzi} />
					<Pinyin hanzi={hanzi} />
				</Grid>
				<Grid columns="2" gap="8" align="center">
					<Play hanzi={hanzi} />
					<Bishun hanzi={hanzi} />
				</Grid>
			</Flex>
		</Flex>
	);
}
