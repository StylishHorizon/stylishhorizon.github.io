/* ================== CONFIG & DATA ================== */
const CURRENT_YEAR = new Date().getFullYear();
const SITE_TITLE = "Stylish Horizon";

// Shared HTML Strings (Injected to all pages)
const HEADER_HTML = `
  <div class="nav-container">
    <a class="logo-title" href="index.html">
      <picture>
        <source srcset="assets/media/StylishHorizon_Clear.webp" type="image/webp">
        <img class="logo" src="assets/media/StylishHorizon_Black.png" alt="Logo" />
      </picture>
      <p class="site-title">${SITE_TITLE}</p>
    </a>
    <button id="burger" aria-label="Menu" aria-controls="primary-navigation" aria-expanded="false">&#9776;</button>
    <ul id="primary-navigation" class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="manifest.html">Why Now</a></li>
      <li><a href="archive.html">Results</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </div>
`;

const FOOTER_HTML = `
  <img src="assets/media/StylishHorizon_Clear.webp" alt="Logo" loading="lazy" />
  <p>© <span id="year">${CURRENT_YEAR}</span> ${SITE_TITLE} | <a href="mailto:stylishhorizon@gmail.com">stylishhorizon@gmail.com</a></p>
`;

const CHAT_HTML = `
  <div id="bill-chat-button">💬</div>
  <div id="bill-chat-window">
    <header>
      <span>Bill — Stylish Horizon AI</span>
      <span class="close-btn">×</span>
    </header>
    <div class="messages" id="bill-messages">
      <div class="message-bill">Hey! I'm Bill. Ask me about Legacy vs. Ultimate or how to start. 👋</div>
    </div>
    <div class="input-area">
      <input id="bill-input" type="text" placeholder="e.g., What’s UHD?" />
      <button id="bill-send">➤</button>
    </div>
  </div>
`;

/* ================== INIT ================== */
document.addEventListener('DOMContentLoaded', () => {
    injectLayout();
    initUI();
    initSliders();
    initChat(); // Only activates if chat placeholder exists or on Contact page
});

/* ================== LAYOUT INJECTOR ================== */
function injectLayout() {
    const headerEl = document.getElementById('site-nav');
    const footerEl = document.querySelector('footer[role="contentinfo"]');
    
    // 1. Inject Nav
    if (headerEl) {
        headerEl.innerHTML = HEADER_HTML;
        highlightActiveLink();
        initBurgerMenu();
    }

    // 2. Inject Footer
    if (footerEl) {
        footerEl.innerHTML = FOOTER_HTML;
    }

    // 3. Inject Chat Widget (Only if on Contact page OR layout dictates)
    // For this build, we inject it into Contact page specifically via HTML check,
    // or we can append it globally. Let's stick to Contact page placeholder logic.
    const chatPlaceholder = document.getElementById('chat-widget-placeholder');
    if (chatPlaceholder) {
        chatPlaceholder.innerHTML = CHAT_HTML;
    }
}

function highlightActiveLink() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href')?.toLowerCase() || '';
        if (href.endsWith(path) && !href.includes('#')) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

/* ================== UI LOGIC ================== */
function initUI() {
    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));

    // Hide Nav on Scroll
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('site-nav');
    window.addEventListener('scroll', () => {
        const curr = window.scrollY;
        if (curr > lastScrollY && curr > 100) nav.classList.add('hidden');
        else nav.classList.remove('hidden');
        lastScrollY = curr <= 0 ? 0 : curr;
    });
}

function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('primary-navigation');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', () => {
        const show = navLinks.classList.toggle('show');
        burger.setAttribute('aria-expanded', String(show));
    });

    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !burger.contains(e.target)) {
            navLinks.classList.remove('show');
        }
    });
}

/* ================== SLIDERS ================== */
function initSliders() {
    document.querySelectorAll('.comparison-container').forEach(setupSlider);
    
    // Modal
    const modal = document.getElementById('comparisonModal');
    if (modal) setupModal(modal);
}

