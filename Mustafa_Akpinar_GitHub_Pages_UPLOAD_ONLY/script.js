/* Small, accessible enhancements; all content works without JavaScript. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  function updateThemeLabel() {
    if (!themeButton) return;
    const isLight = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  }
  function syncBrowserThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = root.dataset.theme === 'dark' ? '#080f18' : '#f8fbfc';
  }
  updateThemeLabel();
  syncBrowserThemeColor();
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('ma-theme', next); } catch(e) {}
    updateThemeLabel();
    syncBrowserThemeColor();
  });

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  function closeMenu() {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open navigation');
    nav.classList.remove('is-open');
  }
  navToggle?.addEventListener('click', () => {
    const opening = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded',String(opening));
    navToggle.setAttribute('aria-label',opening ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open',opening);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if(window.innerWidth > 900) closeMenu(); });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-card[data-category]')];
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => { const selected=b === btn; b.classList.toggle('active',selected); b.setAttribute('aria-pressed',String(selected)); });
    cards.forEach(c => { c.hidden = filter !== 'all' && c.dataset.category !== filter; });
  }));

  // Project metrics come from the README of the IS479 benchmark repository.
  const metrics = {
    f1: { description:'Best observed F1 scores by model in this BigVul benchmark, across the prompting strategies evaluated.',values:[['claude',70.4,'70.4%'],['gemini',62.6,'62.6%'],['openai',56.0,'56.0%']], label:'Best observed F1 scores: Claude Haiku 70.4%, Google Gemini 62.6%, OpenAI GPT 56.0%' },
    mcc:{ description:'Best observed Matthews correlation coefficients by model in the evaluated configurations (scale −1 to +1).',values:[['claude',0.310,'0.310'],['gemini',0.253,'0.253'],['openai',0.206,'0.206']], label:'Best observed MCC: Claude Haiku 0.310, Google Gemini 0.253, OpenAI GPT 0.206' }
  };
  const chart=document.querySelector('.chart');
  document.querySelectorAll('[data-metric]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.metric;
    const data=metrics[key];
    if (!data || !chart) return;
    document.querySelectorAll('[data-metric]').forEach(b => { const selected=b===button; b.classList.toggle('is-active',selected); b.setAttribute('aria-pressed',String(selected)); });
    const desc=document.getElementById('metric-description');
    if(desc) desc.textContent=data.description;
    chart.setAttribute('aria-label',data.label);
    data.values.forEach(([id,value,display]) => {
      const bar=chart.querySelector(`[data-model="${id}"]`);
      const valueLabel=chart.querySelector(`[data-value="${id}"]`);
      if(bar) bar.style.setProperty('--bar',key==='mcc'?`${value*100}%`:`${value}%`);
      if(valueLabel) valueLabel.textContent=display;
    });
  }));
})();
