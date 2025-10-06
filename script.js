// ========== HEADER HIDE ON SCROLL ==========
(function() {
    let lastScrollY = window.scrollY;
    // Используем #site-nav, как в HTML
    const nav = document.getElementById('site-nav'); 

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Скрыть, если прокручиваем вниз и не в самом верху (offset 100px)
        if (currentScrollY > lastScrollY && currentScrollY > 100) { 
            nav.classList.add('hidden');
        } else {
            // Показать, если прокручиваем вверх или вернулись к самому верху
            nav.classList.remove('hidden');
        }
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });
})();

// ========== BURGER MENU TOGGLE ==========
(function() {
    // Используем #primary-navigation и #burger, как в HTML
    const navLinks = document.getElementById('primary-navigation');
    const burger = document.getElementById('burger'); 

    burger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('show');
        burger.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close menu on link click and click outside (optimized structure)
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnBurger = burger.contains(event.target);

        if (navLinks.classList.contains('show') && !isClickInsideNav && !isClickOnBurger) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu when a link inside is clicked (for better mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

})();

// ========== SECTION VISIBILITY ON SCROLL (Intersection Observer) ==========
(function() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Опционально: прекратить наблюдение после первого появления
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });

    sections.forEach(section => observer.observe(section));
})();

// ========== ACTIVE MENU ITEM HIGHLIGHT (Based on URL) ==========
(function markActive() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href')?.toLowerCase() || '';

        // Проверяем, совпадает ли href с текущим файлом и не является ли он якорем (#how)
        if (href.endsWith(path) && !href.includes('#')) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        } else {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
        }
    });
})();

// ========== DYNAMIC YEAR IN FOOTER ==========
// Используем id="year" как в HTML
const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
