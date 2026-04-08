import { Flex, Section } from '@radix-ui/themes';
import Char from './char';
import Pinyin from './pinyin';


export default function Hanzi({ hanzi }: { hanzi: string }) {
  
  return (
    <Section px="2" py="1">
      <Flex  gap="2" align="center">
        <Char hanzi={hanzi} />
        <Pinyin hanzi={hanzi} />
      </Flex>
      </Section>
  )
}
