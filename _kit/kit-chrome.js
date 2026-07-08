/* hello paint kit chrome: one rail + search across every page, toasts,
   and a byte-verified self-test. Include after the page's own <div id="app">
   content (or its render script) so DOM search-scan sees real content. */
(function () {
  var HERE = location.pathname.split('/').pop() || 'index.html';
  var HASH = location.hash;

  var NAV = [
    { href: 'index.html', n: '', label: 'Hub', top: true },
    { href: 'brand-book.html', n: '', label: 'Brand book', top: true },
    {
      href: 'asset-library.html', n: '', label: 'Asset library', top: true, kids: [
        { href: 'asset-library.html#logos', n: '01', label: 'Logos & lockups' },
        { href: 'asset-library.html#app-icons', n: '02', label: 'App & favicons' },
        { href: 'asset-library.html#avatars', n: '03', label: 'Profile pictures' },
        { href: 'asset-library.html#headers', n: '04', label: 'Social & email covers' },
        { href: 'asset-library.html#templates', n: '05', label: 'Social templates' },
        { href: 'asset-library.html#diecut', n: '06', label: 'Die-cut stickers' },
        { href: 'asset-library.html#stationery', n: '07', label: 'Print & packaging' },
        { href: 'asset-library.html#numbers', n: '08', label: 'Number sets' },
        { href: 'asset-library.html#watermarks', n: '09', label: 'Watermarks' },
        { href: 'asset-library.html#icons', n: '10', label: 'Icons & symbols' },
        { href: 'asset-library.html#extras', n: '11', label: 'QR & email signature' },
        { href: 'asset-library.html#motion', n: '12', label: 'Brand motion' }
      ]
    },
    { href: 'social-templates.html', n: '', label: 'Social showcase', top: true, star: true },
    { href: 'motion.html', n: '', label: 'Motion gallery', top: true },
    { href: 'copy-vault.html', n: '', label: 'Copy vault', top: true }
  ];

  function svgMark() {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M21 49 Q50 80 79 49" fill="none" stroke="#E64C81" stroke-width="14" stroke-linecap="round"/><path d="M47 36 Q61 28 75 30" fill="none" stroke="#15A39A" stroke-width="5.4" stroke-linecap="round"/><path d="M81 16 L83.4 19.6 L87 22 L83.4 24.4 L81 28 L78.6 24.4 L75 22 L78.6 19.6 Z" fill="#F6C744"/></svg>';
  }

  function isOn(href) {
    var h = href.split('#')[0];
    if (h !== HERE) return false;
    if (href.indexOf('#') === -1) return true;
    return ('#' + href.split('#')[1]) === HASH;
  }

  function buildRail() {
    var rail = document.createElement('div'); rail.id = 'hp-kit-rail';
    var head = document.createElement('div'); head.className = 'hp-rail-head';
    head.innerHTML = svgMark() + '<a href="index.html"><span class="hello">hello</span> paint<small>Brand kit</small></a>';
    rail.appendChild(head);

    var search = document.createElement('div'); search.className = 'hp-search';
    search.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.2" y2="16.2"/></svg>' +
      '<input id="hp-search-input" placeholder="Search the kit…" autocomplete="off"><kbd>/</kbd>' +
      '<div id="hp-kit-results"></div>';
    rail.appendChild(search);

    var nav = document.createElement('nav');
    NAV.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href; a.className = isOn(item.href) ? 'on' : '';
      a.innerHTML = (item.star ? '★ ' : '') + item.label;
      nav.appendChild(a);
      if (item.kids) {
        item.kids.forEach(function (k) {
          var ka = document.createElement('a');
          ka.href = k.href; ka.className = 'hp-kid' + (isOn(k.href) ? ' on' : '');
          ka.innerHTML = '<span class="hp-n">' + k.n + '</span> ' + k.label;
          nav.appendChild(ka);
        });
      }
    });
    rail.appendChild(nav);

    var foot = document.createElement('div'); foot.className = 'hp-rail-foot';
    foot.innerHTML = 'hello paint · brand kit<br><a href="https://megan-warren.com" target="_blank" rel="noopener">by Megan Warren →</a>';
    rail.appendChild(foot);

    document.body.appendChild(rail);
    document.body.classList.add('hp-railed');

    var burger = document.createElement('button');
    burger.id = 'hp-kit-burger'; burger.setAttribute('aria-label', 'Menu'); burger.textContent = '☰';
    burger.onclick = function () { rail.classList.toggle('open'); };
    document.body.appendChild(burger);

    var toast = document.createElement('div'); toast.id = 'hp-toast';
    document.body.appendChild(toast);
    window.HPToast = function (msg) {
      toast.textContent = msg; toast.classList.add('show');
      clearTimeout(window.__hpToastT);
      window.__hpToastT = setTimeout(function () { toast.classList.remove('show'); }, 1800);
    };

    return { input: search.querySelector('#hp-search-input'), results: search.querySelector('#hp-kit-results') };
  }

  /* ---------- search index: static nav map + on-page DOM scan ---------- */
  function buildIndex() {
    var idx = [];
    NAV.forEach(function (item) {
      idx.push({ label: item.label, sub: 'Page', href: item.href });
      if (item.kids) item.kids.forEach(function (k) { idx.push({ label: k.label, sub: 'Asset library · section ' + k.n, href: k.href }); });
    });
    // scan this page's own asset cards / headings for deep search
    document.querySelectorAll('.asset figcaption b').forEach(function (b) {
      var fig = b.closest('.asset');
      var sub = fig.querySelector('figcaption span');
      var id = fig.id || (fig.closest('section') ? '#' + fig.closest('section').id : '');
      idx.push({ label: b.textContent, sub: (sub ? sub.textContent : 'Asset') + ' · this page', href: HERE + (id && id[0] === '#' ? id : ''), scrollTarget: fig });
    });
    document.querySelectorAll('h2[id], h3[id]').forEach(function (h) {
      idx.push({ label: h.textContent, sub: 'On this page', href: HERE + '#' + h.id });
    });
    return idx;
  }

  function wireSearch(ui) {
    var idx = buildIndex();
    function render(list) {
      if (!list.length) { ui.results.innerHTML = '<div class="hp-noresult">No matches.</div>'; ui.results.classList.add('open'); return; }
      ui.results.innerHTML = list.slice(0, 24).map(function (r) {
        return '<a href="' + r.href + '" data-scroll="' + (r.scrollTarget ? '1' : '') + '"><b>' + r.label + '</b><small>' + r.sub + '</small></a>';
      }).join('');
      ui.results.classList.add('open');
      var anchors = ui.results.querySelectorAll('a');
      list.slice(0, 24).forEach(function (r, i) {
        if (r.scrollTarget) {
          anchors[i].addEventListener('click', function (e) {
            if (r.href.split('#')[0] === HERE || r.href.indexOf('#') === 0) {
              e.preventDefault();
              r.scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
              r.scrollTarget.style.outline = '3px solid #F6C744';
              setTimeout(function () { r.scrollTarget.style.outline = ''; }, 1400);
              ui.results.classList.remove('open'); ui.input.value = '';
            }
          });
        }
      });
    }
    ui.input.addEventListener('input', function () {
      var q = ui.input.value.trim().toLowerCase();
      if (!q) { ui.results.classList.remove('open'); return; }
      render(idx.filter(function (r) { return r.label.toLowerCase().indexOf(q) !== -1; }));
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hp-search')) ui.results.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== ui.input && !/input|textarea/i.test((document.activeElement || {}).tagName || '')) {
        e.preventDefault(); ui.input.focus();
      }
    });
  }

  function init() {
    var ui = buildRail();
    wireSearch(ui);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // apps that render content asynchronously (asset-library.html) call this
  // once their DOM is populated, so search picks up every card.
  window.HPKit = window.HPKit || {};
  window.HPKit.onContentReady = function () {
    var input = document.getElementById('hp-search-input');
    var results = document.getElementById('hp-kit-results');
    if (input && results) wireSearch({ input: input, results: results });
  };

  /* ---------- self-test: byte-verify every export action on this page --- */
  window.HPKit.runSelfTest = async function (sampleEvery) {
    sampleEvery = sampleEvery || 1;
    var out = [];
    function sig(bytes) {
      var b = new Uint8Array(bytes.slice(0, 4));
      if (b[0] === 0x89 && b[1] === 0x50) return 'PNG';
      if (b[0] === 0x50 && b[1] === 0x4B) return 'ZIP/PK';
      if (String.fromCharCode.apply(null, bytes.slice(0, 4)) === '%PDF') return 'PDF';
      var head = new TextDecoder().decode(bytes.slice(0, 5)).toLowerCase();
      if (head.indexOf('<svg') !== -1 || head.indexOf('<?xml') !== -1) return 'SVG/XML';
      return 'unknown(' + b.join(',') + ')';
    }
    var reg = window.HP_ASSET_REG || [];
    var app = window.HP_APP;
    if (!reg.length || !app) { return { page: HERE, note: 'no asset registry on this page', results: [] }; }
    for (var i = 0; i < reg.length; i += sampleEvery) {
      var r = reg[i];
      try {
        var svgBytes = new TextEncoder().encode(r.svg);
        var svgOk = sig(svgBytes) === 'SVG/XML';
        var pngBlob = await app.svgToPngBlob(r.svg, r.w, r.h);
        var pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
        var pngOk = sig(pngBytes) === 'PNG' && pngBytes.length > 0;
        out.push({ file: r.file, svgOk: svgOk, svgSize: svgBytes.length, pngOk: pngOk, pngSize: pngBytes.length });
      } catch (e) {
        out.push({ file: r.file, error: String(e) });
      }
    }
    var fails = out.filter(function (o) { return o.error || !o.svgOk || !o.pngOk; });
    return { page: HERE, tested: out.length, of: reg.length, fails: fails.length, failDetail: fails, results: out };
  };
})();
