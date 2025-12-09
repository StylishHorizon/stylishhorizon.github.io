/* ================== CORE UI FUNCTIONS ================== */

// 1. Header Hide on Scroll
(function() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('site-nav'); 
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        // Hide if scrolling down and not at the very top (offset 100px)
        if (currentScrollY > lastScrollY && currentScrollY > 100) { 
            nav.classList.add('hidden');
        } else {
            // Show if scrolling up
            nav.classList.remove('hidden');
        }
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });
})();

// 2. Burger Menu
(function() {
    const navLinks = document.getElementById('primary-navigation');
    const burger = document.getElementById('burger'); 
    if (!navLinks || !burger) return;

    burger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('show');
        burger.setAttribute('aria-expanded', String(isExpanded));
    });

    // Close menu on click outside
    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('show') && 
            !navLinks.contains(event.target) && 
            !burger.contains(event.target)) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu when a link inside is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
})();

// 3. Scroll Animations (Intersection Observer)
(function() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
})();

// 4. Active Menu Link Highlight
(function() {
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

// 5. Dynamic Year in Footer
const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }


/* ================== COMPARISON SLIDER & MODAL LOGIC ================== */

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('comparisonModal');
    
    // Initialize all sliders on the page
    document.querySelectorAll('.comparison-container').forEach(initSlider);

    // Initialize Modal logic if present
    if (modal) {
        initModal(modal);
    }
});

function initSlider(container) {
    // Skip container inside modal (handled separately in initModal)
    if (container.closest('.modal-content')) return;

    const slider = container.querySelector('.comparison-slider');
    const after = container.querySelector('.comparison-after');
    const before = container.querySelector('.comparison-before');
    
    if (!slider || !after || !before) return;

    let isActive = false;
    let startX = 0;
    let isClick = true; // Assume click by default

    // 1. Loading Check
    let imagesLoaded = 0;
    const checkLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded >= 2) container.classList.add('loaded');
    };

    if (before.complete) checkLoaded(); else before.onload = checkLoaded;
    if (after.complete) checkLoaded(); else after.onload = checkLoaded;

    // 2. Movement Logic
    const updateSlider = (x) => {
        const rect = container.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        
        after.style.clipPath = `inset(0 0 0 ${percent}%)`;
        slider.style.left = `${percent}%`;
    };

    // 3. Mouse/Touch Down
    const onDown = (e) => {
        isActive = true;
        isClick = true; 
        startX = e.touches ? e.touches[0].clientX : e.clientX;
    };

    // 4. Mouse/Touch Move
    const onMove = (e) => {
        if (!isActive) return;

        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        
        // If moved more than 5px, treat as drag
        if (Math.abs(currentX - startX) > 5) {
            isClick = false;
        }

        // Prevent scroll on mobile if dragging slider
        if (!isClick && e.type === 'touchmove') {
            e.preventDefault();
        }

        updateSlider(currentX);
    };

    // 5. Mouse/Touch Up
    const onUp = () => {
        isActive = false;
    };

    // 6. Click Handler
    const onClick = (e) => {
        if (isClick) {
            openModal(container);
        }
    };

    // Bind Events
    container.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    container.addEventListener('mousemove', onMove);

    container.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('touchend', onUp);
    container.addEventListener('touchmove', onMove, { passive: false });

    container.addEventListener('click', onClick);
}

function initModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const modalContainer = modal.querySelector('.comparison-container');
    const modalSlider = modalContainer.querySelector('.comparison-slider');
    const modalAfter = modalContainer.querySelector('.comparison-after');
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Modal internal slider logic
    let isActive = false;
    const moveModal = (clientX) => {
        const rect = modalContainer.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        modalAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
        modalSlider.style.left = `${percent}%`;
    };

    modalSlider.addEventListener('mousedown', () => isActive = true);
    document.addEventListener('mouseup', () => isActive = false);
    modalContainer.addEventListener('mousemove', (e) => { if (isActive) moveModal(e.clientX); });

    modalSlider.addEventListener('touchstart', (e) => { isActive = true; e.preventDefault(); });
    document.addEventListener('touchend', () => isActive = false);
    modalContainer.addEventListener('touchmove', (e) => { if (isActive) { e.preventDefault(); moveModal(e.touches[0].clientX); }});
}

function openModal(sourceContainer) {
    const modal = document.getElementById('comparisonModal');
    const modalBefore = document.getElementById('modalBefore');
    const modalAfter = document.getElementById('modalAfter');
    const modalTitle = document.getElementById('modalTitle');
    const modalContainer = document.getElementById('modalComparisonContainer');
    
    // Controls inside modal
    const slider = modalContainer.querySelector('.comparison-slider');
    const afterImg = modalContainer.querySelector('.comparison-after');

    if (!modalBefore || !modalAfter) return;

    // 1. Get Data from source
    const beforeFull = sourceContainer.dataset.beforeFull;
    const afterFull = sourceContainer.dataset.afterFull;
    
    // Determine Title
    let titleText = sourceContainer.dataset.modalTitle;
    if (!titleText) {
        const parentItem = sourceContainer.closest('.comparison-item');
        if (parentItem) {
            const h3 = parentItem.querySelector('h3');
            const p = parentItem.querySelector('p');
            titleText = `${h3 ? h3.textContent : ''} ${p ? '— ' + p.textContent : ''}`;
        } else {
            titleText = "Full Quality Comparison";
        }
    }

    // 2. Show Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = "Loading full quality...";

    // 3. Reset slider to center
    if (slider && afterImg) {
        slider.style.left = '50%';
        afterImg.style.clipPath = 'inset(0 0 0 50%)';
    }

    // 4. Load Images
    modalBefore.src = "";
    modalAfter.src = "";
    
    setTimeout(() => {
        modalBefore.src = beforeFull;
        modalAfter.src = afterFull;
    }, 10);

    let loaded = 0;
    const onFullLoad = () => {
        loaded++;
        if (loaded >= 2) modalTitle.textContent = titleText;
    };

    modalBefore.onload = onFullLoad;
    modalAfter.onload = onFullLoad;
}
