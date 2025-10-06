document.addEventListener('DOMContentLoaded', () => {
  // Навигация (бургер-меню)
  const burger = document.getElementById('burger');
  const nav = document.getElementById('primary-navigation');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });
  }

  // Год в футере
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Валидация формы (если есть)
  const form = document.getElementById('contactForm');
  if (form) {
    const loadAt = Date.now();

    form.addEventListener('submit', function (e) {
      // Honeypot
      const honeypot = document.getElementById('cf-website');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      // Time-to-submit
      const elapsed = (Date.now() - loadAt) / 1000;
      if (elapsed < 10) {
        e.preventDefault();
        alert('Submitted too quickly. Please try again.');
        return;
      }

      let ok = true;
      const setErr = (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.textContent = msg || '';
      };

      // Очистка ошибок
      ['cf-nameError','cf-emailError','cf-packageError','cf-minutesError','cf-rawLinkError','cf-understandError']
        .forEach(id => setErr(id, ''));

      const name = document.getElementById('cf-name')?.value.trim();
      const email = document.getElementById('cf-email')?.value.trim();
      const pkg = document.getElementById('cf-package')?.value;
      const mins = document.getElementById('cf-minutes')?.value;
      const understand = document.getElementById('cf-understand')?.checked;

      if (!name) { setErr('cf-nameError', 'Name required.'); ok = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('cf-emailError', 'Valid email required.'); ok = false; }
      if (!pkg) { setErr('cf-packageError', 'Select package.'); ok = false; }
      if (!mins || parseInt(mins, 10) < 1) { setErr('cf-minutesError', 'Minutes must be > 0.'); ok = false; }
      if (!understand) { setErr('cf-understandError', 'Please confirm you understand the process.'); ok = false; }

      if (!ok) {
        e.preventDefault();
      }
    });
  }
});
