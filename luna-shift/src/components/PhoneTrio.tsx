import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { Phone } from './Phone'
import type { ScreenId } from '../lib/screens'

export type TrioVariant = 'stepped' | 'fan' | 'cascade' | 'lean'

type Slot = { x: string; y: string; r: string; s: number; z: number }

// Desktop arrangements. Ratios are sized so every phone stays inside the box.
// Mobile collapses to a stacked column in CSS (.trio media query).
const LAYOUTS: Record<TrioVariant, { ratio: string; slots: Slot[] }> = {
  // staircase: left low, right high, right in front
  stepped: {
    ratio: '16 / 14',
    slots: [
      { x: '4%', y: '18%', r: '-6deg', s: 0.94, z: 1 },
      { x: '34%', y: '8%', r: '0deg', s: 1, z: 2 },
      { x: '64%', y: '-2%', r: '6deg', s: 0.94, z: 3 },
    ],
  },
  // centre phone forward, two tucked behind
  fan: {
    ratio: '16 / 12.4',
    slots: [
      { x: '10%', y: '12%', r: '-9deg', s: 0.9, z: 1 },
      { x: '34%', y: '2%', r: '0deg', s: 1.02, z: 3 },
      { x: '58%', y: '12%', r: '9deg', s: 0.9, z: 1 },
    ],
  },
  // fanned deck: heavy overlap, each phone a little lower and more upright than the last
  cascade: {
    ratio: '16 / 13.4',
    slots: [
      { x: '3%', y: '0%', r: '-9deg', s: 0.94, z: 1 },
      { x: '33%', y: '7%', r: '-2deg', s: 0.98, z: 2 },
      { x: '63%', y: '14%', r: '5deg', s: 1, z: 3 },
    ],
  },
  // all leaning the same way, overlapping like a row of cards mid-shuffle
  lean: {
    ratio: '16 / 12.6',
    slots: [
      { x: '6%', y: '14%', r: '-12deg', s: 0.96, z: 1 },
      { x: '34%', y: '6%', r: '-12deg', s: 1, z: 2 },
      { x: '62%', y: '-2%', r: '-12deg', s: 0.96, z: 3 },
    ],
  },
}

type Props = {
  screens: [ScreenId, ScreenId, ScreenId]
  variant?: TrioVariant
  sizes?: string
  className?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

export function PhoneTrio({ screens, variant = 'stepped', sizes, className = '' }: Props) {
  const reduce = useReducedMotion()
  const layout = LAYOUTS[variant]
  return (
    <div className={`trio ${className}`} style={{ '--trio-ratio': layout.ratio } as CSSProperties}>
      {screens.map((screen, i) => {
        const s = layout.slots[i] ?? layout.slots[0]!
        const style = { '--x': s.x, '--y': s.y, '--r': s.r, '--s': s.s, '--z': s.z } as CSSProperties
        return (
          <div key={screen} className="slot" style={style}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.05, ease: EASE, delay: 0.08 * (s.z - 1) }}
            >
              <Phone screen={screen} sizes={sizes} />
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
