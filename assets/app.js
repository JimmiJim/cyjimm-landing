window.cyjimmTurnstileVerified = function () {
  document.dispatchEvent(new CustomEvent('cyjimm:turnstile-verified'));
};

window.cyjimmTurnstileExpired = function () {
  document.dispatchEvent(new CustomEvent('cyjimm:turnstile-expired'));
};

window.cyjimmTurnstileError = function () {
  document.dispatchEvent(new CustomEvent('cyjimm:turnstile-error'));
};

document.addEventListener('DOMContentLoaded', function () {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');

  const yr = document.getElementById('year');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }

  // === Contact Form Logic ===
  const form = document.querySelector('[data-contact-form]');
  const statusBox = document.getElementById('contactStatus');

  if (form && statusBox) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const verifyBtn = form.querySelector('[data-turnstile-verify]');
    const turnstileWidget = form.querySelector('#contact-turnstile-widget');
    const verifyLabel = isEnglish ? 'Verify I am human' : 'אמתו שאני אנושי';
    const verifiedLabel = isEnglish ? 'Verified successfully' : 'האימות הושלם בהצלחה';

    const requireVerification = (message) => {
      if (submitBtn) submitBtn.disabled = true;
      if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.classList.remove('is-verified');
        verifyBtn.textContent = verifyLabel;
      }
      if (message) {
        statusBox.className = 'form-status err';
        statusBox.textContent = message;
      }
    };

    const handleVerified = () => {
      if (submitBtn) submitBtn.disabled = false;
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.classList.add('is-verified');
        verifyBtn.textContent = verifiedLabel;
      }
      statusBox.className = 'form-status ok';
      statusBox.textContent = isEnglish
        ? 'Human verification completed. You can now send the inquiry.'
        : 'האימות הושלם. כעת ניתן לשלוח את הפנייה.';
    };

    const handleExpired = () => {
      requireVerification(isEnglish
        ? 'The verification expired. Please verify again.'
        : 'תוקף האימות פג. יש לבצע אימות מחדש.');
    };

    const handleError = () => {
      requireVerification(isEnglish
        ? 'Verification failed to load. Please try again.'
        : 'האימות לא הצליח להיטען. יש לנסות שוב.');
    };

    document.addEventListener('cyjimm:turnstile-verified', handleVerified);
    document.addEventListener('cyjimm:turnstile-expired', handleExpired);
    document.addEventListener('cyjimm:turnstile-error', handleError);

    if (submitBtn) submitBtn.disabled = true;

    if (verifyBtn && turnstileWidget) {
      verifyBtn.addEventListener('click', () => {
        if (!window.turnstile) {
          handleError();
          return;
        }

        verifyBtn.disabled = true;
        verifyBtn.textContent = isEnglish ? 'Verifying...' : 'מבצע אימות...';
        statusBox.className = 'form-status is-visible';
        statusBox.textContent = isEnglish
          ? 'Complete the verification to continue.'
          : 'יש להשלים את האימות כדי להמשיך.';
        window.turnstile.execute('#contact-turnstile-widget');
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);

      // Honeypot check
      if (data.get('website')) return;

      if (!data.get('cf-turnstile-response')) {
        statusBox.className = 'form-status err';
        statusBox.textContent = isEnglish
          ? 'Please complete the human verification before sending.'
          : 'יש להשלים את האימות לפני שליחת הפנייה.';
        return;
      }

      statusBox.className = 'form-status is-visible';
      statusBox.textContent = isEnglish ? 'Sending...' : 'שולח...';

      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(data)),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        let payload = {};
        try {
          payload = await res.json();
        } catch (_) {
          // Never treat an unparseable response as confirmed email delivery.
        }

        const deliveryConfirmed = payload && payload.success === true;
        if (!res.ok || !deliveryConfirmed) {
          const serviceMessage = payload && typeof payload.message === 'string' ? payload.message : 'Request failed';
          throw new Error(serviceMessage);
        }

        statusBox.className = 'form-status ok';
        statusBox.textContent = isEnglish ? 'Your inquiry was sent successfully.' : 'הפנייה נשלחה בהצלחה.';
        form.reset();
        if (window.turnstile) window.turnstile.reset();
        requireVerification();
        document.dispatchEvent(new CustomEvent('cyjimm:contact-sent', {
          detail: { service: form.dataset.serviceContext || 'general' }
        }));
      } catch (err) {
        console.error('CyJimm contact submission failed:', err);
        if (window.turnstile) window.turnstile.reset();
        requireVerification(isEnglish
          ? 'The form could not confirm email delivery. Please contact hello@cyjimm.com directly.'
          : 'לא התקבל אישור שהפנייה נמסרה למייל. אפשר לפנות ישירות ל־hello@cyjimm.com');
      } finally {
        if (submitBtn && form.querySelector('[name="cf-turnstile-response"]')?.value) {
          submitBtn.disabled = false;
        }
      }
    });
  }

});
