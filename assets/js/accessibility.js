(function () {
  'use strict';

  const STORAGE_KEY = 'cyjimm_accessibility_settings';
  const THEME_STORAGE_KEY = 'cyjimm_theme_preference';
  const defaults = {
    textScale: 1,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    readableFont: false,
    stopAnimations: false
  };

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const text = isEnglish ? {
    trigger: 'Accessibility options',
    title: 'Accessibility options',
    increase: 'Increase text size',
    decrease: 'Decrease text size',
    contrast: 'High contrast',
    grayscale: 'Grayscale',
    links: 'Highlight links',
    font: 'Readable font',
    motion: 'Stop non-essential animations',
    reset: 'Reset accessibility settings',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    updated: 'Accessibility settings updated',
    resetDone: 'Accessibility settings reset'
  } : {
    trigger: 'אפשרויות נגישות',
    title: 'אפשרויות נגישות',
    increase: 'הגדלת טקסט',
    decrease: 'הקטנת טקסט',
    contrast: 'ניגודיות גבוהה',
    grayscale: 'גווני אפור',
    links: 'הדגשת קישורים',
    font: 'גופן קריא',
    motion: 'עצירת הנפשות לא חיוניות',
    reset: 'איפוס הגדרות נגישות',
    themeLight: 'מעבר למצב בהיר',
    themeDark: 'מעבר למצב כהה',
    updated: 'הגדרות הנגישות עודכנו',
    resetDone: 'הגדרות הנגישות אופסו'
  };

  let state = loadState();
  let trigger;
  let themeTrigger;
  let panel;
  let status;
  const toggleButtons = {};

  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {
      // Fall back to the site's established dark appearance when storage is unavailable.
    }
    return 'dark';
  }

  let theme = loadTheme();

  function applyTheme() {
    const lightMode = theme === 'light';
    document.documentElement.setAttribute('data-cyjimm-theme', theme);
    if (!themeTrigger) return;
    const label = lightMode ? text.themeDark : text.themeLight;
    themeTrigger.setAttribute('aria-label', label);
    themeTrigger.setAttribute('title', label);
    themeTrigger.setAttribute('aria-pressed', String(lightMode));
    themeTrigger.textContent = lightMode ? '☾' : '☀';
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // The theme switch remains usable when storage is unavailable.
    }
    applyTheme();
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Object.assign({}, defaults, saved || {});
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // The controls remain usable when storage is unavailable.
    }
  }

  function applyState() {
    const root = document.documentElement;
    root.setAttribute('data-cyjimm-text-scale', String(Math.round(state.textScale * 100)));
    root.classList.toggle('cyjimm-a11y-high-contrast', state.highContrast);
    root.classList.toggle('cyjimm-a11y-grayscale', state.grayscale);
    root.classList.toggle('cyjimm-a11y-highlight-links', state.highlightLinks);
    root.classList.toggle('cyjimm-a11y-readable-font', state.readableFont);
    root.classList.toggle('cyjimm-a11y-stop-animations', state.stopAnimations);

    Object.keys(toggleButtons).forEach(function (key) {
      toggleButtons[key].setAttribute('aria-pressed', String(Boolean(state[key])));
    });

    document.dispatchEvent(new CustomEvent('cyjimm:accessibility-change', {
      detail: Object.assign({}, state)
    }));
  }

  function announce(message) {
    status.textContent = '';
    window.setTimeout(function () {
      status.textContent = message;
    }, 20);
  }

  function update(mutator, message) {
    mutator();
    saveState();
    applyState();
    announce(message || text.updated);
  }

  function makeButton(label, action, toggleKey) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cyjimm-accessibility-control';
    button.textContent = label;
    if (toggleKey) {
      button.setAttribute('aria-pressed', String(Boolean(state[toggleKey])));
      toggleButtons[toggleKey] = button;
    }
    button.addEventListener('click', action);
    return button;
  }

  function closePanel(returnFocus) {
    if (panel.hidden) return;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }

  function buildWidget() {
    const root = document.createElement('div');
    root.className = 'cyjimm-accessibility-root';

    themeTrigger = document.createElement('button');
    themeTrigger.type = 'button';
    themeTrigger.className = 'cyjimm-theme-trigger';
    themeTrigger.addEventListener('click', toggleTheme);

    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cyjimm-accessibility-trigger';
    trigger.setAttribute('aria-label', text.trigger);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'cyjimm-accessibility-panel');
    trigger.textContent = '♿';

    panel = document.createElement('section');
    panel.id = 'cyjimm-accessibility-panel';
    panel.className = 'cyjimm-accessibility-panel';
    panel.setAttribute('aria-labelledby', 'cyjimm-accessibility-title');
    panel.hidden = true;

    const heading = document.createElement('h2');
    heading.id = 'cyjimm-accessibility-title';
    heading.textContent = text.title;

    const controls = document.createElement('div');
    controls.className = 'cyjimm-accessibility-controls';
    controls.appendChild(makeButton(text.increase, function () {
      update(function () { state.textScale = Math.min(1.4, Number((state.textScale + 0.1).toFixed(1))); });
    }));
    controls.appendChild(makeButton(text.decrease, function () {
      update(function () { state.textScale = Math.max(0.8, Number((state.textScale - 0.1).toFixed(1))); });
    }));
    controls.appendChild(makeButton(text.contrast, function () {
      update(function () { state.highContrast = !state.highContrast; });
    }, 'highContrast'));
    controls.appendChild(makeButton(text.grayscale, function () {
      update(function () { state.grayscale = !state.grayscale; });
    }, 'grayscale'));
    controls.appendChild(makeButton(text.links, function () {
      update(function () { state.highlightLinks = !state.highlightLinks; });
    }, 'highlightLinks'));
    controls.appendChild(makeButton(text.font, function () {
      update(function () { state.readableFont = !state.readableFont; });
    }, 'readableFont'));
    controls.appendChild(makeButton(text.motion, function () {
      update(function () { state.stopAnimations = !state.stopAnimations; });
    }, 'stopAnimations'));
    controls.appendChild(makeButton(text.reset, function () {
      state = Object.assign({}, defaults);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        // Reset still applies for the current page when storage is unavailable.
      }
      applyState();
      announce(text.resetDone);
    }));

    status = document.createElement('p');
    status.className = 'cyjimm-accessibility-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    panel.appendChild(heading);
    panel.appendChild(controls);
    panel.appendChild(status);
    root.appendChild(panel);
    root.appendChild(themeTrigger);
    root.appendChild(trigger);
    document.body.appendChild(root);
    applyTheme();

    trigger.addEventListener('click', function () {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) controls.querySelector('button').focus();
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        closePanel(true);
      }
    });
  }

  function init() {
    applyTheme();
    buildWidget();
    applyState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
