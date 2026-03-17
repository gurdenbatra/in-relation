# In Relation — Design Spec
*Conscious Walk Project · Berlin*
*Date: 2026-03-17*

---

## Overview

**In Relation** is a long-form scrollytelling website for a Berlin-based conscious walk project. It documents 12 completed urban walks and promotes upcoming ones. The experience is immersive — scroll-driven animations, floating clay 3D objects, layered photography, and narrative text combine to draw visitors into the sensory world of walking consciously through Berlin.

**Reference:** spring.site — heavy use of superposition, z-index layering, 3D objects, and scroll-triggered reveals.

---

## Design Language

### Mood
**Soft Naturalist** — cream/linen backgrounds, organic warmth, meditative pacing. Like a nature journal brought to life digitally.

### Palette
- Background: `#f5f0e8` (cream)
- Surface: `#ede8df` (warm linen)
- Text primary: `#2d2520` (near-black warm)
- Text secondary: `#7c6f5e` (warm grey)
- Accent: `#a08060` (sand/ochre)
- Accent warm: `#c8b89a` (tan)

### Typography
**Humanist Sans** throughout — system-ui / Inter. Weight contrast (300 light vs 700 bold) carries emotional emphasis. Uppercase small-caps labels with wide tracking for section identifiers.

### 3D Object Style
**Clay / Soft 3D** — rounded, smooth, pastel-toned objects rendered via React Three Fiber. Soft shadows, slightly subsurface-scattering look. Objects represent things found on Berlin urban walks: cobblestones, leaves, pigeons, bottles, street signs, benches. They float, rotate slowly, and react to scroll position.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 18 |
| 3D | React Three Fiber + @react-three/drei |
| Scroll animations | GSAP + ScrollTrigger |
| Component transitions | Framer Motion |
| Styling | Tailwind CSS |
| Image conversion | Sharp (build-time HEIC → WebP) |
| Video | HTML5 `<video>` with `autoplay muted loop playsInline` |

---

## Page Structure

### Section 1 — Intro Hook
- Full-screen entrance. Cream background.
- A **door-shaped box** (portrait rectangle with rounded top, door-knob detail) floats centre-screen.
- Text inside: *"What if all you needed was a conscious walk?"*
- Walk photos from multiple locations drift behind the door at different z-depths and offsets — overlapping, slightly rotated, like a scattered desk of prints.
- 3–4 clay 3D objects orbit slowly in the background (leaf, cobblestone, pigeon).
- No scroll indicator — the visual tension of the door invites interaction.

