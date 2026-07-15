/* ============================================
   ABOUT ME PORTFOLIO — Script
   ============================================ */

(function () {
    'use strict';

    // ─── DOM Elements ───
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('nav');
    const navClock = document.getElementById('navClock');
    const mobileClock = document.getElementById('mobileClock');
    const resumeBtn = document.getElementById('resumeBtn');

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

    // ─── Throttled Scroll Listener ───
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

    // ─── Initial Runs ───
    updateScrollProgress();
    updateNavState();

    // ─── Interactive Resume Button Mockup ───
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            const originalHTML = resumeBtn.innerHTML;
            
            // Success animation
            resumeBtn.innerHTML = `RESUME DOWNLOADED! ✓`;
            resumeBtn.style.color = '#22c55e';
            resumeBtn.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                resumeBtn.innerHTML = originalHTML;
                resumeBtn.style.color = '';
                resumeBtn.style.borderColor = '';
            }, 3000);
        });
    }

    // ─── Polaroid Image Cycling on Hover ───
    const polaroidFrame = document.querySelector('.polaroid-frame');
    const polaroidImg = polaroidFrame ? polaroidFrame.querySelector('.char-img') : null;
    const polaroidCaption = polaroidFrame ? polaroidFrame.querySelector('.polaroid-caption') : null;

    if (polaroidFrame && polaroidImg && polaroidCaption) {
        const hashIcon = '<img src="assets/Highlights-by-Outdraw-Design/11_Punctuation/Punctuation 1.svg" class="hashtag-icon" alt="#">';
        const hoverImages = [
            { src: 'assets/images/aboutMe/nikitha-polaroid.jpg?v=3', caption: hashIcon + 'goldenhour<br>' + hashIcon + 'office vibes' },
            { src: 'assets/images/aboutMe/nikitha-polaroid-2.jpg', caption: hashIcon + 'kathak<br>' + hashIcon + 'dancelife', zoom: 1.2, objectPosition: 'center 58%' },
            { src: 'assets/images/aboutMe/nikitha-polaroid-3.png', caption: hashIcon + 'nature walk<br>' + hashIcon + 'weekend vibes' },
            { src: 'assets/images/aboutMe/nikitha-polaroid-4.png', caption: hashIcon + 'cozy coffee<br>' + hashIcon + 'morning fuel' }
        ];

        // Preload cycling images to ensure instantaneous transition without browser layout flicker
        hoverImages.forEach(imgData => {
            const tempImg = new Image();
            tempImg.src = imgData.src;
        });

        let currentImageIndex = 0;
        let isTransitioning = false;

        polaroidFrame.addEventListener('mouseenter', () => {
            if (isTransitioning) return;
            isTransitioning = true;

            // Increment index
            currentImageIndex = (currentImageIndex + 1) % hoverImages.length;
            const nextData = hoverImages[currentImageIndex];

            // Trigger sleek transition out
            polaroidImg.classList.add('polaroid-switching');
            polaroidCaption.classList.add('polaroid-switching');

            setTimeout(() => {
                polaroidImg.src = nextData.src;
                polaroidCaption.innerHTML = nextData.caption;

                // Apply per-image zoom and position framing
                polaroidImg.style.transform = nextData.zoom ? `scale(${nextData.zoom})` : '';
                polaroidImg.style.objectPosition = nextData.objectPosition || '';

                // When image is bound and loaded, trigger soft spring transition back in
                const handleLoad = () => {
                    polaroidImg.classList.remove('polaroid-switching');
                    polaroidCaption.classList.remove('polaroid-switching');
                    isTransitioning = false;
                    polaroidImg.removeEventListener('load', handleLoad);
                };
                
                if (polaroidImg.complete) {
                    handleLoad();
                } else {
                    polaroidImg.addEventListener('load', handleLoad);
                }

                // Safety timeout fallback
                setTimeout(() => {
                    if (isTransitioning) {
                        polaroidImg.classList.remove('polaroid-switching');
                        polaroidCaption.classList.remove('polaroid-switching');
                        isTransitioning = false;
                    }
                }, 150);
            }, 180);
        });
    }
})();
