---
brand: "Nikitha Portfolio"
philosophy: "Minimalist layout meeting custom hand-drawn, sketchy organic vector lines"
colors:
  background: "#FFFFFF"
  background_secondary: "#F0F2F2"
  background_accent: "#D1EBEB"
  text_primary: "#333333"
  text_secondary: "#555555"
  brand_accent: "#0B3C58"
  success_accent: "#11530D"
  primary_accent: "#F5A623"
  hover_accent: "#FF7A00"
typography:
  display_font: "Inter, sans-serif"
  code_font: "Space Mono, monospace"
  handwritten_font: "Nothing You Could Do, cursive"
  weights:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
    extrabold: 800
    heavy: 900
layout:
  breakpoints:
    mobile: "768px"
---

# DESIGN.md — Nikitha C's Scrollytelling Portfolio

This file serves as the design system specification and AI "source of truth" for Nikitha C's Portfolio website, conforming to the `awesome-design-md` format standard.

---

## 1. Brand & Philosophy

The portfolio blends digital design precision with hand-drawn, sketchy organic graphics, creating a visual balance between code structure and creative art:
* **Organic Hand-Drawn Highlights**: Wobbly sketchy phone bezels and loose polaroid frames soften the layouts.
* **Scroll-Driven Narrative**: Smooth, scroll-triggered visual transformations (fixed phone screen swaps, scroll fades, scrolly comic tracks).
* **Delightful Details**: Interactive live clock, responsive download resume indicators, and seamlessly blended milestone grids.

---

## 2. Colors

Detailed design tokens for backgrounds, text layers, and accents:

* **Background Layer (`#FFFFFF`)**: Primary page canvas and negative spacing.
* **Secondary Surface (`#F0F2F2`)**: Soft grey frame backing the interactive hero video.
* **Accent Surface (`#D1EBEB`)**: Pastel mint-blue container background for the Pots showcase card.
* **Primary Text (`#333333`)**: Body copy, title headers, and dark interface grids.
* **Secondary Accent (`#555555`)**: Used for organic phone and polaroid sketch lines.
* **Cozy Amber/Orange (`#F5A623` / `--accent`)**: The primary brand accent color. Applied to the top scroll progress bar, navigation hover lines, logo hover states, active scroll dots, and typewriter blinking cursor.
* **Vivid Orange (`#FF7A00`)**: The active interaction color. Applied as a vibrant background transition on navigation CTA and secondary outline buttons during hover states.
* **Brand Navy (`#0B3C58`)**: High-contrast blue used for links and secondary project badges.
* **Milestone Green (`#11530D`)**: Forest green used for active roadmap markers and checklist icons.

---

## 3. Typography

Clean editorial readability paired with structured code-like details and loose handwriting:

* **Display (`Inter`)**: Primary interface font family. Spans weights `300` (light) up to `900` (heavy) for tight, bold headings and legible editorial grids.
* **Data Monospace (`Space Mono`)**: Used for the clock, page breadcrumbs, and tags. Lends a digital precision to structural details.
* **Script Handwriting (`Nothing You Could Do`)**: Strictly dedicated to polaroid handwritten descriptions, giving a warm personal signature.

---

## 4. Components

### 4.1. The Sticky Scrolly Phone
- **Bezel**: Hand-drawn sketchy SVG path overlay (`.phone-sketch-overlay`) containing `fill-rule="evenodd"` to block out corners.
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

---

## 5. Responsive Guardrails (Do's and Don'ts)

* **Do**: Preserve clean URLs by keeping `index.html`, `about.html`, and `pots.html` strictly in the root directory.
* **Do**: Use `assets/images/`, `assets/svgs/`, and `assets/videos/` folders to house all static assets.
* **Do**: Automatically transition sticky, fix-positioned side columns on desktop to stack-scrolling cards on screens `≤ 768px`.
* **Don't**: Introduce drop-shadows or solid borders on the phone screens; keep the wobbly vector overlay as the organic boundary.
