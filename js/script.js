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
            document.getElementById('hero'),
            document.getElementById('projects'),
            document.getElementById('chapter-connect'),
        ];

        allSections.forEach((section, index) => {
            if (section && section.offsetTop <= scrollPos) {
                activeIndex = index;
            }
        });

        chapterDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });

        chapterIndicator.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
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

    // ─── Project Panel Scroll → Phone Screen Swap ───
    const projectPanels = document.querySelectorAll('.project-panel');
    const screenImages = document.querySelectorAll('.phone-screen-img');

    if (projectPanels.length && screenImages.length) {
        const panelObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Highlight the active panel
                        projectPanels.forEach((p) => p.classList.remove('active'));
                        entry.target.classList.add('active');

                        // Swap phone screen image
                        const screenIndex = entry.target.getAttribute('data-screen');
                        screenImages.forEach((img) => img.classList.remove('active'));
                        if (screenImages[screenIndex]) {
                            screenImages[screenIndex].classList.add('active');
                        }
                    }
                });
            },
            { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
        );

        projectPanels.forEach((panel) => panelObserver.observe(panel));

        // Set first panel active on load
        projectPanels[0].classList.add('active');
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

    // ─── Projects Scroll Dissolve ───
    const projectsContainer = document.getElementById('projects');
    const projectsLayout = document.querySelector('.projects-layout');

    function updateProjectsFade() {
        if (!projectsContainer || !projectsLayout) return;

        // Disable scrolly fade animation on mobile/tablet to ensure silky-smooth native scrolling
        if (window.innerWidth <= 768) {
            projectsLayout.style.opacity = 1;
            projectsLayout.style.transform = 'none';
            projectsLayout.style.visibility = 'visible';
            projectsLayout.style.pointerEvents = 'auto';
            return;
        }

        const rect = projectsContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        let opacity = 1;
        let translateY = 0;

        // 1. Entrance Fade-in
        const entryStart = viewportHeight * 0.40; // Starts dissolving in
        const entryEnd = 0;                      // Fully visible

        if (rect.top > entryEnd) {
            if (rect.top >= entryStart) {
                opacity = 0;
            } else {
                const ratio = (rect.top - entryEnd) / (entryStart - entryEnd);
                opacity = 1 - ratio;
            }
        }

        // 2. Exit Fade-out
        const exitStart = viewportHeight * 0.80; // Fully visible
        const exitEnd = viewportHeight * 0.50;   // Completely faded out

        if (rect.bottom < exitStart) {
            if (rect.bottom <= exitEnd) {
                opacity = 0;
            } else {
                const ratio = (rect.bottom - exitEnd) / (exitStart - exitEnd);
                opacity = ratio;
            }
        }

        opacity = Math.max(0, Math.min(1, opacity));
        translateY = (1 - opacity) * 30;

        projectsLayout.style.opacity = opacity;
        projectsLayout.style.transform = `translateY(${translateY}px)`;

        if (opacity === 0) {
            projectsLayout.style.visibility = 'hidden';
            projectsLayout.style.pointerEvents = 'none';
        } else {
            projectsLayout.style.visibility = 'visible';
            projectsLayout.style.pointerEvents = 'auto';
        }
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

    // ─── Instagram Stories Viewer ───
    const STORY_DURATION = 5000; // 5 seconds per slide

    // Slide data per project (replace nulls with real image paths later)
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
        },
        echoverse: {
            label: 'ECHOVERSE',
            slides: [
                'assets/images/stories/echoverse_1.jpg',
                'assets/images/stories/echoverse_2.jpg',
                'assets/images/stories/echoverse_3.jpg',
                'assets/images/stories/echoverse_4.jpg',
                'assets/images/stories/echoverse_5.jpg'
            ]
        },
        terraform: {
            label: 'TERRAFORM',
            slides: [
                'assets/images/stories/terraform_1.jpg',
                'assets/images/stories/terraform_2.jpg',
                'assets/images/stories/terraform_3.jpg',
                'assets/images/stories/terraform_4.jpg',
                'assets/images/stories/terraform_5.jpg'
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

        // Set project label
        if (storyLabel) storyLabel.textContent = data.label;

        // Build progress segments
        storyProgressBar.innerHTML = '';
        data.slides.forEach(() => {
            const seg = document.createElement('div');
            seg.className = 'story-progress-seg';
            seg.innerHTML = '<div class="story-progress-fill"></div>';
            storyProgressBar.appendChild(seg);
        });

        // Show viewer
        storyViewer.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Show first slide
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

        // If we've gone past the last slide, close the viewer
        if (index >= slides.length) {
            closeStory();
            return;
        }

        // If going backwards past the beginning, stay at first
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
                // Set the CSS custom property for animation duration
                seg.querySelector('.story-progress-fill').style.setProperty('--story-duration', STORY_DURATION + 'ms');
            }
        });

        // Load the image
        storySlideImg.classList.remove('loaded');

        // Generate a dummy placeholder color for missing images
        const imgSrc = slides[index];
        const dummyCanvas = document.createElement('canvas');
        dummyCanvas.width = 420;
        dummyCanvas.height = 750;
        const ctx = dummyCanvas.getContext('2d');

        // Unique background colour per slide
        const hues = [32, 180, 260, 340, 120];
        const hue = hues[index % hues.length];
        ctx.fillStyle = 'hsl(' + hue + ', 35%, 25%)';
        ctx.fillRect(0, 0, 420, 750);

        // Label text
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = 'bold 80px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1).padStart(2, '0'), 210, 340);

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '600 14px sans-serif';
        ctx.fillText(currentStory.label + ' — SLIDE ' + (index + 1), 210, 410);

        // Try real image, fallback to canvas dummy
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

        // Auto-advance timer
        storyTimer = setTimeout(() => {
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

    // Close button
    if (storyCloseBtn) {
        storyCloseBtn.addEventListener('click', closeStory);
    }

    // Tap zones: left = previous, right = next
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

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && storyViewer.classList.contains('active')) {
            closeStory();
        }
    });

    // ─── Initial ───
    updateScrollProgress();
    updateNavState();
    updateActiveSection();
    updateProjectsFade();
})();
