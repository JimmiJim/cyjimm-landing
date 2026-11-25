(function () {
  'use strict';

  document.querySelectorAll('[data-global-nav]').forEach(function (header) {
    const button = header.querySelector('[data-global-nav-toggle]');
    const nav = header.querySelector('[data-global-nav-links]');
    if (!button || !nav) return;

    const isEnglish = /^en(?:-|$)/i.test(document.documentElement.lang);
    const gamesPath = isEnglish ? '/en/games/' : '/games/';
    const guides = nav.querySelector('a[href="' + (isEnglish ? '/en/guides/' : '/guides/') + '"]:not([lang])');
    if (guides && !nav.querySelector('a[href="' + gamesPath + '"]:not([lang])')) {
      const gamesLink = document.createElement('a');
      gamesLink.href = gamesPath;
      gamesLink.textContent = isEnglish ? 'Games' : 'משחקונים';
      guides.after(gamesLink);
    }

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
