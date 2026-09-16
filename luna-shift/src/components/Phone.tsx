import { screenAlt, screenSrc, type ScreenId } from '../lib/screens'

type Props = {
  screen: ScreenId
  sizes?: string
  priority?: boolean
  className?: string
}

/** CSS iPhone frame around a real full-screen capture. */
export function Phone({ screen, sizes = '(min-width: 1280px) 335px, (min-width: 768px) 26vw, 62vw', priority, className = '' }: Props) {
  return (
    <figure className={`phone ${className}`}>
      <div className="screen">
        <img
          src={screenSrc(screen, 900)}
          srcSet={`${screenSrc(screen, 520)} 520w, ${screenSrc(screen, 900)} 900w`}
          sizes={sizes}
          width={1206}
          height={2622}
          alt={screenAlt[screen]}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      </div>
    </figure>
  )
}
