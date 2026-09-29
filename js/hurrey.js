/**
 * hurrey.js — Page-specific JS for hurrey.html (Hurrey Library UX Case Study)
 */

(function () {
    'use strict';

    /* ── Scroll progress bar ── */
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }, { passive: true });
    }

    /* ── Clock ── */
    function updateClocks() {
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const navClock = document.getElementById('navClock');
        const mobileClock = document.getElementById('mobileClock');
        if (navClock) navClock.textContent = time;
        if (mobileClock) mobileClock.textContent = time;
    }
    updateClocks();
    setInterval(updateClocks, 1000);

    /* ── Mobile nav toggle ── */
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

    /* ── Nav scroll hide/show ── */
    const nav = document.getElementById('nav');
    let lastScrollY = 0;
    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 80) {
                nav.classList.toggle('nav--hidden', currentScrollY > lastScrollY);
            } else {
                nav.classList.remove('nav--hidden');
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /* ── Scroll reveal (IntersectionObserver) ── */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if (revealEls.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    /* ── Final designs tab switcher ── */
    const tabButtons = document.querySelectorAll('.hl-screen-tab');
    const screenGroups = document.querySelectorAll('.hl-screen-group');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.group;

            // Update active button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active group
            screenGroups.forEach(g => {
                const isActive = g.dataset.group === group;
                g.classList.toggle('active', isActive);
                if (isActive) {
                    g.querySelectorAll('img').forEach(img => {
                        img.style.opacity = '1';
                    });
                }
            });
        });
    });

    /* ── Lazy-load images with IntersectionObserver fade-in ── */
    const allImgs = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.complete) {
                        img.style.opacity = '1';
                    } else {
                        img.addEventListener('load', () => { img.style.opacity = '1'; }, { once: true });
                    }
                    imgObserver.unobserve(img);
                }
            });
        }, { threshold: 0.05 });

        allImgs.forEach(img => imgObserver.observe(img));
    } else {
        allImgs.forEach(img => { img.style.opacity = '1'; });
    }

})();
