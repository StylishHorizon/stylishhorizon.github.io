// ========== HEADER HIDE ON SCROLL (with throttle) ==========
(function() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('site-nav');
    if (!nav) return; // Robust check

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    nav.classList.add('hidden');
                } else {
                    nav.classList.remove('hidden');
                }
                lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ========== BURGER MENU TOGGLE ==========
(function() {
    const navLinks = document.getElementById('primary-navigation');
    const burger = document.getElementById('burger');
    if (!navLinks || !burger) return;

    burger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('show');
        burger.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnBurger = burger.contains(event.target);
        if (navLinks.classList.contains('show') && !isClickInsideNav && !isClickOnBurger) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on Escape key (a11y)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
            burger.focus();
        }
    });
})();

// ========== SECTION VISIBILITY ON SCROLL (Intersection Observer) ==========
(function() {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after visible (perf)
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
const yearEl = document.getElementById('year');
if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

// ... (previous code remains)

// ========== FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const errors = {
            nameError: '',
            emailError: '',
            packageError: '',
            tapesError: '',
            rawLinkError: '',
            understandError: ''
        };

        const name = document.getElementById('name').value.trim();
        if (!name) { errors.nameError = 'Name required.'; isValid = false; }

        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) { errors.emailError = 'Email required.'; isValid = false; }
        else if (!emailRegex.test(email)) { errors.emailError = 'Invalid email.'; isValid = false; }

        const pkg = document.getElementById('package').value;
        if (!pkg) { errors.packageError = 'Select package.'; isValid = false; }

        const tapes = parseInt(document.getElementById('tapes').value);
        if (!tapes || tapes < 1) { errors.tapesError = 'Minutes >0.'; isValid = false; }

        const rawLink = document.getElementById('rawLink').value.trim();
        if (!rawLink) { errors.rawLinkError = 'Share link needed for start.'; isValid = false; }

        const understand = document.getElementById('understand').checked;
        if (!understand) { errors.understandError = 'Check to confirm process.'; isValid = false; }

        Object.keys(errors).forEach(key => {
            const errorEl = document.getElementById(key);
            if (errorEl) errorEl.textContent = errors[key];
        });

        if (isValid) {
            alert('Sent! Check email for next steps.');
            // Real send: Use Formspree or similar (add action="https://formspree.io/f/your-id" method="POST")
            this.reset();
            Object.keys(errors).forEach(key => document.getElementById(key).textContent = '');
        }
    });

    ['name', 'email', 'package', 'tapes', 'rawLink', 'understand'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() { document.getElementById(id + 'Error').textContent = ''; });
        }
    });
});

