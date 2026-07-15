/* ============================================
   SCROLLYTELLING PORTFOLIO — Script
   ============================================ */

(function () {
    'use strict';

    // ─── DOM ───
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const chapterIndicator = document.getElementById('chapterIndicator');
    const scrollHint = document.getElementById('scrollHint');
    const chapterDots = document.querySelectorAll('.chapter-dot');



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
    // ─── Typewriter + Video Sync ───
    // Video plays CONTINUOUSLY for smooth morphing transitions.
    // Typewriter reacts to video position using correct segment boundaries.
    const typewriterEl = document.getElementById('typewriterText');
    const morphVideo = document.getElementById('morphVideo');

    // Exact video timeline (8s total, frame-by-frame analysis):
    //   0.0s – 0.7s : Smartphone (resting)
    //   0.7s – 1.0s : Phone → Dice morph
    //   1.0s – 2.5s : Dice (resting)
    //   2.5s – 3.0s : Dice → Magnifying glass morph
    //   3.0s – 5.5s : Magnifying glass (resting)
    //   5.5s – 6.0s : Magnifying glass → Phone morph
    //   6.0s – 8.0s : Smartphone (resting, loops back to 0)

    // Returns which phrase should be shown at a given video time
    function getPhraseForTime(t) {
        if (t < 0.7 || t >= 5.5) return 0;  // Phone → UX DESIGNER
        if (t < 2.7) return 1;               // Dice → GAME DESIGNER
        return 2;                             // Glass → DELUSIONAL DETECTIVE
    }

    const PHRASES = ['UX DESIGNER', 'GAME DESIGNER', 'DELUSIONAL DETECTIVE'];
    let currentSegment = -1;
    let typewriterTarget = '';
    let typewriterCurrent = '';
    let typewriterTimer = null;

    const TYPE_SPEED = 55;
    const DELETE_SPEED = 35;

    if (morphVideo) {
        // Let video play continuously — smooth morphing, no seeking
        morphVideo.addEventListener('loadedmetadata', () => {
            morphVideo.currentTime = 0;
            morphVideo.play();
        });

        // React to video position changes
        morphVideo.addEventListener('timeupdate', () => {
            const segment = getPhraseForTime(morphVideo.currentTime);
            if (segment !== currentSegment) {
                currentSegment = segment;
                startTypingPhrase(PHRASES[segment]);
            }
        });
    }

    function startTypingPhrase(phrase) {
        if (typewriterTimer) clearTimeout(typewriterTimer);
        typewriterTarget = phrase;

        // If there's existing text, delete it first
        if (typewriterCurrent.length > 0) {
            deleteText(() => typeText());
        } else {
            typeText();
        }
    }

    function deleteText(callback) {
        if (typewriterCurrent.length === 0) {
            if (callback) callback();
            return;
        }
        typewriterCurrent = typewriterCurrent.substring(0, typewriterCurrent.length - 1);
        typewriterEl.textContent = typewriterCurrent;
        typewriterTimer = setTimeout(() => deleteText(callback), DELETE_SPEED);
    }

    function typeText() {
        if (typewriterCurrent.length >= typewriterTarget.length) return;
        typewriterCurrent = typewriterTarget.substring(0, typewriterCurrent.length + 1);
        typewriterEl.textContent = typewriterCurrent;
        typewriterTimer = setTimeout(typeText, TYPE_SPEED);
    }

    // Start after hero entrance animation
    setTimeout(() => {
        if (morphVideo) {
            morphVideo.currentTime = 0;
            morphVideo.play();
        }
    }, 1200);

    // ─── Scroll Progress ───
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // ─── Nav State ───
    function updateNavState() {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    }

    // ─── Scroll Hint ───
    function updateScrollHint() {
        if (!scrollHint) return;
        const hide = window.scrollY > 200;
        scrollHint.style.opacity = hide ? '0' : '1';
        scrollHint.style.pointerEvents = hide ? 'none' : 'auto';
    }

    // ─── Active Section ───
    function updateActiveSection() {
        const scrollPos = window.scrollY + window.innerHeight * 0.4;
        let activeIndex = 0;

        const allSections = [
            document.getElementById('section1'),
            document.getElementById('section2'),
            document.getElementById('section3'),
        ];

        allSections.forEach((section, index) => {
            if (section) {
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                if (sectionTop <= scrollPos) {
                    activeIndex = index;
                }
            }
        });

        chapterDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });

        const projectsSec = document.getElementById('projects');
        const connectSec = document.getElementById('chapter-connect');
        if (projectsSec && connectSec) {
            const projectsTop = projectsSec.getBoundingClientRect().top + window.scrollY;
            const connectTop = connectSec.getBoundingClientRect().top + window.scrollY;
            const start = projectsTop - window.innerHeight * 0.5;
            const end = connectTop - window.innerHeight * 0.3;
            const isInsideProjects = window.scrollY >= start && window.scrollY < end;
            chapterIndicator.classList.toggle('visible', isInsideProjects);
        }
    }

    // ─── Scroll Reveal ───
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => revealObserver.observe(el));

    // ─── Projects Scroll Dissolve ───
    function updateProjectsFade() {
        const panels = document.querySelectorAll('.project-panel');
        if (!panels.length) return;

        if (window.innerWidth <= 768) {
            panels.forEach((panel) => {
                panel.style.opacity = '';
                panel.style.transform = '';
                panel.style.visibility = '';
                panel.style.pointerEvents = '';
            });
            return;
        }

        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;

        panels.forEach((panel) => {
            const rect = panel.getBoundingClientRect();
            const panelCenter = rect.top + rect.height / 2;

            // Calculate distance of panel center from viewport center
            const distance = Math.abs(viewportCenter - panelCenter);
            
            // Fully visible (opacity 1) when centered,
            // and fully dissolved (opacity 0) when it moves 85% of the viewport height away.
            const maxDistance = viewportHeight * 0.85;
            
            let opacity = 1 - (distance / maxDistance);
            opacity = Math.max(0, Math.min(1, opacity));

            panel.style.opacity = opacity;
            
            // Subtle shift upward/downward as it scrolls away
            const translateY = (1 - opacity) * 30 * (panelCenter < viewportCenter ? -1 : 1);
            panel.style.transform = `translateY(${translateY}px)`;

            // Prevent interaction with faded out panels
            if (opacity < 0.15) {
                panel.style.pointerEvents = 'none';
                panel.style.visibility = 'hidden';
            } else {
                panel.style.pointerEvents = 'auto';
                panel.style.visibility = 'visible';
            }
        });
    }

    // ─── Chapter Dot Click ───
    chapterDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const target = dot.getAttribute('data-target');
            const el = document.getElementById(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ─── Smooth Nav Links ───
    document.querySelectorAll('.nav-link, .nav-btn').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Form ───
    const form = document.getElementById('connectForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-dark');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `SENT! ✓`;
            btn.style.background = '#22c55e';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ─── Throttled Scroll ───
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavState();
                updateScrollHint();
                updateActiveSection();
                updateProjectsFade();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ─── Instagram Stories Viewer (Hybrid Rich HTML + Image Slides) ───
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
        },
        labellie: {
            label: 'LABEL LIE',
            slides: [
                'assets/images/stories/echoverse_1.jpg',
                'assets/images/stories/echoverse_2.jpg',
                'assets/images/stories/echoverse_3.jpg',
                'assets/images/stories/echoverse_4.jpg',
                'assets/images/stories/echoverse_5.jpg'
            ]
        },
        hurrey: {
            label: 'HURREY LIBRARY',
            slides: [
                'assets/images/stories/terraform_1.jpg',
                'assets/images/stories/terraform_2.jpg',
                'assets/images/stories/terraform_3.jpg',
                'assets/images/stories/terraform_4.jpg',
                'assets/images/stories/terraform_5.jpg'
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
        if (storySlideImg) {
            storySlideImg.classList.remove('loaded');
            storySlideImg.src = '';
            storySlideImg.style.display = 'none';
        }
        if (storySlideContent) {
            storySlideContent.classList.remove('loaded');
            storySlideContent.innerHTML = '';
            storySlideContent.style.display = 'none';
        }
        currentStory = null;
    }

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

        const slide = slides[index];

        if (typeof slide === 'object') {
            // Rich HTML slide
            if (storySlideImg) {
                storySlideImg.classList.remove('loaded');
                storySlideImg.src = '';
                storySlideImg.style.display = 'none';
            }
            if (storySlideContent) {
                storySlideContent.style.display = 'flex';
                storySlideContent.innerHTML = renderSlideHTML(slide);
                requestAnimationFrame(() => {
                    storySlideContent.classList.add('loaded');
                });
            }
        } else {
            // Image slide (fallback)
            if (storySlideContent) {
                storySlideContent.classList.remove('loaded');
                storySlideContent.innerHTML = '';
                storySlideContent.style.display = 'none';
            }
            if (storySlideImg) {
                storySlideImg.style.display = 'block';
                storySlideImg.classList.remove('loaded');

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
                img.src = slide;
            }
        }

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
        if (e.key === 'Escape' && storyViewer.classList.contains('active')) {
            closeStory();
        }
    });

    // ─── Sync Section 3 Monitor Height with Content Container ───
    function syncMonitorHeight() {
        const section3 = document.getElementById('section3');
        if (!section3) return;

        if (window.innerWidth <= 768) {
            // Reset styles on mobile/tablet
            section3.style.setProperty('--monitor-body-h', '');
            section3.style.setProperty('--monitor-body-w', '');
            section3.style.setProperty('--monitor-neck-w', '');
            section3.style.setProperty('--monitor-neck-h', '');
            section3.style.setProperty('--monitor-base-w', '');
            section3.style.setProperty('--monitor-base-h', '');
            section3.style.setProperty('--browser-header-h', '');
            section3.style.setProperty('--browser-dot-size', '');
            section3.style.setProperty('--browser-address-h', '');
            return;
        }

        const infoCol = section3.querySelector('.project-info-col');
        if (!infoCol) return;

        // Force browser to recalculate height accurately
        const contentHeight = infoCol.getBoundingClientRect().height;
        if (contentHeight <= 0) return;

        // Monitor body height = contentHeight - neckHeight - baseHeight + overlaps
        // Neck is ~48px, base is ~14px, overlaps are ~3px
        // So total height of non-body monitor parts is 48 + 14 - 3 = 59px.
        const bodyHeight = Math.max(250, contentHeight - 59);

        // Aspect ratio of body is 550 / 340 = 1.6176
        const bodyWidth = bodyHeight * 1.6176;

        // Neck proportions
        const neckWidth = bodyWidth * (40 / 550);
        const neckHeight = bodyHeight * (48 / 340);

        // Base proportions
        const baseWidth = bodyWidth * (180 / 550);
        const baseHeight = bodyHeight * (14 / 340);

        // Browser header proportions
        const headerHeight = bodyHeight * (24 / 340);
        const dotSize = bodyHeight * (8 / 340);
        const addressHeight = bodyHeight * (14 / 340);

        // Set CSS variables
        section3.style.setProperty('--monitor-body-h', `${bodyHeight}px`);
        section3.style.setProperty('--monitor-body-w', `${bodyWidth}px`);
        section3.style.setProperty('--monitor-neck-w', `${neckWidth}px`);
        section3.style.setProperty('--monitor-neck-h', `${neckHeight}px`);
        section3.style.setProperty('--monitor-base-w', `${baseWidth}px`);
        section3.style.setProperty('--monitor-base-h', `${baseHeight}px`);
        section3.style.setProperty('--browser-header-h', `${headerHeight}px`);
        section3.style.setProperty('--browser-dot-size', `${dotSize}px`);
        section3.style.setProperty('--browser-address-h', `${addressHeight}px`);
    }

    // ─── Initial ───
    syncMonitorHeight();
    updateScrollProgress();
    updateNavState();
    updateActiveSection();
    updateProjectsFade();

    window.addEventListener('resize', () => {
        syncMonitorHeight();
        updateProjectsFade();
    });

    window.addEventListener('load', syncMonitorHeight);
})();