### Section 2 — Scroll-Triggered Footsteps (First Set)
- As user scrolls, **footstep SVGs appear one by one** tracking diagonally across the viewport.
- Each footstep is tied to scroll progress via GSAP ScrollTrigger.
- Footsteps are warm tan (#c8b89a), slightly irregular like real prints.
- They lead the eye toward Section 3.

### Section 3 — Narrative Text
- Large atmospheric layout.
- Text: *"When was the last time the city whispered its secrets to you?"*
- Walk photos layer in around and behind the text box — large, full-bleed crops at varying z-depths.
- Text box has `backdrop-filter: blur(4px)` and semi-transparent cream background.
- 3D clay objects appear at edges, partially cropped.

### Section 4 — Footsteps → INRELATION Stamp
- Second set of footsteps, progressively larger as user scrolls.
- Final giant footstep triggers an **ink-stamp animation**: the word **INRELATION** appears in massive bold type, stamped onto the page with a brief blur/spread effect.
- Stamp style: large uppercase, slight rotation, ink-spread keyframe animation.

### Section 5 — The People
- Photo of **Blasius and Gurden** (source: `images/IMG_2679.HEIC`, convert to WebP).
- Warm, informal framing. Full-width or large offset crop.
- Brief copy: their names, short warm intro line (placeholder for now).
- A clay 3D object floats nearby.

### Section 6 — Road Fork
- Visual **road fork / signpost** element.
- A T-junction or Y-fork graphic (SVG, animated in on scroll).
- Two signpost arrows: **"12 Walks Done ←"** and **"Next Walks →"**
- This acts as a navigation signal — not actual routing, just visual storytelling.
- Below it, the page continues into both paths sequentially (walks first, then next walks).

### Section 7 — The 12 Walks
12 walk cards presented in a scrolling sequence. Each card:

**Card anatomy:**
- Walk number (large, bold)
- Location name
- Question line (italic, poetic)
- 2–3 photos displayed around/behind the card (z-layered)
- Video if available (Walk 6 Paul-Lincke-Ufer has `.MOV` — convert or use as-is with `<video>`)
- **Expand button** → opens journal entry (placeholder text for now)
- Clay 3D object themed to that neighbourhood

**The 12 walks:**

| # | Location | Question Line |
|---|----------|--------------|
| 01 | Reuterkiez | "Can you see the trees dancing?" |
| 02 | Oranienplatz | *(placeholder — no photos yet)* |
| 03 | Hasenheide | *(placeholder)* |
| 04 | Kotti | *(placeholder)* |
| 05 | Frankfurter Allee | *(placeholder)* |
| 06 | Paul-Lincke-Ufer | *(placeholder)* |
| 07 | Treptower Park | *(placeholder)* |
| 08 | Görlitzer Park | *(placeholder)* |
| 09 | Karl-Marx-Strasse | *(placeholder)* |
| 10 | Oranienplatz | *(placeholder)* |
| 11 | Markthalle Neun | *(placeholder)* |
| 12 | Körnerpark | *(placeholder)* |

**Image assignment (best picks per walk):**
- Walk 01 Reuterkiez: `1Reuterkiez1.HEIC` (only image available)
- Walk 02 Oranienplatz: placeholder (no images)
- Walk 03 Hasenheide: `3Hasenheide4.jpg`, `3Hasenheide7.jpg`, `3Hasenheide10.jpg`
- Walk 04 Kotti: `4Kotti1.HEIC`, `4Kott2.jpg`, `4Kott3.jpg`
- Walk 05 Frankfurter Allee: `5Frankfurter Allee1.HEIC`, `5Frankfurter Allee2.HEIC`
- Walk 06 Paul-Lincke-Ufer: `6Paul-Lincke-Ufer4.jpg`, `6Paul-Lincke-Ufer5.jpg` + video `6Paul-Lincke-Ufer1.MOV`
- Walk 07 Treptower Park: `7Treptower Park5.jpg`, `7Treptower Park9.jpg`, `7Treptower Park13.jpg`
- Walk 08 Görlitzer Park: `8Görlitzer6.jpg`, `8Görlitzer7.jpg`, `8Görlitzer9.jpg`
- Walk 09 Karl-Marx-Strasse: `9Karl-Marx1.HEIC`, `9Karl-Marx3.HEIC`
- Walk 10 Oranienplatz: `10Oranienplatz10.jpg`, `10Oranienplatz13.jpg`, `10Oranienplatz16.jpg`
- Walk 11 Markthalle Neun: `11Markthalle7.jpg`, `11Markthalle10.jpg`, `11Markthalle11.jpg`
- Walk 12 Körnerpark: `12Körnerpark3.jpg`, `12Körnerpark5.jpg`, `12Körnerpark7.jpg`

### Section 8 — Next Walks
- 2–3 upcoming walk cards (placeholder dates and locations).
- Each card shows: walk number, location, date, brief teaser.
- **Signal CTA** — a styled button/link to reach Blasius & Gurden via Signal app.
  - Signal icon + "Join via Signal" text.
  - Placeholder link for now (to be replaced with actual Signal group link).

---

## Animation Library Division

**GSAP + ScrollTrigger** owns all scroll-driven animations: footsteps, photo parallax, stamp reveal, 3D Y-position shifts. No Framer Motion in scroll contexts.

**Framer Motion** owns only UI component state transitions: walk card expand/collapse, road fork SVG reveal on entry.

This boundary is strict — the two libraries must not attach to the same scroll context.

## Scroll & Animation Details

### Footsteps
- SVG footprint shapes (left + right alternating).
- GSAP ScrollTrigger: each footstep has `opacity: 0 → 1` and `translateY: 20px → 0` tied to scroll progress.
- Second set additionally scales up: `scale: 0.6 → 1.4` as scroll advances.

### Photo Layering (spring.site style)
- Photos positioned with `position: absolute`, varying `top/left` offsets, `rotate` transforms, `z-index` layering.
- Parallax via GSAP: each photo moves at a different rate on scroll (0.3x to 0.8x scroll speed).
- Some photos behind text (z-index: 0), some in front (z-index: 20).

### 3D Objects (React Three Fiber)
- Each section has 1–3 clay objects in a `<Canvas>` with `position: fixed` or `position: absolute`.
- Idle rotation: `useFrame` accumulates a `rotationY` value (+0.003 rad/frame). This is the object's Y rotation.
- Scroll shift: GSAP ScrollTrigger updates a separate `scrollY` ref (0 → 2 world units) that controls the mesh's `position.y`. Rotation and position are independent — scroll does not affect rotation.
- Per-object differentiation: each object gets a unique rotation axis weight and scroll multiplier (0.5x–1.5x) defined in `walks.js`.
- Soft directional light + ambient light. `MeshStandardMaterial` with `roughness: 0.8` for clay look.
- Object list: leaf, cobblestone, pigeon, bottle, street sign fragment, bench slat.

### Walk Card Expand
- Click expand → `Framer Motion` `AnimatePresence` slides journal content open.
  - Entry: `height: 0 → auto`, `opacity: 0 → 1`, duration `0.4s`, ease `easeOut`.
  - Exit: `height: auto → 0`, `opacity: 1 → 0`, duration `0.3s`, ease `easeIn`.
- **Only one card open at a time.** Opening a new card closes the previous one.
- Close affordance: "×" button top-right of expanded content.
- Journal content: long-form prose (placeholder), more photos in a loose grid.

### Road Fork
- Purely visual/scrollytelling — no routing or navigation. The page continues sequentially below it (walks first, then next walks).
- SVG fork graphic animates in on scroll entry via Framer Motion `whileInView`.
- Two arrow labels animate in with a 200ms stagger after the fork appears.

## Video Handling

Walk 6 Paul-Lincke-Ufer `.MOV` file:
- Wrapped in `<video autoplay muted loop playsInline>`.
- Poster image: `/images/6Paul-Lincke-Ufer4.jpg` (from `public/images/`, shown while video loads or if autoplay blocked).
- Fallback: if video fails to load, poster image remains visible — no JS error state needed.

## Image Conversion

Sharp runs as a **pre-build npm script**: `"predev": "node scripts/convert-images.js"` and `"prebuild": "node scripts/convert-images.js"`.
- Input: `images/*.{HEIC,heic}`
- Output: `public/images/*.webp` (converted) + `public/images/*.jpg` (copied as-is)
- Output files are **committed to the repo** so deploys don't require re-conversion.
- Script is idempotent — skips conversion if output file exists **and** output mtime ≥ source mtime. If source is newer, reconverts..

---

## Image Processing

All HEIC files converted to WebP at build time using Sharp. Originals stay in `images/`. Converted files output to `public/images/`.

The `.MOV` video for Walk 6 is too large for direct web use — it will be referenced as a `<video>` element with `autoplay muted loop playsInline`, sized and cropped in-viewport.

---

## File Structure

```
in-relation/
├── public/
│   └── images/          ← converted WebP files
├── src/
│   ├── components/
│   │   ├── IntroSection.jsx
│   │   ├── FootstepsSection.jsx
│   │   ├── NarrativeSection.jsx
│   │   ├── StampSection.jsx
│   │   ├── PeopleSection.jsx
│   │   ├── RoadFork.jsx
│   │   ├── WalkCard.jsx
│   │   ├── WalksSection.jsx
│   │   ├── NextWalksSection.jsx
│   │   └── ThreeScene.jsx
│   ├── data/
│   │   └── walks.js       ← walk metadata, image refs, placeholder text
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── convert-images.js  ← Sharp HEIC→WebP conversion script
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Responsive Strategy

**Desktop-first.** The immersive layout is designed for large screens (1024px+).

**Mobile (< 768px) — Minimal 3D:**
- **1 clay object per section** (vs 2–3 on desktop). Simpler geometry — sphere/rounded box primitives only, no complex meshes like pigeon.
- Canvas sized to a small corner region (120×120px), `position: absolute`, not full-screen. Keeps GPU load low.
- Idle rotation continues. Scroll-linked Y shift disabled on mobile (touch scroll performance).
- Footstep scroll animations still work (GSAP touch scroll is supported).
- Photo layering simplifies to single stacked images (no absolute positioning).
- Walk cards stack vertically, expand still works.

**Tablet (768px–1024px):** Same as desktop — full 3D, 2–3 objects per section, photo layering intact.

## Out of Scope (this version)

- CMS or content management
- User accounts or persistence
- Actual Signal group link (placeholder)
- Real journal entries (placeholders)
- Walk 2 Oranienplatz photos (placeholder)
- 3D on mobile devices
