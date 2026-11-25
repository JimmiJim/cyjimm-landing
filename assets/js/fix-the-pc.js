(() => {
  'use strict';

  // Each scenario: a symptom, a set of checks, and possible faults. One fault is picked at random per round;
  // every fault must have a clue for every check in its scenario (asserted below).
  const SCENARIOS = {
    network: {
      title: 'אין אינטרנט',
      ticket: '"האינטרנט לא עובד לי. שאר המשפחה גולשת רגיל, רק אצלי לא." — דנה, מחשב נייח בסלון',
      screen: 'net',
      checks: {
        tray: { icon: '📶', label: 'אייקון הרשת במגש המערכת' },
        cable: { icon: '🔌', label: 'כבל הרשת מאחורי המחשב' },
        router: { icon: '📡', label: 'נורות הראוטר' },
        ipconfig: { icon: '⌨️', label: 'הרצת ipconfig' },
        ping: { icon: '🏓', label: 'ping 8.8.8.8 ו־ping google.com' },
        airplane: { icon: '✈️', label: 'מרכז הפעולות (מצב טיסה)' }
      },
      faults: {
        unplugged: {
          name: 'כבל הרשת מנותק או רופף',
          fix: 'מחברים מחדש את הכבל עד שנשמע "קליק", ומוודאים שנורת הקישור בכרטיס הרשת נדלקת. אם אין שינוי, מחליפים כבל או נקודת רשת.',
          clues: {
            tray: 'אייקון של מחשב עם X אדום: "כבל רשת מנותק".',
            cable: 'הכבל יושב רפוי בשקע, ונורת הקישור (Link) בכרטיס הרשת כבויה. 🔴',
            router: 'כל הנורות דולקות כרגיל, והמכשירים האחרים בבית מחוברים.',
            ipconfig: '"Media disconnected" — למתאם Ethernet אין חיבור בכלל.',
            ping: 'שתי הבדיקות נכשלות: "General failure".',
            airplane: 'מצב טיסה כבוי.'
          }
        },
        dhcp: {
          name: 'המחשב לא קיבל כתובת IP מהראוטר (DHCP)',
          fix: 'מנתקים ומחברים את הרשת, או מריצים ipconfig /release ואחר כך ipconfig /renew. אם כתובת 169.254 חוזרת, בודקים את הגדרות ה־DHCP בראוטר או מאתחלים אותו.',
          clues: {
            tray: 'אייקון של גלובוס עם סימן אסור: "אין גישה לאינטרנט".',
            cable: 'הכבל מחובר היטב, ונורת הקישור מהבהבת בירוק. 🟢',
            router: 'כל הנורות דולקות כרגיל, והמכשירים האחרים בבית מחוברים.',
            ipconfig: 'IPv4: 169.254.37.112, ו־Default Gateway ריק. כתובת 169.254 אומרת שהמחשב הקצה לעצמו כתובת, כי אף אחד לא נתן לו כזו.',
            ping: 'שתי הבדיקות נכשלות: "Destination host unreachable".',
            airplane: 'מצב טיסה כבוי.'
          }
        },
        dns: {
          name: 'בעיית DNS: אין תרגום של שמות אתרים לכתובות',
          fix: 'מגדירים DNS תקין (למשל אוטומטי מהראוטר, או 1.1.1.1 / 8.8.8.8) ומריצים ipconfig /flushdns. חשוב לבדוק גם מי שינה את ה־DNS, כי זה יכול להעיד על תוכנה לא רצויה.',
          clues: {
            tray: 'אייקון רשת רגיל, בלי שום אזהרה.',
            cable: 'הכבל מחובר היטב, ונורת הקישור מהבהבת בירוק. 🟢',
            router: 'כל הנורות דולקות כרגיל, והמכשירים האחרים בבית מחוברים.',
            ipconfig: 'IPv4: 192.168.1.23, Gateway: 192.168.1.1. אבל DNS Servers מוגדר ל־10.99.0.1, שזו לא כתובת הראוטר.',
            ping: 'ping 8.8.8.8 מצליח ✅, אבל ping google.com נכשל: "could not find host". ❌',
            airplane: 'מצב טיסה כבוי.'
          }
        },
        airplane: {
          name: 'מצב טיסה דלוק במחשב',
          fix: 'מכבים את מצב הטיסה במרכז הפעולות (Win+A) או במקש הייעודי במקלדת. הפעם המחשב מחובר ב־Wi-Fi ולא בכבל, אז מצב הטיסה מנתק אותו לגמרי.',
          clues: {
            tray: 'במקום אייקון רשת מופיע אייקון של מטוס ✈️.',
            cable: 'אין כבל רשת בכלל: המחשב הזה מחובר ב־Wi-Fi.',
            router: 'כל הנורות דולקות כרגיל, והמכשירים האחרים בבית מחוברים.',
            ipconfig: 'מתאם ה־Wi-Fi מדווח "Media disconnected".',
            ping: 'שתי הבדיקות נכשלות: "General failure".',
            airplane: 'הכפתור "מצב טיסה" מסומן כפעיל.'
          }
        }
      }
    },
    display: {
      title: 'בעיית תצוגה',
      ticket: '"המחשב נדלק, שומעים את המאוורר, אבל המסך לא מציג כמו שצריך." — יוסי, עמדת עבודה במשרד',
      screen: 'display',
      checks: {
        power: { icon: '💡', label: 'נורית ההפעלה של המסך' },
        input: { icon: '🎛️', label: 'תפריט המקור (Input) במסך' },
        cable: { icon: '🔗', label: 'כבל ה־HDMI בשני הקצוות' },
        other: { icon: '🖥️', label: 'חיבור המחשב למסך אחר' },
        devmgr: { icon: '🧩', label: 'מנהל ההתקנים (Device Manager)' },
        settings: { icon: '⚙️', label: 'הגדרות תצוגה ורזולוציה' }
      },
      faults: {
        input: {
          name: 'המסך מוגדר למקור הלא נכון (Input)',
          fix: 'לוחצים על כפתור Input/Source במסך ובוחרים את היציאה שהכבל באמת מחובר אליה (כאן HDMI1). זה קורה הרבה אחרי ניקיון או החלפת מסך.',
          clues: {
            power: 'הנורית כתומה, כלומר המסך במצב המתנה.',
            input: 'המסך מוגדר ל־DisplayPort, אבל הכבל מחובר ל־HDMI1.',
            cable: 'הכבל מחובר היטב בשני הצדדים.',
            other: 'במסך אחר התמונה מופיעה מיד.',
            devmgr: 'כרטיס המסך מוצג תקין: "Intel UHD Graphics".',
            settings: 'אין גישה: המסך שחור, אז אי אפשר לראות את ההגדרות.'
          },
          symptom: 'black'
        },
        cable: {
          name: 'כבל המסך רופף או פגום',
          fix: 'מחברים מחדש את שני הקצוות של הכבל. אם ההבהוב נמשך, מחליפים כבל. כבל שנמעך מתחת לרגל של שולחן הוא חשוד קבוע.',
          clues: {
            power: 'הנורית לבנה, אבל מדי פעם מהבהבת לכתום.',
            input: 'המקור מוגדר נכון (HDMI1), אבל מדי כמה שניות מופיעה ההודעה "No Signal".',
            cable: 'צד המחשב יוצא מהשקע בקלות, והכבל מקופל ומעוך מתחת לרגל השולחן.',
            other: 'גם במסך אחר, עם אותו כבל, התמונה קופצת ונעלמת.',
            devmgr: 'כרטיס המסך מוצג תקין: "Intel UHD Graphics".',
            settings: 'הרזולוציה 1920×1080 כמומלץ. התמונה פשוט נעלמת לרגע וחוזרת.'
          },
          symptom: 'flicker'
        },
        driver: {
          name: 'דרייבר כרטיס המסך חסר או תקול',
          fix: 'מתקינים את הדרייבר מהאתר של היצרן (Intel/AMD/NVIDIA או יצרן המחשב), או דרך Windows Update. אחרי אתחול חוזרת הרזולוציה המלאה.',
          clues: {
            power: 'הנורית לבנה: המסך מקבל אות.',
            input: 'המקור מוגדר נכון (HDMI1).',
            cable: 'הכבל מחובר היטב בשני הצדדים.',
            other: 'גם במסך אחר התמונה מטושטשת וגדולה מדי.',
            devmgr: 'במקום כרטיס המסך מופיע "Microsoft Basic Display Adapter", עם סימן קריאה צהוב. ⚠️',
            settings: 'הרזולוציה תקועה על 1024×768, ואין אפשרויות אחרות ברשימה.'
          },
          symptom: 'blurry'
        }
      }
    },
    slow: {
      "title": "מחשב איטי",
      "ticket": "״המחשב מגיב לאט. אפשר לבדוק מה גורם לזה לפני שמעדכנים הכול?״",
      "screen": "slow",
      "checks": {
        "task": {
          "icon": "📊",
          "label": "מנהל המשימות: עומס וביצועים"
        },
        "update": {
          "icon": "🔄",
          "label": "Windows Update והיסטוריית עדכונים"
        },
        "apps": {
          "icon": "🚀",
          "label": "יישומים שעולים עם הכניסה"
        },
        "devices": {
          "icon": "🧩",
          "label": "מנהל ההתקנים ודרייברים"
        },
        "bios": {
          "icon": "💻",
          "label": "דגם, גרסת BIOS והערות היצרן"
        },
        "timing": {
          "icon": "⏱️",
          "label": "מתי האיטיות מופיעה?"
        }
      },
      "faults": {
        "startup": {
          "name": "תוכנות כבדות מופעלות עם הכניסה",
          "action": "startup",
          "fix": "משביתים בהפעלה אוטומטית רק יישומים לא חיוניים שזוהו, מאתחלים ומודדים שוב. לא מכבים תוכנות אבטחה.",
          "clues": {
            "task": "שני יישומים לא חיוניים משתמשים ברוב משאבי המחשב בדקות הראשונות אחרי הכניסה.",
            "update": "אין התקנה או אתחול ממתינים.",
            "apps": "שני יישומים לא חיוניים מסומנים כבעלי השפעה גבוהה על האתחול.",
            "devices": "הדרייבר תואם לדגם ואין התראות.",
            "bios": "אין עדכון קושחה שמטפל בתסמין.",
            "timing": "האיטיות חולפת אחרי שהיישומים מסיימים לעלות."
          }
        },
        "windows": {
          "name": "עדכון Windows ממתין לאתחול",
          "action": "windows",
          "fix": "שומרים את העבודה, מתאמים אתחול רגיל ובודקים בהיסטוריית העדכונים שההתקנה הסתיימה. מודדים שוב אחרי שהפעילות ברקע נרגעה.",
          "clues": {
            "task": "שירות העדכון עובד ברקע והדיסק עמוס.",
            "update": "עדכון מצטבר שכבר הותקן דורש אתחול להשלמה.",
            "apps": "אין יישום חריג בהפעלה.",
            "devices": "הדרייבר תואם ואין התראות.",
            "bios": "אין עדכון קושחה רלוונטי.",
            "timing": "האיטיות התחילה בזמן התקנת העדכון."
          }
        },
        "driver": {
          "name": "מנהל התקן גרפי מתאים לא מותקן",
          "action": "driver",
          "fix": "מתקינים דרייבר גרפי ממקור רשמי לפי הדגם וגרסת Windows, בהתאם למדיניות הארגון. מאתחלים לפי ההנחיה ובודקים שהתצוגה חזרה להיות חלקה.",
          "clues": {
            "task": "המעבד מתאמץ במיוחד כשמזיזים חלונות או מנגנים וידאו.",
            "update": "אין התקנה או אתחול ממתינים.",
            "apps": "לא זוהתה השפעה חריגה של יישומי האתחול.",
            "devices": "מופיע Microsoft Basic Display Adapter. ליצרן יש דרייבר מתאים לדגם ולגרסת Windows.",
            "bios": "הערות גרסת הקושחה לא מתארות שום תיקון מתאים.",
            "timing": "דפדוף, גלילה ווידאו מקרטעים. העתקת קבצים תקינה."
          }
        },
        "firmware": {
          "name": "תקלה מוכרת בקושחה מגבילה ביצועים",
          "action": "firmware",
          "fix": "בסימולציה בודקים התאמה מדויקת לדגם והערת גרסה שמציינת את התיקון. במחשב אמיתי פועלים לפי הוראות היצרן והארגון: מחברים מתח יציב, מוודאים שמפתח שחזור BitLocker זמין אם יש הצפנה, ולא קוטעים את העדכון. אחרי האתחול מודדים ביצועים שוב.",
          "clues": {
            "task": "תדר המעבד נשאר נמוך תחת עומס, אף שהטמפרטורה תקינה והמטען מתאים.",
            "update": "אין עדכוני Windows או אתחול ממתינים.",
            "apps": "אין יישומי אתחול חריגים.",
            "devices": "כל הדרייברים הדרושים מותקנים.",
            "bios": "בכרטיס היצרן המדומה מופיע תיקון לתופעת הגבלת תדר בדיוק בדגם ובגרסת ה־BIOS הנוכחית.",
            "timing": "האיטיות חוזרת גם בלי יישומי רקע."
          }
        }
      }
    }
  };
  const REPAIR_ACTIONS = {
  "startup": "צמצום יישומי אתחול לא חיוניים",
  "windows": "השלמת עדכון Windows באתחול מבוקר",
  "driver": "התקנת דרייבר מתאים מאתר היצרן",
  "firmware": "עדכון BIOS מתאים לפי נוהל היצרן",
  "all": "התקנת כל העדכונים בלי לבדוק התאמה"
};

  // Self-check: every fault has a clue for every check in its scenario.
  for (const [sid, s] of Object.entries(SCENARIOS)) {
    for (const [fid, f] of Object.entries(s.faults)) {
      for (const cid of Object.keys(s.checks)) console.assert(f.clues[cid], `missing clue ${sid}.${fid}.${cid}`);
    }
  }

  const STORAGE_KEY = 'cyjimm-fix-the-pc-v1';
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  let best = {};
  try { best = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { best = {}; }
  const saveBest = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(best)); } catch (e) { /* storage unavailable */ } };

  const state = { scenario: 'network', fault: null, checked: new Set(), wrong: 0, diagnosed: false, done: false };

  const score = () => Math.max(10, 100 - Math.max(0, state.checked.size - 2) * 10 - state.wrong * 30);

  function pickFault(sid) {
    const ids = Object.keys(SCENARIOS[sid].faults).filter((id) => id !== state.fault || Object.keys(SCENARIOS[sid].faults).length === 1);
    return ids[Math.floor(Math.random() * ids.length)];
  }

  function newRound(sid) {
    state.scenario = sid;
    state.fault = pickFault(sid);
    state.checked = new Set();
    state.wrong = 0;
    state.diagnosed = false;
    state.done = false;
    render();
  }

  function render() {
    const s = SCENARIOS[state.scenario];
    const f = s.faults[state.fault];

    document.querySelectorAll('[data-scenario-tab]').forEach((b) => {
      const on = b.dataset.scenarioTab === state.scenario;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
      $('[data-best]', b).textContent = best[b.dataset.scenarioTab] ? `שיא: ${best[b.dataset.scenarioTab]}` : 'טרם שוחק';
    });

    $('[data-ticket]').textContent = s.ticket;
    const screen = $('[data-screen]');
    screen.className = `pc-screen is-${f.symptom || s.screen}`;

    const checks = $('[data-checks]');
    checks.replaceChildren();
    for (const [cid, c] of Object.entries(s.checks)) {
      const item = el('div', 'check-item');
      const btn = el('button', 'check-btn');
      btn.type = 'button';
      btn.append(el('span', 'check-icon', c.icon), el('span', 'check-label', c.label));
      const opened = state.checked.has(cid);
      btn.setAttribute('aria-expanded', String(opened));
      btn.disabled = state.done && !opened;
      btn.addEventListener('click', () => {
        if (state.done || state.checked.has(cid)) return;
        state.checked.add(cid);
        render();
        $(`[data-clue="${cid}"]`)?.focus();
      });
      item.append(btn);
      if (opened) {
        const clue = el('p', 'check-clue', f.clues[cid]);
        clue.dataset.clue = cid;
        clue.tabIndex = -1;
        item.append(clue);
      }
      checks.append(item);
    }

    $('[data-check-count]').textContent = state.checked.size;
    $('[data-live-score]').textContent = score();

    const opts = $('[data-diagnosis]');
    opts.replaceChildren();
    for (const [fid, fault] of Object.entries(s.faults)) {
      const b = el('button', 'diag-btn', fault.name);
      b.type = 'button';
      b.disabled = state.done;
      b.addEventListener('click', () => diagnose(fid, b));
      opts.append(b);
    }

    const fb = $('[data-result]');
    fb.hidden = true;
  }

  function diagnose(fid, btn) {
    if (state.done) return;
    const s = SCENARIOS[state.scenario];
    const fb = $('[data-result]');
    fb.hidden = false;
    if (fid !== state.fault) {
      state.wrong += 1;
      btn.disabled = true;
      btn.classList.add('is-wrong');
      fb.className = 'game-result is-wrong';
      fb.textContent = state.checked.size < 2
        ? 'לא זה. כדאי לבצע עוד כמה בדיקות לפני שמנחשים: טכנאי טוב אוסף מידע קודם.'
        : 'לא זה. חזרו לרמזים: איזו בדיקה הראתה משהו חריג?';
      $('[data-live-score]').textContent = score();
      return;
    }
    if (state.scenario === 'slow') {
      if (state.diagnosed) return;
      state.diagnosed = true;
      btn.classList.add('is-right');
      document.querySelectorAll('.diag-btn').forEach((b) => { b.disabled = true; });
      document.querySelectorAll('.check-btn').forEach((b) => { b.disabled = true; });
      const choices = el('div','diag-list');
      const prompt = el('h3',null,'3. איזה טיפול מבצעים?');
      const feedback = el('p',null,'הפעולות מדומות בלבד. הן לא משנות את המחשב שלכם.');
      fb.className = 'game-result';
      fb.replaceChildren(prompt,feedback,choices);
      for (const [action,label] of Object.entries(REPAIR_ACTIONS)) {
        const option = el('button','diag-btn',label);
        option.type = 'button';
        option.addEventListener('click',() => {
          if (state.done || option.disabled) return;
          if (action === s.faults[state.fault].action) {
            finish(btn);
            return;
          }
          state.wrong += 1;
          option.disabled = true;
          option.classList.add('is-wrong');
          feedback.textContent = 'הטיפול הזה לא פותר את הגורם שנמצא. בחרו פעולה שמתאימה לרמזים, לא את כל העדכונים.';
          $('[data-live-score]').textContent = score();
          choices.querySelector('button:not(:disabled)')?.focus();
        });
        choices.append(option);
      }
      choices.querySelector('button').focus();
      return;
    }
    finish(btn);
  }

  function finish(btn) {
    const s = SCENARIOS[state.scenario];
    const fb = $('[data-result]');
    state.done = true;
    const pts = score();
    if (!best[state.scenario] || pts > best[state.scenario]) { best[state.scenario] = pts; saveBest(); }
    document.querySelectorAll('.diag-btn').forEach((b) => { b.disabled = true; });
    btn.classList.add('is-right');
    document.querySelectorAll('.check-btn').forEach((b) => { if (b.getAttribute('aria-expanded') !== 'true') b.disabled = true; });
    fb.className = 'game-result is-right';
    fb.replaceChildren(
      el('strong', null, `נמצאה התקלה! +${pts} נקודות`),
      el('p', null, `האבחנה: ${s.faults[state.fault].name}.`),
      el('p', null, `הפתרון: ${s.faults[state.fault].fix}`),
      ...(state.scenario === 'slow' ? [el('p', null, 'בדיקה חוזרת בסימולציה: המחשב חזר להגיב כרגיל.')] : []),
      el('p', 'result-meta', `${state.checked.size} בדיקות, ${state.wrong} ניחושים שגויים.`)
    );
    const again = el('button', 'btn btn-primary', 'תקלה חדשה ↻');
    again.type = 'button';
    again.addEventListener('click', () => newRound(state.scenario));
    fb.append(again);
    document.querySelectorAll('[data-scenario-tab]').forEach((b) => {
      $('[data-best]', b).textContent = best[b.dataset.scenarioTab] ? `שיא: ${best[b.dataset.scenarioTab]}` : 'טרם שוחק';
    });
    again.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-scenario-tab]').forEach((b) => b.addEventListener('click', () => newRound(b.dataset.scenarioTab)));
    $('[data-new-round]').addEventListener('click', () => newRound(state.scenario));
    newRound('network');
  });
})();
