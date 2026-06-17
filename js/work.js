/* ============================================
   WORK PAGE — Filter & Interactions
   ============================================ */

(function () {
    'use strict';

    // ─── DOM ───
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const scrollProgress = document.getElementById('scrollProgress');
    const workGrid = document.getElementById('workGrid');
    const workEmpty = document.getElementById('workEmpty');
    const filterClearBtn = document.getElementById('filterClear');
    const emptyClearBtn = document.getElementById('emptyClear');
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('workFilters');

    const allCards = workGrid ? Array.from(workGrid.querySelectorAll('.work-card')) : [];
    const allCheckboxes = filtersPanel ? Array.from(filtersPanel.querySelectorAll('input[type="checkbox"]')) : [];

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
        if (scrollProgress) scrollProgress.style.width = progress + '%';
    }

    // ─── Nav State ───
    function updateNavState() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
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

        allCards.forEach((card, i) => {
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

    // Sticky header DOM reference
    const workStickyHeader = document.getElementById('workStickyHeader');
    function updateStickyHeader() {
        if (workStickyHeader) {
            workStickyHeader.classList.toggle('is-sticky', window.scrollY > 40);
        }
    }

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

    // ─── Stagger entrance animation ───
    allCards.forEach((card, i) => {
        card.style.animationDelay = (i * 80) + 'ms';
        card.classList.add('card-enter');
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
