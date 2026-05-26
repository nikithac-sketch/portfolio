/* ============================================
   MORPH ANIMATION — Smartphone ↔ Die ↔ Magnifying Glass
   Hand-drawn ink line art, seamless loop
   ============================================ */

(function () {
    'use strict';

    const canvas = document.getElementById('morphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;   // 280
    const H = canvas.height;  // 280
    const CX = W / 2;
    const CY = H / 2;

    // ─── Shape Definitions ───
    // Each shape: { outline: [[x,y]...], details: [{ type, points/center/radius }] }
    // All outlines have exactly 24 points, normalized to canvas coords.

    function phoneShape() {
        const x1 = 95, x2 = 185, top = 30, bot = 250, r = 14;
        const pts = [];
        // Top edge (left to right)
        pts.push([x1 + r, top]);
        pts.push([x1 + 30, top]);
        pts.push([CX, top]);
        pts.push([x2 - 30, top]);
        pts.push([x2 - r, top]);
        // Top-right corner
        pts.push([x2, top + r]);
        // Right edge
        pts.push([x2, top + 50]);
        pts.push([x2, top + 90]);
        pts.push([x2, CY]);
        pts.push([x2, CY + 40]);
        pts.push([x2, bot - 50]);
        pts.push([x2, bot - r]);
        // Bottom-right corner
        pts.push([x2 - r, bot]);
        // Bottom edge (right to left)
        pts.push([x2 - 30, bot]);
        pts.push([CX, bot]);
        pts.push([x1 + 30, bot]);
        pts.push([x1 + r, bot]);
        // Bottom-left corner
        pts.push([x1, bot - r]);
        // Left edge (bottom to top)
        pts.push([x1, bot - 50]);
        pts.push([x1, CY + 40]);
        pts.push([x1, CY]);
        pts.push([x1, top + 90]);
        pts.push([x1, top + 50]);
        pts.push([x1, top + r]);
        return pts;
    }

    function dieShape() {
        const s = 82; // half-size
        const cx = CX, cy = CY;
        const r = 20;
        const pts = [];
        // Top edge
        pts.push([cx - s + r, cy - s]);
        pts.push([cx - s + 40, cy - s]);
        pts.push([cx, cy - s]);
        pts.push([cx + s - 40, cy - s]);
        pts.push([cx + s - r, cy - s]);
        // Top-right corner
        pts.push([cx + s, cy - s + r]);
        // Right edge
        pts.push([cx + s, cy - s + 40]);
        pts.push([cx + s, cy - s + 65]);
        pts.push([cx + s, cy]);
        pts.push([cx + s, cy + s - 65]);
        pts.push([cx + s, cy + s - 40]);
        pts.push([cx + s, cy + s - r]);
        // Bottom-right corner
        pts.push([cx + s - r, cy + s]);
        // Bottom edge
        pts.push([cx + s - 40, cy + s]);
        pts.push([cx, cy + s]);
        pts.push([cx - s + 40, cy + s]);
        pts.push([cx - s + r, cy + s]);
        // Bottom-left corner
        pts.push([cx - s, cy + s - r]);
        // Left edge
        pts.push([cx - s, cy + s - 40]);
        pts.push([cx - s, cy + s - 65]);
        pts.push([cx - s, cy]);
        pts.push([cx - s, cy - s + 65]);
        pts.push([cx - s, cy - s + 40]);
        pts.push([cx - s, cy - s + r]);
        return pts;
    }

    function glassShape() {
        const cx = CX - 15, cy = CY - 25;
        const r = 70;
        const pts = [];
        const steps = 18;
        // Circle portion (18 points around the lens)
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
            pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
        }
        // Handle (6 points): extends from bottom-right of circle down-right
        const hx = cx + r * 0.55, hy = cy + r * 0.7;
        pts.push([hx + 8, hy + 8]);
        pts.push([hx + 22, hy + 28]);
        pts.push([hx + 35, hy + 50]);
        pts.push([hx + 28, hy + 55]);
        pts.push([hx + 12, hy + 32]);
        pts.push([hx - 2, hy + 12]);
        return pts;
    }

    const shapes = [phoneShape(), dieShape(), glassShape()];

    // ─── Detail definitions (interior elements) ───
    // Phone: screen rect + home button
    // Die: dots
    // Glass: inner circle + shine line
    const details = [
        // Phone details
        {
            screen: { x: 108, y: 65, w: 64, h: 120, r: 4 },
            button: { cx: CX, cy: 232, r: 8 },
            speaker: { cx: CX, cy: 48, w: 30, h: 3 }
        },
        // Die details: 6 dots in standard layout
        {
            dots: [
                { cx: CX - 30, cy: CY - 30 },
                { cx: CX + 30, cy: CY - 30 },
                { cx: CX - 30, cy: CY },
                { cx: CX + 30, cy: CY },
                { cx: CX - 30, cy: CY + 30 },
                { cx: CX + 30, cy: CY + 30 }
            ]
        },
        // Magnifying glass details
        {
            innerCircle: { cx: CX - 15, cy: CY - 25, r: 50 },
            shine: { x1: CX - 42, y1: CY - 58, x2: CX - 28, y2: CY - 65 }
        }
    ];

    // ─── Animation State ───
    let currentIdx = 0;
    let phase = 'hold';   // 'hold' or 'morph'
    let phaseStart = 0;
    const HOLD_MS = 1800;
    const MORPH_MS = 1400;

    // ─── Easing ───
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // ─── Interpolation ───
    function lerp(a, b, t) { return a + (b - a) * t; }

    function lerpPoints(src, dst, t) {
        return src.map((p, i) => [lerp(p[0], dst[i][0], t), lerp(p[1], dst[i][1], t)]);
    }

    // ─── Hand-drawn jitter ───
    let seed = 42;
    function seededRandom() {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    function jitter(val, amount) {
        return val + (seededRandom() - 0.5) * amount;
    }

    // ─── Draw smooth closed curve through points ───
    function drawOutline(points, jitterAmt) {
        const n = points.length;
        ctx.beginPath();

        // Use Catmull-Rom → cubic bezier conversion for smooth curves
        for (let i = 0; i < n; i++) {
            const p0 = points[(i - 1 + n) % n];
            const p1 = points[i];
            const p2 = points[(i + 1) % n];
            const p3 = points[(i + 2) % n];

            const cp1x = jitter(p1[0] + (p2[0] - p0[0]) / 6, jitterAmt);
            const cp1y = jitter(p1[1] + (p2[1] - p0[1]) / 6, jitterAmt);
            const cp2x = jitter(p2[0] - (p3[0] - p1[0]) / 6, jitterAmt);
            const cp2y = jitter(p2[1] - (p3[1] - p1[1]) / 6, jitterAmt);

            if (i === 0) {
                ctx.moveTo(jitter(p1[0], jitterAmt), jitter(p1[1], jitterAmt));
            }
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y,
                jitter(p2[0], jitterAmt), jitter(p2[1], jitterAmt));
        }
        ctx.closePath();
    }

    // ─── Draw details with fade ───
    function drawPhoneDetails(alpha, jitterAmt) {
        if (alpha <= 0) return;
        const d = details[0];
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#0d0d0d';
        ctx.lineWidth = 3;

        // Screen
        const { x, y, w, h, r } = d.screen;
        ctx.beginPath();
        ctx.moveTo(jitter(x + r, jitterAmt), jitter(y, jitterAmt));
        ctx.lineTo(jitter(x + w - r, jitterAmt), jitter(y, jitterAmt));
        ctx.quadraticCurveTo(x + w, y, jitter(x + w, jitterAmt), jitter(y + r, jitterAmt));
        ctx.lineTo(jitter(x + w, jitterAmt), jitter(y + h - r, jitterAmt));
        ctx.quadraticCurveTo(x + w, y + h, jitter(x + w - r, jitterAmt), jitter(y + h, jitterAmt));
        ctx.lineTo(jitter(x + r, jitterAmt), jitter(y + h, jitterAmt));
        ctx.quadraticCurveTo(x, y + h, jitter(x, jitterAmt), jitter(y + h - r, jitterAmt));
        ctx.lineTo(jitter(x, jitterAmt), jitter(y + r, jitterAmt));
        ctx.quadraticCurveTo(x, y, jitter(x + r, jitterAmt), jitter(y, jitterAmt));
        ctx.closePath();
        ctx.stroke();

        // Home button
        ctx.beginPath();
        ctx.arc(d.button.cx, d.button.cy, d.button.r, 0, Math.PI * 2);
        ctx.stroke();

        // Speaker slit
        ctx.beginPath();
        ctx.moveTo(d.speaker.cx - d.speaker.w / 2, d.speaker.cy);
        ctx.lineTo(d.speaker.cx + d.speaker.w / 2, d.speaker.cy);
        ctx.stroke();

        ctx.restore();
    }

    function drawDieDetails(alpha, jitterAmt) {
        if (alpha <= 0) return;
        const d = details[1];
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#0d0d0d';

        d.dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(jitter(dot.cx, jitterAmt * 0.5), jitter(dot.cy, jitterAmt * 0.5), 8, 0, Math.PI * 2);
            ctx.fill();
        });

        // Cross lines for 3D cube feel
        ctx.strokeStyle = '#0d0d0d';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(CX - 82, CY);
        ctx.lineTo(CX + 82, CY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(CX, CY - 82);
        ctx.lineTo(CX, CY + 82);
        ctx.stroke();

        ctx.restore();
    }

    function drawGlassDetails(alpha, jitterAmt) {
        if (alpha <= 0) return;
        const d = details[2];
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#0d0d0d';
        ctx.lineWidth = 2.5;

        // Inner circle
        ctx.beginPath();
        ctx.arc(d.innerCircle.cx, d.innerCircle.cy, d.innerCircle.r, 0, Math.PI * 2);
        ctx.stroke();

        // Shine highlight
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(d.innerCircle.cx - 12, d.innerCircle.cy - 15, 25, -2.2, -1.2);
        ctx.stroke();

        ctx.restore();
    }

    const detailDrawers = [drawPhoneDetails, drawDieDetails, drawGlassDetails];

    // ─── Main Render ───
    function render(timestamp) {
        if (!phaseStart) phaseStart = timestamp;
        const elapsed = timestamp - phaseStart;

        // Reset jitter seed each frame for consistency
        seed = Math.floor(timestamp / 120) * 7 + 42;

        ctx.clearRect(0, 0, W, H);

        let pts, detailAlphaCurr = 1, detailAlphaNext = 0;
        let nextIdx = (currentIdx + 1) % shapes.length;

        if (phase === 'hold') {
            pts = shapes[currentIdx];
            detailAlphaCurr = 1;
            detailAlphaNext = 0;

            if (elapsed >= HOLD_MS) {
                phase = 'morph';
                phaseStart = timestamp;
            }
        } else {
            const rawT = Math.min(elapsed / MORPH_MS, 1);
            const t = easeInOutCubic(rawT);
            pts = lerpPoints(shapes[currentIdx], shapes[nextIdx], t);
            detailAlphaCurr = Math.max(0, 1 - rawT * 3);      // fade out fast
            detailAlphaNext = Math.max(0, (rawT - 0.7) * 3.3); // fade in late

            if (rawT >= 1) {
                currentIdx = nextIdx;
                phase = 'hold';
                phaseStart = timestamp;
            }
        }

        const jitterAmt = 1.8;

        // Draw main outline
        ctx.strokeStyle = '#0d0d0d';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawOutline(pts, jitterAmt);
        ctx.stroke();

        // Draw details
        detailDrawers[currentIdx](detailAlphaCurr, jitterAmt);
        if (phase === 'morph') {
            detailDrawers[nextIdx](detailAlphaNext, jitterAmt);
        }

        requestAnimationFrame(render);
    }

    // Start after hero reveal animation
    setTimeout(() => requestAnimationFrame(render), 600);
})();
