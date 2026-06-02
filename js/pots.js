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

    // ─── Scroll Reveal Observer ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Scrollytelling Funnel Logic ───
    const scrollySteps = document.querySelectorAll('.scrolly-step');
    const funnelRows = document.querySelectorAll('.funnel-row');

    if (scrollySteps.length > 0 && funnelRows.length > 0) {
        const scrollyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNum = parseInt(entry.target.getAttribute('data-step'), 10);
                    
                    // Activate corresponding cards
                    scrollySteps.forEach(step => {
                        const currentNum = parseInt(step.getAttribute('data-step'), 10);
                        if (currentNum === stepNum) {
                            step.classList.add('active');
                        } else {
                            step.classList.remove('active');
                        }
                    });

                    // Update funnel layers visibility
                    funnelRows.forEach((row, index) => {
                        const rowIndex = index + 1;
                        if (rowIndex <= stepNum) {
                            row.classList.add('active-step');
                            row.classList.remove('inactive-step');
                        } else {
                            row.classList.remove('active-step');
                            row.classList.add('inactive-step');
                        }
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -40% 0px', // triggers when the card enters the central viewport band
            threshold: 0
        });

        scrollySteps.forEach(step => {
            scrollyObserver.observe(step);
        });
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
