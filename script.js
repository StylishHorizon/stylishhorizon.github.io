// ========== HEADER HIDE ON SCROLL ==========
(function() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('site-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });
})();

// ========== BURGER MENU TOGGLE ==========
(function() {
    const navLinks = document.getElementById('primary-navigation');
    const burger = document.getElementById('burger');

    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnBurger = burger.contains(event.target);
        
        if (navLinks.classList.contains('show') && !isClickInsideNav && !isClickOnBurger) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

    burger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('show');
        burger.setAttribute('aria-expanded', String(isExpanded));
    });
})();

// ========== SECTION VISIBILITY ON SCROLL (Optimized: one-time appearance) ==========
(function() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after first appearance to save CPU
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });

    sections.forEach(section => observer.observe(section));
})();

// ========== ACTIVE MENU ITEM HIGHLIGHT ==========
(function markActive() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href')?.toLowerCase() || '';
        
        // Only mark 'index.html' as active if we are on the homepage 
        // and ignore internal anchor links (like #how)
        if (href.endsWith(path) && !href.includes('#')) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        } else {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
        }
    });
})();

// ========== PARALLAX EFFECT (Cleaned up from App object) ==========
(function() {
    const parallaxLayer = document.querySelector('.parallax-bg');
    if (!parallaxLayer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const MAX_SHIFT = 10;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    window.addEventListener('mousemove', e => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetX = nx * MAX_SHIFT;
        targetY = ny * MAX_SHIFT;
    });

    const animate = () => {
        // Simple linear interpolation for smooth movement
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        parallaxLayer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        requestAnimationFrame(animate);
    };

    animate();
})();

// ========== DYNAMIC YEAR IN FOOTER ==========
document.getElementById('year').textContent = new Date().getFullYear();