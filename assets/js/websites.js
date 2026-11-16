(function () {
  'use strict';

  // Reveal timing is shared (motion.js); this file adds the page's own motion.
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motionOff() {
    return reducedMotion.matches ||
      root.classList.contains('cyjimm-a11y-stop-animations');
  }

  /* Stagger index for lists that arrive in sequence. */
  document.querySelectorAll('.web-needs-column ul, .web-truth-list, .web-scope-card ul, .web-baseline-list').forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (item, i) { item.style.setProperty('--i', i); });
  });

  /* Process line fills with scroll; each step lights up when the line reaches it. */
  var processList = document.querySelector('.web-process-list');
  var hero = document.querySelector('.web-hero');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      if (processList) {
        var r = processList.getBoundingClientRect();
        var mark = vh * 0.62;
        var p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
        processList.style.setProperty('--progress', p.toFixed(4));
        Array.prototype.forEach.call(processList.children, function (li) {
          li.classList.toggle('is-active', li.getBoundingClientRect().top < mark);
        });
      }
      if (hero && !motionOff()) {
        hero.style.setProperty('--hero-scroll', Math.min(window.scrollY, hero.offsetHeight).toFixed(1));
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* Address bar types itself once. */
  var address = document.querySelector('.web-address');
  if (address && !motionOff()) {
    var textNode = Array.prototype.filter.call(address.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })[0];
    if (textNode) {
      var full = textNode.textContent.trim();
      var span = document.createElement('span');
      span.className = 'web-address-text';
      address.replaceChild(span, textNode);
      address.insertBefore(document.createTextNode(' '), span);
      span.style.setProperty('--caret', 1);
      var n = 0;
      var type = function () {
        span.textContent = full.slice(0, ++n);
        if (n < full.length) window.setTimeout(type, 42);
        else window.setTimeout(function () { span.style.setProperty('--caret', 0); }, 900);
      };
      window.setTimeout(type, 900);
    }
  }

  /* Pointer tilt on the hero mockup: a critically damped spring per axis (response 0.4s), so it
     always moves from its current value and settles without overshoot. */
  var stage = document.querySelector('.web-browser-stage');
  if (!stage || !hero) return;

  var omega = 2 * Math.PI / 0.4;
  var axes = { x: { v: 0, x: 0, t: 0 }, y: { v: 0, x: 0, t: 0 } };
  var frame = null, last = 0;

  function clearTilt() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    ['x', 'y'].forEach(function (k) { axes[k].v = axes[k].x = axes[k].t = 0; });
    ['--tilt-y', '--tilt-x', '--px', '--py'].forEach(function (name) {
      stage.style.removeProperty(name);
    });
  }

  function onMotionPreferenceChange() {
    if (motionOff()) clearTilt();
  }

  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionPreferenceChange);
  else if (reducedMotion.addListener) reducedMotion.addListener(onMotionPreferenceChange);
  document.addEventListener('cyjimm:accessibility-change', onMotionPreferenceChange);

  function step(now) {
    frame = null;
    if (motionOff()) { clearTilt(); return; }
    var dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    var settled = true;
    ['x', 'y'].forEach(function (k) {
      var a = axes[k];
      var acc = -omega * omega * (a.x - a.t) - 2 * omega * a.v;
      a.v += acc * dt;
      a.x += a.v * dt;
      if (Math.abs(a.x - a.t) > 0.0005 || Math.abs(a.v) > 0.0005) settled = false;
    });
    stage.style.setProperty('--tilt-y', (axes.x.x * 7).toFixed(3) + 'deg');
    stage.style.setProperty('--tilt-x', (axes.y.x * -5).toFixed(3) + 'deg');
    stage.style.setProperty('--px', axes.x.x.toFixed(4));
    stage.style.setProperty('--py', axes.y.x.toFixed(4));
    if (!settled) frame = window.requestAnimationFrame(step);
  }

  function kick() {
    if (frame !== null) return;
    last = performance.now();
    frame = window.requestAnimationFrame(step);
  }

  hero.addEventListener('pointermove', function (e) {
    // A mouse event is better evidence than viewport width or the reported primary pointer
    // (which may still be touch on a hybrid device).
    if (e.pointerType !== 'mouse' || motionOff()) return;
    var r = stage.getBoundingClientRect();
    axes.x.t = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    axes.y.t = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    kick();
  }, { passive: true });

  hero.addEventListener('pointerleave', function (e) {
    if (e.pointerType !== 'mouse' || motionOff() ||
      (frame === null && !stage.style.getPropertyValue('--px'))) return;
    axes.x.t = 0;
    axes.y.t = 0;
    kick();
  });
}());
