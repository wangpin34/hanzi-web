import { Pencil1Icon } from "@radix-ui/react-icons";
import { Flex, IconButton, Popover } from "@radix-ui/themes";
import HanziWriter from "hanzi-writer";
import { useEffect, useMemo, useRef, useState } from "react";
import Char from "./char";

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
				<Flex p="1" gap="2">
					{stepStrokesNumbers.map((strokeNumber) => (
						<Char
							key={strokeNumber}
							strokes={strokes}
							highlightStrokeNumber={strokeNumber}
							transform={transform}
						/>
					))}
				</Flex>
			</Popover.Content>
		</Popover.Root>
	);
}
