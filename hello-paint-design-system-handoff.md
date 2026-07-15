# Hello Paint: Design System Setup for Claude Design

Source: live brand kit at hellopaint.megan-warren.com (brand-book.html and asset-library.html), cross-checked against the verified 2026-07-12/07-13 business-identity update. Hand this whole file to Claude Design since it can't reach the site directly.

## 1. Brand identity

**Name:** hello paint (always lowercase in running copy, wordmark is one word, one space: "hello paint")

**What it is:** Turns a customer's photo into a custom paint-by-number kit they print and paint at home.

**Personality:** A cozy cool girl. Warm, cheery, friendly to all ages, unmistakably made by a person. Flat, hand-painted look, never techy or arcade.

**One-line brand idea:** "A photo goes in, a paintable kit comes out. The brand should feel like a warm friend who hands you the fun part."

**Real business identity (confirmed 2026-07-12/13):**
- Website: hellopaintart.com
- Instagram, X, Threads, TikTok, YouTube: `@hellopaintart` (identical handle on all five)
- Etsy shop: hellopaintart
- Founder: Megan Warren ("founder & chief painter")
- Note: `hellopaint.megan-warren.com` is a separate domain, just the kit's own hosting for this brand-book/asset site. Don't confuse it with the live storefront.
- This identity block is now also the live kit's own canonical record: `asset-library.html`, section 11, "Contact & handles" (`hellopaint.megan-warren.com/asset-library.html#contact`). Update it there first if anything changes, then this file second.

## 2. Color palette

All values are exact hex from the live brand book. No orange or terracotta, ever, this is a deliberate, load-bearing rule (keeps the brand reading as human-made, not AI/techy).

| Name | Hex | Role |
|---|---|---|
| Raspberry | #E64C81 | Primary, the "hello" |
| Teal | #15A39A | Eye-catching contrast |
| Sunshine | #F6C744 | Accent, the spark |
| Leaf | #5BA86B | Scene greens |
| Sky | #BFE6F2 | Scene blues, dab on dark |
| Plum ink | #312B3D | Text, outlines, the "paint" |
| Cream | #FBF4E8 | Page background, warm paper |
| Off-white | #FFFDF8 | Cards and surfaces |
| Blush | #FBD0DD | Soft tint, use sparingly |

**Tints and shades** (light to deep) for backgrounds, states, and accessible text:

| Family | Tint | Mid-light | Base | Deep (for text) |
|---|---|---|---|---|
| Raspberry | #FBE0EA | #F08CAE | #E64C81 | #B83A66 |
| Teal | #D6EFEC | #6CC4BC | #15A39A | #0F756D |
| Leaf | #DCEDE0 | #94C79F | #5BA86B | #3F7E4F |

**Usage balance (rough target):** cream 50%, plum ink 20%, raspberry 12%, teal 8%, sunshine 5%, leaf 5%. Lead with the neutrals so the brights stay loud.

**Contrast rules (WCAG, already verified):**