function setupSlider(container) {
    if (container.closest('.modal-content')) return;

    const slider = container.querySelector('.comparison-slider');
    const after = container.querySelector('.comparison-after');
    const before = container.querySelector('.comparison-before');
    if (!slider || !after || !before) return;

    // Load Check
    const onImgLoad = () => {
        if (before.complete && after.complete && before.naturalWidth > 0) {
            container.classList.add('loaded');
        }
    };
    if (before.complete) onImgLoad(); else before.onload = onImgLoad;
    if (after.complete) onImgLoad(); else after.onload = onImgLoad;
    setTimeout(onImgLoad, 200);

    // Interaction
    let isActive = false;
    let isClick = true;
    let startX = 0;

    const update = (x) => {
        const rect = container.getBoundingClientRect();
        let p = ((x - rect.left) / rect.width) * 100;
        p = Math.max(0, Math.min(100, p));
        after.style.clipPath = `inset(0 0 0 ${p}%)`;
        slider.style.left = `${p}%`;
        
        container.classList.toggle('edge-left', p < 5);
        container.classList.toggle('edge-right', p > 95);
    };

    const start = (e) => {
        isActive = true; isClick = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const move = (e) => {
        if (!isActive) return;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        if (Math.abs(cx - startX) > 5) isClick = false;
        if (!isClick && e.cancelable && e.type === 'touchmove') e.preventDefault();
        update(cx);
    };
    const end = () => isActive = false;
    
    container.addEventListener('mousedown', start);
    document.addEventListener('mouseup', end);
    container.addEventListener('mousemove', move);
    
    container.addEventListener('touchstart', start, {passive: false});
    document.addEventListener('touchend', end);
    container.addEventListener('touchmove', move, {passive: false});

    container.addEventListener('click', () => { if (isClick) openModal(container); });
}

function setupModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const close = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('modalBefore').src = ''; 
        document.getElementById('modalAfter').src = '';
    };
    
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Internal Slider
    const c = modal.querySelector('.comparison-container');
    const s = c.querySelector('.comparison-slider');
    const a = c.querySelector('.comparison-after');
    let act = false;
    
    const moveM = (x) => {
        const r = c.getBoundingClientRect();
        let p = ((x - r.left) / r.width) * 100;
        p = Math.max(0, Math.min(100, p));
        a.style.clipPath = `inset(0 0 0 ${p}%)`;
        s.style.left = `${p}%`;
    };
    
    s.addEventListener('mousedown', () => act = true);
    document.addEventListener('mouseup', () => act = false);
    c.addEventListener('mousemove', (e) => { if (act) moveM(e.clientX); });
    
    s.addEventListener('touchstart', (e) => { act = true; });
    document.addEventListener('touchend', () => act = false);
    c.addEventListener('touchmove', (e) => { if (act) { e.preventDefault(); moveM(e.touches[0].clientX); } }, {passive: false});
}

function openModal(src) {
    const modal = document.getElementById('comparisonModal');
    const mB = document.getElementById('modalBefore');
    const mA = document.getElementById('modalAfter');
    const mT = document.getElementById('modalTitle');
    const mC = document.getElementById('modalComparisonContainer');
    
    if (!mB || !mA) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    mT.textContent = "Loading full quality...";
    
    // Reset
    mC.querySelector('.comparison-slider').style.left = '50%';
    mC.querySelector('.comparison-after').style.clipPath = 'inset(0 0 0 50%)';

    // Load
    let loaded = 0;
    const done = () => { loaded++; if (loaded >= 2) mT.textContent = src.dataset.modalTitle || "Comparison"; };
    
    mB.onload = done; mA.onload = done;
    mB.src = src.dataset.beforeFull;
    mA.src = src.dataset.afterFull;
}

/* ================== CHAT ================== */
function initChat() {
    const btn = document.getElementById("bill-chat-button");
    const win = document.getElementById("bill-chat-window");
    if (!btn || !win) return;

    const input = document.getElementById("bill-input");
    const msgs = document.getElementById("bill-messages");
    
    const toggle = () => win.classList.toggle("open");
    btn.addEventListener('click', toggle);
    win.querySelector('.close-btn').addEventListener('click', toggle);

    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        
        // Add User Msg
        msgs.innerHTML += `<div class="message-user">${txt}</div><div style="clear:both"></div>`;
        msgs.scrollTop = msgs.scrollHeight;
        input.value = "";
        
        try {
            const res = await fetch("https://stylishh-stylishhorizon-chat.hf.space/chat", {
                method: "POST", 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: txt})
            });
            const data = await res.json();
            msgs.innerHTML += `<div class="message-bill">${data.response}</div><div style="clear:both"></div>`;
        } catch (e) {
            msgs.innerHTML += `<div class="message-bill">I'm offline right now.</div><div style="clear:both"></div>`;
        }
        msgs.scrollTop = msgs.scrollHeight;
    };

    document.getElementById("bill-send").addEventListener('click', send);
    input.addEventListener('keydown', (e) => { if (e.key === "Enter") send(); });
}
