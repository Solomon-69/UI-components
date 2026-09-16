import { motion, useInView, useReducedMotion } from 'motion/react'
import { Component, lazy, Suspense, useCallback, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { Button } from '../components/Button'
import { hasWebGL } from '../lib/hasWebGL'
import { site } from '../site'

const HeroScene = lazy(() => import('../three/HeroScene'))
type CapturePose = 'front' | 'angle' | null

const HERO_ALT =
  'An iPhone showing the Luna Shift Today screen, with one-tap logging for hot flash, night sweat, mood, sleep and brain fog'

const EASE = [0.16, 1, 0.3, 1] as const
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

/** If the model, decoder, texture or WebGL context fails, fall back to the static render instead of blanking the page. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('Hero 3D scene failed, showing the static render instead.', error, info.componentStack)
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function Hero() {
  const reduce = useReducedMotion()
  const [webgl] = useState(() => hasWebGL())
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [staticGone, setStaticGone] = useState(false)
  const [paused, setPaused] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { amount: 0.05 })
  const mode = !reduce && webgl && !failed ? '3d' : 'static'
  const [capture] = useState<CapturePose>(() => {
    if (!import.meta.env.DEV) return null
    const v = new URLSearchParams(window.location.search).get('capture')
    return v === 'angle' ? 'angle' : v === 'front' ? 'front' : null
  })

  const onReady = useCallback(() => setReady(true), [])
  const onError = useCallback(() => setFailed(true), [])
  const showStatic = mode === 'static' || !ready

  return (
    <section className="relative isolate flex items-center pt-24 pb-16 md:pt-28 md:pb-20 lg:min-h-[100svh]">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        <motion.div
          className="lg:col-span-6"
          variants={stagger}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.h1
            variants={item}
            className="max-w-[20ch] text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.08] text-ink"
          >
            Your perimenopause, tracked privately.
          </motion.h1>
          <motion.p variants={item} className="mt-7 max-w-[40ch] text-[1.06rem] leading-relaxed text-muted md:text-[1.12rem]">
            Log symptoms, hormone therapy and daily factors in seconds. Everything stays on your phone. No account, nothing uploaded, nothing sold.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button href={site.ctaHref} external>
              {site.ctaLabel}
            </Button>
            <Button href="#log" variant="quiet">
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-6">
          <div ref={stage} className="hero-stage" role="img" aria-label={HERO_ALT}>
            {mode === '3d' && (
              <SceneBoundary onError={onError}>
                <Suspense fallback={null}>
                  {/* Opaque from the start: the canvas is transparent until the scene resolves, and only the placeholder above it fades. */}
                  <div className="stage-layer">
                    <HeroScene active={inView && !paused} onReady={onReady} onError={onError} capture={capture} />
                  </div>
                </Suspense>
              </SceneBoundary>
            )}
            {(mode === 'static' || !staticGone) && (
              <div
                className="stage-layer"
                style={{ opacity: showStatic ? 1 : 0, pointerEvents: 'none' }}
                onTransitionEnd={() => {
                  if (!showStatic) setStaticGone(true)
                }}
              >
                <img
                  src={mode === 'static' ? '/hero-phone-static.webp' : '/hero-phone-front.webp'}
                  alt=""
                  width={1120}
                  height={1400}
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                />
              </div>
            )}
          </div>
          {mode === '3d' && (
            <div className="mt-3 flex min-h-9 justify-center lg:justify-end">
              <button
                type="button"
                disabled={!ready}
                aria-pressed={paused}
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-2 rounded-pill border border-ink/30 bg-tint px-3 py-1.5 text-[0.82rem] font-medium text-muted transition-opacity duration-300 hover:text-ink disabled:opacity-0"
              >
                {paused ? <Play weight="fill" className="size-3.5" aria-hidden="true" /> : <Pause weight="fill" className="size-3.5" aria-hidden="true" />}
                <span>Pause animation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
