# Luna Shift marketing site

Single-page marketing site for Luna Shift, a private, local-first iOS app for tracking perimenopause symptoms.

## Run it

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

## Before launch

Edit `src/site.ts`:

- `ctaHref`: the public TestFlight link (or the App Store link once live)
- `contactEmail`: the real support address
- `privacyHref`: link to the published privacy policy page (currently points at the on-page privacy section)

## Where things live

- `src/index.css`: brand tokens (light + dark), generated background, CSS phone frame, phone-trio arrangements
- `src/sections/`: Hero, Features (the four phone groups), Privacy, Closing (final CTA + footer)
- `src/three/HeroScene.tsx`: the rotating 3D iPhone (react-three-fiber)
- `src/lib/screens.ts`: the list of app screenshots and their alt text
- `public/screens/`: optimised WebP captures (regenerate with `node scripts/optimize-images.mjs "<folder of PNG captures>"`)
- `public/models/iphone.glb`: Draco-compressed phone model extracted from the supplied OBJ (`model-src/` keeps the intermediate files)
- `public/hero-phone-front.webp` (0deg, shown while the 3D scene loads) and `public/hero-phone-static.webp` (+18deg, shown when WebGL is unavailable or the visitor prefers reduced motion). Regenerate by opening `/?capture=front` or `/?capture=angle` in dev, running `document.querySelector('.hero-stage canvas').toDataURL('image/png')` and converting the result to WebP at 1120px wide.
- `public/hdr/studio.hdr`: studio lighting for the 3D phone (Poly Haven, CC0).
- `scripts/render-icon.mjs`: renders the site icon from the app's Icon Composer layers on the SSD project.

## Deploy

`npm run build` produces a fully static site in `dist/`. Upload that folder to any static host (Hostinger, Netlify, Vercel, Cloudflare Pages). No server or environment variables are needed.
