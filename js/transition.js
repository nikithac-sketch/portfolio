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
        } else {
            // Standard slide-out transition for normal page loads
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

            requestAnimationFrame(() => {
                setTimeout(() => {
                    overlay.classList.add('transition-out');
                }, 50);
            });

            // Clean up DOM
            setTimeout(() => {
                overlay.remove();
            }, 700);
        }

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            let target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
            }

            if (target && target.tagName === 'A') {
                const href = target.getAttribute('href');

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

                    // If it is a VIEW PROJECT CTA, do the expanding orange circle bleed
                    if (target.classList.contains('project-cta')) {
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
                    } else {
                        // Standard page slide-in transition
                        const overlay = document.createElement('div');
                        overlay.className = 'page-transition-overlay transition-in';
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

                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                overlay.style.transform = 'translateY(0)';
                                overlay.style.opacity = '1';
                            }, 20);
                        });

                        setTimeout(() => {
                            window.location.href = href;
                        }, 550);
                    }
                }
            }
        });
    });
})();
