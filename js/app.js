/* hello paint · asset library app: render cards + live SVG/PNG downloads */
(function () {
  var HP = window.HP;
  var REG = [];                 // downloadable registry: {svg,w,h,file}
  var SECTION_RANGES = {};      // section id -> [startIdx, endIdx) into REG, for "download this section" zips
  var FONT_CSS_URL = 'fonts/fonts.css';

  /* ---------- download helpers ----------------------------------------- */
  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
    if (window.HPToast) window.HPToast('Downloaded ' + name);
  }
  function downloadSVG(svg, file) {
    saveBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), file + '.svg');
  }

  var _fontCSS; // undefined = not tried, null = failed, string = ready
  function abToB64(buf) {
    var bytes = new Uint8Array(buf), bin = '', CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(bin);
  }
  // Embeds the brand fonts straight from the kit's own local /fonts folder
  // (no network fetch, no CDN, so it works fully offline once the page loads).
  async function embeddedFontCSS() {
    if (_fontCSS !== undefined) return _fontCSS;
    try {
      var css = await (await fetch(FONT_CSS_URL)).text();
      var blocks = css.match(/@font-face\s*\{[^}]*\}/g) || [];
      // keep only basic-latin subset to limit weight
      var keep = blocks.filter(function (b) { return !/unicode-range/.test(b) || /U\+0000-00FF/.test(b); });
      var out = '';
      for (var i = 0; i < keep.length; i++) {
        var m = keep[i].match(/url\(["']?(fonts\/[^)"']+\.woff2|[A-Za-z-]+\/[^)"']+\.woff2)["']?\)/);
        if (!m) { out += keep[i]; continue; }
        var rel = m[1].indexOf('fonts/') === 0 ? m[1] : 'fonts/' + m[1];
        var buf = await (await fetch(rel)).arrayBuffer();
        out += keep[i].replace(m[1], 'data:font/woff2;base64,' + abToB64(buf));
      }
      _fontCSS = out;
    } catch (e) { _fontCSS = null; }
    return _fontCSS;
  }

  async function svgToPngBlob(svg, w, h) {
    var css = await embeddedFontCSS();
    var doc = css ? svg.replace(/(<svg[^>]*>)/, '$1<defs><style>' + css + '</style></defs>') : svg;
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(doc);
    return await new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { var cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(img, 0, 0, w, h); cv.toBlob(res, 'image/png'); };
      img.onerror = rej; img.src = url;
    });
  }
  async function downloadPNG(svg, w, h, file, btn) {
    var label = btn.textContent; btn.textContent = '…'; btn.disabled = true;
    try { saveBlob(await svgToPngBlob(svg, w, h), file + '.png'); }
    catch (e) { alert('PNG export failed, the SVG download still works.'); }
    btn.textContent = label; btn.disabled = false;
  }

  // ---- store-only ZIP (no dependencies) ----
  function crc32(u8) { var t = crc32.t; if (!t) { t = crc32.t = []; for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } } var crc = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) crc = t[(crc ^ u8[i]) & 0xFF] ^ (crc >>> 8); return (crc ^ 0xFFFFFFFF) >>> 0; }
  function zipStore(files) {
    var u16 = function (n) { return [n & 255, (n >> 8) & 255]; }, u32 = function (n) { return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255]; };
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = f.data, crc = crc32(data);
      var lh = new Uint8Array([].concat([80, 75, 3, 4], u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0)));
      parts.push(lh, name, data);
      var ch = new Uint8Array([].concat([80, 75, 1, 2], u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off)));
      central.push(ch, name); off += lh.length + name.length + data.length;
    });
    var cs = 0; central.forEach(function (c) { cs += c.length; });
    var end = new Uint8Array([].concat([80, 75, 5, 6], u16(0), u16(0), u16(files.length), u16(files.length), u32(cs), u32(off), u16(0)));
    return new Blob(parts.concat(central, [end]), { type: 'application/zip' });
  }
  async function downloadZip(r, btn) {
    var label = btn.textContent; btn.textContent = '…'; btn.disabled = true;
    try {
      var enc = new TextEncoder(), files = [];
      for (var j = 0; j < r.digits.length; j++) {
        var dg = r.digits[j];
        files.push({ name: 'svg/' + dg.file + '.svg', data: enc.encode(dg.svg) });
        var pb = await svgToPngBlob(dg.svg, dg.w, dg.h);
        files.push({ name: 'png/' + dg.file + '.png', data: new Uint8Array(await pb.arrayBuffer()) });
      }
      files.push({ name: r.file + '-strip.svg', data: enc.encode(r.svg) });
      saveBlob(zipStore(files), r.file + '-0-9.zip');
    } catch (e) { alert('Zip failed, the individual SVG/PNG buttons still work.'); }
    btn.textContent = label; btn.disabled = false;
  }

  // ---- "download this whole section" zip: bundles every SVG/PNG (and any
  // per-digit children) whose REG entries fall inside a section's range ----
  async function downloadSectionZip(secId, btn) {
    var range = SECTION_RANGES[secId];
    if (!range) return;
    var label = btn.textContent; btn.textContent = 'zipping…'; btn.disabled = true;
    try {
      var enc = new TextEncoder(), files = [];
      for (var i = range[0]; i < range[1]; i++) {
        var r = REG[i];
        files.push({ name: 'svg/' + r.file + '.svg', data: enc.encode(r.svg) });
        var pb = await svgToPngBlob(r.svg, r.w, r.h);
        files.push({ name: 'png/' + r.file + '.png', data: new Uint8Array(await pb.arrayBuffer()) });
        if (r.digits) {
          for (var j = 0; j < r.digits.length; j++) {
            var dg = r.digits[j];
            files.push({ name: 'svg/' + dg.file + '.svg', data: enc.encode(dg.svg) });
            var dpb = await svgToPngBlob(dg.svg, dg.w, dg.h);
            files.push({ name: 'png/' + dg.file + '.png', data: new Uint8Array(await dpb.arrayBuffer()) });
          }
        }
      }
      saveBlob(zipStore(files), 'hello-paint-' + secId + '.zip');
    } catch (e) { alert('Zip failed, the individual SVG/PNG buttons still work.'); }
    btn.textContent = label; btn.disabled = false;
  }
  function seczipBtn(secId) {
    return '<button class="seczip" data-seczip="' + secId + '">Download this whole section (.zip)</button>';
  }

  /* ---------- QR: live-generated, editable link, bubble at its heart ---- */
  var QR_DEFAULT = 'https://hellopaint.megan-warren.com';
  function qrLoad() {
    try { return localStorage.getItem('hp-qr-link') || QR_DEFAULT; } catch (e) { return QR_DEFAULT; }
  }
  function qrSave(v) { try { localStorage.setItem('hp-qr-link', v); } catch (e) {} }
  function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // builds a real, scannable QR (error correction H so the center bubble cutout
  // never breaks a scan) sized to whatever text is given; falls back to the
  // kit's own URL so the tile never renders empty.
  function buildQrSvg(text, exportSize) {
    text = (text || '').trim() || QR_DEFAULT;
    exportSize = exportSize || 512;
    var qr = window.qrcode(0, 'H');
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount(), cell = 7, margin = 4;
    var full = (n + margin * 2) * cell; // natural coordinate space (viewBox); scales up to exportSize on render/PNG
    var rects = '';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) rects += '<rect x="' + ((c + margin) * cell) + '" y="' + ((r + margin) * cell) + '" width="' + cell + '" height="' + cell + '"/>';
      }
    }
    var hole = full * 0.27, hx = (full - hole) / 2;
    var bScale = (hole * 0.86) / 100, bOff = (hole - 100 * bScale) / 2;
    var inner = '<rect width="' + full + '" height="' + full + '" rx="' + (full * 0.065).toFixed(1) + '" fill="#FFFDF8"/>' +
      '<g fill="#312B3D">' + rects + '</g>' +
      '<rect x="' + hx.toFixed(1) + '" y="' + hx.toFixed(1) + '" width="' + hole.toFixed(1) + '" height="' + hole.toFixed(1) + '" rx="' + (hole * 0.16).toFixed(1) + '" fill="#FFFDF8"/>' +
      '<g transform="translate(' + (hx + bOff).toFixed(1) + ' ' + (hx + bOff).toFixed(1) + ') scale(' + bScale.toFixed(4) + ')">' + HP.bubble() + '</g>';
    var svg = HP.svg(full, full, inner, 'width="' + exportSize + '" height="' + exportSize + '"');
    return { svg: svg, size: exportSize };
  }

  /* ---------- card builders -------------------------------------------- */
  function dlRow(i) {
    return '<div class="dl"><button class="dlb" data-i="' + i + '" data-act="svg">SVG</button>' +
      '<button class="dlb" data-i="' + i + '" data-act="png">PNG</button></div>';
  }
  function assetCard(it) {
    var i = REG.push({ svg: it.svg, w: it.w, h: it.h, file: it.file, digits: it.digits }) - 1;
    var dl = dlRow(i);
    if (it.digits) dl = dl.replace('</div>', '<button class="dlb" data-i="' + i + '" data-act="zip">Zip 0-9</button></div>');
    return '<figure class="asset ' + (it.cls || '') + '"><div class="stage">' + it.svg + '</div>' +
      '<figcaption><b>' + it.name + '</b><span>' + it.sub + '</span>' + dl + '</figcaption></figure>';
  }

  /* ---------- render sections ------------------------------------------ */
  function render() {
    var app = document.getElementById('app'), html = '';
    HP.SECTIONS.forEach(function (sec) {
      var startIdx = REG.length;
      html += '<section class="sec" id="' + sec.id + '" data-screen-label="' + sec.title.replace(/&amp;/g, '&') + '">';
      html += '<p class="kicker">' + sec.kicker + '</p><h2>' + sec.title + '</h2>';
      html += '<p class="intro">' + sec.intro + '</p>';
      html += seczipBtn(sec.id);
      sec.groups.forEach(function (g) {
        if (g.sub) html += '<div class="subhead">' + g.sub + '</div>';
        html += '<div class="gal ' + (g.cls || '') + '">';
        g.items.forEach(function (it) { html += assetCard(it); });
        html += '</div>';
      });
      html += '</section>';
      SECTION_RANGES[sec.id] = [startIdx, REG.length];
    });

    // ---- ICONS ----
    var iconsStart = REG.length;
    html += '<section class="sec" id="icons" data-screen-label="Icons & symbols">';
    html += '<p class="kicker">10 · icons</p><h2>Icons, symbols &amp; emoji</h2>';
    html += '<p class="intro">Sixty little marks in the hello paint hand, rounded plum line work with the four brand dabs. Use them as favicons, bullet glyphs, reaction emoji, or sticker art. Transparent on a checker.</p>';
    html += seczipBtn('icons');
    html += '<div class="gal iconset">';
    HP.ICONS.forEach(function (ic) {
      var svg = HP.svg(100, 100, ic.inner, 'width="512" height="512"');
      var i = REG.push({ svg: svg, w: 512, h: 512, file: 'icon-' + ic.id }) - 1;
      html += '<figure class="asset alpha ico"><div class="stage">' + svg + '</div>' +
        '<figcaption><b>' + ic.label + '</b><span>' + ic.sub + '</span>' + dlRow(i) + '</figcaption></figure>';
    });
    html += '</div></section>';
    SECTION_RANGES.icons = [iconsStart, REG.length];

    // ---- EXTRAS: QR + email signature ----
    var qrLink = qrLoad();
    var qrBuilt;
    // a bad saved link must never blank the whole library render, so fall back to the kit URL
    try { qrBuilt = buildQrSvg(qrLink, 512); } catch (e) { qrBuilt = buildQrSvg(QR_DEFAULT, 512); }
    var qrI = REG.push({ svg: qrBuilt.svg, w: qrBuilt.size, h: qrBuilt.size, file: 'qr-code' }) - 1;
    html += '<section class="sec" id="extras" data-screen-label="QR & email signature">';
    html += '<p class="kicker">11 · extras</p><h2>QR code &amp; email signature</h2>';
    html += '<p class="intro">A real, scannable QR with the bubble at its heart, and a copy-paste email signature.</p>';
    html += '<div class="gal extras">';
    html += '<figure class="asset"><div class="stage" style="background:#FFFDF8"><div style="width:200px" id="qr-stage">' + qrBuilt.svg + '</div></div>' +
      '<figcaption><b>qr code</b><span>scannable · bubble center · edit the link, then share</span>' +
      '<div class="qredit"><label for="qr-url">points to</label><input id="qr-url" type="text" inputmode="url" spellcheck="false" autocomplete="off" maxlength="900" value="' + escAttr(qrLink) + '"></div>' +
      '<div class="dl"><button class="dlb" id="qr-copylink" type="button">Copy link</button>' + dlRow(qrI) + '</div></figcaption></figure>';
    html += '<figure class="asset"><div class="stage" id="sigwrap">' + emailSig(sigLoad(), true) + '</div>' +
      '<figcaption><b>email signature</b><span>click any field to edit, then copy</span>' +
      '<div class="dl"><button class="dlb" data-act="copysig">Copy HTML</button>' +
      '<button class="dlb" data-act="resetsig">Reset</button></div></figcaption></figure>';
    html += '</div></section>';

    // ---- MOTION ----
    html += '<section class="sec" id="motion" data-screen-label="Brand motion">';
    html += '<p class="kicker">12 · motion</p><h2>Brand motion</h2>';
    html += '<p class="intro">Fifteen looping reveals built from the marks, at least one on every brand background. Click any tile to play it full-size in a pop-up; every motion file also opens on its own with its own WebM and HTML export buttons. <a href="motion.html">See the full motion gallery →</a></p>';
    html += '<div class="gal motion">';
    MOTIONS.forEach(function (m) {
      html += '<a class="asset link" href="' + m.href + '" target="_blank" rel="noopener" data-motion="' + m.href + '"><div class="stage" style="background:' + (m.bg || '#FBF4E8') + '">' + m.poster + '</div>' +
        '<figcaption><b>' + m.name + ' <em>▶</em></b><span>' + m.sub + '</span></figcaption></a>';
    });
    html += '</div></section>';

    html += '<p class="foot">hello paint · asset library · volume seven · every mark is original vector art · type is Fraunces &amp; Nunito Sans (free Google Fonts, embedded, works offline) · each tile downloads as an editable SVG master or a native-size PNG · the palette avoids orange on purpose, so the brand always reads as human-made.</p>';

    app.innerHTML = html;
    var countEl = document.getElementById('asset-count');
    if (countEl) countEl.textContent = REG.length + ' downloadable assets';
    var hl = document.getElementById('herolk'); if (hl) hl.innerHTML = HP.HERO;
    wireQr(qrI);
    if (window.HPKit && window.HPKit.onContentReady) window.HPKit.onContentReady();
  }

  /* ---------- QR wiring: edit the link, regenerate live, copy + export -- */
  function wireQr(qrI) {
    var input = document.getElementById('qr-url'), stage = document.getElementById('qr-stage'), copyBtn = document.getElementById('qr-copylink');
    if (!input || !stage) return;
    var deb;
    input.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () {
        var v = input.value.trim() || QR_DEFAULT;
        try {
          var built = buildQrSvg(v, REG[qrI].w);
          REG[qrI].svg = built.svg;
          stage.innerHTML = built.svg;
          qrSave(v);
        } catch (e) { if (window.HPToast) window.HPToast('that link is too long for a qr code'); }
      }, 260);
    });
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var v = input.value.trim() || QR_DEFAULT;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(function () { flash(copyBtn, 'Copied!'); if (window.HPToast) window.HPToast('Link copied'); }, function () { fallbackCopyText(v, copyBtn); });
      } else fallbackCopyText(v, copyBtn);
    });
  }
  function fallbackCopyText(text, btn) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    if (ok) { flash(btn, 'Copied!'); if (window.HPToast) window.HPToast('Link copied'); }
    else if (window.HPToast) window.HPToast('Copy failed, select the text manually');
  }

  /* ---------- email signature (editable) ------------------------------- */
  function sigBubble() {
    return '<svg width="68" height="68" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#FBF4E8"/><g transform="translate(2 6) scale(0.96)">' +
      HP.bubble() + '</g></svg>';
  }
  var SIG_DEF = { name: 'Megan Warren', title: 'founder & chief painter', email: 'megan@hellopaint.studio', site: 'hellopaint.studio', ig: '@hellopaint', tag: 'your photo, painted by you' };
  function sigEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function sigLoad() {
    try { return Object.assign({}, SIG_DEF, JSON.parse(localStorage.getItem('hp-sig') || '{}')); }
    catch (e) { return Object.assign({}, SIG_DEF); }
  }
  function sigRead() {
    function v(id, d) { var el = document.getElementById(id); var t = el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; return t || d; }
    return { name: v('sig-name', SIG_DEF.name), title: v('sig-title', SIG_DEF.title), email: v('sig-email', SIG_DEF.email), site: v('sig-site', SIG_DEF.site), ig: v('sig-ig', SIG_DEF.ig), tag: v('sig-tag', SIG_DEF.tag) };
  }
  // editable=true -> contenteditable spans (for the on-page card)
  // editable=false -> clean <a> links with computed hrefs (for copy/export)
  function emailSig(v, editable) {
    v = v || SIG_DEF;
    var link = 'color:#0F756D;text-decoration:none;font-weight:700;';
    var ig = v.ig.replace(/^@+/, '');
    function f(id, txt, extra) {
      return '<span id="' + id + '"' + (editable ? ' contenteditable="true" spellcheck="false" class="sig-ce"' : '') +
        (extra ? ' style="' + extra + '"' : '') + '>' + sigEsc(txt) + '</span>';
    }
    var emailEl = editable ? f('sig-email', v.email, link) : '<a href="mailto:' + sigEsc(v.email) + '" style="' + link + '">' + sigEsc(v.email) + '</a>';
    var siteEl = editable ? f('sig-site', v.site, link) : '<a href="https://' + sigEsc(v.site) + '" style="' + link + '">' + sigEsc(v.site) + '</a>';
    var igEl = editable ? f('sig-ig', v.ig, link) : '<a href="https://instagram.com/' + sigEsc(ig) + '" style="' + link + '">@' + sigEsc(ig) + '</a>';
    return '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:\'Nunito Sans\',sans-serif;color:#312B3D;background:#FFFDF8;border:1px solid #EADCC6;border-radius:14px;padding:20px 22px;">' +
      '<tr><td style="vertical-align:middle;padding-right:18px;">' + sigBubble() + '</td>' +
      '<td style="vertical-align:middle;border-left:2px solid #EADCC6;padding-left:18px;">' +
      '<div style="font-size:16px;font-weight:800;">' + f('sig-name', v.name) + '</div>' +
      '<div style="font-size:12px;font-weight:700;color:#6E6576;padding:2px 0 6px;">' + f('sig-title', v.title) + '</div>' +
      '<div style="font-size:18px;font-weight:800;letter-spacing:-0.03em;padding-bottom:6px;"><span style="color:#E64C81;">hello</span> <span style="color:#312B3D;">paint</span></div>' +
      '<div style="font-size:12px;line-height:1.7;">' + emailEl + '<br>' + siteEl + ' <span style="color:#EADCC6;">|</span> ' + igEl + '</div>' +
      '<div style="padding-top:8px;font-family:Georgia,serif;font-style:italic;font-size:12px;color:#B83A66;">' + f('sig-tag', v.tag) + '</div></td></tr></table>';
  }

  /* ---------- motion posters ------------------------------------------- */
  var MOTIONS = [
    {
      name: 'brand-motion', sub: 'photo → painted by you', href: 'motion/brand-motion.html',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#FBF4E8"/><g transform="translate(132 26) scale(0.96)">' +
        HP.snapshot('#312B3D') + '</g><circle cx="180" cy="150" r="22" fill="#E64C81"/><path d="M173 140 L173 160 L190 150 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'smile-wink', sub: 'logo · the smile winks', href: 'motion/logo-smile-wink.html',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#FBF4E8"/><g transform="translate(130 36) scale(1.2)">' +
        HP.smile() + '</g><circle cx="180" cy="168" r="20" fill="#E64C81"/><path d="M173 159 L173 177 L189 168 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'palette', sub: 'logo · dabs form the dots', href: 'motion/logo-palette.html', bg: '#312B3D',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#312B3D"/>' + HP.dots(126, 92, 16, 56) +
        '<circle cx="180" cy="160" r="20" fill="#F6C744"/><path d="M173 151 L173 169 L189 160 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'wordmark', sub: 'paints in stroke by stroke', href: 'motion/logo-wordmark.html',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#FBF4E8"/>' +
        HP.wordmark({ x: 180, y: 110, size: 58, anchor: 'middle' }) +
        '<circle cx="180" cy="160" r="18" fill="#E64C81"/><path d="M174 152 L174 168 L188 160 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'berry · love', sub: 'a heart pops over the smile', href: 'motion/motion-berry.html', bg: '#E64C81',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#E64C81"/>' +
        '<path d="M180 96 L165 81 C158 74 162 64 171 64 C176 64 179 68 180 71 C181 68 184 64 189 64 C198 64 202 74 195 81 Z" fill="#FFFDF8"/>' +
        '<circle cx="180" cy="150" r="20" fill="#F6C744"/><path d="M173 141 L173 159 L189 150 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'yellow · spark', sub: 'sparkles burst, wordmark lands', href: 'motion/motion-yellow.html', bg: '#F6C744',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#F6C744"/>' +
        '<path d="M180 56 C184 84 194 94 222 98 C194 102 184 112 180 140 C176 112 166 102 138 98 C166 94 176 84 180 56 Z" fill="#312B3D"/>' +
        '<circle cx="180" cy="166" r="18" fill="#E64C81"/><path d="M174 158 L174 174 L188 166 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'green · brush', sub: 'a brush paints the hill', href: 'motion/motion-green.html', bg: '#5BA86B',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#5BA86B"/>' +
        '<path d="M120 120 Q180 92 240 120 L240 150 L120 150 Z" fill="#FFFDF8"/>' +
        '<circle cx="180" cy="168" r="18" fill="#F6C744"/><path d="M174 160 L174 176 L188 168 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'light blue · develop', sub: 'a polaroid develops', href: 'motion/motion-sky.html', bg: '#BFE6F2',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#BFE6F2"/>' +
        '<rect x="150" y="44" width="60" height="74" rx="6" fill="#FFFDF8" stroke="#312B3D" stroke-width="4"/><rect x="157" y="51" width="46" height="44" fill="#5BA86B"/>' +
        '<circle cx="180" cy="158" r="18" fill="#E64C81"/><path d="M174 150 L174 166 L188 158 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'teal · pop', sub: 'the bubble pops in', href: 'motion/motion-teal.html', bg: '#15A39A',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#15A39A"/><g transform="translate(130 30) scale(1.0)">' +
        HP.bubble('#FFFDF8', '#FFFDF8', '#FFFDF8') + '</g>' +
        '<circle cx="180" cy="170" r="16" fill="#F6C744"/><path d="M174 162 L174 178 L188 170 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'ink · pop', sub: 'the bubble pops in', href: 'motion/motion-pop-ink.html', bg: '#312B3D',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#312B3D"/><g transform="translate(130 30)">' + HP.bubble('#FFFDF8', '#FFFDF8', '#BFE6F2') + '</g>' +
        '<circle cx="180" cy="172" r="16" fill="#F6C744"/><path d="M174 164 L174 180 L188 172 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'berry · pop', sub: 'the bubble pops in', href: 'motion/motion-pop-berry.html', bg: '#E64C81',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#E64C81"/><g transform="translate(130 30)">' + HP.bubble('#FFFDF8', '#FFFDF8', '#BFE6F2') + '</g>' +
        '<circle cx="180" cy="172" r="16" fill="#F6C744"/><path d="M174 164 L174 180 L188 172 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'yellow · pop', sub: 'the bubble pops in', href: 'motion/motion-pop-yellow.html', bg: '#F6C744',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#F6C744"/><g transform="translate(130 30)">' + HP.bubble('#FFFDF8', '#312B3D', '#312B3D') + '</g>' +
        '<circle cx="180" cy="172" r="16" fill="#E64C81"/><path d="M174 164 L174 180 L188 172 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'green · pop', sub: 'the bubble pops in', href: 'motion/motion-pop-green.html', bg: '#5BA86B',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#5BA86B"/><g transform="translate(130 30)">' + HP.bubble('#FFFDF8', '#FFFDF8', '#BFE6F2') + '</g>' +
        '<circle cx="180" cy="172" r="16" fill="#F6C744"/><path d="M174 164 L174 180 L188 172 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'light blue · pop', sub: 'the bubble pops in', href: 'motion/motion-pop-sky.html', bg: '#BFE6F2',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#BFE6F2"/><g transform="translate(130 30)">' + HP.bubble('#FFFDF8', '#312B3D', '#312B3D') + '</g>' +
        '<circle cx="180" cy="172" r="16" fill="#E64C81"/><path d="M174 164 L174 180 L188 172 Z" fill="#fff"/>', 'style="width:100%;height:auto"')
    },
    {
      name: 'ink · smile wink', sub: 'the smile winks (white)', href: 'motion/motion-wink-ink.html', bg: '#312B3D',
      poster: HP.svg(360, 200, '<rect width="360" height="200" fill="#312B3D"/><g transform="translate(130 36) scale(1.2)">' + HP.smile({ mouth: '#E64C81', eye: '#15A39A', spark: '#F6C744' }) + '</g>' +
        '<circle cx="180" cy="170" r="18" fill="#F6C744"/><path d="M173 161 L173 179 L189 170 Z" fill="#312B3D"/>', 'style="width:100%;height:auto"')
    }
  ];

  /* ---------- events ---------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var secBtn = e.target.closest('[data-seczip]');
    if (secBtn) { downloadSectionZip(secBtn.dataset.seczip, secBtn); return; }
    var b = e.target.closest('.dlb'); if (!b) return;
    var act = b.dataset.act;
    if (act === 'copysig') {
      var tmp = document.createElement('div'); tmp.innerHTML = emailSig(sigRead(), false);
      var html = tmp.innerHTML;
      if (navigator.clipboard && navigator.clipboard.write) {
        navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([html], { type: 'text/plain' }) })]).then(flash.bind(null, b, 'Copied!'), function () { fallbackCopy(html, b); });
      } else fallbackCopy(html, b);
      return;
    }
    if (act === 'resetsig') {
      try { localStorage.removeItem('hp-sig'); } catch (err) {}
      var wrap = document.getElementById('sigwrap'); if (wrap) wrap.innerHTML = emailSig(SIG_DEF, true);
      flash(b, 'Reset'); return;
    }
    if (b.dataset.i == null) return;
    var r = REG[+b.dataset.i];
    if (act === 'svg') downloadSVG(r.svg, r.file);
    else if (act === 'png') downloadPNG(r.svg, r.w, r.h, r.file, b);
    else if (act === 'zip') downloadZip(r, b);
  });
  function flash(b, txt) { var o = b.textContent; b.textContent = txt; setTimeout(function () { b.textContent = o; }, 1400); }
  function fallbackCopy(html, b) {
    var ta = document.createElement('textarea'); ta.value = html; document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    if (ok) { flash(b, 'Copied!'); if (window.HPToast) window.HPToast('Copied to clipboard'); }
    else if (window.HPToast) window.HPToast('Copy failed, select the text manually');
  }

  // persist signature edits so a refresh keeps the user's details
  document.addEventListener('input', function (e) {
    if (e.target && e.target.closest && e.target.closest('#sigwrap')) {
      try { localStorage.setItem('hp-sig', JSON.stringify(sigRead())); } catch (err) {}
    }
  });

  // motion modal: play each looping reveal in-page (works in the single file)
  function closeMotion() {
    var modal = document.getElementById('motion-modal'); if (!modal) return;
    modal.hidden = true; var f = document.getElementById('mm-frame'); if (f) f.srcdoc = '';
    if (window.__hpMotionReturn) { try { window.__hpMotionReturn.focus(); } catch (e) {} window.__hpMotionReturn = null; }
  }
  document.addEventListener('click', function (e) {
    var open = e.target.closest('[data-motion]');
    if (open) {
      var href = open.getAttribute('data-motion');
      var doc = (window.HP && HP.MOTION_HTML) ? HP.MOTION_HTML[href] : null;
      if (doc) {
        e.preventDefault();
        var f = document.getElementById('mm-frame'); var modal = document.getElementById('motion-modal');
        if (f && modal) {
          window.__hpMotionReturn = document.activeElement;
          f.srcdoc = doc; modal.hidden = false;
          var mx = modal.querySelector('.mm-x'); if (mx) mx.focus();
        }
      }
      return;
    }
    if (e.target.closest('[data-close]')) { closeMotion(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMotion(); });

  // expose for self-test + kit chrome
  window.HP_ASSET_REG = REG;
  window.HP_APP = { svgToPngBlob: svgToPngBlob, zipStore: zipStore, downloadZip: downloadZip };

  render();
})();
