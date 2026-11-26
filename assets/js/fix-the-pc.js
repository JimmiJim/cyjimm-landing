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
        },
        "disk": { "icon": "💽", "label": "שטח פנוי ואחסון זמני" },
        "health": { "icon": "🩺", "label": "אמינות Windows ובדיקת קובצי מערכת" }
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
            "timing": "האיטיות חולפת אחרי שהיישומים מסיימים לעלות.",
            "disk": "יש מרווח פנוי בכונן המערכת; לא נרשמו התרעות אחסון.",
            "health": "אין קריסות חוזרות של רכיבי Windows ולא זוהתה פגיעה בקובצי מערכת."
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
            "timing": "האיטיות התחילה בזמן התקנת העדכון.",
            "disk": "נותר שטח פנוי מספק בכונן המערכת.",
            "health": "פעילות העדכון מתועדת, אך אין עדות לפגיעה בקובצי מערכת."
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
            "timing": "דפדוף, גלילה ווידאו מקרטעים. העתקת קבצים תקינה.",
            "disk": "יש די מקום פנוי; העומס מורגש בעיקר בפעולות תצוגה.",
            "health": "אין שגיאות של רכיבי Windows. הבעיה מופיעה בפעולות גרפיות."
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
            "timing": "האיטיות חוזרת גם בלי יישומי רקע.",
            "disk": "כונן המערכת לא מלא ובדיקת האחסון תקינה.",
            "health": "לא זוהו כשלים חוזרים של רכיבי Windows. האיטיות מופיעה בעיקר תחת עומס."
          }
        },
        "system": {
          "name": "קובצי מערכת של Windows פגומים",
          "action": "system",
          "fix": "בסימולציה מפעילים את sfc /scannow במסוף עם הרשאות מנהל ובודקים מה הסריקה תיקנה. אחר כך פותחים מחדש את הגדרות Windows ובודקים שגם סייר הקבצים עובד בלי להיתקע. אם הסריקה לא הצליחה לתקן, לא מכריזים שהתקלה נפתרה.",
          "clues": {
            "task": "סייר הקבצים והגדרות Windows מפסיקים להגיב לפרקים, בלי עומס חריג מתוכנות אחרות.",
            "update": "אין עדכון או אתחול ממתינים כרגע.",
            "apps": "אין תוכנות כבדות חריגות בכניסה.",
            "devices": "לא מופיעות שגיאות בהתקנים והדרייברים תואמים.",
            "bios": "אין תיקון קושחה לדגם שעונה על התסמין.",
            "timing": "התקיעות חוזרות גם אחרי אתחול, בעיקר בפעולות של Windows עצמו.",
            "disk": "בכונן המערכת יש מרווח פנוי תקין.",
            "health": "בדיקת אימות מדומה מצאה הפרות של תקינות קובצי מערכת מוגנים. זה ממצא, לא רק ניחוש לפי האיטיות."
          }
        },
        "temp": {
          "name": "הכונן כמעט מלא בגלל הצטברות קבצים זמניים",
          "action": "temp",
          "fix": "פותחים בסימולציה את הגדרות האחסון של Windows, סוקרים את קובצי ה־Temp ובוחרים רק פריטים זמניים שאפשר להסיר. לא מסמנים הורדות, לא מוחקים קבצים אישיים ולא מכריחים מחיקה של קובץ בשימוש. בודקים מחדש את המקום הפנוי ומנסים שוב לשמור קובץ.",
          "clues": {
            "task": "תוכנות מגיבות לאט בעיקר בשמירה ובפתיחת קבצים. אין תהליך יחיד שצורך הרבה מעבד.",
            "update": "אין עדכון או אתחול ממתינים. הכונן מציג אזהרת שטח פנוי נמוך.",
            "apps": "גם עם מעט תוכנות פתוחות, השמירה איטית.",
            "devices": "אין שגיאות שקשורות לכונן או לדרייברים.",
            "bios": "אין עדכון BIOS שקשור לתסמינים.",
            "timing": "הקושי בולט בשמירה ובפעולות שכותבות לכונן, לא רק בבוקר.",
            "disk": "בסימולציה נותר פחות מ־1GB פנוי. סריקת האחסון מצאה 14GB של קבצים זמניים שאפשר לסקור ולנקות.",
            "health": "לא זוהתה פגיעה בקובצי מערכת מוגנים."
          }
        },
        "dism": {
          "name": "מאגר הרכיבים של Windows פגום",
          "action": "dism",
          "fix": "בסימולציה פותחים מסוף כמנהל ומריצים DISM /Online /Cleanup-Image /RestoreHealth. רק אחרי ש־DISM מסיים בהצלחה, מריצים שוב sfc /scannow ובודקים את תוצאתו. אחר כך מנסים שוב את העדכון ובודקים את התסמין המקורי. אם DISM מדווח שחסרים קובצי מקור, הטיפול טרם הסתיים: צריך מקור תיקון תואם ומאושר.",
          "clues": {
            "task": "המעבר בין חלונות רגיל אחרי שהעדכון נעצר, אבל חלק ממסכי Windows שוב מפסיקים להגיב במהלך הניסיון הבא.",
            "update": "אותו עדכון מצטבר נכשל שוב לאחר אתחול; אין עדכון שרק ממתין להשלמה.",
            "apps": "אין יישומי אתחול חריגים.",
            "devices": "אין התראות חומרה או דרייברים חסרים.",
            "bios": "אין תיקון BIOS שתואם לתסמינים.",
            "timing": "התקלה חוזרת בזמן עדכון או פתיחת רכיבי Windows, לא ביישום יחיד.",
            "disk": "יש די שטח פנוי; ניקוי קבצים זמניים אינו מסביר את הכשל.",
            "health": "SFC מצא קבצים שלא הצליח לתקן. בדיקת תקינות מדומה מראה שמאגר הרכיבים של Windows פגום וניתן לתיקון."
          }
        },
        "distribution": {
          "name": "שרת הפצת העדכונים לא הצליח להוריד את החבילה",
          "action": "distribution",
          "fix": "בסימולציה מעבירים את הממצא לצוות שמנהל את העדכונים. הצוות מאמת שהחבילה מאושרת, בודק את הגישה של שרת ההפצה למקור היצרן לפי מדיניות הארגון, ומנסה מחדש דרך מנגנון ההפצה הרגיל. לא משנים בעצמנו את מדיניות הרשת, ולא מתקינים ממקור עוקף.",
          "clues": {
            "task": "השימוש במעבד ובדיסק רגיל בזמן ההמתנה. המחשב לא עסוק בהתקנת חבילה.",
            "update": "אותו עדכון מאושר מוצע לכמה תחנות, אבל ההורדה לא מתחילה. במסך ההפצה המדומה השרת מדווח שלא הצליח להוריד את החבילה ממקור היצרן. אין דרישת אתחול.",
            "apps": "סגירת יישומים לא משנה את מצב העדכון.",
            "devices": "מנהל ההתקנים לא מצביע על בעיה, ועדכונים אחרים הותקנו כרגיל.",
            "bios": "אין עדכון BIOS רלוונטי לחבילה שנכשלה.",
            "timing": "אותה חבילה נשארת בשלב ההורדה גם אחרי אתחול. מחשבים נוספים בקבוצת ההפצה מדווחים על אותו מצב.",
            "disk": "בכונן המערכת יש שטח פנוי מתאים; אין אזהרות אחסון.",
            "health": "בדיקת תקינות מדומה לא מצאה פגיעה בקובצי המערכת או במאגר הרכיבים."
          }
        }
      }
    }
  };
  // Intake details describe observations only; diagnostic evidence is revealed by checks.
  const INTAKE = {
    "network": {
      "unplugged": [
        "״פתחתי את המחשב בסלון ואף אתר לא נטען, וגם שיחת וידאו לא מתחברת.״",
        "זה התחיל היום, אחרי שהזיזו את השולחן. המחשב מחובר בחיבור קווי.",
        "שני אתרים שונים לא נפתחו. באותו זמן הטלפון גלש כרגיל ברשת הביתית."
      ],
      "dhcp": [
        "״המחשב נדלק כרגיל, אבל אני לא מצליחה לגלוש או לפתוח את התיקייה המשותפת בבית.״",
        "זה התחיל אחרי שהדלקתי את המחשב בבוקר. בדרך כלל אני מחוברת בכבל.",
        "הפעלה מחדש של המחשב לא עזרה. במחשב נוסף בבית הכול עובד."
      ],
      "dns": [
        "״כמה אתרים שלא קשורים זה לזה לא נפתחים, למרות שהמחשב נראה מחובר.״",
        "מאז הבוקר, בכמה דפדפנים באותו מחשב נייח.",
        "אותם אתרים נפתחים בטלפון שמחובר לרשת הביתית. עדיין לא בדקתי מה המחשב מצליח להגיע אליו."
      ],
      "airplane": [
        "״פתחתי את הלפטופ בבית, והוא לא מצליח לחזור לרשת שהתחבר אליה אתמול.״",
        "מיד אחרי שהתעורר ממצב שינה. בדרך כלל אני עובדת בחיבור אלחוטי.",
        "הטלפון מחובר לאותה רשת וגולש. סגירה ופתיחה של הדפדפן לא שינו דבר."
      ]
    },
    "display": {
      "input": [
        "״המחשב נדלק, אבל המסך מציג לרגע ‘אין אות’ ואז נשאר שחור.״",
        "מאז שהעמדה הוזזה לניקיון. זו אותה עמדה ואותו מסך שעבדו אתמול.",
        "כיביתי והדלקתי שוב את המסך. ההודעה חזרה, ותפריט המסך עצמו כן נפתח."
      ],
      "cable": [
        "״אני רואה את שולחן העבודה, אבל כל כמה שניות המסך נכבה לרגע וחוזר.״",
        "זה התחיל אחרי סידור העמדה וממשיך גם כשאני לא נוגע במחשב.",
        "ההבהוב קורה גם על שולחן העבודה, בלי אפליקציה פתוחה."
      ],
      "driver": [
        "״יש תמונה, אבל הטקסט והאייקונים גדולים ומטושטשים.״",
        "זה התחיל כשהמחשב חזר לעמדה אחרי התקנה מחדש של Windows.",
        "זה נראה כך גם במסך הכניסה וגם בכמה תוכנות, לא רק בדפדפן."
      ]
    },
    "slow": {
      "startup": [
        "״אחרי שאני נכנס למחשב, אפילו לפתוח תיקייה לוקח זמן. בהמשך היום הוא מרגיש רגיל.״",
        "זה קורה כמעט בכל כניסה ראשונה בבוקר ונמשך כמה דקות.",
        "גם כשלא פתחתי שום תוכנה בעצמי, אותה האטה חזרה בכניסה הבאה."
      ],
      "windows": [
        "״המחשב נהיה איטי באמצע היום. פתיחת קבצים והמעבר בין תוכנות התחילו להתעכב.״",
        "זה התחיל כשהמחשב היה פתוח ועבד כרגיל קודם. עדיין לא ביצעתי אתחול מאז.",
        "סגרתי את הדפדפן ואת הקבצים שעבדתי עליהם. האיטיות לא נעלמה."
      ],
      "driver": [
        "״הגלילה קופצת והווידאו מקרטע, אבל קבצים רגילים נפתחים כרגיל.״",
        "זה התחיל אחרי התקנה נקייה של Windows ומורגש בעיקר כשמזיזים חלונות או מפעילים וידאו.",
        "בדקתי וידאו מקומי וגם וידאו בדפדפן. שניהם מקרטעים, אבל העתקת קבצים תקינה."
      ],
      "firmware": [
        "״גם אחרי שהמחשב כבר פתוח הרבה זמן, פעולות כבדות לוקחות הרבה יותר זמן מבעבר.״",
        "זה חוזר במהלך משימות שדורשות מאמץ מהמחשב, גם כשהוא מחובר לחשמל.",
        "אתחול רגיל וסגירת תוכנות שלא בשימוש לא שינו את הזמן של אותה משימה."
      ],
      "system": [
        "״סייר הקבצים נתקע, ולפעמים אפילו הגדרות Windows לא נפתחות. תוכנות אחרות דווקא מגיבות.״",
        "זה חוזר גם אחרי כניסה מחדש ומורגש במיוחד בפעולות של Windows עצמו.",
        "ביצעתי אתחול וניסיתי לפתוח את אותן הגדרות בלי תוכנות פתוחות. הן שוב נתקעו."
      ],
      "temp": [
        "״פתיחת קבצים ושמירה נהיו איטיות, ובפעם האחרונה Windows הזהיר שאין מספיק מקום.״",
        "זה החמיר בהדרגה במהלך השבוע. גלילה בדף שכבר פתוח עדיין מרגישה רגילה.",
        "ניסיתי לשמור מסמך קטן מקומית אחרי שסגרתי תוכנות אחרות. גם אז הופיעה אזהרה."
      ],
      "dism": [
        "״עדכון Windows נכשל שוב, ולפעמים גם מסך ההגדרות נתקע.״",
        "זה חוזר כשאני מנסה להשלים את אותו עדכון, גם אחרי אתחול.",
        "ניסיתי שוב לאחר ששמרתי עבודה ואתחלתי. העדכון נכשל באותו שלב."
      ],
      "distribution": [
        "״עדכון אחד נשאר על ‘ממתין להורדה’. שאר העבודה על המחשב מתנהלת כרגיל.״",
        "המצב נמשך כבר כמה שעות. הוא חוזר באותו עדכון, גם כשהמחשב מחובר לרשת.",
        "ביצעתי אתחול וניסיתי שוב. ההורדה עדיין לא התחילה, אבל אפליקציות ואתרים נפתחים."
      ]
    }
  };

  const REPAIR_ACTIONS = {
  "startup": "צמצום יישומי אתחול לא חיוניים",
  "windows": "השלמת עדכון Windows באתחול מבוקר",
  "driver": "התקנת דרייבר מתאים מאתר היצרן",
  "firmware": "עדכון BIOS מתאים לפי נוהל היצרן",
  "system": "בדיקה ותיקון קובצי מערכת עם sfc /scannow",
  "temp": "ניקוי קבצים זמניים דרך הגדרות האחסון",
  "dism": "תיקון מאגר הרכיבים עם DISM ואז בדיקה חוזרת עם SFC",
  "distribution": "בדיקת הורדת החבילה בשרת ההפצה מול צוות העדכונים",
  "all": "התקנת כל העדכונים בלי לבדוק התאמה"
};

  const RETEST = {
    distribution: 'בדיקה חוזרת בסימולציה: שרת ההפצה מדווח שהחבילה הורדה, ותחנת הבדיקה הצליחה לקבל ולהתקין אותה באותו מסלול מאושר.',
    system: 'בדיקה חוזרת בסימולציה: SFC סיים בהצלחה, וסייר הקבצים וההגדרות נפתחים ללא תקיעה.',
    temp: 'בדיקה חוזרת בסימולציה: התפנה מקום בכונן, ואותו מסמך נשמר בלי שגיאה.',
    dism: 'בדיקה חוזרת בסימולציה: DISM הסתיים בהצלחה, SFC עבר, ואותו עדכון הותקן בניסיון חוזר.'
  };

  // Self-check: every fault has a clue for every check in its scenario.
  for (const [sid, s] of Object.entries(SCENARIOS)) {
    for (const [fid, f] of Object.entries(s.faults)) {
      console.assert(INTAKE[sid]?.[fid]?.length === 3, `missing intake ${sid}.${fid}`);
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

    const intake = INTAKE[state.scenario]?.[state.fault];
    $('[data-ticket]').textContent = intake?.[0] || s.ticket;
    const details = $('[data-ticket-details]');
    if (details) {
      details.hidden = !intake;
      if (intake) {
        $('[data-ticket-timing]', details).textContent = intake[1];
        $('[data-ticket-tried]', details).textContent = intake[2];
      }
    }
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
      ...(state.scenario === 'slow' ? [el('p', null, (RETEST[s.faults[state.fault].action] || 'בדיקה חוזרת בסימולציה: המחשב חזר להגיב כרגיל.'))] : []),
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
