import { Pencil1Icon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton, Popover, Text } from "@radix-ui/themes";
import HanziWriter from "hanzi-writer";
import { useEffect, useMemo, useRef, useState } from "react";
import Char from "./char";

function numberToChinese(num) {
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

interface CharData {
	strokes: string[];
	medians: Array<Array<Array<number>>>;
	radStrokes: Array<number>;
}

export default function Bishun({ hanzi }: { hanzi: string }) {
	const hanziRef = useRef<string>(hanzi);
	const [charData, setCharData] = useState<CharData>();
	const strokes = charData?.strokes ?? [];
	const stepStrokesNumbers = Array.from(
		{ length: strokes.length },
		(_, i) => i,
	);
	const { transform } = useMemo(
		() => HanziWriter.getScalingTransform(100, 100),
		[],
	);

	useEffect(() => {
		HanziWriter.loadCharacterData(hanziRef.current).then((data) => {
			setCharData(data as CharData);
		});
	}, []);

	return (
		<Popover.Root>
			<Popover.Trigger>
				<IconButton variant="ghost" size="1" radius="full">
					<Pencil1Icon className="w-8 h-8" />
				</IconButton>
			</Popover.Trigger>
			<Popover.Content className="w-auto">
				<Flex justify="center">
					<Text size="3" weight="bold">
						共 {numberToChinese(strokes.length)} 笔
					</Text>
				</Flex>
				<Box
					overflow="auto"
					maxHeight="40vh"
					minWidth="60vw"
					className="m-auto"
				>
					<div className="grid grid-cols-[repeat(auto-fill,100px)] justify-center gap-4 px-2 py-4">
						{stepStrokesNumbers.map((strokeNumber) => (
							<Box>
								<Char
									key={strokeNumber}
									strokes={strokes}
									highlightStrokeNumber={strokeNumber}
									transform={transform}
								/>
								<Text> 第 {numberToChinese(strokeNumber + 1)} 笔</Text>
							</Box>
						))}
					</div>
				</Box>
			</Popover.Content>
		</Popover.Root>
	);
}
