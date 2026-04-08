import Hanzi from '@/components/hanzi';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { TextField } from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
export const Route = createFileRoute('/')({ component: App })



function keepHanzi(str: string) {
  return str.replace(/[^\p{Script=Han}]/gu, '');
}

function App() {
  const [input, setInput] = useState('')
  const hanziInput = useMemo(() => keepHanzi(input).split(''), [input])
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])


      
  
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="mx-auto max-w-2xl">
       <TextField.Root placeholder="输入汉字" value={input} onChange={handleChange}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      </section>
      <section>
        {
          hanziInput.map((char, index) => (
            <Hanzi key={index} hanzi={char} />
          ))
        }
      </section>
    </main>
  )
}
