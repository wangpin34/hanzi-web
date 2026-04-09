import Hanzi from '@/components/hanzi';
import { ArrowLeftIcon, ArrowRightIcon, Cross2Icon } from '@radix-ui/react-icons';
import { Box, Button, Dialog, Flex, IconButton, Text } from '@radix-ui/themes';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import './search-hanzi.css';

export default function SearchHanzi({ chars, open, onOpenChange }: { chars: string[], open: boolean, onOpenChange: (open: boolean) => void }) { 
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  


  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reinit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,

            // 👇 iOS 风格动画
            animation: "slideUp 250ms ease-out",
      }}>
       
      <Flex
            align="center"
            justify="between"
            px="3"
            py="2"
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            {/* 左上角 X */}
            <Dialog.Close>
              <Button variant="ghost">
                <Cross2Icon />
              </Button>
            </Dialog.Close>

            {/* 标题 */}
            <Dialog.Title>
              <Text size="3" weight="bold">搜索结果</Text>
            </Dialog.Title>

            {/* 占位（让标题居中） */}
            <div style={{ width: 32 }} />
          </Flex>
    

        <Box ref={emblaRef} className="embla__viewport">
          <Box className="embla__container">
            {chars.map((char, index) => (
          <div className="embla__slide" key={index}>
                <Hanzi key={index} hanzi={char} />
                </div>
        ))}
            </Box>
        </Box>
        <Flex justify="between">
          <Flex gap="2">
          <IconButton variant="outline" radius="full"  onClick={() => emblaApi?.scrollPrev()} disabled={prevBtnDisabled}><ArrowLeftIcon /></IconButton> 
            <IconButton variant="outline" radius="full" onClick={() => emblaApi?.scrollNext()} disabled={nextBtnDisabled}><ArrowRightIcon /></IconButton>
          </Flex>
          <Flex gap="2" wrap="wrap" mt="2">
            {chars.map((char, index) => (
              <Button key={index} variant="outline" highContrast={selectedIndex === index} size="1" radius='full' onClick={() => emblaApi?.scrollTo(index)}>{char}</Button>
            ))}
          </Flex>
        </Flex>
         <Dialog.Description>
        </Dialog.Description>
    
       <div
            style={{
              height: "env(safe-area-inset-bottom)",
              background: "white",
            }}
          />
      </Dialog.Content>
  </Dialog.Root>  
}