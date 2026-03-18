/* ============================================
   CONVITE — Coastal Minimalist
   ============================================ */
(function () {
  'use strict';

  var WEDDING = new Date('2026-04-17T16:00:00-03:00');
  var PAGES = 3;
  var cur = 1;
  var flipping = false;
  var audioOn = false;
  var aCtx, osc, gain;
  var tx0 = 0, ty0 = 0;

  var envelope = document.getElementById('envelope');
  var flipbook = document.getElementById('flipbook');
  var pages = flipbook.querySelectorAll('.page');
  var dots = document.getElementById('pageDots');
  var prev = document.getElementById('navPrev');
  var next = document.getElementById('navNext');
  var audioBtn = document.getElementById('audioToggle');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMessage');

  /* ---------- INIT ---------- */
  function init() {
    setupEnvelope();
    buildDots();
    updateNav();
    countdown();
    setupPix();
    setupAudio();
    setupTouch();
    setupKeys();
    setTimeout(function () {
      pages[0].querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('animated'); });
    }, 300);
  }

  /* ---------- ENVELOPE ---------- */
  function setupEnvelope() {
    if (!envelope) return;
    function open() {
      envelope.classList.add('opening');
      setTimeout(function () { envelope.classList.add('hidden'); }, 1000);
    }
    envelope.addEventListener('click', open);
    envelope.addEventListener('touchend', function (e) { e.preventDefault(); open(); });
  }

  /* ---------- FLIPBOOK ---------- */
  function goTo(target) {
    if (flipping || target === cur || target < 1 || target > PAGES) return;
    flipping = true;
    var dir = target > cur ? 'next' : 'prev';
    var cEl = pages[cur - 1];
    var tEl = pages[target - 1];

    if (dir === 'next') {
      tEl.classList.add('behind');
      tEl.classList.remove('active');
      cEl.classList.add('flipping');
      setTimeout(function () {
        cEl.classList.remove('active', 'flipping');
        tEl.classList.remove('behind');
        tEl.classList.add('active');
        cur = target;
        updateNav();
        animPage(cur);
        flipping = false;
      }, 700);
    } else {
      tEl.classList.add('active');
      tEl.style.transform = 'rotateY(-180deg)';
      tEl.style.zIndex = '20';
      tEl.style.opacity = '1';
      tEl.style.pointerEvents = 'none';
      cEl.classList.add('behind');
      cEl.classList.remove('active');
      void tEl.offsetWidth;
      requestAnimationFrame(function () {
        tEl.style.transform = 'rotateY(0deg)';
        setTimeout(function () {
          tEl.style.removeProperty('z-index');
          tEl.style.removeProperty('transform');
          tEl.style.removeProperty('opacity');
          tEl.style.removeProperty('pointer-events');
          tEl.classList.add('active');
          cEl.classList.remove('behind');
          cur = target;
          updateNav();
          animPage(cur);
          flipping = false;
        }, 700);
      });
    }
  }

  function animPage(n) {
    var els = pages[n - 1].querySelectorAll('.fade-up');
    els.forEach(function (el) {
      el.classList.remove('animated');
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
    });
    setTimeout(function () {
      els.forEach(function (el) {
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        el.classList.add('animated');
      });
    }, 50);
  }

  /* ---------- DOTS / NAV ---------- */
  function buildDots() {
    for (var i = 1; i <= PAGES; i++) {
      var d = document.createElement('button');
      d.className = 'page-dot' + (i === 1 ? ' active' : '');
      d.setAttribute('aria-label', 'Página ' + i);
      (function (p) { d.addEventListener('click', function () { goTo(p); }); })(i);
      dots.appendChild(d);
    }
  }

  function updateNav() {
    dots.querySelectorAll('.page-dot').forEach(function (d, i) { d.classList.toggle('active', i + 1 === cur); });
    prev.disabled = cur === 1;
    next.disabled = cur === PAGES;
  }

  /* ---------- TOUCH / CLICK ---------- */
  function setupTouch() {
    flipbook.addEventListener('touchstart', function (e) { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, { passive: true });
    flipbook.addEventListener('touchend', function (e) {
      if (!e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - tx0;
      var dy = e.changedTouches[0].clientY - ty0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? goTo(cur + 1) : goTo(cur - 1); }
    }, { passive: true });

    prev.addEventListener('click', function () { goTo(cur - 1); });
    next.addEventListener('click', function () { goTo(cur + 1); });

    flipbook.addEventListener('click', function (e) {
      if (e.target.closest('button, a, input, select, textarea')) return;
      var r = flipbook.getBoundingClientRect();
      var x = e.clientX - r.left;
      if (x > r.width * 0.7) goTo(cur + 1);
      else if (x < r.width * 0.3) goTo(cur - 1);
    });
  }

  function setupKeys() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(cur + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(cur - 1); }
    });
  }

  /* ---------- COUNTDOWN ---------- */
  function countdown() {
    var dE = document.getElementById('days');
    var hE = document.getElementById('hours');
    var mE = document.getElementById('minutes');
    var sE = document.getElementById('seconds');
    if (!dE) return;

    function tick() {
      var diff = WEDDING - new Date();
      if (diff <= 0) { dE.textContent = '0'; hE.textContent = '00'; mE.textContent = '00'; sE.textContent = '00'; return; }
      var d = Math.floor(diff / 864e5);
      var h = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
      var m = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
      var s = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
      if (dE.textContent !== String(d)) pop(dE, String(d));
      if (hE.textContent !== h) pop(hE, h);
      if (mE.textContent !== m) pop(mE, m);
      if (sE.textContent !== s) pop(sE, s);
    }

    function pop(el, v) {
      el.style.transform = 'scale(1.08)';
      el.textContent = v;
      setTimeout(function () { el.style.transform = 'scale(1)'; }, 150);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- PIX ---------- */
  function setupPix() {
    var btn = document.getElementById('btnCopyPix');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var key = 'ana.pedro@email.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(key).then(function () { showToast('Chave PIX copiada!'); btn.textContent = 'Copiado!'; setTimeout(function () { btn.textContent = 'Copiar'; }, 2000); });
      } else {
        var t = document.createElement('textarea'); t.value = key; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
        showToast('Chave PIX copiada!'); btn.textContent = 'Copiado!'; setTimeout(function () { btn.textContent = 'Copiar'; }, 2000);
      }
    });
  }

  /* ---------- TOAST ---------- */
  function showToast(m) { toastMsg.textContent = m; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 3000); }

  /* ---------- AUDIO ---------- */
  function setupAudio() { audioBtn.addEventListener('click', toggleA); }
  function toggleA() { audioOn ? stopA() : startA(); }
  function startA() {
    try {
      if (!aCtx) aCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = aCtx.createOscillator(); gain = aCtx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(440, aCtx.currentTime);
      gain.gain.setValueAtTime(0, aCtx.currentTime); gain.gain.linearRampToValueAtTime(0.03, aCtx.currentTime + 1);
      osc.connect(gain); gain.connect(aCtx.destination); osc.start();
      audioOn = true; updIcon();
    } catch (e) {}
  }
  function stopA() {
    if (gain) { gain.gain.linearRampToValueAtTime(0, aCtx.currentTime + 0.5); setTimeout(function () { if (osc) { osc.stop(); osc = null; } }, 500); }
    audioOn = false; updIcon();
  }
  function updIcon() {
    audioBtn.querySelector('.audio-on').style.display = audioOn ? 'block' : 'none';
    audioBtn.querySelector('.audio-off').style.display = audioOn ? 'none' : 'block';
  }

  /* ---------- GO ---------- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
