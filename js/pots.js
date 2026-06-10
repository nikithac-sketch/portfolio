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
    const pictoPct = document.getElementById('pictoPct');
    const pictoTitle = document.getElementById('pictoTitle');
    const pictoDesc = document.getElementById('pictoDesc');

    // Generate 100 person icons
    if (pictoGrid) {
        const personSvg = '<svg viewBox="0 0 10 22" xmlns="http://www.w3.org/2000/svg"><path d="M7.53663 5.67156C7.32795 5.58808 7.11419 5.51794 6.89663 5.46156C7.45428 5.03522 7.89468 4.4744 8.17663 3.83156C9.82663 0.141557 4.68663 -1.25844 2.60663 1.31156C1.60663 2.59156 1.38663 4.37156 2.84663 5.46156C3.04105 5.59311 3.24494 5.71009 3.45663 5.81156C2.66206 6.22126 1.97649 6.81428 1.45663 7.54156C0.827667 8.51468 0.396151 9.60197 0.186627 10.7416C-0.062209 11.8511 -0.062209 13.002 0.186627 14.1116C0.253722 14.4379 0.431923 14.7309 0.690858 14.9406C0.949792 15.1503 1.27344 15.2638 1.60663 15.2616C1.88295 15.2557 2.15385 15.1837 2.39663 15.0516C2.34572 15.9608 2.34572 16.8723 2.39663 17.7816C2.4477 18.5634 2.56478 19.3395 2.74663 20.1016C2.87687 20.5836 3.16583 21.0077 3.56685 21.3053C3.96786 21.6029 4.45749 21.7566 4.95663 21.7416C5.44328 21.7155 5.9129 21.5536 6.31232 21.2744C6.71174 20.9951 7.025 20.6097 7.21663 20.1616C7.43121 19.6171 7.56594 19.0445 7.61663 18.4616C7.71663 17.4616 7.70663 16.3416 7.73663 15.1716H8.00663C8.42489 15.1632 8.82634 15.0053 9.1382 14.7265C9.45007 14.4476 9.65173 14.0663 9.70663 13.6516C10.019 11.9693 10.019 10.2438 9.70663 8.56156C9.59711 7.94334 9.3436 7.35958 8.96662 6.85751C8.58964 6.35545 8.09976 5.94917 7.53663 5.67156ZM3.33663 1.86156C4.94663 -0.458443 8.33663 1.20156 7.33663 3.41156C7.17411 3.7678 6.93893 4.08615 6.64618 4.34619C6.35343 4.60622 6.00956 4.8022 5.63663 4.92156C5.27673 5.02657 4.89711 5.04508 4.5287 4.97557C4.16029 4.90606 3.81352 4.75049 3.51663 4.52156C2.51663 3.88156 2.72663 2.74156 3.33663 1.86156ZM8.82663 13.5516C8.80565 13.7643 8.70961 13.9627 8.55569 14.1111C8.40177 14.2596 8.20004 14.3483 7.98663 14.3616C7.61663 14.3616 7.27663 14.1116 7.19663 13.5316C7.19663 13.1516 7.11663 12.7416 7.09663 12.3216C7.07663 11.9016 7.09663 11.5116 7.09663 11.1116C7.09932 11.0648 7.09259 11.0179 7.07684 10.9738C7.06109 10.9296 7.03663 10.8891 7.00492 10.8546C6.97321 10.8201 6.93489 10.7923 6.89224 10.7729C6.84959 10.7535 6.80347 10.7428 6.75663 10.7416C6.71197 10.7402 6.66749 10.7477 6.62573 10.7636C6.58397 10.7794 6.54574 10.8034 6.51324 10.834C6.48074 10.8647 6.45459 10.9014 6.4363 10.9422C6.418 10.9829 6.40792 11.0269 6.40663 11.0716V12.3316C6.40663 12.7416 6.40663 13.2016 6.46663 13.6016C6.47805 13.8404 6.53803 14.0745 6.64291 14.2894C6.74779 14.5043 6.89536 14.6956 7.07663 14.8516C6.97663 15.8516 6.90663 16.9116 6.78663 17.8516C6.71175 18.507 6.5293 19.1455 6.24663 19.7416C6.12156 19.9937 5.92936 20.2065 5.69118 20.3564C5.453 20.5064 5.17806 20.5878 4.89663 20.5916C4.6435 20.5932 4.39701 20.5106 4.19603 20.3567C3.99505 20.2028 3.85102 19.9864 3.78663 19.7416C3.50572 18.8791 3.30815 17.9917 3.19663 17.0916C3.0814 16.2023 3.01131 15.3079 2.98663 14.4116C3.0123 14.3799 3.03569 14.3465 3.05663 14.3116C3.29397 13.8875 3.44998 13.4229 3.51663 12.9416C3.58791 12.2774 3.61131 11.609 3.58663 10.9416C3.58796 10.9022 3.58152 10.8629 3.56766 10.826C3.55381 10.7891 3.53281 10.7552 3.50588 10.7264C3.47895 10.6977 3.4466 10.6745 3.4107 10.6582C3.37479 10.6419 3.33603 10.6328 3.29663 10.6316C3.21611 10.6315 3.13874 10.6628 3.08088 10.7188C3.02303 10.7748 2.98922 10.8511 2.98663 10.9316C3.00887 11.5596 2.97876 12.1885 2.89663 12.8116C2.83017 13.2085 2.68755 13.5888 2.47663 13.9316C2.38777 14.0775 2.26298 14.1983 2.11418 14.2823C1.96537 14.3663 1.79752 14.4108 1.62663 14.4116C1.47509 14.4056 1.33057 14.3461 1.21886 14.2435C1.10714 14.1409 1.03547 14.002 1.01663 13.8516C0.870809 12.8686 0.939032 11.8657 1.21663 10.9116C1.42579 9.94861 1.81238 9.03302 2.35663 8.21156C2.88542 7.47856 3.62489 6.92396 4.47663 6.62156C5.33202 6.34097 6.26059 6.38366 7.08663 6.74156C7.50495 6.94579 7.87001 7.24457 8.15292 7.61425C8.43583 7.98394 8.62882 8.4144 8.71663 8.87156C9.03205 10.4125 9.0693 11.9975 8.82663 13.5516Z" fill="currentColor"/></svg>';
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
        { count: 100, color: '#F3C364', pct: '100%', title: 'people who created the pot', desc: '' },
        { count: 68, color: '#80AEAF', pct: '68%', title: 'contributed to it', desc: 'But habits are hard to form. The friction of manual savings kicked in, and only <strong>68% of users</strong> made a contribution to their Pot.' },
        { count: 8, color: '#B84646', pct: '8%', title: 'completed their goal', desc: 'In the end, only a shocking <strong>8% of users</strong> completed their goals. The rest dropped off, revealing a huge gap in motivation and follow-through.' },
    ];

    function updatePictogram(stepIndex) {
        const step = pictoSteps[stepIndex];
        if (!step) return;

        // Update header
        if (pictoPct) {
            pictoPct.textContent = step.pct;
            pictoPct.style.color = step.color;
        }
        if (pictoTitle) pictoTitle.textContent = step.title;
        if (pictoDesc) {
            pictoDesc.innerHTML = step.desc ? '<p class="visible">' + step.desc + '</p>' : '';
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
