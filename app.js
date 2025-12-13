/* ================== CONFIG & DATA ================== */
const CURRENT_YEAR = new Date().getFullYear();
const SITE_TITLE = "Stylish Horizon";

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
   /* In app.js -> const HEADER_HTML */
    <ul id="primary-navigation" class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="manifest.html">Why Now</a></li>
      <li><a href="archive.html">Results</a></li>
      <li><a href="faq.html">FAQ</a></li> <!-- ADDED LINK -->
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </div>
`;

const FOOTER_HTML = `
  <img src="assets/media/StylishHorizon_Clear.webp" alt="Logo" loading="lazy" />
  <p>© <span id="year">${CURRENT_YEAR}</span> ${SITE_TITLE} | <a href="mailto:stylishhorizon@gmail.com">stylishhorizon@gmail.com</a></p>
`;

// SVG Icon for Chat
const CHAT_HTML = `
  <div id="bill-chat-button">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  </div>
  <div id="bill-chat-window">
    <header><span>Bill — Stylish Horizon AI</span><span class="close-btn">×</span></header>
    <div class="messages" id="bill-messages"><div class="message-bill">Hey! I'm Bill. Ask me about Legacy vs. Ultimate. 👋</div></div>
    <div class="input-area"><input id="bill-input" type="text" placeholder="Type here..." /><button id="bill-send">➤</button></div>
  </div>
`;

/* ================== INIT ================== */
document.addEventListener('DOMContentLoaded', () => {
    injectLayout();
    initUI();
    initSliders();
    initChat();
});

function injectLayout() {
    const headerEl = document.getElementById('site-nav');
    const footerEl = document.querySelector('footer[role="contentinfo"]');
    if (headerEl) { headerEl.innerHTML = HEADER_HTML; highlightActiveLink(); initBurgerMenu(); }
    if (footerEl) { footerEl.innerHTML = FOOTER_HTML; }
    
    // Inject chat into placeholder if exists, otherwise append to body (for Contact page mostly)
    const chatPlaceholder = document.getElementById('chat-widget-placeholder');
    if (chatPlaceholder) { 
        chatPlaceholder.innerHTML = CHAT_HTML; 
    }
}

function highlightActiveLink() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(a => {
        const href = a.getAttribute('href')?.toLowerCase() || '';
        if (href.endsWith(path) && !href.includes('#')) a.classList.add('active');
        else a.classList.remove('active');
    });
}

/* ================== UI & SLIDERS ================== */
function initUI() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));

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
        if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !burger.contains(e.target)) navLinks.classList.remove('show');
    });
}

function initSliders() {
    document.querySelectorAll('.comparison-container').forEach(setupSlider);
    const modal = document.getElementById('comparisonModal');
    if (modal) setupModal(modal);
}

function setupSlider(container) {
    if (container.closest('.modal-content')) return;

    const slider = container.querySelector('.comparison-slider');
    const after = container.querySelector('.comparison-after');
    const before = container.querySelector('.comparison-before');
    if (!slider || !after || !before) return;

    const onImgLoad = () => {
        if (before.complete && after.complete && before.naturalWidth > 0) container.classList.add('loaded');
    };
    if (before.complete) onImgLoad(); else before.onload = onImgLoad;
    if (after.complete) onImgLoad(); else after.onload = onImgLoad;
    setTimeout(onImgLoad, 200);

    let isActive = false, isClick = true, startX = 0;

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
    
    s.addEventListener('touchstart', (e) => { 
        if (e.touches.length > 1) return; // Allow pinch
        act = true; 
    });
    document.addEventListener('touchend', () => act = false);
    c.addEventListener('touchmove', (e) => { 
        if (e.touches.length > 1) return; // Allow pinch
        if (act) { e.preventDefault(); moveM(e.touches[0].clientX); } 
    }, {passive: false});
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
    
    mC.classList.remove('loaded'); 
    mC.querySelector('.comparison-slider').style.left = '50%';
    mC.querySelector('.comparison-after').style.clipPath = 'inset(0 0 0 50%)';

    let loaded = 0;
    const done = () => { 
        loaded++; 
        if (loaded >= 2) {
            mT.textContent = src.dataset.modalTitle || "Comparison";
            mC.classList.add('loaded');
        }
    };
    
    mB.onload = null; mA.onload = null; 
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
    
    // Toggle Logic: Hide button when chat is open
    const toggle = () => { 
        const isOpen = win.classList.toggle("open");
        if (isOpen) {
            btn.classList.add("hidden");
            setTimeout(() => input.focus(), 300);
        } else {
            btn.classList.remove("hidden");
        }
    };

    btn.addEventListener('click', toggle);
    win.querySelector('.close-btn').addEventListener('click', toggle);

    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        msgs.innerHTML += `<div class="message-user">${txt}</div><div style="clear:both"></div>`;
        msgs.scrollTop = msgs.scrollHeight;
        input.value = "";
        try {
            const res = await fetch("https://stylishh-stylishhorizon-chat.hf.space/chat", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({message: txt})
            });
            const data = await res.json();
            msgs.innerHTML += `<div class="message-bill">${data.response}</div><div style="clear:both"></div>`;
        } catch (e) { msgs.innerHTML += `<div class="message-bill">I'm offline right now.</div><div style="clear:both"></div>`; }
        msgs.scrollTop = msgs.scrollHeight;
    };
    document.getElementById("bill-send").addEventListener('click', send);
    input.addEventListener('keydown', (e) => { if (e.key === "Enter") send(); });
}

