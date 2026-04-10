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
    <main className="home-search page-wrap px-4 pb-8">
      <section className="home-search-hero rise-in">
        <Link
          to="/search"
          className="home-search-trigger"
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
