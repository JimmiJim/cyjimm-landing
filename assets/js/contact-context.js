(function () {
  'use strict';

  const page = document.querySelector('[data-contact-page]');
  const form = document.querySelector('[data-contact-form]');
  const select = document.getElementById('contact-service');
  const title = document.getElementById('contact-title');
  const intro = document.getElementById('contact-intro');
  const message = document.getElementById('contact-message');
  const messageHint = document.getElementById('contact-message-hint');
  const subject = document.querySelector('[data-contact-subject]');
  const languageSwitches = document.querySelectorAll('[data-contact-language-switch]');

  if (!page || !form || !select || !title || !intro || !message) return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const services = isEnglish ? {
    general: {
      title: "Let's talk",
      intro: 'Tell me briefly what you need help with. From there, we can work out the right next step.',
      placeholder: 'What would you like help with?',
      hint: 'A short description is enough for the first conversation.'
    },
    'private-it': {
      title: 'How can I help with your computer?',
      intro: 'Describe the problem, the device involved, and what you have already tried. A short description is enough to start.',
      placeholder: 'What is happening, and which computer or device is involved?',
      hint: 'Do not include passwords, access codes, or other sensitive credentials.'
    },
    websites: {
      title: "Let's talk about your website",
      intro: 'Tell me about the business, what you offer, and what you would like the website to do. Then we can decide what is actually needed.',
      placeholder: 'What does the business do, and what should the website help visitors do?',
      hint: 'If you already have a website or domain, you can mention it here.'
    },
    'managed-it': {
      title: "Let's understand your IT environment",
      intro: 'Describe the environment, the recurring problem, or the project you are considering. We will start with the current situation and the required scope.',
      placeholder: 'What environment, systems, or operational issue should we look at?',
      hint: 'A high-level description is enough. Do not include credentials or secrets.'
    },
    security: {
      title: "Let's talk about the security need",
      intro: 'Describe the environment, concern, or assessment you have in mind. Scope and boundaries come before tools or promises.',
      placeholder: 'What needs to be reviewed, tested, or improved?',
      hint: 'Do not include credentials, secrets, or sensitive incident data in this initial form.'
    },
    automation: {
      title: "Let's understand the process",
      intro: 'Describe the repetitive work, integration, or delivery process you want to improve. The first step is understanding where automation will actually help.',
      placeholder: 'Which process or integration are you considering, and what is slowing it down today?',
      hint: 'A short description of the current workflow is enough.'
    }
  } : {
    general: {
      title: 'בוא נדבר',
      intro: 'ספר לי בקצרה במה צריך עזרה. משם נוכל להבין מה הצעד הנכון.',
      placeholder: 'במה תרצה עזרה?',
      hint: 'תיאור קצר מספיק לשיחה הראשונה.'
    },
    'private-it': {
      title: 'איך אפשר לעזור עם המחשב?',
      intro: 'ספר בקצרה מה הבעיה, באיזה מחשב או מכשיר מדובר ומה כבר ניסית. זה מספיק כדי להתחיל להבין את הכיוון.',
      placeholder: 'מה קורה, ובאיזה מחשב או מכשיר מדובר?',
      hint: 'אין לצרף סיסמאות, קודי גישה או פרטי התחברות רגישים.'
    },
    websites: {
      title: 'בוא נדבר על האתר שלך',
      intro: 'ספר לי קצת על העסק, מה אתה מציע ומה היית רוצה שהאתר יעשה. משם נוכל להבין מה באמת צריך.',
      placeholder: 'מה העסק עושה, ומה היית רוצה שהמבקרים באתר יוכלו לעשות?',
      hint: 'אם כבר יש אתר או דומיין, אפשר לציין זאת כאן.'
    },
    'managed-it': {
      title: 'בוא נבין את סביבת המחשוב',
      intro: 'ספר בקצרה על הסביבה, התקלה החוזרת או הפרויקט שעל הפרק. מתחילים מהמצב הקיים ומהיקף העבודה הנכון.',
      placeholder: 'איזו סביבה, מערכת או בעיה תפעולית צריך לבדוק?',
      hint: 'מספיק תיאור כללי. אין לצרף סיסמאות או מידע סודי.'
    },
    security: {
      title: 'בוא נדבר על הצורך באבטחה',
      intro: 'ספר על הסביבה, החשש או הבדיקה שעל הפרק. לפני כל כלי או הבטחה מגדירים היקף וגבולות ברורים.',
      placeholder: 'מה צריך לבדוק, לבחון או לשפר?',
      hint: 'אין לצרף סיסמאות, סודות או מידע רגיש מאירוע אבטחה בטופס הראשוני.'
    },
    automation: {
      title: 'בוא נבין את התהליך',
      intro: 'ספר על העבודה החוזרת, האינטגרציה או תהליך המסירה שצריך לשפר. קודם מבינים איפה אוטומציה באמת תעזור.',
      placeholder: 'איזה תהליך או חיבור היית רוצה לשפר, ומה מעכב אותו היום?',
      hint: 'תיאור קצר של התהליך הקיים מספיק בשלב הזה.'
    }
  };

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  const initialService = Object.prototype.hasOwnProperty.call(services, requestedService) ? requestedService : 'general';

  function optionFor(serviceId) {
    return Array.from(select.options).find(function (option) {
      return option.dataset.serviceId === serviceId;
    });
  }

  function applyService(serviceId, updateAddress) {
    const safeService = Object.prototype.hasOwnProperty.call(services, serviceId) ? serviceId : 'general';
    const copy = services[safeService];
    const option = optionFor(safeService) || optionFor('general');
    const label = option ? option.value : '';

    if (option) select.value = option.value;
    title.textContent = copy.title;
    intro.textContent = copy.intro;
    message.placeholder = copy.placeholder;
    if (messageHint) messageHint.textContent = copy.hint;
    if (subject) subject.value = 'CyJimm Contact — ' + label;
    form.dataset.serviceContext = safeService;
    page.dataset.serviceContext = safeService;

    if (languageSwitches.length) {
      const base = isEnglish ? '/contact/' : '/en/contact/';
      const href = safeService === 'general' ? base : base + '?service=' + encodeURIComponent(safeService);
      languageSwitches.forEach(function (link) {
        link.href = href;
      });
    }

    if (updateAddress && window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      if (safeService === 'general') {
        url.searchParams.delete('service');
      } else {
        url.searchParams.set('service', safeService);
      }
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }

  applyService(initialService, false);

  select.addEventListener('change', function () {
    const selectedOption = select.options[select.selectedIndex];
    applyService(selectedOption ? selectedOption.dataset.serviceId : 'general', true);
  });

  document.addEventListener('cyjimm:contact-sent', function () {
    applyService(form.dataset.serviceContext || 'general', false);
  });
}());
