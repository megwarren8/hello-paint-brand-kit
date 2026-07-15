# hello paint brand kit

Live at [hellopaint.megan-warren.com](https://hellopaint.megan-warren.com). Public, part of Megan's portfolio: a showcase of what a full brand kit build looks like.

## What's here

- `index.html`: the hub: hero, a "find hello paint everywhere" contact strip (the website, the Etsy shop, and the one handle used on every platform), search, and the grouped, numbered map.
- `brand-book.html`: the idea, the three marks (Snapshot, Bubble, Smile), the redesign story, colour, type, voice, applications, do & don't.
- `asset-library.html`: the whole generator, twelve numbered sections in three real groups (A. brand marks, B. marketing & print, C. utility & motion), every tile downloads as an editable SVG or a native PNG. Numbers export a full zip of digits 0 to 9. Section 11 ("contact & handles") is the single canonical record of the website, Etsy shop, and the one handle (@hellopaintart) used across every platform; it used to be labeled "QR & email signature" and never stated the identity itself, which is why the same handles kept drifting or going missing elsewhere in the kit.
- `social-templates.html`: the showcase: twenty social templates (feed posts, pins, stories, tagline posts, video thumb, review card, link-share card) shown in real phone/card frames, with per-item and per-group zip downloads.
- `motion.html`: all fifteen looping brand animations in one gallery; each opens standalone with its own WebM and offline-HTML export buttons.
- `copy-vault.html`: forty pastable copy blocks (bios, the Etsy listing, launch posts, customer message templates, the voice card) plus the asset cheat sheet, every block has its own copy button.
- `js/`: the asset-generator engine (`marks.js`, `data.js`, `icons.js`, `qr.js`, `motions-embed.js`, `app.js`): every asset is defined once as an SVG string and rendered, downloaded, and PNG-rasterized from that same source, so nothing drifts.
- `motion/`: the 15 standalone motion demo pages plus `export.js` (WebM capture + offline HTML export).
- `fonts/`: Fraunces and Nunito Sans, self-hosted as woff2 (OFL licensed), so the whole kit works fully offline with zero CDN dependency.
- `_kit/`: the shared rail, search, and toast chrome injected on every page.

## Architecture note

This kit was rebuilt from what had been called "V7," the real interactive asset-generator source, after the previously published version turned out to be a flattened static extraction (real motion demoted to still frames, no font-embedded PNG export, and some internal engineering-tracking files that had leaked into the public folder). The generator engine itself was kept byte-faithful to that source; what changed:

- The font-embedding PNG export now reads the kit's own local `/fonts/fonts.css` instead of live-fetching Google Fonts, so it works with no network at all.
- The placeholder five-star review card no longer carries a fabricated customer name; it is labeled as a template to fill in.
- All fifteen motion demo pages point at the local fonts too, for the same offline reason.
- A shared rail + search + toast layer (`_kit/`) ties every page together with one numbered map.

The 6-day launch checklist, the Etsy SEO playbook, and the engine's internal production-desk / design-handoff material are **not** in this repo on purpose. Those are Megan's own operating documents for running the shop and fixing the separate photo-to-kit product, not brand-kit content, and they live in their own folder instead (see the canonical iCloud copy's sibling `hello-paint-production-and-launch/` folder).

## 2026-07-15 reorganization

The kit had grown by bolt-on (each new asset type or page added to whatever was already there) until the structure looked organized, numbered sections, a persistent rail, a search box, but wasn't: two rail items (`social-templates.html`, `motion.html`) were flat top-level peers even though they're really just alternate views of the asset library's own sections 05 and 12, and the business's actual social handles were never stated as a canonical record anywhere on the live site (they were scattered across bios, an email-signature card, and a private design-handoff doc that isn't part of the kit at all). Fixed without deleting any content:

- Section 11 was renamed from "QR & email signature" to "Contact & handles" and now leads with the canonical identity table (website, Etsy shop, and the one `@hellopaintart` handle used across Instagram/X/Threads/TikTok/YouTube), each with its own copy button, before the existing QR and email-signature generators.
- The rail nav (`_kit/kit-chrome.js`) now groups the 12 sections into three real clusters (A. brand marks, B. marketing & print, C. utility & motion) and nests `social-templates.html` / `motion.html` as sub-links under their real sections instead of flat peers.
- `index.html` leads with a "find hello paint everywhere" strip so the identity record is the first thing on the hub, not something to go hunting for.
- `copy-vault.html`'s email-signature entry and asset cheat sheet now point back to section 11 as the source of truth instead of restating handles independently.

## Deploy

`.github/workflows/deploy.yml` pushes to Cloudflare Pages (project `hello-paint-brand-kit-warren`) on every push to `main`. Needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets; see `~/Documents/megan-warren-com/README.md` for the one-time setup script. This site stays **public** (no password gate), since it doubles as a portfolio piece.

## Self-test

Open the browser console on any page with asset cards and run:

```js
await window.HPKit.runSelfTest()
```

This re-exports a sample of every registered asset as SVG and PNG and checks real byte signatures (`<svg`, PNG magic bytes), not just that a click happened.
