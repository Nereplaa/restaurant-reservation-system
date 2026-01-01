// Active menu highlighting based on current file name
(function(){
    const current = (location.pathname.split('/').pop() || 'dashboard.html').toLowerCase();
    document.querySelectorAll('.nav a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if(href === current) a.classList.add('active');
    });
  })();
  
  // Tabs visual toggle
  document.querySelectorAll('.tabs').forEach(tabWrap => {
    const btns = tabWrap.querySelectorAll('.tab');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    }));
  });
  
  // KDS Clock (only if element exists)
  (function(){
    const el = document.getElementById('clock');
    if(!el) return;
  
    const pad = n => String(n).padStart(2,'0');
    const tick = () => {
      const d = new Date();
      el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  })();
  