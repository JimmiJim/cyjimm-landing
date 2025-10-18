document.addEventListener('DOMContentLoaded',function(){
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobilePanel');
  if(btn && panel){
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.display = expanded ? 'none' : 'flex';
    });
  }
  const yr = document.getElementById('year');
  if(yr){ yr.textContent = new Date().getFullYear(); }
});