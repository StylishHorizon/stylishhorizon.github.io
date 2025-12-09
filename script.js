/* ================== CORE UI FUNCTIONS ================== */

// 1. Header Hide on Scroll
(function() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('site-nav'); 
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) { 
            nav.classList.add('hidden');
        } else {
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

    document.addEventListener('click', (event) => {
        if (navLinks.classList.contains('show') && 
            !navLinks.contains(event.target) && 
            !burger.contains(event.target)) {
            navLinks.classList.remove('show');
            burger.setAttribute('aria-expanded', 'false');
        }
    });

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

// 4. Active Menu Link
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

// 5. Dynamic Year
const yearEl = document.getElementById('year');
if(yearEl){ yearEl.textContent = new Date().getFullYear(); }


/* ================== COMPARISON SLIDER & MODAL LOGIC ================== */

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('comparisonModal');
    
    // Инициализируем все слайдеры на странице
    document.querySelectorAll('.comparison-container').forEach(initSlider);

    // Логика Модального окна (если оно есть на странице)
    if (modal) {
        initModal(modal);
    }
});

function initSlider(container) {
    // Пропускаем контейнер внутри модалки, он управляется отдельно
    if (container.closest('.modal-content')) return;

    const slider = container.querySelector('.comparison-slider');
    const after = container.querySelector('.comparison-after');
    const before = container.querySelector('.comparison-before');
    
    if (!slider || !after || !before) return;

    let isActive = false;
    let hasDragged = false;
    let startX = 0;

    // Loading Check
    let imagesLoaded = 0;
    const checkLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded >= 2) container.classList.add('loaded');
    };

    if (before.complete) checkLoaded(); else before.onload = checkLoaded;
    if (after.complete) checkLoaded(); else after.onload = checkLoaded;

    // Move Logic
    const move = (clientX) => {
        const rect = container.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        
        after.style.clipPath = `inset(0 0 0 ${percent}%)`;
        slider.style.left = `${percent}%`;
    };

    // Mouse Events
    slider.addEventListener('mousedown', (e) => { 
        isActive = true; 
        hasDragged = false; 
        startX = e.clientX; 
    });
    
    document.addEventListener('mouseup', () => { isActive = false; });
    
    container.addEventListener('mousemove', (e) => {
        if (!isActive) return;
        if (Math.abs(e.clientX - startX) > 5) hasDragged = true;
        move(e.clientX);
    });

    // Touch Events
    slider.addEventListener('touchstart', (e) => { 
        isActive = true; 
        hasDragged = false;
        startX = e.touches[0].clientX;
        e.preventDefault(); 
    });
    
    document.addEventListener('touchend', () => { isActive = false; });
    
    container.addEventListener('touchmove', (e) => {
        if (!isActive) return;
        if (Math.abs(e.touches[0].clientX - startX) > 5) hasDragged = true;
        e.preventDefault();
        move(e.touches[0].clientX);
    });

    // Click to Open Modal (только если не перетаскивали)
    container.addEventListener('click', () => {
        if (!hasDragged) openModal(container);
    });
}

function initModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const modalContainer = modal.querySelector('.comparison-container');
    const modalSlider = modalContainer.querySelector('.comparison-slider');
    const modalAfter = modalContainer.querySelector('.comparison-after');
    
    // Закрытие
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Слайдер внутри модалки
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
    
    // Элементы управления внутри модалки
    const slider = modalContainer.querySelector('.comparison-slider');
    const afterImg = modalContainer.querySelector('.comparison-after');

    if (!modalBefore || !modalAfter) return;

    // 1. Получаем данные
    const beforeFull = sourceContainer.dataset.beforeFull;
    const afterFull = sourceContainer.dataset.afterFull;
    
    // Заголовок
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

    // 2. Показываем модалку (важно сделать это ДО манипуляций с размерами)
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = "Loading full quality...";

    // 3. Сбрасываем слайдер в центр (50%)
    if (slider && afterImg) {
        slider.style.left = '50%';
        afterImg.style.clipPath = 'inset(0 0 0 50%)';
    }

    // 4. Загружаем картинки
    modalBefore.src = "";
    modalAfter.src = "";
    
    // Небольшая задержка перед установкой src помогает браузеру понять, что картинки новые
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

