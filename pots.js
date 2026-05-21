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

    updateScrollProgress();
    updateNavState();

    // ─── Interactive Savings Simulator ───
    const simSlider = document.getElementById('savingAmountRange');
    const amountDisplay = document.getElementById('amountDisplay');
    const simProgressBar = document.getElementById('simProgressBar');
    const checkpoints = document.querySelectorAll('.checkpoint');
    const simStatus = document.getElementById('simStatus');

    if (simSlider) {
        simSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            
            // 1. Update text display with commas
            amountDisplay.textContent = `$${val.toLocaleString()}`;
            
            // 2. Set bar percentage width
            const pct = (val / 25000) * 100;
            simProgressBar.style.width = `${pct}%`;
            
            // 3. Highlight milestones
            checkpoints.forEach(cp => {
                const cpVal = parseInt(cp.getAttribute('data-val'), 10);
                if (val >= cpVal) {
                    cp.classList.add('active');
                } else {
                    cp.classList.remove('active');
                }
            });

            // 4. Update status messages dynamically
            if (val === 0) {
                simStatus.textContent = "Slide the control to start simulating your savings!";
                simStatus.style.color = 'var(--text-secondary)';
            } else if (val < 5000) {
                simStatus.textContent = "🌱 Starting small! Just unlocked your first milestone.";
                simStatus.style.color = 'var(--text)';
            } else if (val < 12500) {
                simStatus.textContent = "🚂 Halfway there! The train is picking up speed along the track.";
                simStatus.style.color = 'var(--text)';
            } else if (val < 25000) {
                simStatus.textContent = "✨ Incredible! Almost at your ultimate saving goal.";
                simStatus.style.color = 'var(--text)';
            } else {
                simStatus.textContent = "🎉 GOAL ACHIEVED! $25,000 saved! Confetti & milestone completely unlocked!";
                simStatus.style.color = '#22c55e'; // Green highlight for win state
            }
        });

        // Trigger initial slider state
        simSlider.dispatchEvent(new Event('input'));
    }

})();
