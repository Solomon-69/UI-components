// Builds the hero image from the photographic mockup in screens-src/.
//
// The mockup ships flattened: the screen is a painted checkerboard and the phone sits on
// an opaque grey backdrop. So the Today capture is perspective-mapped onto the screen's
// own four corners, masked to the screen's exact rounded shape, and the phone is lifted
// off its backdrop so it can sit on the site's warm background.
//
//   npm run hero
import sharp from 'sharp'
import path from 'node:path'
import { findScreenQuad, matteFromBackdrop, readRGBA, warpOntoQuad } from './lib/mockup.mjs'

const SRC = path.resolve('screens-src')
const MOCKUP = path.join(SRC, 'mock-soft-studio-light.png')
const CAPTURE = path.join(SRC, 'today-home-hero.jpg')
const OUT = path.resolve('public/hero-phone.webp')
const OUT_WIDTH = 1500

const mockup = await readRGBA(MOCKUP)
const { quad, mask, w, h } = findScreenQuad(mockup)
console.log('screen corners', quad.map((p) => p.join(',')).join('  '))

const [matted, warped] = await Promise.all([
  matteFromBackdrop(MOCKUP),
  warpOntoQuad(CAPTURE, quad, w, h),
])

// Clip the warped capture to the screen's real outline, so the bezel and the Dynamic
// Island stay the mockup's own.
const screen = await sharp(warped)
  .composite([{ input: mask, raw: { width: w, height: h, channels: 4 }, blend: 'dest-in' }])
  .png()
  .toBuffer()

// Two passes: sharp trims before it composites, so the trim has to follow in its own call.
const composed = await sharp(matted).composite([{ input: screen, left: 0, top: 0 }]).png().toBuffer()

await sharp(composed)
  .trim({ threshold: 1 })
  .resize({ width: OUT_WIDTH })
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(OUT)

const out = await sharp(OUT).metadata()
console.log(`hero ${out.width}x${out.height}`)
