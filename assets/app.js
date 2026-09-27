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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);

      // Honeypot check
      if (data.get('website')) return;

      statusBox.className = 'form-status is-visible';
      statusBox.textContent = isEnglish ? 'Sending...' : 'שולח...';

      const submitBtn = form.querySelector('button[type="submit"]');
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

        const formSubmitSuccess = payload && (payload.success === true || payload.success === 'true');
        if (!res.ok || !formSubmitSuccess) {
          const serviceMessage = payload && typeof payload.message === 'string' ? payload.message : 'Request failed';
          throw new Error(serviceMessage);
        }

        statusBox.className = 'form-status ok';
        statusBox.textContent = isEnglish ? 'Your inquiry was sent successfully.' : 'הפנייה נשלחה בהצלחה.';
        form.reset();
        document.dispatchEvent(new CustomEvent('cyjimm:contact-sent', {
          detail: { service: form.dataset.serviceContext || 'general' }
        }));
      } catch (err) {
        console.error('CyJimm contact submission failed:', err);
        statusBox.className = 'form-status err';
        statusBox.textContent = isEnglish
          ? 'The form could not confirm email delivery. Please contact hello@cyjimm.com directly.'
          : 'לא התקבל אישור שהפנייה נמסרה למייל. אפשר לפנות ישירות ל־hello@cyjimm.com';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

});
