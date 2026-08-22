(function () {
  'use strict';

  document.querySelectorAll('[data-global-nav]').forEach(function (header) {
    const button = header.querySelector('[data-global-nav-toggle]');
    const nav = header.querySelector('[data-global-nav-links]');
    if (!button || !nav) return;

    function closeNavigation(returnFocus) {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      if (returnFocus) button.focus();
    }

    button.addEventListener('click', function () {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNavigation(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        event.preventDefault();
        closeNavigation(true);
      }
    });
  });
}());
