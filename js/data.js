/* hello paint · asset definitions
   Every asset is a standalone <svg> string built from HP marks, so the page
   can render it AND hand the exact same vector to the SVG/PNG download.       */
(function (root) {
  var HP = root.HP || (root.HP = {});
  var C = HP.C, NS = HP.NS, FR = HP.FR;
  var INK = C.ink, PAPER = C.paper, CARD = C.card, MUTED = C.muted,
      BERRY = C.berry, TEAL = C.teal, SUN = C.sun, LEAF = C.leaf, SKY = C.sky,
      DEEPBERRY = C.deepberry, LINE = C.line;
  var DROP = '#D9B79A', DROPTXT = '#b89a7e';

  // a simple upload glyph (circle + up-arrow) so a drop zone reads as
  // clickable/droppable at a glance, not just a dashed box with tiny type.
  function dropIcon(cx, cy, r, col) {
    col = col || DROP;
    var sw = (r * 0.13).toFixed(1);
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '"/>' +
      '<path d="M' + cx + ' ' + (cy + r * 0.4).toFixed(1) + ' L' + cx + ' ' + (cy - r * 0.42).toFixed(1) +
      ' M' + (cx - r * 0.34).toFixed(1) + ' ' + (cy - r * 0.1).toFixed(1) + ' L' + cx + ' ' + (cy - r * 0.42).toFixed(1) +
      ' L' + (cx + r * 0.34).toFixed(1) + ' ' + (cy - r * 0.1).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tag(x, y, s, fill, txt, anchor) {
    return '<text x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') +
      ' font-family="' + FR + '" font-style="italic" font-weight="500" font-size="' + s +
      '" fill="' + fill + '">' + esc(txt) + '</text>';
  }

  /* ---------- HEADERS: one clean, centred stacked lockup ----------------- */
  function header(w, h, o) {
    o = o || {};
    var dark = o.dark, cx = w / 2;
    var iconK = o.iconK, ws = o.ws, ts = o.ts, dotR = o.dotR || 12;
    var gA = o.gA != null ? o.gA : 34, gB = o.gB != null ? o.gB : 16, gC = o.gC != null ? o.gC : 34;
    var iconH = 100 * iconK, wordH = ws * 0.74, tagH = o.tagline ? ts : 0, dotsH = dotR * 2;
    var blockH = iconH + gA + wordH + (o.tagline ? gB + tagH : 0) + gC + dotsH;
    var top = (h - blockH) / 2 + (o.shiftY || 0);
    var inner = '<rect width="' + w + '" height="' + h + '" fill="' + (dark ? INK : PAPER) + '"/>';
    inner += HP.confetti(w, h, o.confN || Math.max(18, Math.round(w * h / 42000)), o.confOp != null ? o.confOp : 0.15, o.seed || 5);
    inner += '<g transform="translate(' + (cx - 50 * iconK) + ' ' + top + ') scale(' + iconK + ')">' + HP.snapshot(dark ? PAPER : INK) + '</g>';
    var wy = top + iconH + gA + wordH;
    inner += HP.wordmark({ x: cx, y: wy, size: ws, anchor: 'middle', paint: o.paint || (dark ? PAPER : INK) });
    var lastY = wy;
    if (o.tagline) { lastY = wy + gB + tagH; inner += tag(cx, lastY, ts, o.tagCol || (dark ? SUN : MUTED), o.tagline, 'middle'); }
    var dy = lastY + gC + dotR, gap = dotR * 3.4;
    inner += HP.dots(cx - 1.5 * gap, dy, dotR, gap);
    return HP.svg(w, h, inner);
  }

  function appIcon(size, radius, markInner, k, cy, bg) {
    bg = bg || PAPER; cy = cy == null ? 50 : cy;
    var inner = '<rect width="' + size + '" height="' + size + '" rx="' + radius + '" fill="' + bg + '"/>';
    inner += '<g transform="translate(' + (size / 2 - 50 * k) + ' ' + (size / 2 - cy * k) + ') scale(' + k + ')">' + markInner + '</g>';
    return HP.svg(size, size, inner);
  }

  /* ---------- AVATARS ---------------------------------------------------- */
  function avatar(bg, circle, dark) {
    var inner = circle
      ? '<circle cx="540" cy="540" r="540" fill="' + bg + '"/>'
      : '<rect width="1080" height="1080" rx="120" fill="' + bg + '"/>';
    inner += '<g transform="translate(230 250) scale(6.2)">' + HP.bubble('#FFFDF8', INK, dark ? SKY : INK) + '</g>';
    return HP.svg(1080, 1080, inner);
  }

  // smile profile pic: the smile mark centred on a brand background.
  // dark bg gets the cream mouth + sun spark treatment so it reads on ink.
  function smileAvatar(bg, dark) {
    var inner = '<rect width="1080" height="1080" rx="120" fill="' + bg + '"/>';
    var sm = dark ? HP.smile({ mouth: '#FFFDF8', eye: SKY, spark: SUN }) : HP.smile({});
    inner += '<g transform="translate(194 286) scale(6.4)">' + sm + '</g>';
    return HP.svg(1080, 1080, inner);
  }

  /* ---------- TAGLINE CARDS (1080) --------------------------------------- */
  function taglineCard(bg, lines, o) {
    o = o || {};
    var dark = o.dark, cx = 540, txt = dark ? '#FFFFFF' : INK, accent = dark ? '#FFFFFF' : BERRY;
    var inner = '<rect width="1080" height="1080" fill="' + bg + '"/>';
    inner += HP.confetti(1080, 1080, 24, dark ? 0.12 : 0.14, o.seed || 9);
    var startY = 540 - (lines.length - 1) * 60, size = o.size || 104;
    lines.forEach(function (ln, i) {
      var col = ln.accent ? accent : txt;
      inner += '<text x="' + cx + '" y="' + (startY + i * (size + 14)) + '" text-anchor="middle" font-family="' + FR +
        '" font-weight="600" font-size="' + size + '" letter-spacing="-2.5" fill="' + col + '">' + ln.t + '</text>';
    });
    // smile mark above wordmark
    inner += '<g transform="translate(496 760) scale(0.9)">' + HP.smile(dark ? { mouth: '#FFFFFF', eye: '#FFFFFF', spark: SUN } : {}) + '</g>';
    inner += HP.wordmark({ x: cx, y: 990, size: 56, anchor: 'middle', paint: dark ? '#FFFFFF' : INK, hello: (bg === BERRY) ? '#FFFFFF' : BERRY });
    return HP.svg(1080, 1080, inner);
  }

  /* ---------- DIE-CUT STICKERS ------------------------------------------ */
  // transparent bg, white sticker base + dashed cut contour + mark
  function dieCut(shape, markInner, o) {
    o = o || {};
    var W = o.w || 620, H = o.h || 620, k = o.k || 4.4, mx = o.mx || 0, my = o.my || 0;
    var cutCol = o.cutCol || BERRY, base = o.base || '#FFFDF8';
    var inner = '';
    if (shape === 'circle') {
      var r = o.r || 260, cx = W / 2, cy = H / 2;
      inner += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 14) + '" fill="none" stroke="' + cutCol + '" stroke-width="3" stroke-dasharray="9 9"/>';
      inner += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + base + '"/>';
    } else if (shape === 'pill') {
      inner += '<rect x="20" y="' + (H / 2 - 130) + '" width="' + (W - 40) + '" height="260" rx="130" fill="none" stroke="' + cutCol + '" stroke-width="3" stroke-dasharray="9 9"/>';
      inner += '<rect x="34" y="' + (H / 2 - 116) + '" width="' + (W - 68) + '" height="232" rx="116" fill="' + base + '"/>';
    } else { // roundrect
      var pad = o.pad || 46, rr = o.rr || 70;
      inner += '<rect x="' + (pad - 14) + '" y="' + (pad - 14) + '" width="' + (W - 2 * pad + 28) + '" height="' + (H - 2 * pad + 28) + '" rx="' + (rr + 12) + '" fill="none" stroke="' + cutCol + '" stroke-width="3" stroke-dasharray="9 9"/>';
      inner += '<rect x="' + pad + '" y="' + pad + '" width="' + (W - 2 * pad) + '" height="' + (H - 2 * pad) + '" rx="' + rr + '" fill="' + base + '"/>';
    }
    inner += '<g transform="translate(' + (W / 2 - 50 * k + mx) + ' ' + (H / 2 - 50 * k + my) + ') scale(' + k + ')">' + markInner + '</g>';
    return HP.svg(W, H, inner, 'class="diecut"');
  }

  /* ---------- colour set used everywhere -------------------------------- */
  // dark = needs light foreground
  var COLORS = [
    { id: 'tan', label: 'tan', bg: PAPER, dark: false },
    { id: 'berry', label: 'berry', bg: BERRY, dark: true },
    { id: 'ink', label: 'ink', bg: INK, dark: true },
    { id: 'yellow', label: 'yellow', bg: SUN, dark: false },
    { id: 'green', label: 'green', bg: LEAF, dark: true },
    { id: 'sky', label: 'light blue', bg: SKY, dark: false },
    { id: 'teal', label: 'teal', bg: TEAL, dark: true }
  ];

  var POST_LINES = [
    [{ t: 'your photo,' }, { t: 'painted by you.', accent: true }],
    [{ t: 'no skills.' }, { t: 'just numbers.' }],
    [{ t: 'paint the' }, { t: 'photo you love.' }],
    [{ t: 'every color,' }, { t: 'one studio.', accent: true }],
    [{ t: 'made by you,' }, { t: 'from your photo.' }],
    [{ t: 'turn the page,' }, { t: 'start at one.', accent: true }],
    [{ t: 'the best gift' }, { t: 'is one you make.' }]
  ];
  var STORY_EYEBROWS = [
    'your worst pet photo, welcome',
    'drop your before & after',
    'from photo to painting',
    'every memory, painted',
    'paint night starts here',
    'your photo, by the numbers',
    'the gift they keep forever'
  ];

  /* ---------- Instagram story, one per colour --------------------------- */
  function storyCard(col, eyebrow) {
    var dark = col.dark, cx = 540, fg = dark ? '#FFFFFF' : INK;
    var dropFill = dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF';
    var dropStroke = dark ? 'rgba(255,255,255,0.45)' : DROP;
    var dropTxt = dark ? 'rgba(255,255,255,0.82)' : MUTED;
    var inner = '<rect width="1080" height="1920" fill="' + col.bg + '"/>';
    inner += HP.confetti(1080, 1920, 30, dark ? 0.1 : 0.14, 4);
    var ebCol = (col.id === 'berry' || col.id === 'yellow') ? INK : (dark ? SUN : BERRY);
    inner += tag(cx, 360, 50, ebCol, eyebrow, 'middle');
    inner += '<rect data-dropzone="1" x="140" y="540" width="800" height="800" rx="30" fill="' + dropFill + '" stroke="' + dropStroke + '" stroke-width="3" stroke-dasharray="14 12"/>';
    inner += '<g data-dropzone-label="1">' + dropIcon(540, 892, 42, dropStroke) +
      '<text x="540" y="982" font-family="' + NS + '" font-weight="800" font-size="26" letter-spacing="0.5" fill="' + dropTxt + '" text-anchor="middle">drop before &amp; after</text></g>';
    inner += HP.wordmark({ x: cx, y: 1640, size: 92, anchor: 'middle', paint: dark ? '#FFFFFF' : INK, hello: (col.id === 'berry') ? '#FFFFFF' : BERRY });
    inner += tag(cx, 1710, 34, dark ? SUN : MUTED, 'your photo, painted by you', 'middle');
    inner += HP.dots(cx - 84, 1790, 15, 56, dark ? '#FFFDF8' : INK);
    return HP.svg(1080, 1920, inner);
  }

  /* ---------- contour ("kiss-cut") die-cut around an authored outline ---- */
  // pathD is a silhouette in the 0..100 box; cut line hugs its outer edge.
  function dieCutContour(W, H, pathD, markInner, o) {
    o = o || {};
    var k = o.k || 4.6, my = o.my || 0, cutCol = o.cutCol || BERRY;
    var g = '<g transform="translate(' + (W / 2 - 50 * k + (o.mx || 0)) + ' ' + (H / 2 - 50 * k + my) + ') scale(' + k + ')">';
    g += '<path d="' + pathD + '" fill="none" stroke="' + cutCol + '" stroke-width="11" stroke-dasharray="2.4 2.4" stroke-linejoin="round"/>';
    g += '<path d="' + pathD + '" fill="#FFFDF8" stroke="#FFFDF8" stroke-width="5" stroke-linejoin="round"/>';
    g += markInner + '</g>';
    return HP.svg(W, H, g, 'class="diecut"');
  }
  // bubble silhouette (rounded-rect body + lower-left tail), matches HP.bubble
  var BUBBLE_SIL = 'M32 12 L68 12 Q88 12 88 32 L88 48 Q88 68 68 68 L48 68 L22 88 L38 68 L32 68 Q12 68 12 48 L12 32 Q12 12 32 12 Z';
  var BUBBLE_DOTS = '<circle cx="35" cy="33" r="5.6" fill="#E64C81"/><circle cx="50" cy="30" r="5.6" fill="#15A39A"/><circle cx="65" cy="33" r="5.6" fill="#F6C744"/><circle cx="42" cy="47" r="5.6" fill="#5BA86B"/><circle cx="58" cy="47" r="5.6" fill="#312B3D"/>';
  // palette silhouette (kidney/oval with thumb notch)
  var PALETTE_SIL = 'M50 16 C74 16 90 32 90 52 C90 66 80 74 70 74 C63 74 60 70 54 70 C47 70 44 78 44 84 C30 84 10 70 10 50 C10 30 26 16 50 16 Z';

  /* ---------- number set: 0-9 in one colour ----------------------------- */
  function numberSet(col) {
    var dark = col.dark, txt = dark ? '#FFFDF8' : INK;
    var light = (col.id === 'tan');               // paper needs a ring to read
    var ring = light ? INK : null;
    var r = 44, gap = 96, x0 = 60, W = x0 * 2 + gap * 9, H = 130;
    var inner = '';
    for (var d = 0; d <= 9; d++) inner += HP.digitBadge(d, x0 + d * gap, H / 2, r, col.bg, txt, ring);
    return HP.svg(W, H, inner, 'class="diecut"');
  }

  /* ---------- sticker sheet: one die-cut per colour --------------------- */
  function stickerForColor(col, mark) {
    if (mark === 'bubble') return HP.bubble('#FFFDF8', INK, SKY);
    if (mark === 'dab') return HP.ICONS.find(function (i) { return i.id === 'dab'; }).inner;
    // smile: light bg -> default; dark bg -> white mouth + sun spark, teal wink
    // (teal bg uses a berry wink so the eye still pops)
    if (!col.dark) return HP.smile({});
    var eye = (col.id === 'teal') ? BERRY : TEAL;
    return HP.smile({ mouth: '#FFFDF8', eye: eye, spark: SUN });
  }
  function stickerSheet() {
    var inner = '<rect width="1080" height="1080" fill="' + PAPER + '"/>';
    // tidy 4-over-3 grid + a wordmark pill centred at the foot
    var spots = [
      { c: 0, cx: 180, cy: 290, m: 'smile' },
      { c: 1, cx: 420, cy: 290, m: 'smile' },
      { c: 2, cx: 660, cy: 290, m: 'bubble' },
      { c: 3, cx: 900, cy: 290, m: 'dab' },
      { c: 4, cx: 300, cy: 590, m: 'smile' },
      { c: 5, cx: 540, cy: 590, m: 'bubble' },
      { c: 6, cx: 780, cy: 590, m: 'smile' }
    ];
    var R = 108;
    spots.forEach(function (s) {
      var col = COLORS[s.c];
      inner += '<circle cx="' + s.cx + '" cy="' + s.cy + '" r="' + (R + 11) + '" fill="none" stroke="#D9B79A" stroke-width="2.5" stroke-dasharray="8 8"/>';
      inner += '<circle cx="' + s.cx + '" cy="' + s.cy + '" r="' + R + '" fill="' + col.bg + '"' + (col.id === 'tan' ? ' stroke="' + LINE + '" stroke-width="3"' : '') + '/>';
      var k = 1.66, mk = stickerForColor(col, s.m);
      inner += '<g transform="translate(' + (s.cx - 50 * k) + ' ' + (s.cy - 50 * k) + ') scale(' + k + ')">' + mk + '</g>';
    });
    inner += '<rect x="360" y="850" width="360" height="104" rx="52" fill="' + TEAL + '"/>';
    inner += HP.wordmark({ x: 540, y: 920, size: 40, anchor: 'middle', paint: '#FFFFFF', hello: '#FFFFFF' });
    return HP.svg(1080, 1080, inner);
  }

  /* ====================================================================== */
  /* ---------- additional social templates (v6) -------------------------- */
  // YouTube / video thumbnail: 1280×720, headline + finished-painting drop.
  function youtubeThumb() {
    var inner = '<rect width="1280" height="720" fill="' + PAPER + '"/>' + HP.confetti(1280, 720, 16, 0.12, 3);
    inner += '<rect x="724" y="80" width="476" height="560" rx="30" fill="#FFFFFF" stroke="' + DROP + '" stroke-width="3" stroke-dasharray="13 11"/>';
    inner += '<text x="962" y="366" font-family="' + NS + '" font-weight="800" font-size="18" letter-spacing="2" fill="' + DROPTXT + '" text-anchor="middle">YOUR FINISHED PAINTING</text>';
    inner += '<text x="80" y="244" font-family="' + FR + '" font-weight="600" font-size="80" letter-spacing="-3" fill="' + INK + '">paint your</text>';
    inner += '<text x="80" y="336" font-family="' + FR + '" font-weight="600" font-size="80" letter-spacing="-3" fill="' + BERRY + '">favorite photo.</text>';
    inner += '<circle cx="122" cy="448" r="40" fill="' + BERRY + '"/><path d="M110 428 L110 468 L142 448 Z" fill="#FFFFFF"/>';
    inner += '<text x="182" y="460" font-family="' + NS + '" font-weight="800" font-size="32" fill="' + INK + '">watch the whole process</text>';
    inner += HP.wordmark({ x: 80, y: 656, size: 54 });
    inner += HP.dots(1014, 638, 12, 42);
    return HP.svg(1280, 720, inner);
  }

  // Review card: 1080×1080, five stars + a customer quote (template copy).
  function reviewCard() {
    var starP = 'M50 16 L61 40 L86 43 L67 61 L72 86 L50 73 L28 86 L33 61 L14 43 L39 40 Z';
    var inner = '<rect width="1080" height="1080" fill="' + PAPER + '"/>' + HP.confetti(1080, 1080, 22, 0.12, 12);
    for (var i = 0; i < 5; i++) {
      inner += '<g transform="translate(' + (360 + i * 92) + ' 252) scale(0.62) translate(-50 -50)">' +
        '<path d="' + starP + '" fill="' + SUN + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/></g>';
    }
    inner += '<text x="540" y="494" text-anchor="middle" font-family="' + FR + '" font-style="italic" font-weight="600" font-size="72" letter-spacing="-2" fill="' + INK + '">\u201cI teared up when</text>';
    inner += '<text x="540" y="582" text-anchor="middle" font-family="' + FR + '" font-style="italic" font-weight="600" font-size="72" letter-spacing="-2" fill="' + BERRY + '">I painted the last</text>';
    inner += '<text x="540" y="670" text-anchor="middle" font-family="' + FR + '" font-style="italic" font-weight="600" font-size="72" letter-spacing="-2" fill="' + INK + '">number.\u201d</text>';
    inner += '<text x="540" y="758" text-anchor="middle" font-family="' + NS + '" font-weight="800" font-size="22" letter-spacing="1" fill="' + MUTED + '">TEMPLATE \u00b7 SWAP IN A REAL CUSTOMER QUOTE</text>';
    inner += '<g transform="translate(496 846) scale(0.78)">' + HP.smile() + '</g>';
    inner += HP.wordmark({ x: 540, y: 996, size: 50, anchor: 'middle' });
    return HP.svg(1080, 1080, inner);
  }

  // Link-share / Open-Graph card: 1200×630, headline + before/after drop.
  function ogCard() {
    var inner = '<rect width="1200" height="630" fill="' + PAPER + '"/>' + HP.confetti(1200, 630, 14, 0.12, 6);
    inner += '<rect x="744" y="86" width="386" height="458" rx="26" fill="#FFFFFF" stroke="' + DROP + '" stroke-width="3" stroke-dasharray="12 10"/>';
    inner += dropIcon(937, 288, 30, DROP);
    inner += '<text x="937" y="342" font-family="' + NS + '" font-weight="800" font-size="20" letter-spacing="0.6" fill="' + MUTED + '" text-anchor="middle">your before &amp; after</text>';
    inner += '<g transform="translate(70 94) scale(0.8)">' + HP.smile() + '</g>';
    inner += '<text x="70" y="266" font-family="' + FR + '" font-weight="600" font-size="74" letter-spacing="-2.5" fill="' + INK + '">turn your photo</text>';
    inner += '<text x="70" y="346" font-family="' + FR + '" font-weight="600" font-size="74" letter-spacing="-2.5" fill="' + BERRY + '">into a painting.</text>';
    inner += tag(74, 426, 32, MUTED, 'custom paint-by-number kits from your own photo');
    inner += HP.wordmark({ x: 70, y: 512, size: 48 });
    return HP.svg(1200, 630, inner);
  }

  var lockupHoriz = function (dark) {
    var bg = dark ? INK : PAPER;
    var inner = '<rect width="1200" height="340" fill="' + bg + '"/>';
    inner += '<g transform="translate(44 50) scale(2.4)">' + HP.snapshot(dark ? PAPER : INK) + '</g>';
    inner += HP.wordmark({ x: 320, y: 205, size: 150, paint: dark ? TEAL : INK });
    inner += tag(324, 250, 30, dark ? '#FFFDF8' : MUTED, 'your photo, painted by you');
    return HP.svg(1200, 340, inner);
  };

  var SECTIONS = [
    {
      id: 'logos', num: '01', kicker: '01 · logos', title: 'Logos &amp; lockups',
      intro: 'The wordmark pairs two ways, with four marks by role. Transparent assets shown on a checker.',
      groups: [
        {
          sub: 'Lockups', cls: 'lockups', items: [
            { name: 'lockup · horizontal', sub: '1200×340 · default', w: 1200, h: 340, file: 'lockup-horizontal', svg: lockupHoriz(false) },
            { name: 'lockup · reversed', sub: '1200×340 · on ink', w: 1200, h: 340, file: 'lockup-reversed', svg: lockupHoriz(true) },
            {
              name: 'lockup · signature', sub: '1200×340 · Fraunces', w: 1200, h: 340, file: 'lockup-signature',
              svg: HP.svg(1200, 340, '<rect width="1200" height="340" fill="' + PAPER + '"/>' +
                '<g transform="translate(70 70) scale(2)">' + HP.smile() + '</g>' +
                HP.wordmarkSig({ x: 330, y: 225, size: 150 }))
            },
            {
              name: 'lockup · stacked', sub: '900×1000', w: 900, h: 1000, cls: 'square', file: 'lockup-stacked',
              svg: HP.svg(900, 1000, '<rect width="900" height="1000" fill="' + PAPER + '"/>' +
                '<g transform="translate(270 90) scale(3.6)">' + HP.snapshot(INK) + '</g>' +
                HP.wordmark({ x: 450, y: 580, size: 150, anchor: 'middle' }) +
                tag(450, 650, 38, MUTED, 'your photo, painted by you') +
                HP.dots(372, 730, 16, 52))
            },
            {
              name: 'wordmark', sub: '1000×260 · transparent', w: 1000, h: 260, cls: 'alpha', file: 'wordmark',
              svg: HP.svg(1000, 260, HP.wordmark({ x: 500, y: 172, size: 150, anchor: 'middle' }))
            }
          ]
        },
        {
          sub: 'Marks', cls: 'marks', items: [
            { name: 'icon · snapshot', sub: 'main · before & after', w: 512, h: 512, cls: 'alpha icon', file: 'icon-snapshot', svg: HP.svg(100, 100, HP.snapshot(INK), 'width="512" height="512"') },
            { name: 'icon · bubble', sub: 'avatar mark', w: 512, h: 512, cls: 'alpha icon', file: 'icon-bubble', svg: HP.svg(100, 100, HP.bubble(), 'width="512" height="512"') },
            { name: 'icon · smile', sub: 'sticker mark', w: 512, h: 512, cls: 'alpha icon', file: 'icon-smile', svg: HP.svg(100, 100, HP.smile(), 'width="512" height="512"') },
            { name: 'stamp · one-color', sub: 'plum · seals', w: 512, h: 512, cls: 'alpha icon', file: 'stamp-one-color', svg: HP.svg(100, 100, HP.smile({ mouth: INK, eye: INK, spark: INK }), 'width="512" height="512"') }
          ]
        }
      ]
    },

    {
      id: 'app-icons', num: '02', kicker: '02 · icons', title: 'App &amp; favicons',
      intro: 'Product icons for every store, browser tab, and home screen.',
      groups: [{
        cls: 'icons', items: [
          { name: 'app-icon', sub: '1024 · store/PWA', w: 1024, h: 1024, cls: 'icon', file: 'app-icon-1024', svg: appIcon(1024, 230, HP.snapshot(INK), 6, 54) },
          { name: 'apple-touch', sub: '180 · iOS', w: 180, h: 180, cls: 'icon', file: 'apple-touch-icon-180', svg: appIcon(180, 40, HP.snapshot(INK), 1.28, 54) },
          { name: 'maskable', sub: '512 · Android', w: 512, h: 512, cls: 'icon', file: 'maskable-icon-512', svg: appIcon(512, 0, HP.bubble(), 3, 48) },
          { name: 'favicon', sub: '64 · tab', w: 64, h: 64, cls: 'icon', file: 'favicon-64', svg: appIcon(64, 13, HP.bubble(), 0.5, 48) },
          { name: 'favicon · smile', sub: '64 · tab · smile', w: 64, h: 64, cls: 'icon', file: 'favicon-smile-64', svg: appIcon(64, 13, HP.smile(), 0.62, 40) },
          { name: 'favicon · smile mono', sub: '64 · tab · one-color', w: 64, h: 64, cls: 'icon', file: 'favicon-smile-mono-64', svg: appIcon(64, 13, HP.smile({ mouth: INK, eye: INK, spark: INK }), 0.62, 40) }
        ]
      }]
    },

    {
      id: 'avatars', num: '03', kicker: '03 · avatars', title: 'Profile pictures',
      intro: 'The hello bubble on every brand background, ready for any platform\u2019s circle or square crop.',
      groups: [{
        cls: 'avatars', items: [
          { name: 'avatar · circle', sub: '1080 · default', w: 1080, h: 1080, cls: 'square', file: 'avatar-circle', svg: avatar(PAPER, true) },
          { name: 'avatar · tan', sub: '1080 · square', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-tan', svg: avatar(PAPER, false) },
          { name: 'avatar · berry', sub: '1080 · campaigns', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-berry', svg: avatar(BERRY, false) },
          { name: 'avatar · ink', sub: '1080 · dark', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-ink', svg: avatar(INK, false, true) },
          { name: 'avatar · yellow', sub: '1080 · sunny', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-yellow', svg: avatar(SUN, false) },
          { name: 'avatar · green', sub: '1080 · fresh', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-green', svg: avatar(LEAF, false) },
          { name: 'avatar · light blue', sub: '1080 · soft', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-sky', svg: avatar(SKY, false) },
          { name: 'avatar · teal', sub: '1080 · cool', w: 1080, h: 1080, cls: 'square', file: 'avatar-square-teal', svg: avatar(TEAL, false) }
        ]
      }, {
        sub: 'Smile profile pics', cls: 'avatars', items: [
          { name: 'avatar · smile ink', sub: '1080 · the smile on ink', w: 1080, h: 1080, cls: 'square', file: 'avatar-smile-ink', svg: smileAvatar(INK, true) },
          { name: 'avatar · smile cream', sub: '1080 · the smile on cream', w: 1080, h: 1080, cls: 'square', file: 'avatar-smile-cream', svg: smileAvatar(PAPER, false) }
        ]
      }]
    },

    {
      id: 'headers', num: '04', kicker: '04 · headers', title: 'Social &amp; email covers',
      intro: 'Rebuilt as one centred lockup per platform, sized to each safe area, over a soft paint-dab confetti.',
      groups: [
        {
          cls: 'headers', items: [
            { name: 'x-header', sub: '1500×500', w: 1500, h: 500, file: 'x-header-1500x500', svg: header(1500, 500, { iconK: 1.55, ws: 92, ts: 26, dotR: 11, tagline: 'your photo, painted by you', seed: 3, confOp: 0.16 }) },
            { name: 'facebook-cover', sub: '1640×624', w: 1640, h: 624, file: 'facebook-cover-1640x624', svg: header(1640, 624, { iconK: 1.85, ws: 108, ts: 28, dotR: 12, tagline: 'your photo, painted by you', seed: 6 }) },
            { name: 'youtube-banner', sub: '2560×1440 · TV-safe', w: 2560, h: 1440, file: 'youtube-banner-2560x1440', svg: header(2560, 1440, { iconK: 2.6, ws: 150, ts: 34, dotR: 16, tagline: 'your photo, painted by you', seed: 11, confOp: 0.13 }) },
            { name: 'etsy-shop-banner', sub: '1600×400', w: 1600, h: 400, file: 'etsy-shop-banner-1600x400', svg: header(1600, 400, { iconK: 1.15, ws: 70, ts: 22, dotR: 10, gA: 22, gC: 22, tagline: 'custom paint-by-number kits from your photo', seed: 4, confOp: 0.16 }) },
            { name: 'email-header', sub: '1200×300', w: 1200, h: 300, file: 'email-header-1200x300', svg: header(1200, 300, { iconK: 0.95, ws: 56, ts: 19, dotR: 8, gA: 18, gB: 12, gC: 16, tagline: 'your photo, painted by you', seed: 8, confOp: 0.14 }) }
          ]
        },
        {
          sub: 'On ink · reversed (paint in teal, tagline in white)', cls: 'headers', items: [
            { name: 'x-header · reversed', sub: '1500×500 · on ink', w: 1500, h: 500, file: 'x-header-1500x500-reversed', svg: header(1500, 500, { dark: true, paint: TEAL, tagCol: '#FFFDF8', iconK: 1.55, ws: 92, ts: 26, dotR: 11, tagline: 'your photo, painted by you', seed: 3, confOp: 0.13 }) },
            { name: 'facebook-cover · reversed', sub: '1640×624 · on ink', w: 1640, h: 624, file: 'facebook-cover-1640x624-reversed', svg: header(1640, 624, { dark: true, paint: TEAL, tagCol: '#FFFDF8', iconK: 1.85, ws: 108, ts: 28, dotR: 12, tagline: 'your photo, painted by you', seed: 6, confOp: 0.12 }) },
            { name: 'youtube-banner · reversed', sub: '2560×1440 · on ink', w: 2560, h: 1440, file: 'youtube-banner-2560x1440-reversed', svg: header(2560, 1440, { dark: true, paint: TEAL, tagCol: '#FFFDF8', iconK: 2.6, ws: 150, ts: 34, dotR: 16, tagline: 'your photo, painted by you', seed: 11, confOp: 0.1 }) },
            { name: 'etsy-shop-banner · reversed', sub: '1600×400 · on ink', w: 1600, h: 400, file: 'etsy-shop-banner-1600x400-reversed', svg: header(1600, 400, { dark: true, paint: TEAL, tagCol: '#FFFDF8', iconK: 1.15, ws: 70, ts: 22, dotR: 10, gA: 22, gC: 22, tagline: 'custom paint-by-number kits from your photo', seed: 4, confOp: 0.12 }) },
            { name: 'email-header · reversed', sub: '1200×300 · on ink', w: 1200, h: 300, file: 'email-header-1200x300-reversed', svg: header(1200, 300, { dark: true, paint: TEAL, tagCol: '#FFFDF8', iconK: 0.95, ws: 56, ts: 19, dotR: 8, gA: 18, gB: 12, gC: 16, tagline: 'your photo, painted by you', seed: 8, confOp: 0.12 }) }
          ]
        },
        {
          sub: 'Shop icon', cls: 'avatars', items: [
            { name: 'etsy-shop-icon', sub: '500', w: 500, h: 500, cls: 'square', file: 'etsy-shop-icon-500', svg: appIcon(500, 80, HP.snapshot(INK), 3, 54) }
          ]
        }
      ]
    },

    {
      id: 'templates', num: '05', kicker: '05 · templates', title: 'Social templates',
      intro: 'Dashed boxes mark where the customer\u2019s before &amp; after photo drops in. Stories and posts ship on every brand background, plus a video thumbnail, a review card, and a link-share image.',
      groups: [
        {
          sub: 'Feed & pins', cls: 'templates', items: [
          {
            name: 'instagram-post', sub: '1080×1080', w: 1080, h: 1080, cls: 'tall', file: 'instagram-post-1080',
            svg: HP.svg(1080, 1080, '<rect width="1080" height="1080" fill="' + PAPER + '"/>' + HP.confetti(1080, 1080, 22, 0.13, 2) +
              '<g transform="translate(64 60) scale(0.86)">' + HP.smile() + '</g>' +
              '<text x="1010" y="118" text-anchor="end" font-family="' + NS + '" font-weight="800" font-size="34" fill="' + INK + '">@hellopaintart</text>' +
              '<rect data-dropzone="1" x="90" y="210" width="900" height="590" rx="30" fill="#FFFFFF" stroke="' + DROP + '" stroke-width="3" stroke-dasharray="12 10"/>' +
              '<g data-dropzone-label="1">' + dropIcon(540, 463, 38, DROP) +
              '<text x="540" y="548" font-family="' + NS + '" font-weight="800" font-size="27" letter-spacing="0.4" fill="' + MUTED + '" text-anchor="middle">drop your before &amp; after</text></g>' +
              HP.wordmark({ x: 540, y: 905, size: 78, anchor: 'middle' }) +
              tag(540, 958, 30, MUTED, 'your photo, painted by you') + HP.dots(474, 1012, 13, 44))
          },
          {
            name: 'pinterest-pin', sub: '1000×1500', w: 1000, h: 1500, cls: 'tall', file: 'pinterest-pin-1000x1500',
            svg: HP.svg(1000, 1500, '<rect width="1000" height="1500" fill="' + PAPER + '"/>' + HP.confetti(1000, 1500, 20, 0.12, 7) +
              '<text x="500" y="300" text-anchor="middle" font-family="' + FR + '" font-weight="600" font-size="86" letter-spacing="-2" fill="' + INK + '">your photo,</text>' +
              '<text x="500" y="392" text-anchor="middle" font-family="' + FR + '" font-weight="600" font-size="86" letter-spacing="-2" fill="' + BERRY + '">by the numbers.</text>' +
              '<rect data-dropzone="1" x="90" y="470" width="820" height="820" rx="28" fill="#FFFFFF" stroke="' + DROP + '" stroke-width="3" stroke-dasharray="12 10"/>' +
              '<g data-dropzone-label="1">' + dropIcon(500, 828, 42, DROP) +
              '<text x="500" y="922" font-family="' + NS + '" font-weight="800" font-size="25" letter-spacing="0.4" fill="' + MUTED + '" text-anchor="middle">drop your before &amp; after</text></g>' +
              '<g transform="translate(388 1330) scale(0.78)">' + HP.smile() + '</g>' +
              HP.wordmark({ x: 448, y: 1388, size: 56 }) +
              '<text x="500" y="1452" text-anchor="middle" font-family="' + NS + '" font-weight="700" font-size="28" letter-spacing="1" fill="' + MUTED + '">hellopaintart.com</text>')
          },
          {
            name: 'etsy-listing', sub: '2000×2000', w: 2000, h: 2000, cls: 'tall', file: 'etsy-listing-2000',
            svg: HP.svg(2000, 2000, '<rect width="2000" height="2000" fill="' + PAPER + '"/>' +
              HP.wordmark({ x: 160, y: 210, size: 90 }) +
              '<rect x="1480" y="150" width="360" height="76" rx="38" fill="' + TEAL + '"/>' +
              '<text x="1660" y="197" text-anchor="middle" font-family="' + NS + '" font-weight="800" font-size="26" letter-spacing="1" fill="#FFFFFF">24 COLORS · NO. 0042</text>' +
              '<rect data-dropzone="1" x="160" y="300" width="1680" height="1240" rx="36" fill="#FFFFFF" stroke="' + DROP + '" stroke-width="3" stroke-dasharray="12 10"/>' +
              '<g data-dropzone-label="1">' + dropIcon(1000, 840, 70, DROP) +
              '<text x="1000" y="978" font-family="' + NS + '" font-weight="800" font-size="36" letter-spacing="0.5" fill="' + MUTED + '" text-anchor="middle">drop your finished painting</text></g>' +
              '<g transform="translate(160 1640) scale(2.2)">' + HP.snapshot(INK) + '</g>' +
              '<text x="430" y="1740" font-family="' + FR + '" font-weight="600" font-size="64" fill="' + INK + '">a paint-by-number kit,</text>' +
              tag(430, 1812, 48, MUTED, 'made from your own photo.') + HP.dots(1682, 1760, 16, 52))
          }
          ]
        },
        {
          sub: 'Video, review &amp; link share', cls: 'templates', items: [
            { name: 'youtube-thumbnail', sub: '1280×720', w: 1280, h: 720, cls: 'tall', file: 'youtube-thumbnail-1280x720', svg: youtubeThumb() },
            { name: 'review-card', sub: '1080×1080', w: 1080, h: 1080, cls: 'tall', file: 'review-card-1080', svg: reviewCard() },
            { name: 'link-share', sub: '1200×630 · OG card', w: 1200, h: 630, cls: 'tall', file: 'link-share-1200x630', svg: ogCard() }
          ]
        },
        {
          sub: 'Instagram stories · one per colour', cls: 'templates',
          items: COLORS.map(function (c, i) {
            return { name: 'story · ' + c.label, sub: '1080×1920', w: 1080, h: 1920, cls: 'tall', file: 'instagram-story-' + c.id, svg: storyCard(c, STORY_EYEBROWS[i]) };
          })
        },
        {
          sub: 'Tagline posts · one per colour', cls: 'templates',
          items: COLORS.map(function (c, i) {
            return { name: 'post · ' + c.label, sub: '1080×1080', w: 1080, h: 1080, cls: 'tall', file: 'post-' + c.id, svg: taglineCard(c.bg, POST_LINES[i], { dark: c.dark, seed: 9 + i * 4, size: 96 }) };
          })
        }
      ]
    },

    {
      id: 'diecut', num: '06', kicker: '06 · die-cut', title: 'Die-cut stickers',
      intro: 'Individual contour-cut stickers. The dashed line is the cut path; the white shape is the printed sticker. Drop them on any kit, card, or laptop.',
      groups: [{
        cls: 'templates', items: [
          { name: 'die-cut · smile', sub: 'circle cut', w: 620, h: 620, cls: 'square', file: 'diecut-smile', svg: dieCut('circle', HP.smile(), { k: 4, r: 250 }) },
          { name: 'die-cut · bubble', sub: 'true bubble cut', w: 620, h: 620, cls: 'square', file: 'diecut-bubble', svg: dieCutContour(620, 620, BUBBLE_SIL, BUBBLE_DOTS, { k: 4.4, cutCol: TEAL }) },
          { name: 'die-cut · palette', sub: 'palette cut', w: 620, h: 620, cls: 'square', file: 'diecut-palette', svg: dieCutContour(620, 620, PALETTE_SIL, '<circle cx="74" cy="49" r="7" fill="none" stroke="' + INK + '" stroke-width="4"/><circle cx="36" cy="42" r="6.5" fill="' + BERRY + '"/><circle cx="54" cy="35" r="6.5" fill="' + TEAL + '"/><circle cx="40" cy="60" r="6.5" fill="' + SUN + '"/><circle cx="58" cy="55" r="6.5" fill="' + LEAF + '"/>', { k: 4.4, cutCol: BERRY }) },
          { name: 'die-cut · snapshot', sub: 'rounded cut', w: 620, h: 620, cls: 'square', file: 'diecut-snapshot', svg: dieCut('roundrect', HP.snapshot(INK), { k: 4.2, my: 12, cutCol: SUN }) },
          { name: 'die-cut · dab', sub: 'contour cut', w: 620, h: 620, cls: 'square', file: 'diecut-dab', svg: dieCut('circle', HP.ICONS.find(function (i) { return i.id === 'dab'; }).inner, { k: 4, r: 240, cutCol: LEAF }) },
          { name: 'die-cut · number', sub: 'badge cut', w: 620, h: 620, cls: 'square', file: 'diecut-number', svg: dieCut('circle', HP.ICONS.find(function (i) { return i.id === 'number'; }).inner, { k: 4.4, r: 230 }) },
          {
            name: 'die-cut · wordmark', sub: 'pill cut', w: 1000, h: 360, file: 'diecut-wordmark',
            svg: (function () {
              var inner = '<rect x="20" y="50" width="960" height="260" rx="130" fill="none" stroke="' + BERRY + '" stroke-width="3" stroke-dasharray="9 9"/>' +
                '<rect x="34" y="64" width="932" height="232" rx="116" fill="#FFFDF8"/>' +
                HP.wordmark({ x: 500, y: 218, size: 92, anchor: 'middle' });
              return HP.svg(1000, 360, inner, 'class="diecut"');
            })()
          }
        ]
      }]
    },

    {
      id: 'stationery', num: '07', kicker: '07 · stationery', title: 'Print &amp; packaging',
      intro: 'The unboxing that matches the feed: letterhead, cards, seals, and kit print.',
      groups: [{
        cls: 'stationery', items: [
          {
            name: 'business card · front', sub: '1050×600', w: 1050, h: 600, file: 'business-card-front',
            svg: HP.svg(1050, 600, '<rect width="1050" height="600" fill="' + PAPER + '"/>' +
              '<g transform="translate(70 95) scale(1.5)">' + HP.snapshot(INK) + '</g>' +
              HP.wordmark({ x: 255, y: 305, size: 76 }) + tag(258, 345, 26, MUTED, 'your photo, painted by you') +
              '<line x1="70" y1="470" x2="980" y2="470" stroke="' + LINE + '" stroke-width="2"/>' +
              '<text x="70" y="528" font-family="' + NS + '" font-weight="700" font-size="25" fill="' + INK + '">@hellopaintart</text>' +
              HP.dots(869, 518, 10, 34))
          },
          {
            name: 'business card · back', sub: '1050×600', w: 1050, h: 600, file: 'business-card-back',
            svg: HP.svg(1050, 600, '<rect width="1050" height="600" fill="' + BERRY + '"/>' +
              '<g transform="translate(435 150) scale(1.8)">' + HP.smile({ mouth: '#FFFDF8', eye: '#FFFDF8', spark: '#FFFDF8' }) + '</g>' +
              '<text x="525" y="430" text-anchor="middle" font-family="' + NS + '" font-weight="800" font-size="40" letter-spacing="1" fill="#FFFFFF">hellopaintart.com</text>')
          },
          {
            name: 'letterhead', sub: '1050×1485 · A4', w: 1050, h: 1485, cls: 'tall', file: 'letterhead-a4',
            svg: HP.svg(1050, 1485, '<rect width="1050" height="1485" fill="' + PAPER + '"/>' +
              '<g transform="translate(80 90) scale(1.1)">' + HP.snapshot(INK) + '</g>' +
              HP.wordmark({ x: 220, y: 175, size: 60 }) + tag(222, 210, 22, MUTED, 'your photo, painted by you') +
              '<line x1="80" y1="250" x2="970" y2="250" stroke="' + LINE + '" stroke-width="2"/>' +
              '<line x1="80" y1="1330" x2="970" y2="1330" stroke="' + LINE + '" stroke-width="2"/>' +
              '<text x="80" y="1388" font-family="' + NS + '" font-weight="700" font-size="22" fill="' + MUTED + '">@hellopaintart</text>' +
              '<text x="970" y="1388" text-anchor="end" font-family="' + NS + '" font-weight="700" font-size="22" fill="' + MUTED + '">hellopaintart.com</text>' +
              HP.dots(456, 1382, 9, 34))
          },
          {
            name: 'kit-box label', sub: '1200×1200', w: 1200, h: 1200, cls: 'square', file: 'kit-box-label-1200',
            svg: HP.svg(1200, 1200, '<rect width="1200" height="1200" fill="' + PAPER + '"/>' +
              '<g transform="translate(84 86) scale(0.96)">' + HP.smile() + '</g>' +
              HP.wordmark({ x: 210, y: 190, size: 72 }) +
              '<rect x="940" y="110" width="170" height="76" rx="38" fill="' + TEAL + '"/>' +
              '<text x="1025" y="160" text-anchor="middle" font-family="' + NS + '" font-weight="800" font-size="30" fill="#fff">no. 0042</text>' +
              '<g transform="translate(320 300) scale(5.6)">' + HP.snapshot(INK) + '</g>' +
              tag(600, 1010, 46, INK, 'your kit: turn the page and start at 1', 'middle') + HP.dots(528, 1090, 14, 48))
          },
          {
            name: 'thank-you card', sub: '1500×1050', w: 1500, h: 1050, file: 'thank-you-card',
            svg: HP.svg(1500, 1050, '<rect width="1500" height="1050" fill="' + PAPER + '"/>' + HP.confetti(1500, 1050, 20, 0.14, 6) +
              '<g transform="translate(704 150) scale(0.92)">' + HP.smile() + '</g>' +
              '<text x="750" y="520" text-anchor="middle" font-family="' + FR + '" font-weight="600" font-size="128" letter-spacing="-3" fill="' + BERRY + '">thank you</text>' +
              tag(750, 610, 52, INK, 'for painting with us.', 'middle') +
              HP.wordmark({ x: 750, y: 900, size: 44, anchor: 'middle' }))
          },
          {
            name: 'sticker sheet', sub: '1080 · one per colour', w: 1080, h: 1080, cls: 'square', file: 'sticker-sheet-1080',
            svg: stickerSheet()
          }
        ]
      }]
    },

    {
      id: 'numbers', num: '08', kicker: '08 · numbers', title: 'Number sets',
      intro: 'Paint-by-number digits 0\u20139, drawn as brand dots in every colour. Use them for kit steps, swatches, captions, and count-up reels. Download the whole row, or grab a zip of all ten cut individually.',
      groups: [{
        cls: 'numbers', items: COLORS.map(function (c) {
          var W = 60 * 2 + 96 * 9, H = 130;
          var txt = c.dark ? '#FFFDF8' : INK, ring = (c.id === 'tan') ? INK : null;
          var digits = [];
          for (var d = 0; d <= 9; d++) digits.push({ file: 'numbers-' + c.id + '-' + d, w: 240, h: 240, svg: HP.svg(240, 240, HP.digitBadge(d, 120, 120, 100, c.bg, txt, ring), 'class="diecut"') });
          return { name: 'numbers · ' + c.label, sub: '0\u20139 · ' + c.label, w: W, h: H, file: 'numbers-' + c.id, svg: numberSet(c), digits: digits };
        })
      }]
    },

    {
      id: 'watermarks', num: '09', kicker: '09 · watermarks', title: 'Watermarks',
      intro: 'Transparent, low-key marks to sit over a customer photo so reposts stay sourced. Shown on a checker; download the SVG (or a PNG with a transparent background).',
      groups: [{
        cls: 'templates', items: [
          {
            name: 'watermark · corner', sub: '1080 · bottom-right', w: 1080, h: 1080, cls: 'square', file: 'watermark-corner',
            svg: HP.svg(1080, 1080, '<g opacity="0.5"><g transform="translate(690 902) scale(0.62)">' + HP.smile() + '</g>' +
              HP.wordmark({ x: 1040, y: 1024, size: 46, anchor: 'end' }) + '</g>', 'class="diecut"')
          },
          {
            name: 'watermark · center', sub: '1080 · centered', w: 1080, h: 1080, cls: 'square', file: 'watermark-center',
            svg: HP.svg(1080, 1080, '<g opacity="0.16"><g transform="translate(476 360) scale(2)">' + HP.smile({ mouth: INK, eye: INK, spark: INK }) + '</g>' +
              HP.wordmark({ x: 540, y: 660, size: 96, anchor: 'middle', paint: INK, hello: INK }) +
              '<text x="540" y="724" text-anchor="middle" font-family="' + NS + '" font-weight="800" font-size="26" letter-spacing="3" fill="' + INK + '">HELLOPAINT.STUDIO</text></g>', 'class="diecut"')
          },
          {
            name: 'watermark · tiled', sub: '1080 · repeat pattern', w: 1080, h: 1080, cls: 'square', file: 'watermark-tiled',
            svg: (function () {
              var g = '<g opacity="0.12">';
              for (var r = 0; r < 6; r++) for (var cc = 0; cc < 6; cc++) {
                var x = 40 + cc * 180 + (r % 2) * 90, y = 70 + r * 175;
                g += '<g transform="translate(' + x + ' ' + y + ') scale(0.7) rotate(-12)">' + HP.smile({ mouth: INK, eye: INK, spark: INK }) + '</g>';
              }
              return HP.svg(1080, 1080, g + '</g>', 'class="diecut"');
            })()
          }
        ]
      }]
    }
  ];

  HP.SECTIONS = SECTIONS;
  HP.HERO = lockupHoriz(false);
})(window);
