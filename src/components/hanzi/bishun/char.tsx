export default function Char({
	strokes,
	strokeColor = "#aaa",
	highlightStrokeNumber = 0,
	highlightColor = "#000",
	transform,
}: {
	strokes: string[];
	strokeColor?: string;
	highlightColor?: string;
	highlightStrokeNumber?: number;
	transform: string;
}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100"
			height="100"
			viewBox="0 0 100 100"
		>
			<g stroke="red" strokeDasharray="1,1" strokeWidth="1">
				<rect
					x="0"
					y="0"
					width="100"
					height="100"
					fill="none"
					strokeDasharray="none"
				/>
				<line x1="0" y1="0" x2="100" y2="100" />
				<line x1="100" y1="0" x2="0" y2="100" />
				<line x1="50" y1="0" x2="50" y2="100" />
				<line x1="0" y1="50" x2="100" y2="50" />
			</g>
			<g transform={transform}>
				{strokes.map((stroke, index) =>
					index > (highlightStrokeNumber ?? -1) ? (
						<path key={index} d={stroke} fill={strokeColor} />
					) : null,
				)}
			</g>
			<g transform={transform}>
				{strokes.map((stroke, index) =>
					index <= (highlightStrokeNumber ?? -1) ? (
						<path key={index} d={stroke} fill={highlightColor} />
					) : null,
				)}
			</g>
		</svg>
	);
}
