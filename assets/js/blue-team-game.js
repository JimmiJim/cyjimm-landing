/*
 * CyJimm Blue Team exercises (static, self-contained).
 * All data below is entirely fictional and inert. No requests, storage,
 * cookies, tracking or user-provided data. DOM is built with textContent only.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var LANG = (root.getAttribute('lang') || 'en').toLowerCase().indexOf('he') === 0 ? 'he' : 'en';

  var STRINGS = {
    en: {
      triageProgress: 'Record {n} of {t}',
      incidentProgress: 'Stage {n} of {t}',
      score: 'Score: {s}',
      correct: 'Correct!',
      wrong: 'Not quite.',
      expected: 'Correct answer: {a}.',
      nextTriage: 'Next record',
      nextIncident: 'Next stage',
      finish: 'See summary',
      triageSummary: 'You scored {s} of {m} points ({c} of {t} correct).',
      incidentSummary: 'You scored {s} of {m} points ({c} of {t} stages correct).',
      perfect: 'Excellent - every answer was correct.',
      retry: 'Review the explanations and try again.',
      fields: {
        account: 'Account',
        time: 'Time',
        location: 'Location',
        device: 'Device',
        outcome: 'Result',
        clock: 'Timeline',
        situation: 'Situation'
      },
      points: function (p) { return p === 1 ? '+1 point.' : '+' + p + ' points.'; }
    },
    he: {
      triageProgress: 'רשומה {n} מתוך {t}',
      incidentProgress: 'שלב {n} מתוך {t}',
      score: 'ניקוד: {s}',
      correct: 'נכון!',
      wrong: 'לא מדויק.',
      expected: 'התשובה הנכונה: {a}.',
      nextTriage: 'לרשומה הבאה',
      nextIncident: 'לשלב הבא',
      finish: 'לסיכום',
      triageSummary: 'צברת {s} מתוך {m} נקודות ({c} מתוך {t} תשובות נכונות).',
      incidentSummary: 'צברת {s} מתוך {m} נקודות ({c} מתוך {t} שלבים נכונים).',
      perfect: 'מצוין - כל התשובות נכונות.',
      retry: 'כדאי לעבור על ההסברים ולנסות שוב.',
      fields: {
        account: 'חשבון',
        time: 'שעה',
        location: 'מיקום',
        device: 'מכשיר',
        outcome: 'תוצאה',
        clock: 'ציר זמן',
        situation: 'מצב'
      },
      points: function (p) { return p === 1 ? '+1 נקודה.' : '+' + p + ' נקודות.'; }
    }
  };

  var S = STRINGS[LANG];

  /* Fictional sign-in records. answer: "review" | "ok" */
  var TRIAGE = [
    {
      id: 't1',
      answer: 'review',
      en: {
        account: 'demo.user.a (fictional)',
        time: '03:12 local time',
        location: 'A country never seen before for this account',
        device: 'New, unrecognized browser',
        outcome: 'Success after 9 failed attempts',
        explain: 'Many failures followed by a success, at an odd hour, from a new place and device, is a pattern worth reviewing.'
      },
      he: {
        account: 'demo.user.a (בדוי)',
        time: '03:12 שעון מקומי',
        location: 'מדינה שלא נראתה בעבר עבור החשבון',
        device: 'דפדפן חדש שאינו מוכר',
        outcome: 'הצלחה אחרי 9 ניסיונות כושלים',
        explain: 'רצף כישלונות ואחריו הצלחה, בשעה חריגה, ממיקום וממכשיר חדשים - דפוס שמצדיק בדיקה.'
      }
    },
    {
      id: 't2',
      answer: 'ok',
      en: {
        account: 'demo.user.b (fictional)',
        time: '09:05 local time',
        location: 'Usual office city',
        device: 'Known company laptop',
        outcome: 'Success on first attempt, MFA completed',
        explain: 'Usual time, place and device with a clean MFA sign-in match the normal baseline for this account.'
      },
      he: {
        account: 'demo.user.b (בדוי)',
        time: '09:05 שעון מקומי',
        location: 'עיר המשרד הרגילה',
        device: 'מחשב נייד ארגוני מוכר',
        outcome: 'הצלחה בניסיון הראשון, אימות דו-שלבי הושלם',
        explain: 'שעה, מיקום ומכשיר רגילים עם אימות דו-שלבי תקין תואמים את ההתנהגות הרגילה של החשבון.'
      }
    },
    {
      id: 't3',
      answer: 'review',
      en: {
        account: 'demo.user.c (fictional)',
        time: '14:20 and 14:31 local time',
        location: 'Two distant countries, 11 minutes apart',
        device: 'Two different devices',
        outcome: 'Both sign-ins successful',
        explain: 'Two successful sign-ins from far-apart places within minutes is physically unlikely ("impossible travel") and should be reviewed.'
      },
      he: {
        account: 'demo.user.c (בדוי)',
        time: '14:20 ו-14:31 שעון מקומי',
        location: 'שתי מדינות רחוקות, בהפרש של 11 דקות',
        device: 'שני מכשירים שונים',
        outcome: 'שתי ההתחברויות הצליחו',
        explain: 'שתי התחברויות מוצלחות ממקומות מרוחקים בהפרש של דקות אינן אפשריות פיזית ("נסיעה בלתי אפשרית") ומצדיקות בדיקה.'
      }
    },
    {
      id: 't4',
      answer: 'ok',
      en: {
        account: 'demo.user.d (fictional)',
        time: '19:40 local time',
        location: 'Home city, as on previous evenings',
        device: 'Known personal phone registered to the account',
        outcome: 'Success, MFA completed by the user',
        explain: 'An evening sign-in from a familiar place and a registered device matches this account\'s known routine.'
      },
      he: {
        account: 'demo.user.d (בדוי)',
        time: '19:40 שעון מקומי',
        location: 'עיר המגורים, כמו בערבים קודמים',
        device: 'טלפון אישי מוכר הרשום לחשבון',
        outcome: 'הצלחה, אימות דו-שלבי הושלם על ידי המשתמש',
        explain: 'התחברות בשעת ערב ממקום מוכר וממכשיר רשום תואמת את השגרה הידועה של החשבון.'
      }
    }
  ];

  /* Fictional incident timeline. answer: "isolate" | "preserve" | "notify" */
  var INCIDENT = [
    {
      id: 'i1',
      answer: 'isolate',
      clock: 'T+00:00',
      en: {
        situation: 'Alerts show files on the fictional "Workstation Alpha" being renamed rapidly, and the activity appears to be spreading across the network.',
        explain: 'When harm may be spreading, the first priority is containment: isolate the affected host from the network.'
      },
      he: {
        situation: 'התראות מראות שקבצים בתחנת העבודה הבדויה "Workstation Alpha" משנים את שמם במהירות, והפעילות נראית מתפשטת ברשת.',
        explain: 'כשנזק עלול להתפשט, העדיפות הראשונה היא בלימה: לבודד את המחשב הנפגע מהרשת.'
      }
    },
    {
      id: 'i2',
      answer: 'preserve',
      clock: 'T+00:20',
      en: {
        situation: 'Workstation Alpha is now isolated. A manager asks to wipe and reinstall it immediately so the user can get back to work.',
        explain: 'Wiping now would destroy the information needed to understand what happened. Preserve evidence first, then recover.'
      },
      he: {
        situation: 'Workstation Alpha מבודדת כעת. מנהל מבקש למחוק ולהתקין אותה מחדש מיד, כדי שהעובד יחזור לעבוד.',
        explain: 'מחיקה עכשיו תהרוס את המידע שדרוש כדי להבין מה קרה. קודם משמרים ראיות, ורק אחר כך משחזרים.'
      }
    },
    {
      id: 'i3',
      answer: 'notify',
      clock: 'T+00:45',
      en: {
        situation: 'Evidence is preserved. Notes suggest the same fictional account was also used on other systems outside your team\'s scope.',
        explain: 'When an incident may reach beyond your scope, escalate to the incident response team so they can coordinate the next steps.'
      },
      he: {
        situation: 'הראיות נשמרו. הרשומות מרמזות שאותו חשבון בדוי שימש גם במערכות אחרות, מחוץ לתחום האחריות של הצוות שלך.',
        explain: 'כשאירוע עשוי לחרוג מתחום האחריות שלך, מסלימים לצוות התגובה לאירועים כדי שיתאם את הצעדים הבאים.'
      }
    }
  ];

  function fmt(template, values) {
    return template.replace(/\{(\w+)\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : m;
    });
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function addRow(dl, label, value, isolateDir) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = label;
    if (isolateDir) {
      var bdi = document.createElement('bdi');
      bdi.textContent = value;
      dd.appendChild(bdi);
    } else {
      dd.textContent = value;
    }
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function renderTriage(record, container) {
    var d = record[LANG];
    var dl = document.createElement('dl');
    dl.className = 'bt-record';
    dl.setAttribute('data-record-id', record.id);
    addRow(dl, S.fields.account, d.account, true);
    addRow(dl, S.fields.time, d.time, false);
    addRow(dl, S.fields.location, d.location, false);
    addRow(dl, S.fields.device, d.device, false);
    addRow(dl, S.fields.outcome, d.outcome, false);
    container.appendChild(dl);
  }

  function renderIncident(stage, container) {
    var d = stage[LANG];
    var dl = document.createElement('dl');
    dl.className = 'bt-record bt-stage';
    dl.setAttribute('data-stage-id', stage.id);
    addRow(dl, S.fields.clock, stage.clock, true);
    addRow(dl, S.fields.situation, d.situation, false);
    container.appendChild(dl);
  }

  function setupExercise(cfg) {
    var section = document.getElementById(cfg.prefix);
    if (!section) { return; }

    function byId(suffix) { return document.getElementById(cfg.prefix + '-' + suffix); }

    var startBtn = byId('start');
    var play = byId('play');
    var progress = byId('progress');
    var scoreEl = byId('score');
    var itemBox = byId('item');
    var feedback = byId('feedback');
    var nextBtn = byId('next');
    var resetBtn = byId('reset');
    var summary = byId('summary');
    var summaryTitle = byId('summary-title');
    var summaryText = byId('summary-text');
    var restartBtn = byId('restart');
    var choices = Array.prototype.slice.call(section.querySelectorAll('[data-choice]'));

    if (!startBtn || !play || !progress || !scoreEl || !itemBox || !feedback ||
        !nextBtn || !summary || !summaryTitle || !summaryText || !restartBtn || !choices.length) {
      return;
    }

    var state = { index: 0, score: 0, correct: 0, locked: false };
    var maxScore = cfg.items.length * cfg.points;

    function labelFor(key) {
      for (var i = 0; i < choices.length; i++) {
        if (choices[i].getAttribute('data-choice') === key) {
          return choices[i].textContent.trim();
        }
      }
      return key;
    }

    function updateScore() {
      scoreEl.textContent = fmt(S.score, { s: state.score });
      section.setAttribute('data-score', String(state.score));
    }

    function render() {
      var item = cfg.items[state.index];
      state.locked = false;
      section.setAttribute('data-index', String(state.index));
      section.setAttribute('data-current-id', item.id);
      section.removeAttribute('data-last-result');
      progress.textContent = fmt(cfg.progress, { n: state.index + 1, t: cfg.items.length });
      clear(itemBox);
      cfg.render(item, itemBox);
      feedback.textContent = '';
      feedback.removeAttribute('data-result');
      nextBtn.hidden = true;
      nextBtn.textContent = state.index === cfg.items.length - 1 ? S.finish : cfg.nextLabel;
      choices.forEach(function (btn) {
        btn.disabled = false;
        btn.removeAttribute('data-state');
        btn.setAttribute('aria-pressed', 'false');
      });
      updateScore();
    }

    function begin() {
      state.index = 0;
      state.score = 0;
      state.correct = 0;
      startBtn.hidden = true;
      summary.hidden = true;
      play.hidden = false;
      section.setAttribute('data-phase', 'playing');
      render();
      progress.focus();
    }

    function answer(choice) {
      if (state.locked || play.hidden) { return; }
      state.locked = true;
      var item = cfg.items[state.index];
      var isCorrect = choice === item.answer;
      if (isCorrect) {
        state.score += cfg.points;
        state.correct += 1;
      }
      choices.forEach(function (btn) {
        var key = btn.getAttribute('data-choice');
        btn.disabled = true;
        btn.setAttribute('aria-pressed', key === choice ? 'true' : 'false');
        if (key === choice) {
          btn.setAttribute('data-state', isCorrect ? 'correct' : 'wrong');
        } else if (key === item.answer) {
          btn.setAttribute('data-state', 'answer');
        }
      });
      var parts = [];
      if (isCorrect) {
        parts.push(S.correct, S.points(cfg.points));
      } else {
        parts.push(S.wrong, fmt(S.expected, { a: labelFor(item.answer) }));
      }
      parts.push(item[LANG].explain);
      feedback.textContent = parts.join(' ');
      feedback.setAttribute('data-result', isCorrect ? 'correct' : 'wrong');
      section.setAttribute('data-last-result', isCorrect ? 'correct' : 'wrong');
      updateScore();
      nextBtn.hidden = false;
      nextBtn.focus();
    }

    function showSummary() {
      play.hidden = true;
      summary.hidden = false;
      section.setAttribute('data-phase', 'summary');
      var text = fmt(cfg.summary, {
        s: state.score, m: maxScore, c: state.correct, t: cfg.items.length
      });
      summaryText.textContent = text + ' ' + (state.correct === cfg.items.length ? S.perfect : S.retry);
      summaryTitle.focus();
    }

    function next() {
      if (!state.locked) { return; }
      if (state.index >= cfg.items.length - 1) {
        showSummary();
        return;
      }
      state.index += 1;
      render();
      progress.focus();
    }

    startBtn.addEventListener('click', begin);
    restartBtn.addEventListener('click', begin);
    if (resetBtn) { resetBtn.addEventListener('click', begin); }
    nextBtn.addEventListener('click', next);
    choices.forEach(function (btn) {
      btn.addEventListener('click', function () {
        answer(btn.getAttribute('data-choice'));
      });
    });

    section.setAttribute('data-phase', 'intro');
    section.setAttribute('data-max-score', String(maxScore));
  }

  function init() {
    setupExercise({
      prefix: 'bt-triage',
      items: TRIAGE,
      points: 250,
      progress: S.triageProgress,
      nextLabel: S.nextTriage,
      summary: S.triageSummary,
      render: renderTriage
    });
    setupExercise({
      prefix: 'bt-incident',
      items: INCIDENT,
      points: 1,
      progress: S.incidentProgress,
      nextLabel: S.nextIncident,
      summary: S.incidentSummary,
      render: renderIncident
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
