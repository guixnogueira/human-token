/* Human Token | Unico — interactions
   1. "How it works" step carousel (no scroll-jacking)
   2. Client logo marquee (seamless loop)
*/
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Step carousel ---------- */
  var root = document.querySelector('.steps');
  if (root) {
    var DURATION = 6000; // ms per step, keep in sync with --step-duration in CSS
    var slides = Array.prototype.slice.call(root.querySelectorAll('.step'));
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var btnPrev = root.querySelector('[data-prev]');
    var btnNext = root.querySelector('[data-next]');
    var btnPause = root.querySelector('[data-pause]');
    var current = 0;
    var timer = null;
    var userStopped = reduceMotion; // reduced motion: no autoplay
    var hovering = false;
    var inView = false;

    function loadVideo(v) {
      if (!v || v.dataset.loaded) return;
      var src = v.getAttribute('data-src');
      if (!src) return;
      // Only attach the source if the file exists (videos are optional until motion is delivered).
      fetch(src, { method: 'HEAD' }).then(function (r) {
        if (r.ok) { v.src = src; v.dataset.loaded = '1'; if (v.closest('.step').classList.contains('is-active')) v.play().catch(function () {}); }
      }).catch(function () {});
      v.dataset.loaded = 'pending';
    }

    function go(index, fromUser) {
      index = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active);
        s.hidden = !active;
        var v = s.querySelector('video');
        if (v) {
          if (active) { loadVideo(v); if (v.src) { v.currentTime = 0; v.play().catch(function () {}); } }
          else if (v.src) { v.pause(); }
        }
      });
      tabs.forEach(function (t, i) {
        var active = i === index;
        t.classList.toggle('is-active', active);
        t.classList.toggle('is-done', i < index);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
      });
      current = index;
      if (fromUser) stop(true);
      restart();
    }

    function playing() { return !userStopped && !hovering && inView; }

    function restart() {
      clearTimeout(timer);
      // restart the CSS progress animation on the active tab
      root.classList.remove('is-playing');
      void root.offsetWidth;
      if (playing()) {
        root.classList.add('is-playing');
        timer = setTimeout(function () { go(current + 1, false); }, DURATION);
      }
    }

    function stop(byUser) {
      if (byUser) userStopped = true;
      btnPause.setAttribute('aria-pressed', userStopped ? 'true' : 'false');
      btnPause.querySelector('.ctrl-label').textContent = userStopped ? 'Play' : 'Pause';
    }

    btnPrev.addEventListener('click', function () { go(current - 1, true); });
    btnNext.addEventListener('click', function () { go(current + 1, true); });
    btnPause.addEventListener('click', function () {
      userStopped = !userStopped;
      stop(false);
      restart();
    });
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i, true); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, true); tabs[current].focus(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1, true); tabs[current].focus(); }
        if (e.key === 'Home') { e.preventDefault(); go(0, true); tabs[current].focus(); }
        if (e.key === 'End') { e.preventDefault(); go(tabs.length - 1, true); tabs[current].focus(); }
      });
    });

    // Pause while the pointer is over the carousel or focus is inside it
    var stage = root.querySelector('.container');
    stage.addEventListener('mouseenter', function () { hovering = true; restart(); });
    stage.addEventListener('mouseleave', function () { hovering = false; restart(); });
    stage.addEventListener('focusin', function () { hovering = true; restart(); });
    stage.addEventListener('focusout', function () { hovering = false; restart(); });

    // Swipe on touch devices
    var startX = null;
    var stageEl = root.querySelector('.steps-stage');
    stageEl.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    stageEl.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1), true);
    });

    // Only run autoplay while the section is on screen (no scroll-jacking)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        restart();
      }, { threshold: 0.35 }).observe(root);
    } else { inView = true; }

    stop(false);
    go(0, false);
  }

  /* ---------- 2. Logo marquee ---------- */
  var track = document.querySelector('.marquee-track');
  if (track && !reduceMotion) {
    var clone = track.cloneNode(true);
    Array.prototype.forEach.call(clone.children, function (li) {
      li.setAttribute('aria-hidden', 'true');
      var img = li.querySelector('img'); if (img) img.alt = '';
    });
    while (clone.firstChild) track.appendChild(clone.firstChild);
  }
})();
