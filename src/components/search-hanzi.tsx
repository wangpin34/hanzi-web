/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import Hanzi from "#/components/hanzi";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Cross2Icon,
} from "@radix-ui/react-icons";
import { Box, Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import "./search-hanzi.css";

export default function SearchHanzi({
	chars,
	open,
	onOpenChange,
}: {
	chars: string[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev());
		setNextBtnDisabled(!emblaApi.canScrollNext());
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on("reinit", onSelect).on("select", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content
				style={{
					// 👇 iOS 风格动画
					animation: "slideUp 250ms ease-out",
				}}
				className="max-w-full!  fixed! inset-0! flex flex-col border-radius-0"
			>
				<Dialog.Title>
					<Flex
						align="center"
						justify="between"
						px="3"
						py="2"
						style={{
							borderBottom: "1px solid #eee",
						}}
					>
						<Dialog.Close>
							<Button size="1" variant="ghost" radius="full">
								<Cross2Icon />
							</Button>
						</Dialog.Close>

						<Flex justify="between">
							<Flex gap="2">
								<IconButton
									size="1"
									variant="outline"
									radius="full"
									onClick={() => emblaApi?.scrollPrev()}
									disabled={prevBtnDisabled}
								>
									<ArrowLeftIcon />
								</IconButton>
								<IconButton
									size="1"
									variant="outline"
									radius="full"
									onClick={() => emblaApi?.scrollNext()}
									disabled={nextBtnDisabled}
								>
									<ArrowRightIcon />
								</IconButton>
							</Flex>
						</Flex>
					</Flex>
				</Dialog.Title>
				<Dialog.Description></Dialog.Description>
				<Box ref={emblaRef} className="embla__viewport grow">
					<Box className="embla__container">
						{chars.map((char, index) => (
							<div className="embla__slide" key={index}>
								<Hanzi key={index} hanzi={char} />
							</div>
						))}
					</Box>
				</Box>

				<Flex gap="2" wrap="wrap" mt="2" align="center">
					<Flex gap="1" align="center" mx="2">
						<ArrowRightIcon />
						<Text size="1">快速选择</Text>
					</Flex>
					{chars.map((char, index) => (
						<Button
							key={index}
							variant="ghost"
							highContrast={selectedIndex === index}
							size="3"
							radius="full"
							onClick={() => emblaApi?.scrollTo(index)}
						>
							{char}
						</Button>
					))}
				</Flex>

				<div
					style={{
						height: "env(safe-area-inset-bottom)",
						background: "white",
					}}
				/>
			</Dialog.Content>
		</Dialog.Root>
	);
}
