/* hello paint · motion export — adds WebM + HTML download buttons to any
   motion page that has an <svg id="reel"> and a .controls bar.
   WebM: re-draws the live SVG onto a canvas each frame and records ~one loop
   with MediaRecorder. HTML: saves the page itself (self-contained, loops). */
(function () {
  var reel = document.getElementById('reel');
  var bar = document.querySelector('.controls');
  if (!reel || !bar) return;

  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 1500);
  }
  var slug = (document.title.split('·').pop() || 'motion').trim().replace(/\s+/g, '-').toLowerCase();

  function downloadHTML() {
    var html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    save(new Blob([html], { type: 'text/html' }), 'hello-paint-' + slug + '.html');
  }

  function vb() { var v = reel.getAttribute('viewBox').split(/\s+/); return { w: +v[2], h: +v[3] }; }

  async function downloadWebM(btn) {
    if (!('MediaRecorder' in window) || !HTMLCanvasElement.prototype.captureStream) {
      alert('This browser can’t record WebM — use the HTML download instead.'); return;
    }
    var label = btn.textContent; btn.textContent = '● rec…'; btn.disabled = true;
    try {
      var d = vb(), size = 800, cv = document.createElement('canvas');
      cv.width = size; cv.height = Math.round(size * d.h / d.w);
      var ctx = cv.getContext('2d');
      var stream = cv.captureStream(30);
      var mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(function (m) { return MediaRecorder.isTypeSupported(m); });
      var rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
      var blobs = []; rec.ondataavailable = function (e) { if (e.data.size) blobs.push(e.data); };
      var done = new Promise(function (r) { rec.onstop = r; });
      var DUR = 5200, t0 = performance.now(), running = true;
      rec.start();
      (function drawLoop() {
        if (!running) return;
        var svg = new XMLSerializer().serializeToString(reel);
        var img = new Image();
        img.onload = function () { ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        if (performance.now() - t0 < DUR) requestAnimationFrame(drawLoop);
        else { running = false; setTimeout(function () { rec.stop(); }, 120); }
      })();
      await done;
      save(new Blob(blobs, { type: 'video/webm' }), 'hello-paint-' + slug + '.webm');
    } catch (e) { alert('WebM capture failed — the HTML download still works.'); }
    btn.textContent = label; btn.disabled = false;
  }

  function mk(txt, fn) {
    var b = document.createElement('button'); b.textContent = txt;
    b.style.cssText = 'font-family:inherit;font-weight:800;font-size:13px;color:#312B3D;background:#FBF4E8;border:none;border-radius:999px;padding:10px 16px;cursor:pointer;';
    b.onclick = function () { fn(b); }; return b;
  }
  bar.appendChild(mk('↓ WebM', downloadWebM));
  bar.appendChild(mk('↓ HTML', function () { downloadHTML(); }));
})();
