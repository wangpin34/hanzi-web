/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import Hanzi from "#/components/hanzi";
import { useAuth } from "@/utils/auth-context";
import { supabase } from "@/utils/supabase";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Cross2Icon,
	HeartFilledIcon,
	HeartIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Dialog, Flex, IconButton, Text } from "@radix-ui/themes";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import "./search-hanzi.css";

async function favoriteChars(userId: string, chars: string[]) {
	await supabase
		.from("user_hanzi_favorited")
		.insert({ hanzi: chars.join(""), created_by: userId });
}

export default function SearchHanzi({
	chars,
	open,
	onOpenChange,
}: {
	chars: string[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { user } = useAuth();
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [favorited, setFavorited] = useState(false);

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

	useEffect(() => {
		if (open) setFavorited(false);
	}, [open]);

	const handleFavorite = useCallback(async () => {
		if (!user || chars.length === 0) return;
		await favoriteChars(user.id, chars);
		setFavorited(true);
	}, [user, chars]);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content
				style={{
					// 👇 iOS 风格动画
					animation: "slideUp 250ms ease-out",
				}}
				className="max-w-full! fixed! inset-0! flex flex-col border-radius-0 p-0!"
			>
				<Dialog.Title className="bg-[var(--primary)] text-white mb-0! pt-[env(safe-area-inset-top)]">
					<Flex align="center" justify="between" px="3" py="3">
						<Dialog.Close>
							<Button
								size="1"
								variant="ghost"
								radius="full"
								className="text-white! hover:bg-white/20!"
							>
								<Cross2Icon />
							</Button>
						</Dialog.Close>

						<Flex justify="between">
							<Flex gap="2" align="center">
								{user && (
									<IconButton
										size="1"
										variant="ghost"
										radius="full"
										className="text-white! hover:bg-white/20!"
										onClick={handleFavorite}
										disabled={favorited}
										aria-label={favorited ? "已收藏" : "收藏"}
									>
										{favorited ? <HeartFilledIcon /> : <HeartIcon />}
									</IconButton>
								)}
								<IconButton
									size="1"
									variant="outline"
									radius="full"
									className="text-white! border-white/40! hover:bg-white/20!"
									onClick={() => emblaApi?.scrollPrev()}
									disabled={prevBtnDisabled}
								>
									<ArrowLeftIcon />
								</IconButton>
								<IconButton
									size="1"
									variant="outline"
									radius="full"
									className="text-white! border-white/40! hover:bg-white/20!"
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
				<Box
					ref={emblaRef}
					className="embla__viewport grow overflow-hidden bg-[var(--bg-base)]"
				>
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
