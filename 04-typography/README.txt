HELLO PAINT - TYPOGRAPHY
========================
Two fonts, no more. Both are free and open-source (SIL Open Font License 1.1).


THE FONTS
---------
  Fraunces      Headings. Optical serif, weight 600. Warm and editorial.
                One headline per view.
  Nunito Sans   Body and the wordmark. Friendly sans. Weights 400 and 700 for
                text, 800 for the wordmark and kit numbers.

The wordmark stays lowercase with a single space: "hello" in raspberry,
"paint" in plum ink. Sentence case everywhere, never Title Case or all caps.


TYPE SCALE (from the brand book)
--------------------------------
  Role          Size (px)
  Display, h1          40
  Section, h2          28
  Subhead, h3          22
  Body                 17
  Caption              14


WHAT IS IN THIS FOLDER
----------------------
  Fraunces/           Web font files (woff2), split by character subset:
                      latin, latin-ext, vietnamese (italic and normal cuts).
  Nunito-Sans/        Web font files (woff2), split by subset:
                      latin, latin-ext, cyrillic, cyrillic-ext, vietnamese.
  fonts.css           Wires the subsets into @font-face rules. Drop this in a
                      web project to use the brand fonts, fully offline.
  OFL-Fraunces.txt    Fraunces license.
  OFL-NunitoSans.txt  Nunito Sans license.
  README.txt          This note.


HOW TO USE
----------
  In a web project   Copy this folder in and link fonts.css, or paste its
                     @font-face rules into your stylesheet. No internet needed.
  In design tools    Install Fraunces and Nunito Sans (free on Google Fonts),
                     or open files in a tool that already has them, so live text
                     renders in the brand fonts instead of a fallback.
  In the brand book  01-brand-book.html already has these fonts embedded as
                     base64, so it looks identical offline. You do not need to
                     install anything to view it.


KEY (how this file is written)
------------------------------
  UPPERCASE HEADINGS   Section breaks.
  Indented rows        Exact values: font names, sizes, file names.
  Hyphen "-"           Used in place of a dash on purpose, so it never reads
                       as a minus sign.


GLOSSARY
--------
  woff2     A compressed web font file format. Small and fast in browsers.
  @font-face A CSS rule that tells a browser where to find a font file.
  Subset    A font file trimmed to a set of characters (e.g. just Latin) to
            keep the file small.
  Base64    A way to write a file as text so it can be embedded directly inside
            an HTML or CSS file, with no separate download.
  OFL       SIL Open Font License, the open-source license these fonts use.
            Free to use, embed, and bundle; just do not sell the fonts alone.
