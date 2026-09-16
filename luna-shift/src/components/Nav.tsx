import { Button } from './Button'
import { Wordmark } from './Wordmark'
import { site } from '../site'

export function Nav() {
  return (
    <header
      id="top"
      className="fixed inset-x-0 top-0 z-30 border-b border-line/60 bg-[color-mix(in_oklab,var(--bg)_74%,transparent)] backdrop-blur-md"
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Wordmark />
        <nav aria-label="Primary" className="flex items-center gap-6">
          <a href="#privacy" className="hidden text-[0.95rem] font-medium text-muted transition-colors hover:text-ink sm:inline">
            Privacy
          </a>
          <Button href={site.ctaHref} external size="sm">
            {site.ctaLabel}
          </Button>
        </nav>
      </div>
    </header>
  )
}