| Text on background | Ratio | Use |
|---|---|---|
| Plum ink on cream | 12.44 | Body copy |
| Cream on plum ink | 12.44 | Reversed body copy |
| Sky on plum ink | 10.25 | On dark |
| Deep teal (#0F756D) on cream | 5.07 | Links, teal text |
| Deep raspberry (#B83A66) on cream | 5.01 | Raspberry text |
| Bright raspberry (#E64C81) on cream | 3.36 | Large text/headlines only, never body |

Bright raspberry and bright teal are for headlines, shapes, and the logo only, never paragraph text. For berry or teal running text, use the deep variants above.

## 3. Typography

**Fraunces** (headings): optical serif, weight 600 for headings, 500 italic for taglines/editorial. Warm and editorial. One headline per view; never set long body copy in it. Free on Google Fonts.

**Nunito Sans** (body and wordmark): friendly sans. Weights 400/700 for body text, 800 for the wordmark and kit numbers. Free on Google Fonts.

**Type scale (from the live book):**

| Role | Size | Example |
|---|---|---|
| Display / H1 | 40px | "paint your photo" |
| Section / H2 | 28px | "your worst pet photo, welcome" |
| Subhead / H3 | 22px | "no drawing needed, ever" |
| Body | 17px | "Send a photo and we turn it into a numbered kit you paint at home." |
| Caption | 14px | "printed on warm matte stock with a light-gray outline" |

Wordmark is always lowercase, one word, one space ("hello paint"), set in Nunito Sans 800.

## 4. Logo family

Three marks plus a wordmark, each used by role:

1. **Main logo, "before & after" (snapshot mark):** half photo, half numbered paint-by-number kit. Explains the product on its own. Reading order runs 1, 2, 3 (sun on the right in both halves so the photo half and numbered half line up; sky=1, sun=2, hill=3).
2. **Profile avatar, "hello bubble":** a speech-bubble-style hello full of paint. Used as the round photo/profile mark on every platform.
3. **Sticker and stamp, "the smile":** one raspberry curve for a smile, a teal streak of motion, a sunshine wink. Single-color friendly sign-off mark. (This replaced an earlier waving-hand mark that read as busy/stiff at small sizes; the redesign rationale is worth keeping if Claude Design asks "why a smile.")

**Lockups (wordmark pairings):**
- Primary horizontal lockup: snapshot mark + Nunito Sans 800 wordmark
- Signature lockup: smile mark + Fraunces italic wordmark, for a softer/editorial voice
- Stacked and reversed variants also exist (reversed on plum ink: outlines flip to cream, the bubble's fifth paint dab becomes sky so it stays bright; both survive a circle crop)

**Clear space:** equal to the height of the lowercase "h" in the wordmark, on every side. Never crowd with text or edges.

**Minimum size:** holds at 16px (flat vector, one ink, legible at favicon size). Full lockup: at least 120px wide on screen, 25mm in print.

## 5. Voice and tone

**In one line:** cozy cool girl. Plain over clever. Invite, don't instruct.

- Talk the way you'd hype a friend.
- Lead with the before and after (show the transformation, not the process).
- Ask for the worst pet photo, it's a running bit in the brand's voice.
- Keep the handle lowercase.
- Standalone pronoun "I" is capitalized as an exception to the all-lowercase rule (autocorrect can't be fought otherwise); everything else stays lowercase.

**Taglines (real, in rotation):**
- hi! send a photo, get a paint-by-number kit
- your photo, painted by you
- turn your photo into a painting you can make
- no drawing needed, ever

**Words to avoid:** AI-generated, algorithm, data, pixel, render, processing, Title Case, orange.

## 6. Do and don't

**Do:**
- Keep "hello" raspberry and "paint" plum ink.
- Lead layouts with cream so the brights pop.
- Use the one-color smile for stickers and labels.
- Pair the snapshot logo with a real before-and-after photo.
- Give every mark its clear space.

**Don't:**
- Add orange or terracotta anywhere.
- Capitalize or close up the wordmark.
- Add gradients, shadows, or arcade styling.
- Set body text in bright raspberry or teal.
- Stretch, rotate, or recolor the marks.

## 7. What assets already exist (for reference, not included in this file)

The live kit has 140 downloadable assets across 12 numbered sections, each as editable SVG plus native-size PNG. Since Claude Design can't reach the site, these need to be manually downloaded from hellopaint.megan-warren.com/asset-library.html and uploaded wherever Claude Design needs source files:

1. Logos & lockups (horizontal, reversed, signature, stacked, wordmark-only, plus the 4 marks)
2. App & favicons (app icon, apple-touch, maskable, favicon variants)
3. Profile pictures (hello bubble on 8 brand-color backgrounds, plus 2 smile variants)
4. Social & email covers (X, Facebook, YouTube, Etsy shop banner, email header, each in default and reversed)
5. Social templates (20: feed/pin posts, video thumbnail, review card, link-share OG card, 7 Instagram stories, 7 tagline posts)
6. Die-cut stickers (7: smile, bubble, palette, snapshot, dab, number, wordmark)
7. Print & packaging (business card front/back, letterhead, kit-box label, thank-you card, sticker sheet)
8. Number sets (digits 0 to 9 in each of 7 brand colors)
9. Watermarks (corner, center, tiled)
10. Icons & symbols (60 line icons in plum ink with brand-dab accents)
11. Contact & handles (the canonical identity record: website, Etsy shop, the one social handle) plus the editable, live-generated QR code and email signature
12. Brand motion (15 looping animated reveals, exportable as WebM or standalone HTML)

If Claude Design needs actual logo files rather than just the color/type tokens above, download the SVGs for the primary horizontal lockup, the reversed lockup, and the 3 individual marks (snapshot, bubble, smile) from section 01, that covers the core set most design systems need first.
