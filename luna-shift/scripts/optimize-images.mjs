// Converts the raw 1206x2622 iPhone captures into web-ready WebP at two widths,
// plus a dedicated texture for the 3D hero phone. A true-to-size Dynamic Island
// is baked into every capture so frames (CSS and 3D) do not need to fake one.
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = process.argv[2] ?? '/Users/solomond/Desktop/Stuff 3/Luna Shift screenshots (Demo app)'
const OUT = path.resolve('public/screens')
await mkdir(OUT, { recursive: true })

// iPhone 16/17 Pro: 402x874pt at 3x. Island is about 125x37pt, 11pt from the top.
const ISLAND = Buffer.from(
  `<svg width="1206" height="2622" xmlns="http://www.w3.org/2000/svg"><rect x="415" y="33" width="376" height="112" rx="56" fill="#0a0807"/></svg>`,
)
const withIsland = (file) => sharp(file).composite([{ input: ISLAND, top: 0, left: 0 }])

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f))
for (const f of files) {
  const base = f.replace(/\.(png|jpe?g)$/i, '')
  const src = path.join(SRC, f)
  const full = await withIsland(src).png().toBuffer()
  await sharp(full).resize({ width: 520 }).webp({ quality: 82 }).toFile(path.join(OUT, `${base}-520.webp`))
  await sharp(full).resize({ width: 900 }).webp({ quality: 82 }).toFile(path.join(OUT, `${base}-900.webp`))
  console.log('ok', base)
}
// Hero texture: 1206 wide keeps text crisp on the 3D screen at DPR 2.
const heroName = files.find((f) => f.startsWith('today-home-hero'))
// The 3D model has its own Dynamic Island mesh, so the hero texture stays clean.
await sharp(path.join(SRC, heroName)).webp({ quality: 90 }).toFile(path.join(OUT, 'hero-texture.webp'))
console.log('texture ok')
