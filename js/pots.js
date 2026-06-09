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

                    // Update funnel layers visibility and focus
                    funnelRows.forEach((row, index) => {
                        const rowIndex = index + 1;
                        if (rowIndex <= stepNum) {
                            row.classList.add('active-step');
                            row.classList.remove('inactive-step');
                        } else {
                            row.classList.remove('active-step');
                            row.classList.add('inactive-step');
                        }

                        if (rowIndex === stepNum) {
                            row.classList.add('focus-step');
                        } else {
                            row.classList.remove('focus-step');
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
    // ─── Scrollytelling Archetypes Logic ───
    const archetypeTriggers = document.querySelectorAll('.archetype-scroll-trigger');
    const donutPct = document.getElementById('donutPct');
    const donutLabel = document.getElementById('donutLabel');
    const donutSegments = document.querySelectorAll('.donut-segment');

    const archetypeData = {
        1: { pct: '37.84%', label: 'The Architect' },
        2: { pct: '16.22%', label: 'The Accumulator' },
        3: { pct: '1.55%', label: 'The Countdown' },
        4: { pct: '44.39%', label: 'The Explorer' }
    };

    if (archetypeTriggers.length > 0) {
        const archetypesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const archId = parseInt(entry.target.getAttribute('data-archetype'), 10);
                    
                    // Activate corresponding card
                    archetypeTriggers.forEach(trigger => {
                        const card = trigger.querySelector('.archetype-card');
                        const currentId = parseInt(trigger.getAttribute('data-archetype'), 10);
                        if (currentId === archId) {
                            if (card) card.classList.add('active-card');
                        } else {
                            if (card) card.classList.remove('active-card');
                        }
                    });

                    // Update donut chart text
                    if (donutPct && donutLabel && archetypeData[archId]) {
                        donutPct.textContent = archetypeData[archId].pct;
                        donutLabel.textContent = archetypeData[archId].label;
                    }

                    // Highlight donut segment
                    donutSegments.forEach(segment => {
                        const segmentId = parseInt(segment.getAttribute('data-archetype'), 10);
                        if (segmentId === archId) {
                            segment.classList.add('active-slice');
                        } else {
                            segment.classList.remove('active-slice');
                        }
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -40% 0px', // triggers when the card enters the central viewport band
            threshold: 0
        });

        archetypeTriggers.forEach(trigger => {
            archetypesObserver.observe(trigger);
        });

        // Add click listener on donut segments to scroll to corresponding cards
        document.querySelectorAll('.donut-segment').forEach(el => {
            el.addEventListener('click', () => {
                const archId = el.getAttribute('data-archetype');
                const targetTrigger = document.querySelector(`.archetype-scroll-trigger[data-archetype="${archId}"]`);
                if (targetTrigger) {
                    targetTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
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
