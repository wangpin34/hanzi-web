import SearchHanzi from '@/components/search-hanzi'
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { TextField } from '@radix-ui/themes'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const Route = createFileRoute('/search')({
  component: SearchRoute,
})

function keepHanzi(str: string) {
  return str.replace(/[^\p{Script=Han}]/gu, '')
}

function SearchRoute() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const hanziInput = useMemo(() => Array.from(keepHanzi(input)), [input])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const returnToHome = useCallback(() => {
    setOpenSearch(false)
    void navigate({ to: '/' })
  }, [navigate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return
    }

    e.preventDefault()

    if (hanziInput.length > 0) {
      setOpenSearch(true)
    }
  }, [hanziInput.length])

  return (
    <main className="home-search page-wrap px-4 pb-8 pt-14">
      <section className="mx-auto max-w-2xl rise-in">
        <div className="home-search-bar">
          <button
            type="button"
            className="home-search-back"
            onClick={returnToHome}
            aria-label="Back to home"
          >
            <ArrowLeftIcon height="18" width="18" />
          </button>
          <TextField.Root
            ref={inputRef}
            placeholder="输入汉字"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            size="3"
            className="home-search-input"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </div>
      </section>

      <SearchHanzi
        chars={hanziInput}
        open={openSearch}
        onOpenChange={setOpenSearch}
      />
    </main>
  )
}
