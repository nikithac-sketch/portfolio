/* ============================================
   ABOUT ME PORTFOLIO — Script
   ============================================ */

(function () {
    'use strict';

    // ─── DOM Elements ───
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const resumeBtn = document.getElementById('resumeBtn');

    // ─── Live Clock ───
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        if (navClock) navClock.textContent = `${h}:${m}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ─── Scroll Progress ───
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }
    }

    // ─── Nav State ───
    function updateNavState() {
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 80);
        }
    }

    // ─── Throttled Scroll Listener ───
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavState();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ─── Initial Runs ───
    updateScrollProgress();
    updateNavState();

    // ─── Interactive Resume Button Mockup ───
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalHTML = resumeBtn.innerHTML;
            
            // Success animation
            resumeBtn.innerHTML = `RESUME DOWNLOADED! ✓`;
            resumeBtn.style.color = '#22c55e';
            resumeBtn.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                resumeBtn.innerHTML = originalHTML;
                resumeBtn.style.color = '';
                resumeBtn.style.borderColor = '';
            }, 3000);
        });
    }
})();
