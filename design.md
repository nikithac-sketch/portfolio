---
brand: "Nikitha Portfolio"
philosophy: "Minimalist layout meeting custom hand-drawn, sketchy organic vector lines"
colors:
  background: "#FFFFFF"
  background_secondary: "#F6F5F2"
  background_accent: "#D1EBEB"
  text_primary: "#0D0D0D"
  text_secondary: "#5A5A5A"
  border_stroke: "#555555"
  brand_accent: "#0B3C58"
  success_accent: "#11530D"
  primary_accent: "#F5A623"
  hover_accent: "#FF7A00"
typography:
  display_font: "Instrument Sans, sans-serif"
  code_font: "Space Mono, monospace"
  handwritten_font: "Permanent Marker, cursive"
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
layout:
  breakpoints:
    mobile: "768px"
---

# DESIGN.md — Nikitha C's Scrollytelling Portfolio

This file serves as the design system specification and AI "source of truth" for Nikitha C's Portfolio website, conforming to the `awesome-design-md` format standard.

---

## 1. Brand & Philosophy

The portfolio blends digital design precision with hand-drawn, sketchy organic graphics, creating a visual balance between code structure and creative art:
* **Organic Hand-Drawn Highlights**: Wobbly sketchy phone bezels and loose polaroid frames soften the layouts. All organic underlines, loops, blobs, whirls, doodles, arrows, and path styles are derived from the official **`Highlights-by-Outdraw-Design`** illustration library located in `assets/Highlights-by-Outdraw-Design/`.
* **Scroll-Driven Narrative**: Smooth, scroll-triggered visual transformations (fixed phone screen swaps, scroll fades, scrolly comic tracks).
* **Delightful Details**: Interactive live clock, responsive download resume indicators, and seamlessly blended milestone grids.

---

## 2. Colors

Detailed design tokens for backgrounds, text layers, and accents:

* **Background Layer (`#FFFFFF`)**: Primary page canvas and negative spacing.
* **Secondary Surface (`#F6F5F2`)**: Cozy grey-white surface backing phone screens, polaroid frames, and background layout blocks.
* **Accent Surface (`#D1EBEB`)**: Pastel mint-blue container background for the Pots showcase card.
* **Primary Text (`#0D0D0D`)**: Near black body copy, title headers, and dark interface grids.
* **Secondary Text (`#5A5A5A`)**: Subtle slate grey used for secondary descriptors, tags, and paragraph preludes.
* **Border & Sketch Stroke (`#555555`)**: Charcoal grey dedicated to sketchy organic phone overlays, polaroid hand-drawn frames, and modular borders.
* **Cozy Amber/Orange (`#F5A623` / `--accent`)**: The primary brand accent color. Applied to the top scroll progress bar, navigation hover lines, logo hover states, active scroll dots, and typewriter blinking cursor.
* **Vivid Orange (`#FF7A00`)**: The active interaction color. Applied as a vibrant background transition on navigation CTA and secondary outline buttons during hover states.
* **Brand Navy (`#0B3C58`)**: High-contrast blue used for links and secondary project badges.
* **Milestone Green (`#11530D`)**: Forest green used for active roadmap markers and checklist icons.

---

## 3. Typography

Clean editorial readability paired with structured code-like details and loose handwriting:

* **Display (`Instrument Sans`)**: Primary interface font family. Spans weights `400` (regular) up to `700` (bold) for tight, distinct headings and legible editorial grids.
  - *Outline Letter-Spacing*: Outlined headers (`.text-outline`) use a positive letter-spacing of `0.04em` (overriding the default heading spacing of `-0.03em`) to prevent adjacent characters' outline strokes from intersecting or overlapping, ensuring a clean, hollow aesthetic.
* **Data Monospace (`Space Mono`)**: Used for the clock, page breadcrumbs, and tags. Lends a digital precision to structural details.
* **Script Handwriting (`Permanent Marker`)**: Strictly dedicated to polaroid handwritten descriptions, giving a bold marker signature.

---

## 4. Components

