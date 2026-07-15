/* ============================================
   WORK PAGE — Filter & Interactions
   ============================================ */

(function () {
    'use strict';

    // ─── DOM ───
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const mobileClock = document.getElementById('mobileClock');
    const scrollProgress = document.getElementById('scrollProgress');
    const workGrid = document.getElementById('workGrid');
    const workEmpty = document.getElementById('workEmpty');
    const filterClearBtn = document.getElementById('filterClear');
    const emptyClearBtn = document.getElementById('emptyClear');
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('workFilters');

    const allCards = workGrid ? Array.from(workGrid.querySelectorAll('.project-card')) : [];
    const allCheckboxes = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[type="checkbox"]')) : [];

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
        if (scrollProgress) scrollProgress.style.width = progress + '%';
    }

    // ─── Nav State ───
    function updateNavState() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
    }

    // ─── Sticky Header DOM reference ───
    const workStickyHeader = document.getElementById('workStickyHeader');
    function updateStickyHeader() {
        if (workStickyHeader) {
            workStickyHeader.classList.toggle('is-sticky', window.scrollY > 40);
        }
    }

    // ─── Filter Logic ───
    function getActiveFilters() {
        const filters = {};
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                const name = cb.name;
                if (!filters[name]) filters[name] = [];
                filters[name].push(cb.value);
            }
        });
        return filters;
    }

    function applyFilters() {
        const filters = getActiveFilters();
        const hasActiveFilters = Object.keys(filters).length > 0;
        let visibleCount = 0;

        allCards.forEach((card) => {
            let show = true;

            if (hasActiveFilters) {
                // For each filter group, the card must match at least one selected value (OR within group, AND across groups)
                if (filters.type && filters.type.length > 0) {
                    if (!filters.type.includes(card.getAttribute('data-type'))) show = false;
                }
                if (filters.dept && filters.dept.length > 0) {
                    if (!filters.dept.includes(card.getAttribute('data-dept'))) show = false;
                }
                if (filters.duration && filters.duration.length > 0) {
                    if (!filters.duration.includes(card.getAttribute('data-duration'))) show = false;
                }
                if (filters.industry && filters.industry.length > 0) {
                    if (!filters.industry.includes(card.getAttribute('data-industry'))) show = false;
                }
            }

            if (show) {
                card.style.display = '';
                card.style.animationDelay = (visibleCount * 60) + 'ms';
                card.classList.add('card-enter');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('card-enter');
            }
        });

        // Show/hide empty state
        if (workEmpty) {
            workEmpty.style.display = visibleCount === 0 ? 'flex' : 'none';
        }

        // Update active filter count on toggle button
        const totalActive = allCheckboxes.filter(cb => cb.checked).length;
        if (filterToggle) {
            const countBadge = filterToggle.querySelector('.filter-count');
            if (totalActive > 0) {
                if (countBadge) {
                    countBadge.textContent = totalActive;
                } else {
                    const badge = document.createElement('span');
                    badge.className = 'filter-count';
                    badge.textContent = totalActive;
                    filterToggle.appendChild(badge);
                }
            } else if (countBadge) {
                countBadge.remove();
            }
        }
    }

    function clearAllFilters() {
        allCheckboxes.forEach(cb => { cb.checked = false; });
        applyFilters();
    }

    // Bind filter checkboxes
    allCheckboxes.forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });

    // Clear buttons
    if (filterClearBtn) filterClearBtn.addEventListener('click', clearAllFilters);
    if (emptyClearBtn) emptyClearBtn.addEventListener('click', clearAllFilters);

    // Mobile filter toggle
    if (filterToggle && filtersPanel) {
        filterToggle.addEventListener('click', () => {
            filtersPanel.classList.toggle('open');
            filterToggle.classList.toggle('active');
        });
    }

    // Mobile filter close button
    const filterClose = document.getElementById('filterClose');
    if (filterClose && filtersPanel) {
        filterClose.addEventListener('click', () => {
            filtersPanel.classList.remove('open');
            if (filterToggle) filterToggle.classList.remove('active');
        });
    }

    // Collapsible filter groups & Dropdown behavior
    const filterGroupLabels = filtersPanel ? filtersPanel.querySelectorAll('.filter-group-label') : [];
    filterGroupLabels.forEach(label => {
        label.addEventListener('click', (e) => {
            const isDesktop = window.innerWidth > 900;
            const group = label.closest('.filter-group');
            
            if (group) {
                if (isDesktop) {
                    e.stopPropagation();
                    const isCollapsed = group.classList.contains('collapsed');
                    // Close all other groups
                    if (filtersPanel) {
                        filtersPanel.querySelectorAll('.filter-group').forEach(g => {
                            g.classList.add('collapsed');
                        });
                    }
                    // Toggle this group
                    if (isCollapsed) {
                        group.classList.remove('collapsed');
                    } else {
                        group.classList.add('collapsed');
                    }
                } else {
                    // Mobile accordion
                    group.classList.toggle('collapsed');
                }
            }
        });
    });

    // Close dropdowns on click outside (desktop only)
    document.addEventListener('click', () => {
        if (window.innerWidth > 900 && filtersPanel) {
            filtersPanel.querySelectorAll('.filter-group').forEach(g => {
                g.classList.add('collapsed');
            });
        }
    });

    // Stop propagation inside options so clicking options doesn't close the dropdown
    if (filtersPanel) {
        filtersPanel.querySelectorAll('.filter-group-options').forEach(options => {
            options.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    // ─── Stagger entrance animation on Load ───
    allCards.forEach((card, i) => {
        card.style.animationDelay = (i * 80) + 'ms';
        card.classList.add('card-enter');
    });

    // ─── Instagram Stories Viewer ───
    const STORY_DURATION = 5000; // 5 seconds per slide

    // Slide data per project
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
        },
        studybuddy: {
            label: 'STUDYBUDDY',
            slides: [
                'assets/images/stories/studybuddy_1.jpg',
                'assets/images/stories/studybuddy_2.jpg',
                'assets/images/stories/studybuddy_3.jpg',
                'assets/images/stories/studybuddy_4.jpg',
                'assets/images/stories/studybuddy_5.jpg'
            ]
        },
        coinflow: {
            label: 'COINFLOW',
            slides: [
                'assets/images/stories/coinflow_1.jpg',
                'assets/images/stories/coinflow_2.jpg',
                'assets/images/stories/coinflow_3.jpg',
                'assets/images/stories/coinflow_4.jpg',
                'assets/images/stories/coinflow_5.jpg'
            ]
        },
        paywise: {
            label: 'PAYWISE',
            slides: [
                'assets/images/stories/paywise_1.jpg',
                'assets/images/stories/paywise_2.jpg',
                'assets/images/stories/paywise_3.jpg',
                'assets/images/stories/paywise_4.jpg',
                'assets/images/stories/paywise_5.jpg'
            ]
        },
        questforge: {
            label: 'QUESTFORGE',
            slides: [
                'assets/images/stories/questforge_1.jpg',
                'assets/images/stories/questforge_2.jpg',
                'assets/images/stories/questforge_3.jpg',
                'assets/images/stories/questforge_4.jpg',
                'assets/images/stories/questforge_5.jpg'
            ]
        },
        learnloop: {
            label: 'LEARNLOOP',
            slides: [
                'assets/images/stories/learnloop_1.jpg',
                'assets/images/stories/learnloop_2.jpg',
                'assets/images/stories/learnloop_3.jpg',
                'assets/images/stories/learnloop_4.jpg',
                'assets/images/stories/learnloop_5.jpg'
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
        storyTapLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex - 1);
        });
    }
    if (storyTapRight) {
        storyTapRight.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlideIndex + 1);
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && storyViewer && storyViewer.classList.contains('active')) {
            closeStory();
        }
    });

    // ─── Scroll listener ───
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNavState();
                updateStickyHeader();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ─── Initial ───
    updateScrollProgress();
    updateNavState();
    updateStickyHeader();
    applyFilters();

})();
