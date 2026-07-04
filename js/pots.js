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
            image: "assets/svgs/project_Pots/Dashboard_Partial state.svg",
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
        if (!data || !cutModal || !cutModalImg || !cutModalTitle || !cutModalBody) return;

        // Reset class
        cutModal.classList.remove('full-svg-mode');

        const fullSvgScreens = [1, '1', 3, '3', 4, '4', 5, '5', 8, '8', 9, '9'];
        if (fullSvgScreens.includes(screenNum)) {
            cutModal.classList.add('full-svg-mode');
            cutModalImg.src = data.image;
            cutModalImg.alt = data.title;
            cutModalTitle.textContent = '';
            cutModalBody.innerHTML = '';
        } else {
            cutModalImg.src = data.image;
            cutModalImg.alt = data.title;
            cutModalTitle.textContent = data.title;

            let html = '';
            html += '<div class="cut-section">';
            html += '  <h4>The Concept</h4>';
            html += '  <p>' + data.concept + '</p>';
            html += '</div>';

            html += '<div class="cut-section">';
            html += '  <h4>❌ Why it didn\'t make the cut</h4>';
            html += '  <ul class="cut-drawbacks-list">';
            data.drawbacks.forEach(db => {
                html += '    <li>' + db + '</li>';
            });
            html += '  </ul>';
            html += '</div>';

            html += '<div class="cut-section">';
            html += '  <h4>✓ What works in the final design</h4>';
            html += '  <p>' + data.solution + '</p>';
            html += '</div>';

            cutModalBody.innerHTML = html;
        }

        cutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (cutModal && cutModalClose) {
        const closeCutModal = () => {
            cutModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                cutModalImg.src = '';
                cutModalTitle.textContent = '';
                cutModalBody.innerHTML = '';
                cutModal.classList.remove('full-svg-mode');
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

    // ─── Instagram Stories Viewer ───
    const STORY_DURATION = 5000; // 5 seconds per slide

    const storySlides = {
        pots: {
            label: 'POTS',
            slides: [
                'assets/images/stories/pots_1.jpg',
                'assets/images/stories/pots_2.jpg',
                'assets/images/stories/pots_3.jpg',
                'assets/images/stories/pots_4.jpg',
                'assets/images/stories/pots_5.jpg'
            ]
        }
    };

    const storyViewer     = document.getElementById('storyViewer');
    const storyProgressBar = document.getElementById('storyProgressBar');
    const storySlideImg   = document.getElementById('storySlideImg');
    const storyCloseBtn   = document.getElementById('storyClose');
    const storyTapLeft    = document.getElementById('storyTapLeft');
    const storyTapRight   = document.getElementById('storyTapRight');
    const storyLabel      = document.getElementById('storyProjectLabel');

    let currentStory = null;
    let currentSlideIndex = 0;
    let storyTimer = null;

    function openStory(projectKey) {
        const data = storySlides[projectKey];
        if (!data) return;

        currentStory = data;
        currentSlideIndex = 0;

        if (storyLabel) storyLabel.textContent = data.label;

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
        storySlideImg.classList.remove('loaded');
        storySlideImg.src = '';
        currentStory = null;
    }

    function showSlide(index) {
        if (!currentStory) return;
        const slides = currentStory.slides;

        if (index >= slides.length) {
            closeStory();
            return;
        }

        if (index < 0) index = 0;

        currentSlideIndex = index;
        clearTimeout(storyTimer);

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

        storySlideImg.classList.remove('loaded');

        const imgSrc = slides[index];
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = 420;
        dummyCanvas.height = 750;
        const ctx = dummyCanvas.getContext('2d');

        const hues = [32, 180, 260, 340, 120];
        const hue = hues[index % hues.length];
        ctx.fillStyle = 'hsl(' + hue + ', 35%, 25%)';
        ctx.fillRect(0, 0, 420, 750);

        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = 'bold 80px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1).padStart(2, '0'), 210, 340);

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '600 14px sans-serif';
        ctx.fillText(currentStory.label + ' — SLIDE ' + (index + 1), 210, 410);

        const img = new Image();
        img.onload = function () {
            storySlideImg.src = img.src;
            storySlideImg.classList.add('loaded');
        };
        img.onerror = function () {
            storySlideImg.src = dummyCanvas.toDataURL();
            storySlideImg.classList.add('loaded');
        };
        img.src = imgSrc;

        storyTimer = setTimeout(() => {
            showSlide(currentSlideIndex + 1);
        }, STORY_DURATION);
    }

    document.querySelectorAll('.story-ring').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = btn.getAttribute('data-story');
            openStory(key);
        });
    });

    if (storyCloseBtn) {
        storyCloseBtn.addEventListener('click', closeStory);
    }

    if (storyTapLeft) {
        storyTapLeft.addEventListener('click', () => {
            showSlide(currentSlideIndex - 1);
        });
    }
    if (storyTapRight) {
        storyTapRight.addEventListener('click', () => {
            showSlide(currentSlideIndex + 1);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && storyViewer && storyViewer.classList.contains('active')) {
            closeStory();
        }
    });

    // Initial executions
    updateScrollProgress();
    updateNavState();

})();

