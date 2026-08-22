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

      statusBox.className = 'form-status';
      statusBox.style.display = 'block';
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

        if (res.ok) {
          statusBox.className = 'form-status ok';
          statusBox.textContent = isEnglish ? 'Your details were sent successfully ✔️ We will get back to you soon.' : 'הפרטים נשלחו בהצלחה ✔️ נחזור אליך בהקדם.';
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        statusBox.className = 'form-status err';
        statusBox.textContent = isEnglish ? 'There was an error sending the form. You can contact hello@cyjimm.com directly.' : 'שגיאה בשליחה. אפשר לפנות ישירות ל־hello@cyjimm.com';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

});
