/* ============================================
   CONVITE — Coastal Minimalist
   ============================================ */
(function () {
  'use strict';

  var WEDDING = new Date('2026-04-17T16:00:00-03:00');
  var PAGES = 5;
  var cur = 1;
  var flipping = false;
  var audioOn = false;
  var introAudio = null;
  var mainAudio = null;
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
    // Auto-play intro on first user interaction anywhere
    function startIntroOnce() {
      if (!audioOn) playIntro();
      document.removeEventListener('click', startIntroOnce);
      document.removeEventListener('touchstart', startIntroOnce);
    }
    document.addEventListener('click', startIntroOnce);
    document.addEventListener('touchstart', startIntroOnce);

    function open() {
      // Start intro if not already playing
      if (!audioOn) playIntro();
      envelope.classList.add('opening');
      // Crossfade to main music
      setTimeout(function () { crossfadeToMain(); }, 400);
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
      var key = 'c1579833-e6d3-4cf1-a046-cfd3f73135c4';
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
  function setupAudio() {
    // Pre-create audio elements
    introAudio = new Audio('referencias/músicas/intro.mp3');
    introAudio.loop = true;
    introAudio.volume = 0.75;

    mainAudio = new Audio('referencias/músicas/Ordinary (Alex Warren)   Violin Cover by Violin Valenti - V. Valenti (youtube).mp3');
    mainAudio.loop = true;
    mainAudio.volume = 0;

    audioBtn.addEventListener('click', toggleA);
  }

  function playIntro() {
    try {
      introAudio.play().then(function () {
        audioOn = true;
        updIcon();
      }).catch(function () {});
    } catch (e) {}
  }

  function crossfadeToMain() {
    if (!audioOn) return;
    mainAudio.volume = 0;
    mainAudio.play().catch(function () {});

    // Fade out intro over 2s, fade in main over 2s
    var steps = 40;
    var interval = 2000 / steps;
    var step = 0;
    var fade = setInterval(function () {
      step++;
      var progress = step / steps;
      introAudio.volume = Math.max(0, 0.75 * (1 - progress));
      mainAudio.volume = Math.min(0.5, 0.5 * progress);
      if (step >= steps) {
        clearInterval(fade);
        introAudio.pause();
        introAudio.volume = 0.75;
      }
    }, interval);
  }

  function toggleA() { audioOn ? stopA() : startA(); }

  function startA() {
    // If envelope is still visible, play intro
    if (envelope && !envelope.classList.contains('hidden')) {
      playIntro();
    } else {
      // Envelope already gone, play main directly
      mainAudio.volume = 0.5;
      mainAudio.play().catch(function () {});
      audioOn = true;
      updIcon();
    }
  }

  function stopA() {
    introAudio.pause();
    mainAudio.pause();
    audioOn = false;
    updIcon();
  }

  function updIcon() {
    audioBtn.querySelector('.audio-on').style.display = audioOn ? 'block' : 'none';
    audioBtn.querySelector('.audio-off').style.display = audioOn ? 'none' : 'block';
  }

  /* ---------- LEAFLET MAP ---------- */
  function initMap() {
    var el = document.getElementById('leafletMap');
    if (!el || typeof L === 'undefined') return;
    var lat = -27.051866, lng = -48.588336;
    var map = L.map(el, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var icon = L.divIcon({
      className: 'map-pin',
      html: '<svg viewBox="0 0 24 24" width="32" height="32" fill="#c9a96e" stroke="#8b6914" stroke-width="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.marker([lat, lng], { icon: icon }).addTo(map);
    // Fix map rendering when page becomes visible
    var observer = new MutationObserver(function () {
      var page = el.closest('.page');
      if (page && page.classList.contains('active')) {
        setTimeout(function () { map.invalidateSize(); }, 100);
      }
    });
    var page3 = el.closest('.page');
    if (page3) observer.observe(page3, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- GO ---------- */
  function boot() { init(); initMap(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
