import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import type { CharData } from "../types";
import Char from "./char";
import Playable from "./playable-char";

function numberToChinese(num: number) {
	if (num < 0 || num > 100 || !Number.isInteger(num)) {
		throw new Error("only support integers between 0 and 100");
	}

	const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

	if (num === 0) return "零";
	if (num === 100) return "一百";

	const tens = Math.floor(num / 10);
	const ones = num % 10;

	// 1–9
	if (num < 10) return digits[num];

	// 10–19
	if (tens === 1) {
		return ones === 0 ? "十" : "十" + digits[ones];
	}

	// 20–99
	return ones === 0 ? digits[tens] + "十" : digits[tens] + "十" + digits[ones];
}

export default function Bishun({
	hanzi,
	charData,
}: {
	hanzi: string;
	charData: CharData;
}) {
	const strokes = charData?.strokes ?? [];
	const stepStrokesNumbers = Array.from(
		{ length: strokes.length },
		(_, i) => i,
	);

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<IconButton variant="ghost" size="1" radius="full">
					<Pencil1Icon className="w-8 h-8" />
				</IconButton>
			</Dialog.Trigger>
			<Dialog.Content className="w-auto">
				<div className="absolute w-full top-4 right-4 flex justify-end">
					<Dialog.Close>
						<IconButton variant="ghost" color="gray" radius="full" size="4">
							<Cross1Icon />
						</IconButton>
					</Dialog.Close>
				</div>
				<Flex justify="center">
					<Playable hanzi={hanzi} />
				</Flex>
				<Flex justify="center">
					<Text size="3" weight="bold">
						共 {numberToChinese(strokes.length)} 笔
					</Text>
				</Flex>
				<Box overflow="auto" maxHeight="40vh" className="m-auto">
					<div className="grid grid-cols-[repeat(auto-fill,100px)] justify-center gap-4 px-2 py-4">
						{stepStrokesNumbers.map((strokeNumber) => (
							<Flex
								direction="column"
								align="center"
								key={strokeNumber}
								gap="1"
							>
								<Char
									key={strokeNumber}
									strokes={strokes}
									highlightStrokeNumber={strokeNumber}
									outline
									riceGrid
									size={60}
								/>
								<Text size="1"> 第 {numberToChinese(strokeNumber + 1)} 笔</Text>
							</Flex>
						))}
					</div>
				</Box>
			</Dialog.Content>
		</Dialog.Root>
	);
}
