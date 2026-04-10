import { Flex } from '@radix-ui/themes';
import Char from './char';
import Pinyin from './pinyin';
import Play from './play';


export default function Hanzi({ hanzi }: { hanzi: string }) {

  return (
    <Flex px="2" py="1" className="w-full" justify="center" align="center" data-name="hanzi" data-value={hanzi}>
      <Flex gap="2" align="center" className="w-content">
        <Char hanzi={hanzi} />
        <Pinyin hanzi={hanzi} />
        <Play hanzi={hanzi} />

      </Flex>
      </Flex>
  )
}
