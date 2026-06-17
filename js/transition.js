/* ============================================
   PAGE TRANSITION OVERLAY SCRIPT
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // 1. Create page transition overlay dynamically
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.id = 'pageTransitionOverlay';
        overlay.innerHTML = `
            <div class="transition-card">
                <svg class="transition-sketch-border" viewBox="0 0 320 220" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 10,2 C 60,1.5 260,2.5 310,2 C 315,2 318,5 318,10 C 317,40 319,170 318,200 C 318,205 315,208 310,208 C 260,207 60,209 10,208 C 5,208 2,205 2,200 C 3,170 1,40 2,10 C 2,5 5,2 10,2 Z" />
                </svg>
                <div class="transition-content">
                    <img src="assets/Highlights-by-Outdraw-Design/12_Doodles/Doodle 2.svg" class="transition-doodle" alt="Loading doodle">
                    <div class="transition-text" id="transitionText">sketching layout...</div>
                </div>
            </div>
        `;
        document.body.prepend(overlay);

        // 2. Transition OUT once page is ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                overlay.classList.add('transition-out');
            }, 50);
        });

        // 3. Intercept internal page links to slide overlay IN before navigating
        document.addEventListener('click', (e) => {
            let target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
            }

            if (target && target.tagName === 'A') {
                const href = target.getAttribute('href');

                // Only transition if navigating to a separate local html file (not hash links, not external links, not new tabs)
                if (
                    href &&
                    !href.startsWith('#') &&
                    !href.startsWith('mailto:') &&
                    !href.startsWith('tel:') &&
                    target.getAttribute('target') !== '_blank' &&
                    !e.metaKey &&
                    !e.ctrlKey
                ) {
                    e.preventDefault();
                    overlay.classList.remove('transition-out');
                    overlay.classList.add('transition-in');

                    // Navigate after the overlay finishes sliding in
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                }
            }
        });
    });
})();
