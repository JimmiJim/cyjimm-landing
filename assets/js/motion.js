(function () {
  'use strict';

  var root = document.documentElement;
  var main = document.querySelector('main');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    root.classList.contains('cyjimm-a11y-stop-animations');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // The phishing trainer swaps sections in place; animating them would fight its own UI.
  var interactiveApp = document.body.classList.contains('phishing-page');

  var CARDS = '.card, .path-card, .pc-card, .pc-values-card, .portfolio-card, .about-stat, .skill, .visual-card, .step, .vendor, .box, .danger-item, .contact-form-card, .web-service-card, .web-quality-card, .web-needs-column, .web-scope-card, .web-process-list li';
  var NO_SPOT = '.pc-step';

  /* Header edge: a shadow appears only once content scrolls under it. */
  var scrolled = false;
  function onScroll() {
    var now = window.scrollY > 8;
    if (now !== scrolled) { scrolled = now; root.classList.toggle('mo-scrolled', now); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!main) return;

  /* Pointer-following light on cards. */
  main.querySelectorAll(CARDS).forEach(function (el) {
    if (el.matches(NO_SPOT) || el.closest('[aria-hidden="true"]')) return;
    el.classList.add('mo-spot');
    if (window.getComputedStyle(el).position === 'static') el.classList.add('mo-rel');
  });

  if (finePointer) {
    var pending = null, px = 0, py = 0;
    main.addEventListener('pointermove', function (e) {
      pending = e.target.closest && e.target.closest('.mo-spot');
      px = e.clientX; py = e.clientY;
      if (pending && !pending.moFrame) {
        var el = pending;
        el.moFrame = window.requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--mx', (px - r.left) + 'px');
          el.style.setProperty('--my', (py - r.top) + 'px');
          el.moFrame = 0;
        });
      }
    }, { passive: true });
  }

  /* Scroll reveal. Pages may mark [data-reveal] themselves; otherwise the hero and cards are tagged here. */
  if (reduceMotion || interactiveApp || !('IntersectionObserver' in window)) return;

  var targets = [];
  var h1 = main.querySelector('h1');
  if (h1 && !h1.closest('[data-reveal]')) {
    Array.prototype.forEach.call(h1.parentElement.children, function (child) {
      if (child.getAttribute('aria-hidden') === 'true' || child.querySelector(CARDS)) return;
      targets.push(child);
    });
  }
  main.querySelectorAll(CARDS + ', section h2').forEach(function (el) { targets.push(el); });
  targets.forEach(function (el) {
    var nested = el.parentElement && el.parentElement.closest('[data-reveal]');
    if (!nested && !el.closest('[aria-hidden="true"], .visually-hidden, .sr-only')) el.setAttribute('data-reveal', '');
  });

  var items = main.querySelectorAll('[data-reveal]');
  items.forEach(function (el) {
    var i = 0, sib = el.previousElementSibling;
    while (sib) { if (sib.hasAttribute('data-reveal')) i++; sib = sib.previousElementSibling; }
    if (i) el.style.setProperty('--mo-delay', Math.min(i, 8) * 70 + 'ms');
  });

  function finish(el) {
    if (el.classList.contains('mo-done')) return;
    el.classList.add('mo-done');
    el.style.removeProperty('--mo-delay');
  }

  root.classList.add('mo-reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      el.classList.add('mo-in', 'is-visible');
      // Hand the element back to its own transitions (hover etc.) once it has arrived.
      el.addEventListener('transitionend', function handler(ev) {
        if (ev.target !== el || ev.propertyName !== 'translate') return;
        el.removeEventListener('transitionend', handler);
        finish(el);
      });
      window.setTimeout(function () { finish(el); }, 2000);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach(function (el) { observer.observe(el); });
}());
