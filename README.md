# hello paint brand kit

Live at [hellopaint.megan-warren.com](https://hellopaint.megan-warren.com). Public, part of Megan's portfolio: a showcase of what a full brand kit build looks like.

## What's here

- `index.html` — the hub: hero, search, the six-page map.
- `brand-book.html` — the idea, the three marks (Snapshot, Bubble, Smile), the redesign story, color, type, voice, applications, do & don't.
- `asset-library.html` — the whole generator, twelve numbered sections (logos through motion), every tile downloads as an editable SVG or a native PNG. Numbers export a full zip of digits 0 to 9.
- `social-templates.html` — the showcase: twenty social templates (feed posts, pins, stories, tagline posts, video thumb, review card, link-share card) shown in real phone/card frames, with per-item and per-group zip downloads.
- `motion.html` — all fifteen looping brand animations in one gallery; each opens standalone with its own WebM and offline-HTML export buttons.
- `copy-vault.html` — forty pastable copy blocks (bios, the Etsy listing, launch posts, customer message templates, the voice card) plus the asset cheat sheet, every block has its own copy button.
- `js/` — the asset-generator engine (`marks.js`, `data.js`, `icons.js`, `qr.js`, `motions-embed.js`, `app.js`): every asset is defined once as an SVG string and rendered, downloaded, and PNG-rasterized from that same source, so nothing drifts.
- `motion/` — the 15 standalone motion demo pages plus `export.js` (WebM capture + offline HTML export).
- `fonts/` — Fraunces and Nunito Sans, self-hosted as woff2 (OFL licensed), so the whole kit works fully offline with zero CDN dependency.
- `_kit/` — the shared rail, search, and toast chrome injected on every page.

## Architecture note

This kit was rebuilt from what had been called "V7," the real interactive asset-generator source, after the previously published version turned out to be a flattened static extraction (real motion demoted to still frames, no font-embedded PNG export, and some internal engineering-tracking files that had leaked into the public folder). The generator engine itself was kept byte-faithful to that source; what changed:

- The font-embedding PNG export now reads the kit's own local `/fonts/fonts.css` instead of live-fetching Google Fonts, so it works with no network at all.
- The placeholder five-star review card no longer carries a fabricated customer name; it is labeled as a template to fill in.
- All fifteen motion demo pages point at the local fonts too, for the same offline reason.
- A shared rail + search + toast layer (`_kit/`) ties every page together with one numbered map.

The 6-day launch checklist, the Etsy SEO playbook, and the engine's internal production-desk / design-handoff material are **not** in this repo on purpose. Those are Megan's own operating documents for running the shop and fixing the separate photo-to-kit product, not brand-kit content, and they live in their own folder instead (see the canonical iCloud copy's sibling `hello-paint-production-and-launch/` folder).

## Deploy

`.github/workflows/deploy.yml` pushes to Cloudflare Pages (project `hello-paint-brand-kit-warren`) on every push to `main`. Needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets; see `~/Documents/megan-warren-com/README.md` for the one-time setup script. This site stays **public** (no password gate), since it doubles as a portfolio piece.

## Self-test

Open the browser console on any page with asset cards and run:

```js
await window.HPKit.runSelfTest()
```

This re-exports a sample of every registered asset as SVG and PNG and checks real byte signatures (`<svg`, PNG magic bytes), not just that a click happened.
