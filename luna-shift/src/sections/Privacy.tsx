import { CloudSlash, HandCoins, LockKey, UserCircleMinus, type Icon } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { BRAND } from '../site'

const PROMISES: { icon: Icon; title: string; body: string }[] = [
  { icon: LockKey, title: 'On-device only', body: 'Your logs are stored in the app on your iPhone, not on our servers.' },
  { icon: UserCircleMinus, title: 'No account needed', body: 'Open the app and start. You never have to create one.' },
  { icon: CloudSlash, title: 'Nothing uploaded', body: 'What you log is not sent to us, or to anyone else.' },
  { icon: HandCoins, title: 'Nothing sold', body: 'Not to advertisers, not to data brokers, not to anyone.' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Privacy() {
  const reduce = useReducedMotion()
  return (
    <section id="privacy" className="scroll-mt-24 py-16 md:py-24 lg:py-28" aria-labelledby="privacy-title">
      <div className="container-x">
        <Reveal>
          <div className="grid gap-10 rounded-card bg-panel px-7 py-10 text-on-panel md:px-14 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-20 lg:py-20">
            <div className="lg:col-span-5">
              <h2 id="privacy-title" className="text-[clamp(2rem,3.8vw,3.1rem)] leading-[1.06]">
                Private by design.
              </h2>
              <p className="mt-6 max-w-[38ch] text-[1.06rem] leading-relaxed text-panel-muted">
                Everything you log stays on your phone. Not on a server, not in an account, not in anyone’s hands but yours.
              </p>
            </div>
            <ul className="lg:col-span-7 lg:pl-8">
              {PROMISES.map(({ icon: I, title, body }, i) => (
                <motion.li
                  key={title}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.1 }}
                  className={`flex gap-5 py-6 ${i > 0 ? 'border-t border-[var(--panel-line)]' : 'lg:pt-0'} ${i === PROMISES.length - 1 ? 'lg:pb-0' : ''}`}
                >
                  <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-on-panel/10">
                    <I weight="light" className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans text-[1.08rem] font-medium">{title}</h3>
                    <p className="mt-1 text-[0.98rem] leading-relaxed text-panel-muted">{body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1} y={20}>
          <p className="mt-8 max-w-[68ch] text-[0.95rem] leading-relaxed text-muted md:mt-10">
            {BRAND} is a tracking tool for your own records. It is not a medical device and does not diagnose menopause or anything else. For decisions about your health, talk with a qualified clinician.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
