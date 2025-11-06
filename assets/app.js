document.addEventListener('DOMContentLoaded', function () {
  // --- תפריט מובייל ---
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobilePanel');
  if (btn && panel) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.display = expanded ? 'none' : 'flex';
    });
  }

  // --- עדכון שנה בפוטר ---
  const yr = document.getElementById('year');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }

  // === חללית שעוקבת אחרי הסמן ===
  // נרוץ רק במכשירים עם מצביע "עדין" (דסקטופ/פד), כדי לא לשבור מובייל
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const ship = document.querySelector('.cursor-ship');

  if (ship && finePointer) {
    // מתחילים שקופים; נחשפים כשנכנסים לחלון
    ship.style.opacity = '0';

    document.addEventListener('mouseenter', () => {
      ship.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      ship.style.opacity = '0';
    });

    // תנועה "חלקה" עם easing בעזרת requestAnimationFrame
    let x = 0, y = 0;   // מיקום נוכחי
    let tx = 0, ty = 0; // מיקום יעד
    let rafId = null;
    const speed = 0.22; // ככל שגדול יותר — פחות גרירה, תנועה חדה יותר

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
