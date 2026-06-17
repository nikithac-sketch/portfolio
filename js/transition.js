/* ============================================
   PAGE TRANSITION OVERLAY SCRIPT
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Check if we need to perform a radial reveal
        const transitionType = sessionStorage.getItem('page-transition-type');
        const transitionColor = sessionStorage.getItem('page-transition-color') || '#ff7a00';

        if (transitionType === 'radial-reveal') {
            sessionStorage.removeItem('page-transition-type');
            sessionStorage.removeItem('page-transition-color');

            // Create radial reveal overlay
            const revealOverlay = document.createElement('div');
            revealOverlay.className = 'radial-reveal-overlay';
            revealOverlay.style.backgroundColor = transitionColor;
            document.body.prepend(revealOverlay);

            // Animate it shrinking radially to reveal the page contents
            requestAnimationFrame(() => {
                setTimeout(() => {
                    revealOverlay.classList.add('reveal-active');
                }, 50);
            });

            // Clean up DOM after animation completes
            setTimeout(() => {
                revealOverlay.remove();
            }, 900);
        }

        // Intercept link clicks for VIEW PROJECT buttons
        document.addEventListener('click', (e) => {
            let target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
            }

            if (target && target.tagName === 'A') {
                const href = target.getAttribute('href');

                // We only intercept if it's the VIEW PROJECT button (has class 'project-cta')
                if (
                    target.classList.contains('project-cta') &&
                    href &&
                    !href.startsWith('#') &&
                    !href.startsWith('mailto:') &&
                    !href.startsWith('tel:') &&
                    target.getAttribute('target') !== '_blank' &&
                    !e.metaKey &&
                    !e.ctrlKey
                ) {
                    e.preventDefault();

                    // Calculate center of clicked button
                    const rect = target.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    // Create expanding circle
                    const circle = document.createElement('div');
                    circle.className = 'expanding-transition-circle';
                    circle.style.left = x + 'px';
                    circle.style.top = y + 'px';
                    circle.style.backgroundColor = '#ff7a00'; // Orange color
                    document.body.appendChild(circle);

                    // Save session storage info for the destination page
                    sessionStorage.setItem('page-transition-type', 'radial-reveal');
                    sessionStorage.setItem('page-transition-color', '#ff7a00');

                    // Animate scaling up to cover the entire viewport diagonal
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    const diagonal = Math.sqrt(w * w + h * h);
                    const targetScale = Math.ceil(diagonal / 5) + 10; // safety padding

                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            circle.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
                        }, 20);
                    });

                    // Navigate after animation completes
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600);
                }
            }
        });
    });
})();
