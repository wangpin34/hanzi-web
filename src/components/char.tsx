import { PlayIcon } from '@radix-ui/react-icons';
import HanziWriter from 'hanzi-writer';
import { useEffect, useRef } from 'react';

export default function Char({ hanzi }: { hanzi: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  useEffect(() => {
    if (!hanzi || hanzi.length > 1) return
    if (!writer.current) {
      if (!containerRef.current) return
      writer.current = HanziWriter.create(containerRef.current!, hanzi, {
        width: 100,
        height: 100,
        padding: 5,
        radicalColor: '#168F16' 
      });
    } else {
      writer.current?.setCharacter(hanzi)
    }
  }, [hanzi])
  
  
  return (
    <div className="group relative">
       <div className="absolute top-0 left-0 w-full h-full p-[20px] invisible group-hover:visible">
        <PlayIcon onClick={() => writer.current?.animateCharacter()} className="w-[60px] h-[60px]" />
      </div>
      <div ref={containerRef}></div>
      </div>
  )
}