### 4.1. The Sticky Scrolly Phone
- **Bezel**: Hand-drawn sketchy SVG path overlay (`.phone-sketch-overlay`) containing `fill-rule="evenodd"` to block out corners. The outlines and control points are explicitly derived from the vector paths of the **`07_Lines`** library collection to maintain consistent wobbliness and hand-crafted weight.
- **Screen**: Centered viewport (`.phone-screen`) masking smooth, scrolling-triggered active image transitions.
- **Behavior**: As sections scroll, an `IntersectionObserver` matches viewport position to toggle active screen layers seamlessly.

### 4.2. Timeline Edge Masks
- **Container Mask**: Left and right side horizontal fade to dissolve sharp boundary cuts:
  ```css
  mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
  ```
- **SVG Track Fade**: A linear gradient (`paint_active_fade` from `x=360` to `x=520`) softens the active progress bar at the viewBox bounds.

### 4.3. Horizontal Scrolly Comic
- **Track**: Anchored sticky inside a scroll depth of `350vh`.
- **Logic**: Converts vertical scroll progress into a seamless `translateX` layout shift, moving panels left-to-right.

### 4.4. Hand-Drawn CTA Buttons
- **Shape & Border**: Wobbly rectangular single-stroke outline using path coordinate rounding to keep corners slightly curved, styled via custom responsive SVG overlay (`.cta-sketch-border` or `.nav-sketch-border`).
- **Solid Canvas & Dark Fills**: Default primary project buttons use a solid `#ffffff` background inside the wobbly path fill. The contact submit button (`.cta-dark-btn`) and navigation contact button (`.nav-btn-wobbly`) are unified to use solid black path fills (`fill: var(--text);` or `fill: #000000;`) with white text.
- **Accents & Arrows**: Primary white buttons utilize standard horizontal arrow icons (`Arrow 5.svg`) or vertical down arrow icons (`Arrow 17.svg`) selected directly from the **`01_Arrows`** library.
- **Interactive Transitions**: On hover, all buttons dynamically fill and outline with vivid orange (`#ff7a00`), with text/arrows transitioning smoothly to white.
### 4.5. Hand-Drawn Contact Section
- **Containers & Form**: Replaced regular solid CSS borders on `.contact-card` and `.connect-form` with wobbly rectangular vector SVG overlays (`.card-sketch-border` and `.form-sketch-border`) to continue the organic hand-drawn aesthetic. Background solidness (`#ffffff`) is preserved inside the wobbly path fills.
- **Unclamped Boundaries**: Applied `overflow: visible;` in CSS to contact cards and forms, letting sketchy lines wobble organically outside parent bounding limits.
- **Interactive States**: Hovering over `.contact-card` dynamically transitions the vector card outline stroke to `--accent` and changes the interior path fill to a subtle amber tint (`rgba(245,166,35,0.04)`).
- **Sketchy Icons**: Small icon boxes utilize wobbly square SVG outline masks (`.icon-sketch-border`) that fill with orange on hover. The core SVG icons (phone, mail, LinkedIn) feature custom-drawn wobbly paths to achieve unified, sketchy vector line quality.

---

## 5. Responsive Guardrails (Do's and Don'ts)

* **Do**: Preserve clean URLs by keeping `index.html`, `about.html`, and `pots.html` strictly in the root directory.
* **Do**: Use `assets/images/`, `assets/svgs/`, and `assets/videos/` folders to house all static assets. Store the **`Highlights-by-Outdraw-Design`** asset library in its dedicated root under `assets/Highlights-by-Outdraw-Design/`.
* **Do**: Derive the hand-drawn contours for phone bezels, polaroid frames, and custom highlights directly from the stroke styles of the **`Highlights-by-Outdraw-Design`** library (specifically `07_Lines` and `02_Underlines`) to preserve visual alignment.
* **Do**: Automatically transition sticky, fix-positioned side columns on desktop to stack-scrolling cards on screens `≤ 768px`.
* **Don't**: Introduce drop-shadows or solid borders on the phone screens; keep the wobbly vector overlay as the organic boundary.
