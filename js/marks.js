/* hello paint · shared SVG mark builders
   Every function returns a string of SVG inner-markup laid out in a 0..100 box
   (unless noted). Callers wrap it in <g transform="..."> to place/scale it.    */
(function (root) {
  var HP = root.HP || (root.HP = {});

  // brand
  HP.C = {
    paper: '#FBF4E8', card: '#FFFDF8', ink: '#312B3D', muted: '#6E6576',
    berry: '#E64C81', teal: '#15A39A', sun: '#F6C744', leaf: '#5BA86B',
    sky: '#BFE6F2', deepberry: '#B83A66', deepteal: '#0F756D',
    line: '#EADCC6', pink: '#FBD0DD'
  };
  var NS = "'Nunito Sans','Trebuchet MS',sans-serif";
  var FR = "'Fraunces',Georgia,serif";
  HP.NS = NS; HP.FR = FR;

  // ---- the snapshot icon (camera / before & after) ----------------------
  // strokeC lets the reversed lockup use paper-colored card stroke on ink.
  HP.snapshot = function (strokeC) {
    var s = strokeC || HP.C.ink;
    return [
      '<rect x="12" y="12" width="76" height="84" rx="10" fill="#FFFDF8" stroke="' + s + '" stroke-width="3"/>',
      '<rect x="20" y="18" width="56" height="48" rx="5" fill="#FBF4E8"/>',
      '<rect x="20" y="18" width="28" height="34" fill="#BFE6F2"/>',
      '<circle cx="37" cy="29" r="6.3" fill="#F6C744"/>',
      '<path d="M20 52 Q34 43 48 50 L48 66 L20 66 Z" fill="#5BA86B"/>',
      '<line x1="48" y1="18" x2="48" y2="66" stroke="#312B3D" stroke-width="1.4"/>',
      '<path d="M48 52 Q62 43 76 50 L76 66 L48 66 Z" fill="none" stroke="#312B3D" stroke-width="1.3"/>',
      '<text x="55" y="33.5" font-family="' + NS + '" font-size="12" font-weight="800" fill="#312B3D" text-anchor="middle">1</text>',
      '<circle cx="67" cy="29" r="7" fill="none" stroke="#312B3D" stroke-width="1.3"/>',
      '<text x="67" y="32.6" font-family="' + NS + '" font-size="9.5" font-weight="800" fill="#312B3D" text-anchor="middle">2</text>',
      '<text x="62" y="60" font-family="' + NS + '" font-size="12" font-weight="800" fill="#312B3D" text-anchor="middle">3</text>',
      '<g transform="translate(48 15) rotate(20)"><rect x="-2.5" y="-15" width="5" height="12" rx="2.5" fill="#15A39A"/><rect x="-3.5" y="-4" width="7" height="4" rx="1" fill="#312B3D"/><path d="M-3.5 -1 L3.5 -1 L0 7 Z" fill="#E64C81"/></g>',
      '<circle cx="30" cy="82" r="7" fill="#BFE6F2" stroke="#312B3D" stroke-width="0.7"/><text x="30" y="85.5" font-family="' + NS + '" font-size="9.5" font-weight="800" fill="#312B3D" text-anchor="middle">1</text>',
      '<circle cx="46" cy="82" r="7" fill="#F6C744"/><text x="46" y="85.5" font-family="' + NS + '" font-size="9.5" font-weight="800" fill="#312B3D" text-anchor="middle">2</text>',
      '<circle cx="62" cy="82" r="7" fill="#5BA86B"/><text x="62" y="85.5" font-family="' + NS + '" font-size="9.5" font-weight="800" fill="#312B3D" text-anchor="middle">3</text>'
    ].join('');
  };

  // ---- speech-bubble avatar mark (5 dots) -------------------------------
  HP.bubble = function (cardC, strokeC, darkDot) {
    var c = cardC || '#FFFDF8', s = strokeC || HP.C.ink, d = darkDot || '#312B3D';
    return [
      '<rect x="14" y="14" width="72" height="52" rx="18" fill="' + c + '" stroke="' + s + '" stroke-width="3"/>',
      '<path d="M30 60 L24 82 L46 64 Z" fill="' + c + '"/>',
      '<path d="M30 60 L24 82 L46 64" fill="none" stroke="' + s + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
      '<circle cx="35" cy="33" r="5.6" fill="#E64C81"/><circle cx="50" cy="30" r="5.6" fill="#15A39A"/><circle cx="65" cy="33" r="5.6" fill="#F6C744"/>',
      '<circle cx="42" cy="47" r="5.6" fill="#5BA86B"/><circle cx="58" cy="47" r="5.6" fill="' + d + '"/>'
    ].join('');
  };

  // ---- smile mark (mouth + wink + spark) --------------------------------
  HP.smile = function (col) {
    var c = col || {};
    return [
      '<path d="M21 49 Q50 80 79 49" fill="none" stroke="' + (c.mouth || '#E64C81') + '" stroke-width="14" stroke-linecap="round"/>',
      '<path d="M47 36 Q61 28 75 30" fill="none" stroke="' + (c.eye || '#15A39A') + '" stroke-width="5.4" stroke-linecap="round"/>',
      '<path d="M81 16 L83.4 19.6 L87 22 L83.4 24.4 L81 28 L78.6 24.4 L75 22 L78.6 19.6 Z" fill="' + (c.spark || '#F6C744') + '"/>'
    ].join('');
  };

  // ---- wordmark text (Nunito Sans 800) ----------------------------------
  // opts: {x,y,size,anchor,paint} paint = colour of "paint"
  HP.wordmark = function (o) {
    o = o || {};
    var size = o.size || 150, x = o.x || 0, y = o.y || 0;
    var anchor = o.anchor ? ' text-anchor="' + o.anchor + '"' : '';
    var paint = o.paint || '#312B3D', hello = o.hello || '#E64C81';
    return '<text x="' + x + '" y="' + y + '"' + anchor + ' font-family="' + NS +
      '" font-weight="800" font-size="' + size + '" letter-spacing="' + (-0.03 * size) +
      '"><tspan fill="' + hello + '">hello</tspan><tspan fill="' + paint + '" dx="' + (0.26 * size) + '">paint</tspan></text>';
  };

  // signature wordmark (Fraunces italic)
  HP.wordmarkSig = function (o) {
    o = o || {};
    var size = o.size || 150, x = o.x || 0, y = o.y || 0;
    var anchor = o.anchor ? ' text-anchor="' + o.anchor + '"' : '';
    var paint = o.paint || '#312B3D';
    return '<text x="' + x + '" y="' + y + '"' + anchor + ' font-family="' + FR +
      '" font-style="italic" font-weight="600" font-size="' + size + '" letter-spacing="' + (-0.012 * size) +
      '"><tspan fill="#E64C81">hello</tspan><tspan fill="' + paint + '" dx="' + (0.22 * size) + '">paint</tspan></text>';
  };

  // ---- 4 brand dots in a row --------------------------------------------
  HP.dots = function (cx, cy, r, gap, ring) {
    r = r || 13; gap = gap || (r * 3.4);
    var cols = ['#E64C81', '#15A39A', '#F6C744', '#5BA86B'];
    var rk = ring ? ' stroke="' + ring + '" stroke-width="' + (r * 0.14) + '"' : '';
    return cols.map(function (c, i) {
      return '<circle cx="' + (cx + i * gap) + '" cy="' + cy + '" r="' + r + '" fill="' + c + '"' + rk + '/>';
    }).join('');
  };

  // ---- numbered badge (paint-by-number dot) ----------------------------
  // d=digit, fill=circle colour, txt=number colour, ring optional stroke
  HP.digitBadge = function (d, cx, cy, r, fill, txt, ring) {
    var c = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' +
      (ring ? ' stroke="' + ring + '" stroke-width="' + (r * 0.06) + '"' : '') + '/>';
    return c + '<text x="' + cx + '" y="' + (cy + r * 0.36) + '" text-anchor="middle" font-family="' + NS +
      '" font-weight="800" font-size="' + (r * 1.22) + '" fill="' + txt + '">' + d + '</text>';
  };

  // ---- confetti of soft paint dabs (deterministic) ----------------------
  // mulberry-style seeded RNG so it renders identically every time.
  HP.confetti = function (w, h, n, opacity, seed) {
    n = n || 26; opacity = (opacity == null ? 0.15 : opacity); seed = seed || 7;
    var s = seed >>> 0;
    function rnd() { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }
    var cols = ['#15A39A', '#FBD0DD', '#5BA86B', '#F6C744', '#E64C81'];
    var out = '<g opacity="' + opacity + '">';
    for (var i = 0; i < n; i++) {
      var cx = (rnd() * w).toFixed(1), cy = (rnd() * h).toFixed(1);
      var r = (4 + rnd() * 9).toFixed(1), c = cols[(rnd() * cols.length) | 0];
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c + '"/>';
    }
    return out + '</g>';
  };

  // ---- assemble a standalone <svg> document -----------------------------
  HP.svg = function (w, h, inner, attrs) {
    attrs = attrs || '';
    var wh = /\bwidth=/.test(attrs) ? '' : ' width="' + w + '" height="' + h + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h +
      '"' + wh + (attrs ? ' ' + attrs : '') + '>' + inner + '</svg>';
  };
})(window);
