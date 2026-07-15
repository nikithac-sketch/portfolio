/* ============================================
   POTS UX CASE STUDY — Interactive Script
   ============================================ */

(function () {
    'use strict';

    // ─── DOM Elements ───
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const mobileClock = document.getElementById('mobileClock');

    // ─── Live Clock ───
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${h}:${m}:${s}`;
        if (navClock) navClock.textContent = timeStr;
        if (mobileClock) mobileClock.textContent = timeStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ─── Mobile Navigation Toggle ───
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNavToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when links are clicked
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link, .mobile-btn-wobbly');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside the menu drawer
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                mobileNavToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

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
        { count: 68, color: '#80AEAF', prefix: 'Only', pct: '68%', title: 'contributed to it', desc: 'The friction of manual savings kicked in, and only <strong>68% of users</strong> made a contribution to their Pot.' },
        { count: 8, color: '#B84646', prefix: 'And only', pct: '8%', title: 'completed their goal', desc: 'In the end, only a shocking <strong>8% of users</strong> completed their goals. The rest dropped off, revealing a huge gap in motivation and follow-through.' },
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
                        donutLabel.textContent = 'of Users';
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

    // ─── Pain Points Card Reveal ───
    const painCards = document.querySelectorAll('.painpoint-card');
    if (painCards.length > 0) {
        const painObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('pp-visible');
                    painObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });

        painCards.forEach(card => {
            painObserver.observe(card);
        });
    }

    // ─── Lightbox Modal Interactivity ───
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const conceptImageWrappers = document.querySelectorAll('.concept-image-wrapper');

    if (lightboxModal && lightboxImg && lightboxClose) {
        conceptImageWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('img');
                const caption = wrapper.getAttribute('data-caption');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxCaption.textContent = caption || img.alt;
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxImg.src = '';
                lightboxCaption.textContent = '';
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ─── Ideation Cuts Modal Interactivity ───
    const cutModal = document.getElementById('cutModal');
    const cutModalImg = document.getElementById('cutModalImg');
    const cutModalTitle = document.getElementById('cutModalTitle');
    const cutModalBody = document.getElementById('cutModalBody');
    const cutModalClose = document.getElementById('cutModalClose');

    const cutData = {
        1: {
            title: "Ideation Cut: Screen 1 — Form-Heavy Setup",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen1_itdmtc.svg",
            concept: "We initially designed a comprehensive, single-page creation form where users had to input their Pot Name, Target Amount, and Goal Date all at once.",
            drawbacks: [
                "<strong>High cognitive load:</strong> Seeing a long form with multiple required inputs right after clicking 'Create Pot' created immediate friction.",
                "<strong>Date picker friction:</strong> Forcing users to select a calendar date felt like homework and stalled the excitement of setting a savings goal.",
                "<strong>Lack of guidance:</strong> No preset templates or categories left users staring at a blank name field, leading to a 34% drop-off rate in early user trials."
            ],
            solution: "We broke the flow down into a progressive, step-by-step wizard. We replaced the text input with visual categories (e.g. Travel, Emergency, Tech) and introduced preset goal targets to get users started instantly."
        },
        3: {
            title: "Ideation Cut: Screen 3 — Restrictive Target Dates",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen3_itdmtc.svg",
            concept: "This version enforced a strict, non-negotiable target date for the pot to calculate exact monthly savings schedules.",
            drawbacks: [
                "<strong>Intimidating pressure:</strong> Users felt anxious about missing fixed deadlines, which discouraged them from creating pots for open-ended goals like 'Rainy Day Fund'.",
                "<strong>Rigid automation:</strong> The system automatically set fixed monthly drafts without giving users control over flexible deposit amounts or schedules.",
                "<strong>Negative feedback loop:</strong> If a user missed a scheduled deposit, the UI flagged it as a failure, causing users to abandon the pot altogether."
            ],
            solution: "We made target dates completely optional, rebranding them as milestones. We introduced flexible, gamified scheduling options (e.g., Round-ups, recurring deposits, or manually adding spare change) to encourage positive reinforcement."
        },
        4: {
            title: "Ideation Cut: Screen 4 — Milestone Rewards",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen4_itdmtc.svg"
        },
        5: {
            title: "Ideation Cut: Screen 5 — Redundant Preview Step",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen5_itdmtc.svg",
            concept: "A confirmation screen summarizing the pot rules, selected category, and scheduled drafts, requiring a final confirmation click.",
            drawbacks: [
                "<strong>Speed bump:</strong> The preview page acted as a transaction screen, slowing down the instant-gratification loop of savings.",
                "<strong>Duplicated effort:</strong> Users felt they were re-reading what they just input, causing a micro-annoyance before completing creation.",
                "<strong>Underutilized real estate:</strong> The page lacked visual interest and felt dry compared to the rest of the gamified interface."
            ],
            solution: "We eliminated the separate confirmation step entirely. Instead, clicking 'Create' immediately initiates a vibrant success animation and deploys the pot, while providing an inline 'Edit' option directly on the dashboard."
        },
        8: {
            title: "Ideation Cut: Screen 8",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen8_itdmtc.svg"
        },
        9: {
            title: "Ideation Cut: Screen 9",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen9_itdmtc.svg"
        },
        12: {
            title: "Ideation Cut: Screen 12 — Static Success Screen",
            image: "assets/svgs/project_Pots/ideationScreens/potCreation/ideationsThatDidn'tMakeTheCut/screen12_itdmtc.svg",
            concept: "A simple success screen with a 'Congrats' message and a single button to return to the main dashboard.",
            drawbacks: [
                "<strong>Missed onboarding opportunity:</strong> Once the pot was created, the user was left with a balance of $0 and no prompt or guidance on what to do next.",
                "<strong>Dead-end flow:</strong> Users had to navigate back to the dashboard, select the pot, and click 'Deposit' to fund it—creating three extra clicks.",
                "<strong>Low initial funding:</strong> Early testing showed that only 12% of users funded their pots immediately after creation in this flow."
            ],
            solution: "We transformed the success screen into an active onboarding step, adding a primary button saying 'Add your first $10' alongside presets. This simple change increased immediate funding rates from 12% to 64%."
        },
        "dashboard-2": {
            title: "Ideation Cut: Screen 2 — Dense Matrix Grid Compare Layout",
            image: "assets/svgs/project_Pots/gamificationConcepts/Frame 16.svg",
            concept: "We initially designed a detailed comparison matrix showing all assets side-by-side with exhaustive financial metrics, interest yields, and maturity dates.",
            drawbacks: [
                "<strong>Overwhelming data density:</strong> Desktop-style comparison tables felt extremely cramped and required heavy horizontal scrolling on a mobile viewport.",
                "<strong>High cognitive load:</strong> Presenting raw interest formulas and maturity calculations distracted users from the core task of comparing overall benefits.",
                "<strong>Lack of visual hierarchy:</strong> Without a clear recommendation or highlight system, users spent too much time trying to decode which option suited them best."
            ],
            solution: "We streamlined the comparison into a clean, card-based comparison layout with toggleable detail tabs, highlighting key differentiators like interest yield and flexibility using visual badges."
        }
    };

    function openCutModal(screenNum) {
        const data = cutData[screenNum];
        if (!data || !cutModal || !cutModalImg) return;

        cutModalImg.src = data.image;
        cutModalImg.alt = data.title;

        cutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (cutModal && cutModalClose) {
        const closeCutModal = () => {
            cutModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                cutModalImg.src = '';
            }, 300);
        };

        cutModalClose.addEventListener('click', closeCutModal);
        cutModal.addEventListener('click', (e) => {
            if (e.target === cutModal) {
                closeCutModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cutModal.classList.contains('active')) {
                closeCutModal();
            }
        });
    }

    // ─── Scroll Listener ───
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



    // ─── Ideation Section: Folder + Phase + Screen Flow ───
    const ideationPhaseBtns = document.querySelectorAll('.ideation-phase-btn');
    const ideationScreenFlow = document.getElementById('ideationScreenFlow');

    // Screen data: phase > array of image URLs (null = empty placeholder)
    // Replace null values with actual image paths when ready, e.g.:
    //   'assets/svgs/project_Pots/gamificationConcepts/Frame 17.svg'
    const ideationScreenData = {
        creation: [
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen4.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen5.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen6.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen7.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen8.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen9.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen10.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen11.svg',
            'assets/svgs/project_Pots/ideationScreens/potCreation/screen12.svg'
        ],
        dashboard: [
            'assets/svgs/project_Pots/ideationScreens/compareAsset/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/compareAsset/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/compareAsset/screen3.svg'
        ],
        add: [
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen4.svg',
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen5.svg',
            'assets/svgs/project_Pots/ideationScreens/addMoneyToPot/screen6.svg'
        ],
        withdraw: [
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen4.svg',
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen5.svg',
            'assets/svgs/project_Pots/ideationScreens/withdrawFromPot/screen6.svg'
        ],
        schedule: [
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen4.svg',
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen5.svg',
            'assets/svgs/project_Pots/ideationScreens/scheduleForPot/screen6.svg'
        ],
        favourite: [
            'assets/svgs/project_Pots/ideationScreens/favouritePot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/favouritePot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/favouritePot/screen3.svg'
        ],
        edit: [
            'assets/svgs/project_Pots/ideationScreens/editPot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/editPot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/editPot/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/editPot/screen4.svg'
        ],
        close: [
            'assets/svgs/project_Pots/ideationScreens/closePot/screen1.svg',
            'assets/svgs/project_Pots/ideationScreens/closePot/screen2.svg',
            'assets/svgs/project_Pots/ideationScreens/closePot/screen3.svg',
            'assets/svgs/project_Pots/ideationScreens/closePot/screen4.svg'
        ]
    };

    let activePhase = 'creation';

    function renderScreenFlow() {
        if (!ideationScreenFlow) return;

        const screens = (ideationScreenData[activePhase] || []).filter(src => src !== null);

        ideationScreenFlow.innerHTML = '';

        screens.forEach((src, i) => {
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'ideation-screen-wrapper';

            // Create screen card
            const card = document.createElement('div');
            card.className = 'ideation-screen-card';
            card.style.animationDelay = (i * 60) + 'ms';

            if (src) {
                // Real image
                card.classList.add('has-image');
                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Screen ' + (i + 1);
                img.className = 'screen-card-img';
                card.appendChild(img);
            } else {
                // Empty placeholder
                card.innerHTML =
                    '<div class="screen-card-inner">' +
                        '<span class="screen-card-number">' + String(i + 1).padStart(2, '0') + '</span>' +
                        '<span class="screen-card-label">Screen</span>' +
                    '</div>';
            }

            wrapper.appendChild(card);

            // Add the "didn't make the cut" link
            let showBadge = false;
            let cutKey = null;

            if (activePhase === 'creation' && (i === 0 || i === 2 || i === 3 || i === 4 || i === 7 || i === 8 || i === 11)) {
                showBadge = true;
                cutKey = i + 1;
            } else if (activePhase === 'dashboard' && i === 1) {
                showBadge = true;
                cutKey = 'dashboard-2';
            }

            if (showBadge) {
                const teaserLines = {
                    1: 'This screen started as a long, intimidating form.',
                    3: 'The tone of voice is very important!',
                    4: "Recommendations sounded great, until they didn't.",
                    5: "This page went through a lot of user testing and team feedback before finalisation.",
                    8: 'An earlier take that missed the mark.',
                    9: 'A direction we explored but ultimately moved past.',
                    12: 'A dead-end success screen that left users stranded.',
                    'dashboard-2': 'A data-heavy comparison grid that overwhelmed users.'
                };

                const cutLink = document.createElement('button');
                cutLink.className = 'ideation-cut-link';
                cutLink.style.animationDelay = (i * 60 + 15) + 'ms';
                cutLink.innerHTML = 'See what didn\'t work <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

                const teaser = document.createElement('span');
                teaser.className = 'ideation-cut-teaser';
                teaser.textContent = teaserLines[cutKey] || '';
                teaser.style.animationDelay = (i * 60 + 12) + 'ms';
                cutLink.appendChild(teaser);

                cutLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openCutModal(cutKey);
                });
                wrapper.appendChild(cutLink);
            }

            ideationScreenFlow.appendChild(wrapper);
        });
    }

    // Phase button click handler
    ideationPhaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activePhase = btn.getAttribute('data-phase');
            ideationPhaseBtns.forEach(b => b.classList.toggle('active', b === btn));
            renderScreenFlow();
        });
    });

    // Initial render
    renderScreenFlow();

    // ─── Instagram Stories Viewer (Rich HTML Slides) ───
    const STORY_DURATION = 6000; // 6 seconds per slide

    const storySlides = {
        pots: {
            label: 'POTS',
            slides: [
                {
                    type: 'title',
                    bg: 'linear-gradient(165deg, #D1EBEB 0%, #85B787 55%, #5C8F5E 100%)',
                    tagline: 'HUGOSAVE · UX CASE STUDY',
                    title: 'POTS',
                    subtitle: 'Gamifying micro-savings through delightful milestones & visual pathways',
                    accent: '#F3C364'
                },
                {
                    type: 'stat',
                    bg: 'linear-gradient(165deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    tagline: 'THE PROBLEM',
                    stat: '68%',
                    description: 'of users who created money pots never returned to save more after their first deposit.',
                    footnote: 'Based on internal analytics & user interviews'
                },
                {
                    type: 'insight',
                    bg: 'linear-gradient(165deg, #2d2d3f 0%, #1e1e30 100%)',
                    tagline: 'USER RESEARCH',
                    title: 'Four distinct saving archetypes',
                    items: [
                        { icon: '🏗️', name: 'Architect', pct: '37.8%', desc: 'Plans every detail before saving' },
                        { icon: '📦', name: 'Accumulator', pct: '16.2%', desc: 'Saves impulsively in small bursts' },
                        { icon: '⏳', name: 'Countdown', pct: '1.6%', desc: 'Deadline-driven, last-minute savers' },
                        { icon: '🧭', name: 'Explorer', pct: '44.4%', desc: 'Curious but needs gentle nudges' }
                    ]
                },
                {
                    type: 'concept',
                    bg: 'linear-gradient(165deg, #0f3460 0%, #1a1a2e 100%)',
                    tagline: 'THE SOLUTION',
                    title: 'A gamified savings journey',
                    description: 'Transform passive pot creation into an engaging milestone pathway — every deposit unlocks visual rewards & progress celebrations.',
                    image: 'assets/svgs/project_Pots/gamificationConcepts/Frame 16.svg'
                },
                {
                    type: 'screen',
                    bg: 'linear-gradient(165deg, #D1EBEB 0%, #a8d5ba 100%)',
                    tagline: 'CREATING A POT',
                    caption: 'Guided pot creation with flexible goal-setting and personalised themes',
                    image: 'assets/svgs/project_Pots/finalScreens/Money Pot Creation.svg',
                    dark: true
                },
                {
                    type: 'screen',
                    bg: 'linear-gradient(165deg, #f5e6d3 0%, #e8d5b7 100%)',
                    tagline: 'SAVINGS DASHBOARD',
                    caption: 'Track progress, celebrate milestones, and manage all pots from one place',
                    image: 'assets/svgs/project_Pots/finalScreens/Money Pot screen.svg',
                    dark: true
                },
                {
                    type: 'screen',
                    bg: 'linear-gradient(165deg, #1a1a2e 0%, #2d2d3f 100%)',
                    tagline: 'MILESTONE REWARDS',
                    caption: 'Delightful celebration moments that encourage continued saving habits',
                    image: 'assets/svgs/project_Pots/finalScreens/Congratulation screen/Buy Schedule.svg',
                    dark: false
                },
                {
                    type: 'impact',
                    bg: 'linear-gradient(165deg, #85B787 0%, #5C8F5E 50%, #3d6b3f 100%)',
                    tagline: 'IMPACT',
                    stats: [
                        { value: '4×', label: 'Increase in return visits after pot creation' },
                        { value: '92%', label: 'Of testers found milestones motivating' },
                        { value: '3.2×', label: 'More deposits per user per month' }
                    ],
                    footnote: 'Measured during usability testing with 24 participants'
                }
            ]
        }
    };

    const storyViewer       = document.getElementById('storyViewer');
    const storyProgressBar  = document.getElementById('storyProgressBar');
    const storySlideImg     = document.getElementById('storySlideImg');
    const storySlideContent = document.getElementById('storySlideContent');
    const storyCloseBtn     = document.getElementById('storyClose');
    const storyTapLeft      = document.getElementById('storyTapLeft');
    const storyTapRight     = document.getElementById('storyTapRight');
    const storyLabelEl      = document.getElementById('storyProjectLabel');

    let currentStory = null;
    let currentSlideIndex = 0;
    let storyTimer = null;

    function openStory(projectKey) {
        const data = storySlides[projectKey];
        if (!data) return;

        currentStory = data;
        currentSlideIndex = 0;

        if (storyLabelEl) storyLabelEl.textContent = data.label;

        storyProgressBar.innerHTML = '';
        data.slides.forEach(() => {
            const seg = document.createElement('div');
            seg.className = 'story-progress-seg';
            seg.innerHTML = '<div class="story-progress-fill"></div>';
            storyProgressBar.appendChild(seg);
        });

        storyViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        showSlide(0);
    }

    function closeStory() {
        clearTimeout(storyTimer);
        storyViewer.classList.remove('active');
        document.body.style.overflow = '';
        if (storySlideImg) { storySlideImg.classList.remove('loaded'); storySlideImg.src = ''; }
        if (storySlideContent) { storySlideContent.innerHTML = ''; storySlideContent.style.display = 'none'; }
        currentStory = null;
    }

    /* ── Render a rich HTML slide ── */
    function renderSlideHTML(slide) {
        let html = '';

        if (slide.type === 'title') {
            html = `
                <div class="ss-title-slide" style="background:${slide.bg}">
                    <span class="ss-tagline" style="color:${slide.dark ? '#333' : '#fff'}">${slide.tagline}</span>
                    <h2 class="ss-hero-title" style="color:${slide.dark ? '#111' : '#fff'}">${slide.title}</h2>
                    <p class="ss-hero-sub" style="color:${slide.dark ? '#333' : 'rgba(255,255,255,0.85)'}">${slide.subtitle}</p>
                    <div class="ss-accent-bar" style="background:${slide.accent}"></div>
                </div>`;
        }

        else if (slide.type === 'stat') {
            html = `
                <div class="ss-stat-slide" style="background:${slide.bg}">
                    <span class="ss-tagline">${slide.tagline}</span>
                    <div class="ss-stat-value">${slide.stat}</div>
                    <p class="ss-stat-desc">${slide.description}</p>
                    <span class="ss-footnote">${slide.footnote}</span>
                </div>`;
        }

        else if (slide.type === 'insight') {
            const itemsHtml = slide.items.map(it => `
                <div class="ss-insight-item">
                    <span class="ss-insight-icon">${it.icon}</span>
                    <div class="ss-insight-text">
                        <strong>${it.name}</strong> <span class="ss-insight-pct">${it.pct}</span>
                        <p>${it.desc}</p>
                    </div>
                </div>`).join('');
            html = `
                <div class="ss-insight-slide" style="background:${slide.bg}">
                    <span class="ss-tagline">${slide.tagline}</span>
                    <h3 class="ss-section-title">${slide.title}</h3>
                    <div class="ss-insight-list">${itemsHtml}</div>
                </div>`;
        }

        else if (slide.type === 'concept') {
            html = `
                <div class="ss-concept-slide" style="background:${slide.bg}">
                    <span class="ss-tagline">${slide.tagline}</span>
                    <h3 class="ss-section-title">${slide.title}</h3>
                    <p class="ss-concept-desc">${slide.description}</p>
                    <div class="ss-concept-img-wrap">
                        <img src="${slide.image}" alt="${slide.title}" class="ss-concept-img" />
                    </div>
                </div>`;
        }

        else if (slide.type === 'screen') {
            html = `
                <div class="ss-screen-slide" style="background:${slide.bg}">
                    <span class="ss-tagline" style="color:${slide.dark ? '#333' : '#fff'}">${slide.tagline}</span>
                    <div class="ss-phone-frame">
                        <img src="${slide.image}" alt="${slide.tagline}" class="ss-phone-img" />
                    </div>
                    <p class="ss-screen-caption" style="color:${slide.dark ? '#444' : 'rgba(255,255,255,0.85)'}">${slide.caption}</p>
                </div>`;
        }

        else if (slide.type === 'impact') {
            const statsHtml = slide.stats.map(s => `
                <div class="ss-impact-stat">
                    <div class="ss-impact-value">${s.value}</div>
                    <p class="ss-impact-label">${s.label}</p>
                </div>`).join('');
            html = `
                <div class="ss-impact-slide" style="background:${slide.bg}">
                    <span class="ss-tagline">${slide.tagline}</span>
                    <div class="ss-impact-grid">${statsHtml}</div>
                    <span class="ss-footnote">${slide.footnote}</span>
                </div>`;
        }

        return html;
    }

    function showSlide(index) {
        if (!currentStory) return;
        const slides = currentStory.slides;

        if (index >= slides.length) { closeStory(); return; }
        if (index < 0) index = 0;

        currentSlideIndex = index;
        clearTimeout(storyTimer);

        // Update progress segments
        const segs = storyProgressBar.querySelectorAll('.story-progress-seg');
        segs.forEach((seg, i) => {
            seg.classList.remove('active', 'done');
            if (i < index) {
                seg.classList.add('done');
            } else if (i === index) {
                seg.classList.add('active');
                seg.querySelector('.story-progress-fill').style.setProperty('--story-duration', STORY_DURATION + 'ms');
            }
        });

        const slide = slides[index];

        // Always use rich HTML rendering
        if (storySlideImg) { storySlideImg.classList.remove('loaded'); storySlideImg.src = ''; storySlideImg.style.display = 'none'; }

        if (storySlideContent) {
            storySlideContent.style.display = 'flex';
            storySlideContent.innerHTML = renderSlideHTML(slide);

            // Animate in
            requestAnimationFrame(() => {
                storySlideContent.classList.add('loaded');
            });
        }

        // Auto-advance
        storyTimer = setTimeout(() => {
            if (storySlideContent) storySlideContent.classList.remove('loaded');
            showSlide(currentSlideIndex + 1);
        }, STORY_DURATION);
    }

    // Bind story ring buttons
    document.querySelectorAll('.story-ring').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = btn.getAttribute('data-story');
            openStory(key);
        });
    });

    if (storyCloseBtn) storyCloseBtn.addEventListener('click', closeStory);

    if (storyTapLeft) {
        storyTapLeft.addEventListener('click', () => {
            if (storySlideContent) storySlideContent.classList.remove('loaded');
            showSlide(currentSlideIndex - 1);
        });
    }
    if (storyTapRight) {
        storyTapRight.addEventListener('click', () => {
            if (storySlideContent) storySlideContent.classList.remove('loaded');
            showSlide(currentSlideIndex + 1);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && storyViewer && storyViewer.classList.contains('active')) {
            closeStory();
        }
        if (storyViewer && storyViewer.classList.contains('active')) {
            if (e.key === 'ArrowRight') { storySlideContent.classList.remove('loaded'); showSlide(currentSlideIndex + 1); }
            if (e.key === 'ArrowLeft')  { storySlideContent.classList.remove('loaded'); showSlide(currentSlideIndex - 1); }
        }
    });

    // ─── Final Designs Showcase Scrollytelling Logic ───
    const creationSteps = document.querySelectorAll('.creation-scroll-step');
    const creationImages = document.querySelectorAll('.creation-scrolly-layout .phone-screen-img');

    if (creationSteps.length > 0 && creationImages.length > 0) {
        const creationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepIndex = parseInt(entry.target.getAttribute('data-step'), 10);
                    
                    // Update scrolling step classes
                    creationSteps.forEach((step, i) => {
                        step.classList.toggle('active', i === stepIndex);
                    });

                    // Update screen image active states
                    creationImages.forEach((img, i) => {
                        img.classList.toggle('active', i === stepIndex);
                    });
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '-10% 0px -10% 0px'
        });

        creationSteps.forEach(step => {
            creationObserver.observe(step);
        });

        // Set first step active on load
        creationSteps[0].classList.add('active');
        creationImages[0].classList.add('active');
    }

    // Initial executions
    updateScrollProgress();
    updateNavState();

})();

