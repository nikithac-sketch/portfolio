# Design System & Creative Philosophy — Nikitha's Portfolio

This document outlines the design architecture, typography, color palettes, responsive layout principles, and interactive components that define the user experience of **Nikitha C's Scrollytelling Portfolio**.

---

## 1. Creative Concept & Philosophy

The portfolio is designed as an interactive, narratively-driven experience ("Scrollytelling") that merges a clean, minimalist layout with custom **hand-drawn, sketchy vector elements**. 

### Key Tenets:
- **Art Meets Code**: Precise typography and digital layouts contrasted with organic, sketchy borders (e.g., wobbly phone bezels, hand-drawn polaroid frames).
- **Responsive Motion**: Subtle scroll-based transitions (scroll reveals, scrolly phone screen updates, horizontal-scrolling comic strip).
- **Playful UX Details**: Inclusion of real-time local clock, interactive custom resume buttons, and delightful milestone timelines.

---

## 2. Typography

We use Google Fonts to establish a hierarchy that balances clean editorial readability with a code-like, structured feel:

| Font Family | Applied To | Weights / Styles | Rationale |
| :--- | :--- | :--- | :--- |
| **Inter** | Headings, Body Text, Navigation, Project Titles | `300`, `400`, `500`, `600`, `700`, `800`, `900` | Elegant sans-serif providing extreme readability at both microscopic metadata scales and bold header sizes. |
| **Space Mono** | Live Clock, Prelude Tags, Metadata Labels | `400`, `700` | Monospaced face giving a code-inspired, mechanical precision to technical details. |
| **Nothing You Could Do** | Polaroid Captions (About Page) | `Regular` | A natural, handwritten script to give the profile sections an authentic, personal touch. |

---

## 3. Color System

A sleek, content-centric color palette designed for high contrast and organic feel.

```
┌────────────────────────────────────────────────────────┐
│  Backgrounds & Ground Colors                           │
│  █████████ #FFFFFF (Page background / White Space)     │
│  █████████ #F0F2F2 (Hero video showcase container)     │
│  █████████ #D1EBEB (Pots showcase soft gradient background) │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  Typography & Accents                                  │
│  █████████ #333333 (Core dark headers & body copy)      │
│  █████████ #555555 (Sketchy phone & polaroid borders)  │
│  █████████ #0B3C58 (Deep navy - Case study links)      │
│  █████████ #11530D (Forest green - Active milestones)   │
└────────────────────────────────────────────────────────┘
```

---

## 4. Key Interactive Components

### 4.1. Sticky Phone Scrollyteller (`index.html`)
- **Visuals**: A clean image screen container masked under a wobbly phone frame (`phone-sketch-overlay`) drawn with a custom `evenodd` SVG path fill to block out screen corners.
- **Interactions**: As the user scrolls through project text panels on the right, an `IntersectionObserver` swaps the active image (`img-pots.svg` ➔ `img-echoverse.png` ➔ `img-terraform.png`) on the left screen smoothly.

### 4.2. Timeline Edge Masks (`pots.html`)
- To avoid harsh timeline lines clipping at the edge of the showcase container, we use a CSS mask on the parent container (`.showcase-frame`):
  ```css
  mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
  ```
- Combined with a local SVG `<linearGradient>` on the active track line (`paint_active_fade` from `x=360` to `x=520`), this blends the timeline organically at both ends while keeping the milestone markers readable.

### 4.3. Scrolly Comic Strip (`pots.html`)
- A vertical scroll depth of `350vh` anchors a sticky horizontal track.
- Re-translates vertical page progress (`window.scrollY`) into horizontal shifts (`translateX`) of a beautiful, panel-by-panel comic strip describing design problems and loops.

---

## 5. Responsive Design Breaks

To preserve the scrollytelling phone layouts on small screens, our layout responds gracefully across devices:

> [!NOTE]
> - **Desktop (> 768px)**: Dual-column sticky scrolling showcase (left screen fixed, right content scrolls).
> - **Mobile (≤ 768px)**: Converts automatically to a stacked layout. Fixes the fixed-height phone container, translating it into elegant native scrolling cards so interaction is fast and lightweight.
