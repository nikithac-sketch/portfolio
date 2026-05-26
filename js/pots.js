/* ============================================
   POTS UX CASE STUDY — Interactive Script
   ============================================ */

(function () {
    'use strict';

    // ─── DOM Elements ───
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');

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

    // ─── Comic Horizontal Scroll Logic ───
    const comicContainer = document.querySelector('.comic-scroll-container');
    const comicTrack = document.querySelector('.comic-track');

    function handleComicScroll() {
        if (!comicContainer || !comicTrack) return;

        const rect = comicContainer.getBoundingClientRect();
        const containerHeight = comicContainer.scrollHeight;
        const viewHeight = window.innerHeight;

        // Calculate scroll duration (how much vertical scroll exists inside container)
        const totalDuration = containerHeight - viewHeight;
        
        // Scroll distance from top of container relative to viewport
        const currentScroll = -rect.top;

        // Calculate progress percentage clamped between 0 and 1
        let pct = currentScroll / totalDuration;
        pct = Math.max(0, Math.min(1, pct));

        // Total translate width = total track scroll width - viewport width
        const trackWidth = comicTrack.scrollWidth;
        const maxTranslate = trackWidth - window.innerWidth;

        const translateAmount = -pct * Math.max(0, maxTranslate);
        
        // Apply transform
        comicTrack.style.transform = `translateX(${translateAmount}px)`;
    }

    // ─── Scroll Listener ───
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavState();
                handleComicScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle resize to update translation math dynamically
    window.addEventListener('resize', () => {
        handleComicScroll();
    });

    // Initial executions
    updateScrollProgress();
    updateNavState();
    handleComicScroll();

})();
