import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

export default function Play({ hanzi }: { hanzi: string }) {
	return (
		<IconButton
			size="1"
			variant="ghost"
			radius="full"
			onClick={() => {
				const utterance = new SpeechSynthesisUtterance(hanzi);
				utterance.lang = "zh";
				utterance.rate = 0.2;
				speechSynthesis.speak(utterance);
			}}
		>
			<SpeakerLoudIcon className="w-8 h-8" />
		</IconButton>
	);
}
