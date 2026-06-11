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

    // ─── Scrollytelling Pictogram Logic ───
    const scrollySteps = document.querySelectorAll('.scrolly-step');
    const pictoGrid = document.getElementById('pictoGrid');
    const pictoPrefix = document.getElementById('pictoPrefix');
    const pictoPct = document.getElementById('pictoPct');
    const pictoTitle = document.getElementById('pictoTitle');
    const pictoDesc = document.getElementById('pictoDesc');

    // Generate 100 person icons
    if (pictoGrid) {
        const personSvg = '<svg viewBox="0 0 20 36" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="5" r="4.5"/><path d="M10,11 C5,11 2,16 2,22 L5,22 5,34 8.5,34 8.5,25 11.5,25 11.5,34 15,34 15,22 18,22 C18,16 15,11 10,11Z"/></svg>';
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.className = 'picto-person';
            div.dataset.index = i;
            div.innerHTML = personSvg;
            pictoGrid.appendChild(div);
        }
    }

    const pictoPersons = document.querySelectorAll('.picto-person');
    const pictoSteps = [
        { count: 100, color: '#F3C364', prefix: 'Out of', pct: 'ALL', title: 'the people who created money pots', desc: '' },
        { count: 68, color: '#80AEAF', prefix: '', pct: '68%', title: 'contributed to it', desc: 'But habits are hard to form. The friction of manual savings kicked in, and only <strong>68% of users</strong> made a contribution to their Pot.' },
        { count: 8, color: '#B84646', prefix: '', pct: '8%', title: 'completed their goal', desc: 'In the end, only a shocking <strong>8% of users</strong> completed their goals. The rest dropped off, revealing a huge gap in motivation and follow-through.' },
        { count: 0, color: '#ddd', prefix: '', pct: '', title: '', desc: '', showOverlay: true }
    ];

    function updatePictogram(stepIndex) {
        const step = pictoSteps[stepIndex];
        if (!step) return;

        // Handle overlay visibility and header fade out for step 4 (index 3)
        const overlay = document.getElementById('pictoOverlay');
        if (step.showOverlay) {
            if (pictoPrefix) {
                pictoPrefix.style.opacity = '0';
                pictoPrefix.style.pointerEvents = 'none';
            }
            if (pictoPct) {
                pictoPct.style.opacity = '0';
                pictoPct.style.pointerEvents = 'none';
            }
            if (pictoTitle) {
                pictoTitle.style.opacity = '0';
                pictoTitle.style.pointerEvents = 'none';
            }
            if (pictoDesc) {
                pictoDesc.style.opacity = '0';
                pictoDesc.style.pointerEvents = 'none';
            }
            if (overlay) overlay.classList.add('visible');
            if (pictoGrid) pictoGrid.classList.add('fade-out');
        } else {
            if (pictoPrefix) {
                pictoPrefix.textContent = step.prefix || '';
                pictoPrefix.style.opacity = step.prefix ? '0.75' : '0';
                pictoPrefix.style.pointerEvents = step.prefix ? 'auto' : 'none';
                pictoPrefix.style.marginBottom = step.prefix ? '6px' : '0px';
            }
            if (pictoPct) {
                pictoPct.style.opacity = '1';
                pictoPct.style.pointerEvents = 'auto';
                pictoPct.textContent = step.pct;
                pictoPct.style.color = step.color;
            }
            if (pictoTitle) {
                pictoTitle.style.opacity = '1';
                pictoTitle.style.pointerEvents = 'auto';
                pictoTitle.textContent = step.title;
            }
            if (pictoDesc) {
                pictoDesc.style.opacity = '1';
                pictoDesc.style.pointerEvents = 'auto';
                pictoDesc.innerHTML = step.desc ? '<p class="visible">' + step.desc + '</p>' : '';
            }
            if (overlay) overlay.classList.remove('visible');
            if (pictoGrid) pictoGrid.classList.remove('fade-out');
        }

        // Set fill color
        if (pictoGrid) pictoGrid.style.setProperty('--picto-fill', step.color);

        // Fill bottom-to-top: items 0-99 flow top-left to bottom-right
        // To fill from bottom, we fill indices >= (100 - count)
        const fillThreshold = 100 - step.count;

        pictoPersons.forEach((person, i) => {
            const shouldFill = i >= fillThreshold;
            if (shouldFill) {
                person.classList.add('filled');
                // Stagger: bottom icons fill first (smaller delay)
                const distFromBottom = 99 - i;
                person.style.setProperty('--stagger', (distFromBottom * 0.012) + 's');
            } else {
                person.classList.remove('filled');
                person.style.setProperty('--stagger', '0s');
            }
        });
    }

    // Initialize with step 1
    updatePictogram(0);

    if (scrollySteps.length > 0 && pictoPersons.length > 0) {
        const pictoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepNum = parseInt(entry.target.getAttribute('data-step'), 10);
                    updatePictogram(stepNum - 1);
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -40% 0px',
            threshold: 0
        });

        scrollySteps.forEach(step => {
            pictoObserver.observe(step);
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
