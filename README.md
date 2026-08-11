# UI Component Library

A personal collection of 80+ animated React UI components used for building premium websites. Includes text effects, animated backgrounds, interactive UI blocks, and KokonutUI components.

**[View the interactive showcase](showcase.html)** — open it in a browser to see live previews of every component.

---

## Components

### Text Effects (17)

| Component | Description |
|---|---|
| `BlurText` | Blur entrance animation by word or character on scroll |
| `CountUp` | Animates numbers from zero up to a target value |
| `DecryptedText` | Matrix-style character decode on reveal |
| `FuzzyText` | Depth-of-field fuzzy blur animation |
| `GlitchText` | RGB channel split glitch effect |
| `GradientText` | Smooth animated multi-color gradient across text |
| `MaskedHeading` | Scroll-linked text mask reveal |
| `RotatingText` | Rotates between multiple word strings |
| `ScrambledText` | Scrambles characters then resolves on hover |
| `ScrollReveal` | Animates text as it enters the viewport |
| `ScrollVelocity` | Text parallax tied to scroll velocity |
| `ShinyText` | Metallic light sweep shimmer |
| `SplitFlapText` | Mechanical split-flap departure board effect |
| `SplitText` | Splits text into chars or words for stagger entry |
| `TextLoop` | Loops through multiple words with transitions |
| `TextType` | Typewriter with configurable speed and cursor |
| `TrueFocus` | Depth-of-field focus animation per word |

### Backgrounds (9)

| Component | Description |
|---|---|
| `Aurora` | Multi-color aurora borealis gradient animation |
| `Beams` | Animated vertical light beam rays |
| `DotGrid` | Animated interactive dot grid |
| `GridMotion` | Grid that shifts with scroll |
| `Iridescence` | Rainbow iridescent shifting color surface |
| `Noise` | Film grain noise texture overlay |
| `Particles` | Floating animated particle field |
| `Silk` | Smooth silky fluid flowing gradient |
| `Waves` | Animated SVG wave layers |

### UI Blocks (20)

| Component | Description |
|---|---|
| `AnimatedContent` | Wrapper that animates children on mount |
| `AnimatedList` | Staggered list with spring enter and exit |
| `BorderGlow` | Glowing animated border around any container |
| `BounceCards` | Cards with spring physics bounce on hover |
| `Carousel` | Drag-to-scroll carousel with snap |
| `ElasticSlider` | Stretchy elastic range slider |
| `FadeContent` | Fades and slides content in on scroll |
| `GlareHover` | Light glare that follows cursor inside card |
| `GlassSurface` | Frosted glass morphism container |
| `LogoLoop` | Infinite horizontal scrolling logo marquee |
| `MagicBento` | Bento grid with mouse-tracking glow |
| `Masonry` | Variable-height masonry grid layout |
| `ProfileCard` | Animated profile card with 3D tilt |
| `ScrollFloat` | Elements float and shift position on scroll |
| `ScrollStack` | Cards that pin and stack as you scroll |
| `SpotlightCard` | Spotlight cursor effect inside a card |
| `Stack` | Stacked card deck that fans out on hover |
| `StarBorder` | Star particles orbit along the border |
| `Stepper` | Animated step-by-step progress indicator |
| `TiltedCard` | 3D perspective tilt tracking mouse position |

### KokonutUI (34)

All KokonutUI components live in `components/kokonutui/`.

**Buttons** - attract-button, gradient-button, particle-button, slide-text-button, hold-button, social-button

**Text** - dynamic-text, glitch-text, matrix-text, scroll-text, shimmer-text, sliced-text, swoosh-text, type-writer

**Cards** - bento-grid, card-flip, card-stack, carousel-cards, liquid-glass-card, mouse-effect-card, spotlight-cards, tweet-card

**Backgrounds** - background-paths, beams-background, flow-field, shape-hero

**Navigation & UI** - action-search-bar, morphic-navbar, profile-dropdown, smooth-drawer, smooth-tab, toolbar, loader, file-upload

---

## Usage

Components are built with React. Copy the file from the relevant folder into your project.

```bash
# Main components
components/BlurText/BlurText.jsx
components/Aurora/Aurora.jsx
# ... etc

# KokonutUI components
components/kokonutui/attract-button.tsx
components/kokonutui/bento-grid.tsx
# ... etc
```

Most components depend on `motion/react` (Framer Motion). Install it if your project doesn't have it:

```bash
npm install motion
```

Some components use `anime.js`. The library is bundled at `components/anime.esm.min.js` and can be imported directly:

```js
import anime from '../components/anime.esm.min.js'
```

---

## Tech Stack

- **React** with JSX/TSX components
- **motion/react** for animations and transitions
- **anime.js** for timeline-based animations
- No build configuration required - components are copy-paste ready
