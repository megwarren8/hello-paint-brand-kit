/* hello paint kit chrome: one rail + search across every page, toasts,
   and a byte-verified self-test. Include after the page's own <div id="app">
   content (or its render script) so DOM search-scan sees real content. */
(function () {
  var HERE = location.pathname.split('/').pop() || 'index.html';
  var HASH = location.hash;

  // honour a reader's reduced-motion setting for every scripted scroll
  function hpSmooth() {
    return (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
  }

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
    { href: 'listing-pack.html', n: '', label: 'Listing pack', top: true },
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
    head.innerHTML = svgMark() + '<a href="index.html"><span class="hello">hello</span> paint<small>Brand kit</small></a>' +
      '<button class="hp-collapse-btn" id="hp-rail-collapse-btn" aria-controls="hp-kit-rail" aria-label="Collapse menu" title="Collapse menu">‹</button>';
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
    burger.id = 'hp-kit-burger'; burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-controls', 'hp-kit-rail'); burger.setAttribute('aria-expanded', 'false');
    burger.textContent = '☰';
    burger.onclick = function () { rail.classList.toggle('open'); };
    document.body.appendChild(burger);

    // keep the burger's aria-expanded in sync no matter how the drawer opens or closes
    if (window.MutationObserver) {
      new MutationObserver(function () {
        burger.setAttribute('aria-expanded', rail.classList.contains('open') ? 'true' : 'false');
      }).observe(rail, { attributes: true, attributeFilter: ['class'] });
    }

    // tapping outside the open mobile drawer closes it (before, only the burger did)
    document.addEventListener('click', function (e) {
      if (rail.classList.contains('open') && !e.target.closest('#hp-kit-rail') && !e.target.closest('#hp-kit-burger')) {
        rail.classList.remove('open');
      }
    });

    var reopen = document.createElement('button');
    reopen.id = 'hp-rail-reopen'; reopen.setAttribute('aria-label', 'Show menu'); reopen.setAttribute('aria-controls', 'hp-kit-rail'); reopen.title = 'Show menu';
    reopen.innerHTML = svgMark() + '<span>menu</span>';
    document.body.appendChild(reopen);

    var toast = document.createElement('div'); toast.id = 'hp-toast';
    toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    window.HPToast = function (msg) {
      toast.textContent = msg; toast.classList.add('show');
      clearTimeout(window.__hpToastT);
      window.__hpToastT = setTimeout(function () { toast.classList.remove('show'); }, 1800);
    };

    return { input: search.querySelector('#hp-search-input'), results: search.querySelector('#hp-kit-results'), rail: rail, reopen: reopen };
  }

  /* ---------- collapse / bring back (desktop only, persisted) ---------- */
  function initCollapse(rail, reopen) {
    var KEY = 'hp-rail-collapsed';
    function set(collapsed) {
      document.body.classList.toggle('hp-rail-collapsed', collapsed);
      try { collapsed ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {}
    }
    var collapseBtn = document.getElementById('hp-rail-collapse-btn');
    if (collapseBtn) collapseBtn.addEventListener('click', function () { set(true); });
    reopen.addEventListener('click', function () { set(false); });
    var was; try { was = localStorage.getItem(KEY) === '1'; } catch (e) { was = false; }
    if (was) set(true);
  }

  /* ---------- back to top ---------- */
  function buildBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'hp-backtotop'; btn.setAttribute('aria-label', 'Back to top'); btn.title = 'Back to top';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="6"/><polyline points="6 12 12 6 18 12"/></svg>';
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: hpSmooth() }); });
    document.body.appendChild(btn);
    return btn;
  }

  /* ---------- scrollspy: highlight the nav item for the section in view --- */
  // Polls on a short interval rather than IntersectionObserver/scroll events:
  // both can go silent in some embedded/automated viewports (no compositor
  // tick), so a plain getBoundingClientRect poll is what actually stays
  // reliable everywhere, and it's cheap for a page with ~12 sections.
  function scrollspyLinks() {
    var links = Array.prototype.filter.call(document.querySelectorAll('#hp-kit-rail nav a'), function (a) {
      var href = a.getAttribute('href') || '';
      return href.split('#')[0] === HERE && href.indexOf('#') !== -1;
    });
    var byId = {}, targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').split('#')[1];
      var el = document.getElementById(id);
      if (el) { byId[id] = a; targets.push({ id: id, el: el }); }
    });
    return { links: links, byId: byId, targets: targets };
  }

  function startPoller(backToTopBtn) {
    var spy = scrollspyLinks();
    var current = null;
    function tick() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (backToTopBtn) backToTopBtn.classList.toggle('show', (window.scrollY || document.documentElement.scrollTop || 0) > 480);
      if (!spy.targets.length) return;
      var bandTop = vh * 0.15, bandBottom = vh * 0.3; // "active" reading line sits in the top third
      var hit = null;
      for (var i = 0; i < spy.targets.length; i++) {
        var r = spy.targets[i].el.getBoundingClientRect();
        if (r.top <= bandTop && r.bottom >= bandBottom) { hit = spy.targets[i].id; break; }
      }
      if (!hit) {
        // fallback: the last section whose top has already scrolled past the band
        // (nothing has, e.g. we're still above section 1) leaves hit as null
        for (var j = 0; j < spy.targets.length; j++) {
          if (spy.targets[j].el.getBoundingClientRect().top <= bandTop) hit = spy.targets[j].id;
        }
      }
      if (hit !== current) {
        current = hit;
        spy.links.forEach(function (a) { a.classList.remove('on'); });
        if (hit && spy.byId[hit]) spy.byId[hit].classList.add('on');
      }
    }
    tick();
    setInterval(tick, 150);
  }

  /* ---------- footer copyright, injected after this page's own .foot ---- */
  function addCopyright() {
    if (document.querySelector('.hp-kit-copyright')) return;
    var year = new Date().getFullYear();
    var line = document.createElement('p');
    line.className = 'hp-kit-copyright';
    line.innerHTML = '© ' + year + ' Megan Warren &middot; hello paint';
    var foot = document.querySelector('.foot');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(line, foot.nextSibling);
    else (document.querySelector('.wrap') || document.body).appendChild(line);
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

  var _hpSearchIdx = [];
  function wireSearch(ui) {
    _hpSearchIdx = buildIndex();               // (re)build the index on every call
    if (ui.input.__hpWired) return;            // but bind the listeners only once
    ui.input.__hpWired = true;

    // combobox semantics for the field + its results list
    ui.input.setAttribute('role', 'combobox');
    ui.input.setAttribute('aria-autocomplete', 'list');
    ui.input.setAttribute('aria-controls', 'hp-kit-results');
    ui.input.setAttribute('aria-expanded', 'false');
    ui.results.setAttribute('role', 'listbox');
    ui.results.setAttribute('aria-label', 'search results');

    // a visually-hidden live region so screen readers hear the match count
    var live = document.createElement('span');
    live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;';
    ui.input.parentNode.appendChild(live);

    var selIndex = -1;
    function expanded(on) { ui.input.setAttribute('aria-expanded', on ? 'true' : 'false'); }
    function anchorsNow() { return Array.prototype.slice.call(ui.results.querySelectorAll('a')); }
    function closeResults() {
      ui.results.classList.remove('open'); expanded(false); selIndex = -1;
      ui.input.removeAttribute('aria-activedescendant');
    }
    function highlight() {
      var anchors = anchorsNow();
      anchors.forEach(function (a, i) {
        var on = i === selIndex;
        a.classList.toggle('sel', on);
        a.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (selIndex >= 0 && anchors[selIndex]) {
        anchors[selIndex].scrollIntoView({ block: 'nearest' });
        ui.input.setAttribute('aria-activedescendant', anchors[selIndex].id);
      } else {
        ui.input.removeAttribute('aria-activedescendant');
      }
    }
    function render(list) {
      selIndex = -1;
      if (!list.length) {
        ui.results.innerHTML = '<div class="hp-noresult">No matches.</div>';
        ui.results.classList.add('open'); expanded(true); live.textContent = 'no matches';
        return;
      }
      var shown = list.slice(0, 24);
      ui.results.innerHTML = shown.map(function (r, i) {
        return '<a id="hp-opt-' + i + '" role="option" aria-selected="false" href="' + r.href + '" data-scroll="' + (r.scrollTarget ? '1' : '') + '"><b>' + r.label + '</b><small>' + r.sub + '</small></a>';
      }).join('');
      ui.results.classList.add('open'); expanded(true);
      live.textContent = shown.length + (shown.length === 1 ? ' match' : ' matches');
      var anchors = anchorsNow();
      shown.forEach(function (r, i) {
        if (r.scrollTarget) {
          anchors[i].addEventListener('click', function (e) {
            if (r.href.split('#')[0] === HERE || r.href.indexOf('#') === 0) {
              e.preventDefault();
              r.scrollTarget.scrollIntoView({ behavior: hpSmooth(), block: 'center' });
              r.scrollTarget.style.outline = '3px solid #F6C744';
              setTimeout(function () { r.scrollTarget.style.outline = ''; }, 1400);
              closeResults(); ui.input.value = '';
              var railSel = document.getElementById('hp-kit-rail');
              if (railSel) railSel.classList.remove('open');
            }
          });
        }
      });
    }
    ui.input.addEventListener('input', function () {
      var q = ui.input.value.trim().toLowerCase();
      if (!q) { closeResults(); return; }
      render(_hpSearchIdx.filter(function (r) { return r.label.toLowerCase().indexOf(q) !== -1; }));
    });
    // arrow keys move a highlight, Enter opens it, Escape closes the list
    ui.input.addEventListener('keydown', function (e) {
      var anchors = ui.results.classList.contains('open') ? anchorsNow() : [];
      if (e.key === 'ArrowDown' && anchors.length) {
        e.preventDefault(); selIndex = Math.min(selIndex + 1, anchors.length - 1); highlight();
      } else if (e.key === 'ArrowUp' && anchors.length) {
        e.preventDefault(); selIndex = Math.max(selIndex - 1, 0); highlight();
      } else if (e.key === 'Enter' && selIndex >= 0 && anchors[selIndex]) {
        e.preventDefault(); anchors[selIndex].click();
      } else if (e.key === 'Escape') {
        closeResults();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hp-search')) closeResults();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== ui.input && !/input|textarea/i.test((document.activeElement || {}).tagName || '')) {
        e.preventDefault();
        // make sure the field is actually on-screen before focusing it
        if (document.body.classList.contains('hp-rail-collapsed')) {
          document.body.classList.remove('hp-rail-collapsed');
          try { localStorage.removeItem('hp-rail-collapsed'); } catch (err) {}
        }
        var railNow = document.getElementById('hp-kit-rail');
        if (railNow && window.matchMedia && matchMedia('(max-width: 960px)').matches) railNow.classList.add('open');
        ui.input.focus();
      }
    });
  }

  /* ---------- skip link: first tab stop, jumps to the main content ---------- */
  function ensureSkipLink() {
    if (document.querySelector('.hp-skip')) return;
    var main = document.querySelector('main') || document.querySelector('.wrap');
    if (main && !main.id) main.id = 'hp-main';
    if (main) main.setAttribute('tabindex', '-1');
    var targetId = main ? main.id : '';
    var skip = document.createElement('a');
    skip.className = 'hp-skip'; skip.href = '#' + targetId; skip.textContent = 'skip to content';
    skip.addEventListener('click', function (e) {
      var t = targetId && document.getElementById(targetId);
      if (t) { e.preventDefault(); t.focus(); t.scrollIntoView(); }
    });
    document.body.insertBefore(skip, document.body.firstChild);
  }

  function init() {
    ensureSkipLink();
    var ui = buildRail();
    wireSearch(ui);
    initCollapse(ui.rail, ui.reopen);
    var backToTopBtn = buildBackToTop();
    startPoller(backToTopBtn);
    addCopyright();
    // if a page renders its cards asynchronously, refresh the search index once loaded
    window.addEventListener('load', function () {
      if (window.HPKit && window.HPKit.onContentReady) window.HPKit.onContentReady();
    });
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

  /* deep links + smooth in-page anchors -----------------------------------
     The asset library builds its 12 sections in JavaScript, so the browser's
     native jump to a #hash can run before those sections exist. This makes
     every section link reliable: it scrolls to the target once it is really
     in the DOM (on load and on hashchange), and turns same-page anchor clicks
     into a smooth scroll instead of a reload. It only ever acts on a #id that
     matches a real element, so any page without that id is left untouched. */
  function hpScrollToId(id, smooth) {
    if (!id) return false;
    var el = document.getElementById(id);
    if (!el) return false;
    var y = el.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop || 0) - 12;
    try { window.scrollTo({ top: y, behavior: smooth ? hpSmooth() : 'auto' }); }
    catch (e) { window.scrollTo(0, y); }
    return true;
  }
  function hpScrollToHash(smooth) {
    if (!location.hash) return;
    var id = decodeURIComponent(location.hash.slice(1));
    if (hpScrollToId(id, smooth)) {
      setTimeout(function () { hpScrollToId(id, false); }, 300);
    }
  }
  if (location.hash) {
    if (document.readyState === 'complete') hpScrollToHash(false);
    else window.addEventListener('load', function () { hpScrollToHash(false); });
  }
  window.addEventListener('hashchange', function () { hpScrollToHash(true); });
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (a.closest('[data-motion]') || a.closest('.hp-search') || a.closest('#hp-kit-results')) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('#') === -1) return;
    var parts = href.split('#'), pathN = parts[0].replace(/\.html$/, ''), id = parts[1];
    if (!id) return;
    var here = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
    if (pathN !== '' && pathN !== here) return;
    if (!document.getElementById(decodeURIComponent(id))) return;
    e.preventDefault();
    if (window.history && history.replaceState) history.replaceState(null, '', '#' + id);
    else location.hash = id;
    var railAnchor = document.getElementById('hp-kit-rail');
    if (railAnchor) railAnchor.classList.remove('open');
    hpScrollToId(decodeURIComponent(id), true);
  }, false);

})();
