// ========== CONFIG ==========
const CONFIG = {
  SCROLL_OFFSET: 100,              // Nav hide/show hysteresis
  INTERSECTION_THRESHOLD: 0.2,     // Section visibility threshold
  NAV_HIDE_CLASS: 'hide-nav'
};

// ========== NAVIGATION SCROLL BEHAVIOR ==========
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNav = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > CONFIG.SCROLL_OFFSET) {
      // Scrolling down → hide nav
      nav.classList.add(CONFIG.NAV_HIDE_CLASS);
    } else if (currentScrollY < lastScrollY || currentScrollY <= CONFIG.SCROLL_OFFSET) {
      // Scrolling up or near top → show nav
      nav.classList.remove(CONFIG.NAV_HIDE_CLASS);
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();

// ========== MOBILE MENU TOGGLE ==========
(function () {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('primary-navigation');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !burger.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
    }
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
    }
  });
})();

// ========== SECTION HIGHLIGHT IN NAV ==========
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#primary-navigation a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: CONFIG.INTERSECTION_THRESHOLD });

  sections.forEach(section => observer.observe(section));
})();

// ========== FORM VALIDATION (contact.html only) ==========
(function () {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelectorAll('.error').forEach(el => el.classList.remove('show'));

    let hasError = false;

    const required = ['name', 'email', 'package', 'tapes'];
    required.forEach(id => {
      const field = document.getElementById(id);
      if (!field.value.trim() || (id === 'tapes' && field.value < 1)) {
        showError(`${id}Error`, 'This field is required');
        hasError = true;
      }
    });

    if (!document.getElementById('understand').checked) {
      showError('understandError', 'Confirmation required');
      hasError = true;
    }

    if (!hasError) {
      console.log('Form ready to submit');
      // await fetch(...)
      alert('Thank you! We will contact you soon.');
      form.reset();
    }
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('show');
  }
})();
