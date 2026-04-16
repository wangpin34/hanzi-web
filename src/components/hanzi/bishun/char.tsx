import HanziWriter from "hanzi-writer";
import { useMemo } from "react";

export default function Char({
	strokes,
	strokeColor = "#aaa",
	highlightStrokeNumber = strokes.length - 1,
	highlightColor = "#000",
	riceGrid = false,
	outline = false,
	size = 100,
}: {
	strokes: string[];
	strokeColor?: string;
	highlightColor?: string;
	highlightStrokeNumber?: number;
	riceGrid?: boolean;
	outline?: boolean;
	size?: number;
}) {
	const { transform } = useMemo(
		// must be same as the view box of the svg
		() => HanziWriter.getScalingTransform(100, 100),
		[],
	);
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 100 100"
		>
			<g stroke="red" strokeDasharray="1,1" strokeWidth="1">
				{outline && (
					<rect
						x="0"
						y="0"
						width="100"
						height="100"
						fill="none"
						strokeDasharray="none"
					/>
				)}
				{riceGrid && (
					<>
						<line x1="0" y1="0" x2="100" y2="100" />
						<line x1="100" y1="0" x2="0" y2="100" />
						<line x1="50" y1="0" x2="50" y2="100" />
						<line x1="0" y1="50" x2="100" y2="50" />
					</>
				)}
			</g>
			<g transform={transform}>
				{strokes.map((stroke, index) =>
					index > (highlightStrokeNumber ?? -1) ? (
						<path key={index} d={stroke} fill={strokeColor} />
					) : null,
				)}
			</g>
			<g transform={transform}>
				{strokes.slice(0, highlightStrokeNumber + 1).map((stroke, index) => (
					<path key={index} d={stroke} fill={highlightColor} />
				))}
			</g>
		</svg>
	);
}
