document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobilePanel');
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.display = expanded ? 'none' : 'flex';
    });
  }

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
      statusBox.textContent = 'שולח...';

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
          statusBox.textContent = 'הפרטים נשלחו בהצלחה ✔️ נחזור אליך בהקדם.';
          form.reset();
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        statusBox.className = 'form-status err';
        statusBox.textContent = 'שגיאה בשליחה. אפשר לפנות ישירות ל־madara@cyjimm.com';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const ship = document.querySelector('.cursor-ship');

  if (ship && finePointer) {
    ship.style.opacity = '0';

    document.addEventListener('mouseenter', () => {
      ship.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      ship.style.opacity = '0';
    });

    let x = 0, y = 0;
    let tx = 0, ty = 0;
    let rafId = null;
    const speed = 0.22;

    function onMouseMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    function update() {
      x += (tx - x) * speed;
      y += (ty - y) * speed;
      ship.style.transform = `translate(${x}px, ${y}px)`;

      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    }

    document.addEventListener('mousemove', onMouseMove);
  }
});
