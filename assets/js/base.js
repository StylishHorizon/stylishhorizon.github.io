// Хедер: скрытие/появление при скролле
let lastScroll = 0;
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll && currentScroll > 50) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;
});

// Бургер-меню
const burger = document.querySelector('.burger');
const navList = document.getElementById('nav-list');

burger.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', !expanded);
  navList.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!burger.contains(e.target) && !navList.contains(e.target)) {
    burger.setAttribute('aria-expanded', 'false');
    navList.classList.remove('open');
  }
});

// Подсветка активного пункта
const currentPage = location.pathname.split('/').pop();
document.querySelectorAll('nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.setAttribute('aria-current', 'page');
  }
});

// Intersection Observer для анимации появления
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.content-block').forEach(block => {
  observer.observe(block);
});

// Динамический год
document.getElementById('year').textContent = new Date().getFullYear();
