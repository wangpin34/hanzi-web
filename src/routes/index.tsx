import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
export const Route = createFileRoute('/')({ component: App })

function App() {
  const navigate = useNavigate()

  const goToSearch = useCallback(() => {
    void navigate({ to: '/search' })
  }, [navigate])

  return (
    <main className="page-wrap min-h-[calc(100vh-7rem)] px-4 pb-8 max-sm:min-h-[calc(100vh-5.5rem)]">
      <section className="rise-in grid min-h-[calc(100vh-10rem)] place-items-center max-sm:min-h-[calc(100vh-8rem)]">
        <Link
          to="/search"
          className="inline-flex w-full max-w-[34rem] items-center justify-start gap-4 rounded-full border border-[var(--line)] bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] px-5 py-4 text-[1.02rem] text-[var(--sea-ink-soft)] no-underline shadow-[inset_0_1px_0_var(--inset-glint),0_24px_46px_rgba(30,90,72,0.12),0_8px_20px_rgba(23,58,64,0.08)] transition-[background-color,color,border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-[color-mix(in_oklab,var(--lagoon-deep)_36%,var(--line))] hover:text-[var(--sea-ink)] focus-visible:-translate-y-px focus-visible:border-[color-mix(in_oklab,var(--lagoon-deep)_36%,var(--line))] focus-visible:text-[var(--sea-ink)] focus-visible:outline-none max-sm:px-4 max-sm:py-[0.95rem] max-sm:text-[0.98rem]"
          aria-label="输入汉字"
          onFocus={goToSearch}
        >
          <MagnifyingGlassIcon height="18" width="18" />
          <span>输入汉字</span>
        </Link>
      </section>
    </main>
  )
}
