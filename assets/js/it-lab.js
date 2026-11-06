(() => {
  'use strict';

  const STORAGE_KEY = 'cyjimm-it-lab-v1';
  const games = {
    phishing: [
      {
        from: 'Microsoft 365 Security <alerts@microsoft-support-login.com>',
        subject: 'החשבון ייחסם בעוד 30 דקות',
        message: 'זיהינו חריגה בנפח תיבת הדואר. יש לאמת את החשבון מיד כדי למנוע חסימה.',
        link: 'https://microsoft-support-login.com/verify',
        answer: 'suspicious',
        explanation: 'הדומיין אינו microsoft.com, ההודעה יוצרת לחץ והקישור מבקש אימות מחוץ לשירות הרשמי. נכנסים ל-Microsoft 365 באופן עצמאי ולא דרך הקישור.'
      },
      {
        from: 'Cloudflare Billing <billing@cloudflare.com>',
        subject: 'Your monthly invoice is ready',
        message: 'החשבונית החודשית זמינה בחשבון. אין צורך בפעולה אם אמצעי התשלום מעודכן.',
        link: 'אין קישור לפעולה בהודעה',
        answer: 'legit',
        explanation: 'השולח משתמש בדומיין הרשמי, אין איום או לחץ ואין בקשה למסור מידע. עדיין נכון לפתוח את החשבון מהאתר או מהסימנייה שלכם.'
      },
      {
        from: 'שירות לקוחות <service@bank-hapoalim-secure.co>',
        subject: 'פעילות חריגה בכרטיס — אישור נדרש',
        message: 'בוצעה עסקה חריגה. אשרו את זהותכם והזינו את קוד ה-SMS שקיבלתם.',
        link: 'https://bank-hapoalim-secure.co/card-check',
        answer: 'suspicious',
        explanation: 'בנק לא אמור לבקש קוד MFA בתוך עמוד שהגיע מקישור במייל. גם הדומיין המתחזה אינו הדומיין הרשמי. מתקשרים למספר הרשמי או נכנסים לאפליקציה.'
      },
      {
        from: 'Matan Jamil <matan@cyjimm.com>',
        subject: 'מסמך הפרויקט שסיכמנו בפגישה',
        message: 'היי, מצורף הקישור למסמך שעליו עברנו היום. ההרשאות מוגבלות לצוות הפרויקט.',
        link: 'https://cyjimm.sharepoint.com/sites/project/docs',
        answer: 'legit',
        explanation: 'השולח, ההקשר והדומיין הארגוני מתאימים לפעולה שהייתה צפויה. אם ההודעה לא צפויה, מאמתים מול השולח בערוץ נפרד לפני פתיחה.'
      },
      {
        from: 'Israel Post Delivery <delivery@israelpost-track.info>',
        subject: 'החבילה נעצרה — תשלום ₪2.90',
        message: 'לא ניתן למסור את החבילה עקב חוסר בתשלום. השלימו פרטי אשראי עוד היום.',
        link: 'https://israelpost-track.info/pay-now',
        answer: 'suspicious',
        explanation: 'סכום קטן, דחיפות ודומיין דומה למותג הם תבנית נפוצה של פישינג. בודקים משלוח רק באתר הרשמי שהקלדתם בעצמכם.'
      }
    ],
    triage: [
      {
        icon: '🐢', tag: 'ביצועים', title: 'המחשב נהיה איטי מאוד באמצע יום עבודה',
        description: 'נפתחו הרבה טאבים ותוכנות, אבל אין הודעת שגיאה ברורה.',
        options: ['לפרמט מיד את המחשב', 'לפתוח Task Manager ולבדוק CPU, זיכרון ודיסק', 'למחוק תיקיות מתוך Windows', 'להתקין “PC Booster” אקראי'],
        correct: 1,
        explanation: 'מתחילים במדידה. Task Manager מראה איזה תהליך צורך משאבים ומאפשר לסגור רק את הגורם הבעייתי לפני שעושים שינוי רחב.'
      },
      {
        icon: '💾', tag: 'אחסון', title: 'כונן C כמעט מלא',
        description: 'Windows מציג פחות מ־5GB פנויים והעדכונים מתחילים להיכשל.',
        options: ['למחוק קבצים אקראיים מ-System32', 'לכבות עדכונים לצמיתות', 'לבדוק Storage ולזהות מה באמת תופס מקום', 'לדחוס את כל הכונן בלי בדיקה'],
        correct: 2,
        explanation: 'ממפים לפני שמוחקים. Storage, קבצים זמניים ותיקיות משתמש מציגים את המקור לעומס בלי לסכן קבצי מערכת.'
      },
      {
        icon: '📶', tag: 'תקשורת', title: 'יש Wi‑Fi אבל אין גלישה',
        description: 'סמל הרשת מחובר, אך הדפדפן לא פותח אתרים.',
        options: ['לבדוק אם התקלה קיימת גם במכשיר נוסף', 'לאפס מיד את Windows', 'להחליף סיסמת Microsoft', 'להסיר את האנטי-וירוס'],
        correct: 0,
        explanation: 'בדיקה במכשיר נוסף מפרידה בין תקלה בנתב או בספק לבין תקלה מקומית במחשב — מידע שמקצר מאוד את האבחון.'
      },
      {
        icon: '🖨️', tag: 'ציוד היקפי', title: 'המדפסת מופיעה Offline',
        description: 'הדפסה שעבדה אתמול נשארת בתור ולא יוצאת.',
        options: ['לקנות מדפסת חדשה', 'להתקין דרייבר מאתר לא מוכר', 'לבדוק מתח, חיבור, כתובת רשת ותור הדפסה', 'למחוק את כל פרופיל המשתמש'],
        correct: 2,
        explanation: 'בודקים קודם את שרשרת החיבור ואת תור ההדפסה. התקנה מחדש מגיעה רק אחרי שמבינים שהחומרה והרשת תקינות.'
      },
      {
        icon: '🔄', tag: 'עדכונים', title: 'Windows מבקש Restart בזמן עבודה',
        description: 'יש מסמכים פתוחים ופגישה בעוד עשרים דקות.',
        options: ['לנתק את החשמל', 'לשמור עבודה ולתזמן Restart לזמן מתאים', 'להתעלם מהעדכונים לתמיד', 'לסגור את שירות Windows Update בכוח'],
        correct: 1,
        explanation: 'שומרים, סוגרים ומתזמנים חלון תחזוקה. כך העדכון מושלם בלי לאבד עבודה ובלי להשאיר את המחשב במצב חלקי.'
      }
    ],
    safety: [
      { statement: 'שימוש במנהל סיסמאות וסיסמה ייחודית לכל שירות', answer: 'safe', explanation: 'מנהל סיסמאות מאפשר סיסמאות ארוכות וייחודיות ומצמצם נזק מדליפה של שירות אחד.' },
      { statement: 'חיבור דיסק־און־קי לא מוכר שמצאתם בחניה', answer: 'risky', explanation: 'התקן לא מוכר עלול להכיל נוזקה או להתחזות למקלדת. מעבירים אותו לטיפול IT ולא מחברים למחשב.' },
      { statement: 'אישור התראת MFA שלא יזמתם כדי שהיא תפסיק לקפוץ', answer: 'risky', explanation: 'התראה לא צפויה יכולה להעיד שמישהו כבר מחזיק בסיסמה. דוחים, מחליפים סיסמה ומדווחים.' },
      { statement: 'גיבוי קבוע שנבדק ונשמר גם בנפרד מהמחשב', answer: 'safe', explanation: 'גיבוי שלא מחובר תמיד למחשב מסייע בהתאוששות מכשל, גניבה או כופרה. חשוב גם לבדוק שאפשר לשחזר ממנו.' },
      { statement: 'הורדת דרייבר “מעודכן” מפורום במקום מאתר היצרן', answer: 'risky', explanation: 'דרייברים רצים בהרשאות גבוהות. מורידים אותם מ-Windows Update או מהאתר הרשמי של היצרן בלבד.' }
    ]
  };

  const freshState = () => ({
    games: {
      phishing: { index: 0, score: 0, correct: 0, completed: false },
      triage: { index: 0, score: 0, correct: 0, completed: false },
      safety: { index: 0, score: 0, correct: 0, completed: false }
    },
    stats: { currentStreak: 0, maxStreak: 0 }
  });

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.games || !saved.stats) return freshState();
      return saved;
    } catch (_) {
      return freshState();
    }
  }

  let state = loadState();
  let activeGame = 'phishing';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Progress is optional. */ }
  }

  function totals() {
    const values = Object.values(state.games);
    return {
      score: values.reduce((sum, game) => sum + game.score, 0),
      correct: values.reduce((sum, game) => sum + game.correct, 0),
      answered: values.reduce((sum, game) => sum + game.index, 0),
      completed: values.every(game => game.completed)
    };
  }

  function rankFor(score) {
    if (score >= 1300) return ['מגן סייבר', '🏆'];
    if (score >= 1000) return ['בלש מערכות', '🛡️'];
    if (score >= 600) return ['טכנאי חד', '🔧'];
    if (score >= 200) return ['חוקר מתחיל', '🔎'];
    return ['טירון רשת', '💻'];
  }

  function updateDashboard() {
    const total = totals();
    const [rank] = rankFor(total.score);
    $('[data-total-score]').textContent = total.score;
    $('[data-total-xp]').textContent = total.score;
    $('[data-rank]').textContent = rank;
    $('[data-total-meter]').style.width = `${Math.min(100, total.score / 15)}%`;
    Object.entries(state.games).forEach(([name, game]) => {
      $(`[data-tab-status="${name}"]`).textContent = game.completed ? 'הושלם' : `${game.index}/${games[name].length}`;
    });
    if (total.completed) showResults(total);
  }

  function updateProgress(name) {
    const game = state.games[name];
    const count = games[name].length;
    const displayIndex = Math.min(game.index + 1, count);
    $(`[data-progress-label="${name}"]`).textContent = `שאלה ${displayIndex} מתוך ${count}`;
    $(`[data-progress-bar="${name}"]`).style.width = `${Math.max(20, displayIndex / count * 100)}%`;
  }

  function switchGame(name) {
    activeGame = name;
    $$('[data-game-tab]').forEach(button => {
      const selected = button.dataset.gameTab === name;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    $$('[data-game-panel]').forEach(panel => {
      const selected = panel.dataset.gamePanel === name;
      panel.classList.toggle('is-active', selected);
      panel.hidden = !selected;
    });
  }

  function feedback(name, correct, explanation, onNext) {
    const box = $(`[data-feedback="${name}"]`);
    box.hidden = false;
    box.className = `game-feedback ${correct ? 'is-correct' : 'is-wrong'}`;
    box.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = correct ? 'בול. החלטה נכונה.' : 'לא הפעם — וזה בדיוק המקום ללמוד.';
    const copy = document.createElement('p');
    copy.textContent = explanation;
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'next-question';
    next.textContent = state.games[name].index === games[name].length - 1 ? 'לסיכום האתגר' : 'לשאלה הבאה';
    next.addEventListener('click', onNext, { once: true });
    box.append(title, copy, next);
    next.focus();
  }

  function registerResult(name, correct) {
    const game = state.games[name];
    if (correct) {
      game.score += 100;
      game.correct += 1;
      state.stats.currentStreak += 1;
      state.stats.maxStreak = Math.max(state.stats.maxStreak, state.stats.currentStreak);
    } else {
      state.stats.currentStreak = 0;
    }
    updateDashboard();
  }

  function advance(name) {
    const game = state.games[name];
    game.index += 1;
    if (game.index >= games[name].length) game.completed = true;
    persist();
    renderGame(name);
    updateDashboard();
    if (game.completed) {
      const nextGame = Object.keys(games).find(key => !state.games[key].completed);
      if (nextGame) switchGame(nextGame);
      else $('[data-results]').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function renderComplete(name) {
    const panel = $(`[data-game-panel="${name}"]`);
    const game = state.games[name];
    const labels = { phishing: 'צייד הפישינג', triage: 'מה עושים קודם?', safety: 'בטוח או מסוכן' };
    panel.innerHTML = `<div class="game-complete"><span aria-hidden="true">✓</span><div><span class="game-label">האתגר הושלם</span><h3>${labels[name]}</h3><p>${game.correct} מתוך ${games[name].length} תשובות נכונות · ${game.score} נקודות</p></div></div>`;
  }

  function renderPhishing() {
    const game = state.games.phishing;
    if (game.completed) return renderComplete('phishing');
    const item = games.phishing[game.index];
    $('[data-phishing-from]').textContent = item.from;
    $('[data-phishing-subject]').textContent = item.subject;
    $('[data-phishing-message]').textContent = item.message;
    $('[data-phishing-link]').textContent = item.link;
    const box = $('[data-feedback="phishing"]');
    box.hidden = true;
    $$('[data-answer="phishing"]').forEach(button => {
      button.disabled = false;
      button.classList.remove('is-correct', 'is-wrong');
    });
    updateProgress('phishing');
  }

  function renderTriage() {
    const game = state.games.triage;
    if (game.completed) return renderComplete('triage');
    const item = games.triage[game.index];
    $('[data-triage-icon]').textContent = item.icon;
    $('[data-triage-tag]').textContent = item.tag;
    $('[data-triage-title]').textContent = item.title;
    $('[data-triage-description]').textContent = item.description;
    const list = $('[data-triage-options]');
    list.replaceChildren();
    item.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      button.textContent = option;
      button.dataset.optionIndex = String(index);
      button.addEventListener('click', () => answerTriage(index));
      list.append(button);
    });
    $('[data-feedback="triage"]').hidden = true;
    updateProgress('triage');
  }

  function renderSafety() {
    const game = state.games.safety;
    if (game.completed) return renderComplete('safety');
    const item = games.safety[game.index];
    $('[data-safety-statement]').textContent = item.statement;
    const box = $('[data-feedback="safety"]');
    box.hidden = true;
    $$('[data-answer="safety"]').forEach(button => {
      button.disabled = false;
      button.classList.remove('is-correct', 'is-wrong');
    });
    updateProgress('safety');
  }

  function renderGame(name) {
    if (name === 'phishing') renderPhishing();
    if (name === 'triage') renderTriage();
    if (name === 'safety') renderSafety();
  }

  function answerBinary(name, value) {
    const game = state.games[name];
    const item = games[name][game.index];
    const correct = value === item.answer;
    $$(`[data-answer="${name}"]`).forEach(button => {
      button.disabled = true;
      if (button.dataset.value === item.answer) button.classList.add('is-correct');
      else if (button.dataset.value === value) button.classList.add('is-wrong');
    });
    registerResult(name, correct);
    feedback(name, correct, item.explanation, () => advance(name));
  }

  function answerTriage(index) {
    const game = state.games.triage;
    const item = games.triage[game.index];
    const correct = index === item.correct;
    $$('[data-option-index]').forEach(button => {
      button.disabled = true;
      const optionIndex = Number(button.dataset.optionIndex);
      if (optionIndex === item.correct) button.classList.add('is-correct');
      else if (optionIndex === index) button.classList.add('is-wrong');
    });
    registerResult('triage', correct);
    feedback('triage', correct, item.explanation, () => advance('triage'));
  }

  function showResults(total) {
    const results = $('[data-results]');
    const [rank, icon] = rankFor(total.score);
    results.hidden = false;
    $('[data-results-icon]').textContent = icon;
    $('[data-results-title]').textContent = rank;
    $('[data-results-score]').textContent = total.score;
    $('[data-results-correct]').textContent = total.correct;
    $('[data-results-streak]').textContent = state.stats.maxStreak;
    $('[data-results-copy]').textContent = total.score >= 1000
      ? 'אתם עוצרים, בודקים הקשר ומתחילים מאבחון לפני שינוי. אלה בדיוק ההרגלים שמונעים תקלות ואירועי אבטחה.'
      : 'הבסיס קיים. עברו שוב על ההסברים — המטרה היא לא לנחש מהר, אלא לבנות הרגל החלטה עקבי ובטוח.';
  }

  $$('[data-game-tab]').forEach(button => {
    button.addEventListener('click', () => switchGame(button.dataset.gameTab));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const order = Object.keys(games);
      const direction = event.key === 'ArrowLeft' ? 1 : -1;
      const next = order[(order.indexOf(activeGame) + direction + order.length) % order.length];
      switchGame(next);
      $(`[data-game-tab="${next}"]`).focus();
    });
  });

  $$('[data-answer="phishing"]').forEach(button => button.addEventListener('click', () => answerBinary('phishing', button.dataset.value)));
  $$('[data-answer="safety"]').forEach(button => button.addEventListener('click', () => answerBinary('safety', button.dataset.value)));
  $('[data-reset-lab]').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  Object.keys(games).forEach(renderGame);
  updateDashboard();
  const firstIncomplete = Object.keys(games).find(name => !state.games[name].completed);
  switchGame(firstIncomplete || 'phishing');
})();
