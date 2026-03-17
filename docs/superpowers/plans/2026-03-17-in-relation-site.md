# In Relation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the In Relation scrollytelling website — a long-form, immersive single-page experience documenting 12 conscious walks in Berlin, with clay 3D objects, scroll-driven animations, layered photography, and expandable walk journals.

**Architecture:** Vite + React single-page app. GSAP ScrollTrigger drives all scroll animations (footsteps, parallax, stamp reveal). React Three Fiber renders clay 3D objects in positioned canvases. Framer Motion handles component state transitions (card expand/collapse, road fork entry). Walk data lives in a single `walks.js` file. Images are pre-converted from HEIC to WebP by a build-time Sharp script.

**Tech Stack:** Vite 5 · React 18 · React Three Fiber · @react-three/drei · GSAP + ScrollTrigger · Framer Motion · Tailwind CSS v3 · Sharp · Vitest

---

## File Map

```
in-relation/
├── public/
│   └── images/                    ← converted WebP + copied JPG (committed)
├── scripts/
│   └── convert-images.js          ← Sharp HEIC→WebP pre-build script
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── IntroSection.jsx   ← door box, layered photos, 3D
│   │   │   ├── FootstepsSection.jsx ← first footstep sequence
│   │   │   ├── NarrativeSection.jsx ← whisper text, layered photos
│   │   │   ├── StampSection.jsx   ← growing footsteps → INRELATION stamp
│   │   │   ├── PeopleSection.jsx  ← Blasius & Gurden photo
│   │   │   ├── RoadFork.jsx       ← visual fork signpost
│   │   │   ├── WalksSection.jsx   ← container for 12 walk cards
│   │   │   └── NextWalksSection.jsx ← upcoming walks + Signal CTA
│   │   ├── cards/
│   │   │   ├── WalkCard.jsx       ← single walk card with expand toggle
│   │   │   └── WalkJournal.jsx    ← expanded journal content + photos
│   │   ├── three/
│   │   │   ├── ThreeScene.jsx     ← R3F Canvas wrapper, responsive
│   │   │   └── ClayObject.jsx     ← single clay mesh with idle rotation
│   │   └── ui/
│   │       ├── Footstep.jsx       ← single SVG footstep (left/right)
│   │       └── LayeredPhoto.jsx   ← positioned photo with parallax data attrs
│   ├── data/
│   │   └── walks.js               ← all walk metadata, image refs, 3D config
│   ├── hooks/
│   │   └── useBreakpoint.js       ← isMobile / isTablet booleans
│   ├── App.jsx                    ← top-level section composition
│   ├── main.jsx                   ← React root mount
│   └── index.css                  ← Tailwind directives + global CSS vars
├── tests/
│   ├── walks.test.js              ← data integrity tests
│   └── convert-images.test.js    ← image script unit tests
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Chunk 1: Project Setup & Image Conversion

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Initialise the project**

From `/Users/gurden/Documents/code/in-relation`, run:

```bash
npm create vite@latest . -- --template react
```

When prompted "Current directory is not empty. Remove existing files and continue?" → choose **Ignore files and continue**.

- [ ] **Step 2: Install all dependencies**

```bash
npm install
npm install gsap @gsap/react framer-motion @react-three/fiber @react-three/drei three
npm install -D tailwindcss postcss autoprefixer vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom sharp
```

- [ ] **Step 3: Initialise Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0e8',
        linen: '#ede8df',
        'warm-tan': '#c8b89a',
        'sand-accent': '#a08060',
        'text-primary': '#2d2520',
        'text-secondary': '#7c6f5e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');

:root {
  --cream: #f5f0e8;
  --linen: #ede8df;
  --warm-tan: #c8b89a;
  --sand-accent: #a08060;
  --text-primary: #2d2520;
  --text-secondary: #7c6f5e;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: auto; /* GSAP controls scrolling */
}

body {
  background-color: var(--cream);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}
```

- [ ] **Step 6: Replace `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 7: Create test setup file**

Create `tests/setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Replace `src/App.jsx` with placeholder**

```jsx
export default function App() {
  return (
    <main className="bg-cream min-h-screen">
      <p className="p-8 text-text-primary">In Relation — loading...</p>
    </main>
  )
}
```

- [ ] **Step 9: Replace `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 10: Verify dev server starts**

```bash
npm run dev
```

Expected: browser opens at `http://localhost:5173` showing cream background with "In Relation — loading..."

- [ ] **Step 11: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold vite react project with tailwind and dependencies"
```

---

### Task 2: Image conversion script

**Files:**
- Create: `scripts/convert-images.js`
- Create: `tests/convert-images.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/convert-images.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'

// We test the logic functions exported from the script, not the Sharp I/O
import { shouldConvert, getOutputPath } from '../scripts/convert-images.js'

describe('shouldConvert', () => {
  it('returns true when output does not exist', () => {
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', false, null, null)).toBe(true)
  })

  it('returns false when output exists and output mtime >= source mtime', () => {
    const srcMtime = new Date('2025-01-01')
    const outMtime = new Date('2025-01-02') // output is newer
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', true, srcMtime, outMtime)).toBe(false)
  })

  it('returns true when output exists but source is newer', () => {
    const srcMtime = new Date('2025-01-03')
    const outMtime = new Date('2025-01-01') // output is older
    expect(shouldConvert('/src/img.HEIC', '/out/img.webp', true, srcMtime, outMtime)).toBe(true)
  })
})

describe('getOutputPath', () => {
  it('converts HEIC extension to webp', () => {
    const result = getOutputPath('1Reuterkiez1.HEIC', '/public/images')
    expect(result).toBe('/public/images/1Reuterkiez1.webp')
  })

  it('converts heic (lowercase) extension to webp', () => {
    const result = getOutputPath('photo.heic', '/public/images')
    expect(result).toBe('/public/images/photo.webp')
  })

  it('keeps jpg extension as-is', () => {
    const result = getOutputPath('3Hasenheide4.jpg', '/public/images')
    expect(result).toBe('/public/images/3Hasenheide4.jpg')
  })

  it('replaces spaces with hyphens in HEIC output name', () => {
    const result = getOutputPath('7Treptower Park5.HEIC', '/public/images')
    expect(result).toBe('/public/images/7Treptower-Park5.webp')
  })

  it('replaces spaces with hyphens in jpg output name', () => {
    const result = getOutputPath('5Frankfurter Allee1.jpg', '/public/images')
    expect(result).toBe('/public/images/5Frankfurter-Allee1.jpg')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/convert-images.test.js
```

Expected: FAIL — `Cannot find module '../scripts/convert-images.js'`

- [ ] **Step 3: Create `scripts/convert-images.js`**

```js
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, '..', 'images')
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images')

// Pure logic — exported for testing
export function shouldConvert(srcPath, outPath, outExists, srcMtime, outMtime) {
  if (!outExists) return true
  return srcMtime > outMtime
}

/**
 * Normalise filename: replace spaces with hyphens so output paths are
 * URL-safe and can be used directly in <img src> without encoding.
 * HEIC files are converted to .webp; other extensions kept as-is.
 */
export function getOutputPath(filename, outputDir) {
  const ext = path.extname(filename).toLowerCase()
  // Normalise spaces → hyphens in the base name
  const safeBase = path.basename(filename, path.extname(filename)).replace(/ /g, '-')
  if (ext === '.heic') {
    return path.join(outputDir, safeBase + '.webp')
  }
  return path.join(outputDir, safeBase + ext)
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(IMAGES_DIR)

  for (const filename of files) {
    const srcPath = path.join(IMAGES_DIR, filename)
    const ext = path.extname(filename).toLowerCase()

    // Skip non-image files and videos
    if (!['.heic', '.jpg', '.jpeg', '.png'].includes(ext)) continue

    const outPath = getOutputPath(filename, OUTPUT_DIR)
    const srcStat = fs.statSync(srcPath)
    const outExists = fs.existsSync(outPath)
    const outStat = outExists ? fs.statSync(outPath) : null

    if (!shouldConvert(srcPath, outPath, outExists, srcStat.mtime, outStat?.mtime ?? null)) {
      console.log(`  skip  ${filename} (up to date)`)
      continue
    }

    if (ext === '.heic') {
      console.log(`  convert  ${filename} → webp`)
      await sharp(srcPath).webp({ quality: 85 }).toFile(outPath)
    } else {
      // Copy JPG/PNG as-is
      console.log(`  copy  ${filename}`)
      fs.copyFileSync(srcPath, outPath)
    }
  }

  console.log('Image conversion complete.')
}

// Only run when executed directly (not imported in tests)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(console.error)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/convert-images.test.js
```

Expected: PASS — 8 tests passing

- [ ] **Step 5: Add npm scripts to `package.json`**

Open `package.json`. The Vite scaffold already has `"dev"`, `"build"`, and `"preview"` in `scripts`. Add three new keys alongside them:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "convert-images": "node scripts/convert-images.js",
    "predev": "npm run convert-images",
    "prebuild": "npm run convert-images"
  }
}
```

Verify the hooks fire by running `npm run dev` — you should see image conversion output (`skip` or `convert` lines) **before** the Vite dev server starts. If you don't see conversion output, the hooks are not wired correctly.

- [ ] **Step 6: Run the conversion script**

```bash
node scripts/convert-images.js
```

Expected: Output lists each image file with `convert` or `copy`. Files appear in `public/images/`.

- [ ] **Step 7: Verify output**

```bash
ls public/images/ | head -20
```

Expected: `.webp` files for HEIC originals, `.jpg` files copied over.

- [ ] **Step 8: Commit**

```bash
git add scripts/ tests/ public/images/ package.json vite.config.js
git commit -m "feat: add image conversion script with HEIC to WebP support"
```

---

## Chunk 2: Data Layer

### Task 3: Walk data file

**Files:**
- Create: `src/data/walks.js`
- Create: `tests/walks.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/walks.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { walks, nextWalks } from '../src/data/walks.js'

const REQUIRED_WALK_FIELDS = ['id', 'name', 'location', 'question', 'images', 'hasPlaceholder', 'journalText', 'threeObjectType']

describe('walks data', () => {
  it('has exactly 12 walks', () => {
    expect(walks).toHaveLength(12)
  })

  it('each walk has all required fields', () => {
    walks.forEach((walk) => {
      REQUIRED_WALK_FIELDS.forEach((field) => {
        expect(walk, `walk ${walk?.id} missing field: ${field}`).toHaveProperty(field)
      })
    })
  })

  it('walk ids are 1-12 in order', () => {
    walks.forEach((walk, i) => {
      expect(walk.id).toBe(i + 1)
    })
  })

  it('each walk has at least one image or hasPlaceholder is true', () => {
    walks.forEach((walk) => {
      const valid = walk.hasPlaceholder || walk.images.length > 0
      expect(valid, `walk ${walk.id} has no images and hasPlaceholder is false`).toBe(true)
    })
  })

  it('threeObjectType is a known value', () => {
    const validTypes = ['leaf', 'cobblestone', 'pigeon', 'bottle', 'sign', 'bench']
    walks.forEach((walk) => {
      expect(validTypes, `walk ${walk.id} has unknown threeObjectType: ${walk.threeObjectType}`).toContain(walk.threeObjectType)
    })
  })
})

describe('nextWalks data', () => {
  it('has at least one upcoming walk', () => {
    expect(nextWalks.length).toBeGreaterThanOrEqual(1)
  })

  it('each next walk has id, location, date, teaser', () => {
    nextWalks.forEach((walk) => {
      expect(walk).toHaveProperty('id')
      expect(walk).toHaveProperty('location')
      expect(walk).toHaveProperty('date')
      expect(walk).toHaveProperty('teaser')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/walks.test.js
```

Expected: FAIL — `Cannot find module '../src/data/walks.js'`

- [ ] **Step 3: Create `src/data/walks.js`**

```js
export const walks = [
  {
    id: 1,
    name: 'Reuterkiez',
    location: 'Reuterkiez, Neukölln',
    question: 'Can you see the trees dancing?',
    images: ['/images/1Reuterkiez1.webp'],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Reuterkiez. We gathered at the corner of Weichselstraße and found ourselves immediately slowing down. The street market was in full swing. Someone had left flowers on a windowsill. We noticed the way light filtered through the linden trees — a kind of soft green strobe. What does it mean to really see a tree? To notice it not as backdrop but as presence?`,
    threeObjectType: 'leaf',
    scrollMultiplier: 0.8,
  },
  {
    id: 2,
    name: 'Oranienplatz I',
    location: 'Oranienplatz, Kreuzberg',
    question: 'What does a square remember?',
    images: [],
    hasPlaceholder: true,
    video: null,
    journalText: `Placeholder journal entry for Oranienplatz (first walk). Photos coming soon. We explored the square and its layers of protest, play, and passage. Every square in Berlin carries multiple histories simultaneously.`,
    threeObjectType: 'cobblestone',
    scrollMultiplier: 1.0,
  },
  {
    id: 3,
    name: 'Hasenheide',
    location: 'Hasenheide Park, Neukölln',
    question: 'Who else is listening to the city right now?',
    images: [
      '/images/3Hasenheide4.jpg',
      '/images/3Hasenheide7.jpg',
      '/images/3Hasenheide10.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Hasenheide. The park holds so many different worlds at once — the dog walkers, the chess players, the napping students, the vigil-keepers. We tried to move through without destination.`,
    threeObjectType: 'pigeon',
    scrollMultiplier: 0.6,
  },
  {
    id: 4,
    name: 'Kotti',
    location: 'Kottbusser Tor, Kreuzberg',
    question: 'Can you feel the pulse underneath your feet?',
    images: [
      '/images/4Kotti1.webp',
      '/images/4Kott2.jpg',
      '/images/4Kott3.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Kotti. One of the most charged urban nodes in Berlin. We stood at the centre of the roundabout and tried to be still while the city moved around us.`,
    threeObjectType: 'sign',
    scrollMultiplier: 1.2,
  },
  {
    id: 5,
    name: 'Frankfurter Allee',
    location: 'Frankfurter Allee, Friedrichshain',
    question: 'What do wide boulevards do to your body?',
    images: [
      '/images/5Frankfurter-Allee1.webp',
      '/images/5Frankfurter-Allee2.webp',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Frankfurter Allee. The scale of the Stalinist boulevard is designed to make you feel small. We walked it consciously and noticed what it asked of our bodies — a kind of performance of smallness.`,
    threeObjectType: 'bench',
    scrollMultiplier: 0.9,
  },
  {
    id: 6,
    name: 'Paul-Lincke-Ufer',
    location: 'Paul-Lincke-Ufer, Kreuzberg',
    question: 'What does water change about how you walk?',
    images: [
      '/images/6Paul-Lincke-Ufer4.jpg',
      '/images/6Paul-Lincke-Ufer5.jpg',
    ],
    hasPlaceholder: false,
    video: '/images/6Paul-Lincke-Ufer1.MOV',
    videoPoster: '/images/6Paul-Lincke-Ufer4.jpg',
    journalText: `Placeholder journal entry for Paul-Lincke-Ufer. Walking alongside the canal changes something — you move more slowly, you look sideways instead of ahead. The water reflects a different version of the city.`,
    threeObjectType: 'bottle',
    scrollMultiplier: 0.7,
  },
  {
    id: 7,
    name: 'Treptower Park',
    location: 'Treptower Park, Treptow',
    question: 'What do monuments do to silence?',
    images: [
      '/images/7Treptower-Park5.jpg',
      '/images/7Treptower-Park9.jpg',
      '/images/7Treptower-Park13.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Treptower Park. The Soviet War Memorial creates a very particular kind of silence. We spent time with the scale of grief that the architecture holds.`,
    threeObjectType: 'leaf',
    scrollMultiplier: 1.1,
  },
  {
    id: 8,
    name: 'Görlitzer Park',
    location: 'Görlitzer Park, Kreuzberg',
    question: 'How many cities exist inside one park?',
    images: [
      '/images/8Görlitzer6.jpg',
      '/images/8Görlitzer7.jpg',
      '/images/8Görlitzer9.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Görlitzer Park. Gorli is its own ecosystem — contested, layered, alive. We moved through its zones and noticed how each has its own social weather.`,
    threeObjectType: 'cobblestone',
    scrollMultiplier: 0.5,
  },
  {
    id: 9,
    name: 'Karl-Marx-Strasse',
    location: 'Karl-Marx-Strasse, Neukölln',
    question: 'What is a high street trying to tell you?',
    images: [
      '/images/9Karl-Marx1.webp',
      '/images/9Karl-Marx3.webp',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Karl-Marx-Strasse. The long commercial street is easy to dismiss. We tried to slow down and read it — the shop signs, the languages, the temporary and the permanent.`,
    threeObjectType: 'sign',
    scrollMultiplier: 1.3,
  },
  {
    id: 10,
    name: 'Oranienplatz II',
    location: 'Oranienplatz, Kreuzberg',
    question: 'Does a familiar place ever really repeat?',
    images: [
      '/images/10Oranienplatz10.jpg',
      '/images/10Oranienplatz13.jpg',
      '/images/10Oranienplatz16.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Oranienplatz (second visit). We returned with the memory of our first walk here. The same place was entirely different. Returning consciously is its own practice.`,
    threeObjectType: 'cobblestone',
    scrollMultiplier: 0.9,
  },
  {
    id: 11,
    name: 'Markthalle Neun',
    location: 'Markthalle Neun, Kreuzberg',
    question: 'What does it smell like to belong somewhere?',
    images: [
      '/images/11Markthalle7.jpg',
      '/images/11Markthalle10.jpg',
      '/images/11Markthalle11.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Markthalle Neun. A covered market is a particular kind of inside-outside. We paid attention to the way smell creates memory and belonging.`,
    threeObjectType: 'bottle',
    scrollMultiplier: 0.8,
  },
  {
    id: 12,
    name: 'Körnerpark',
    location: 'Körnerpark, Neukölln',
    question: 'Can beauty be a form of resistance?',
    images: [
      '/images/12Körnerpark3.jpg',
      '/images/12Körnerpark5.jpg',
      '/images/12Körnerpark7.jpg',
    ],
    hasPlaceholder: false,
    video: null,
    journalText: `Placeholder journal entry for Körnerpark. The sunken baroque garden in the middle of Neukölln feels like a secret. Its formal beauty sits in sharp contrast to its surroundings. We wondered what that contrast asks of us.`,
    threeObjectType: 'leaf',
    scrollMultiplier: 0.6,
  },
]

export const nextWalks = [
  {
    id: 13,
    location: 'TBA — Berlin',
    date: 'Coming soon',
    teaser: 'The next conscious walk. Details to be announced via Signal.',
  },
  {
    id: 14,
    location: 'TBA — Berlin',
    date: 'Coming soon',
    teaser: 'More walks are planned. Join the Signal group to stay informed.',
  },
]
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/walks.test.js
```

Expected: PASS — all tests green

- [ ] **Step 5: Commit**

```bash
git add src/data/ tests/walks.test.js
git commit -m "feat: add walk data with 12 walks and next walks"
```

---

## Chunk 3: UI Primitives & Hooks

### Task 4: Breakpoint hook

**Files:**
- Create: `src/hooks/useBreakpoint.js`

- [ ] **Step 1: Create `src/hooks/useBreakpoint.js`**

```js
import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/
git commit -m "feat: add useBreakpoint hook"
```

---

### Task 5: Footstep UI component

**Files:**
- Create: `src/components/ui/Footstep.jsx`

- [ ] **Step 1: Create `src/components/ui/Footstep.jsx`**

```jsx
/**
 * Single SVG footstep. side: 'left' | 'right'
 * scale: number (1 = default, >1 = larger for stamp section)
 */
export default function Footstep({ side = 'left', scale = 1, className = '', style = {} }) {
  // Mirror the SVG for right foot
  const transform = side === 'right' ? 'scaleX(-1)' : 'scaleX(1)'

  return (
    <svg
      className={className}
      style={{ transform: `scale(${scale}) ${transform}`, ...style }}
      width="32"
      height="46"
      viewBox="0 0 32 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sole */}
      <ellipse cx="16" cy="32" rx="13" ry="12" fill="#c8b89a" />
      {/* Heel */}
      <ellipse cx="16" cy="40" rx="10" ry="6" fill="#b8a888" />
      {/* Big toe */}
      <ellipse cx="10" cy="20" rx="5" ry="6" fill="#c8b89a" />
      {/* Toe 2 */}
      <ellipse cx="16" cy="17" rx="4" ry="5.5" fill="#c8b89a" />
      {/* Toe 3 */}
      <ellipse cx="21" cy="19" rx="3.5" ry="5" fill="#c8b89a" />
      {/* Toe 4 */}
      <ellipse cx="25" cy="22" rx="3" ry="4.5" fill="#c8b89a" />
      {/* Little toe */}
      <ellipse cx="28" cy="26" rx="2.5" ry="4" fill="#c8b89a" />
    </svg>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Footstep.jsx
git commit -m "feat: add Footstep SVG component"
```

---

### Task 6: LayeredPhoto component

**Files:**
- Create: `src/components/ui/LayeredPhoto.jsx`

- [ ] **Step 1: Create `src/components/ui/LayeredPhoto.jsx`**

```jsx
/**
 * A photo positioned absolutely with a parallax multiplier.
 * GSAP ScrollTrigger reads data-parallax-speed from the DOM element.
 *
 * Props:
 *   src: string — image path from public/images/
 *   alt: string
 *   style: object — position (top/left/right/bottom), rotation, zIndex, width
 *   parallaxSpeed: number — 0.3 to 0.8 (lower = more parallax drift)
 */
export default function LayeredPhoto({ src, alt = '', style = {}, parallaxSpeed = 0.5 }) {
  return (
    <div
      className="layered-photo absolute overflow-hidden rounded-sm"
      data-parallax-speed={parallaxSpeed}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/LayeredPhoto.jsx
git commit -m "feat: add LayeredPhoto component with parallax data attr"
```

---

## Chunk 4: 3D Layer

### Task 7: ClayObject component

**Files:**
- Create: `src/components/three/ClayObject.jsx`

- [ ] **Step 1: Create `src/components/three/ClayObject.jsx`**

```jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

const CLAY_MATERIAL = {
  roughness: 0.8,
  metalness: 0.0,
}

// Map type → geometry + colour
const OBJECT_CONFIGS = {
  leaf: { color: '#a8c890', component: 'leaf' },
  cobblestone: { color: '#9a8e80', component: 'cobblestone' },
  pigeon: { color: '#b8b0a8', component: 'pigeon' },
  bottle: { color: '#98b898', component: 'bottle' },
  sign: { color: '#c8a878', component: 'sign' },
  bench: { color: '#8a7060', component: 'bench' },
}

function LeafMesh({ color }) {
  return (
    <mesh rotation={[0.3, 0, 0.5]}>
      <sphereGeometry args={[0.6, 8, 6]} />
      <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
    </mesh>
  )
}

function CobblestoneMesh({ color }) {
  return (
    <RoundedBox args={[1, 0.6, 0.8]} radius={0.2} smoothness={4}>
      <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
    </RoundedBox>
  )
}

function PigeonMesh({ color }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.5, 0.3]}>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
    </group>
  )
}

function BottleMesh({ color }) {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 12]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.25, 0.5, 12]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
    </group>
  )
}

function SignMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.7, 0.08]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
        <meshStandardMaterial color="#7c6f5e" {...CLAY_MATERIAL} />
      </mesh>
    </group>
  )
}

function BenchMesh({ color }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.4]} />
        <meshStandardMaterial color={color} {...CLAY_MATERIAL} />
      </mesh>
      <mesh position={[-0.5, -0.3, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.4]} />
        <meshStandardMaterial color="#7c6f5e" {...CLAY_MATERIAL} />
      </mesh>
      <mesh position={[0.5, -0.3, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.4]} />
        <meshStandardMaterial color="#7c6f5e" {...CLAY_MATERIAL} />
      </mesh>
    </group>
  )
}

const MESHES = {
  leaf: LeafMesh,
  cobblestone: CobblestoneMesh,
  pigeon: PigeonMesh,
  bottle: BottleMesh,
  sign: SignMesh,
  bench: BenchMesh,
}

/**
 * A single rotating clay object.
 * scrollY: a React ref whose .current is updated by GSAP (world units, 0→2)
 */
export default function ClayObject({ type = 'cobblestone', scrollY }) {
  const groupRef = useRef()
  const config = OBJECT_CONFIGS[type] ?? OBJECT_CONFIGS.cobblestone
  const MeshComponent = MESHES[type] ?? MESHES.cobblestone

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.003
    if (scrollY?.current !== undefined) {
      groupRef.current.position.y = scrollY.current
    }
  })

  return (
    <group ref={groupRef}>
      <MeshComponent color={config.color} />
    </group>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/ClayObject.jsx
git commit -m "feat: add ClayObject component with 6 clay mesh types"
```

---

### Task 8: ThreeScene wrapper

**Files:**
- Create: `src/components/three/ThreeScene.jsx`

- [ ] **Step 1: Create `src/components/three/ThreeScene.jsx`**

```jsx
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint.js'
import ClayObject from './ClayObject.jsx'

/**
 * Wraps a R3F Canvas with responsive sizing.
 *
 * Desktop: full size canvas (parent controls dimensions via className/style)
 * Mobile: small 120×120 canvas, position absolute in corner
 *
 * Props:
 *   objectType: string — clay object type
 *   scrollYRef: React ref — updated by GSAP with world Y position
 *   className: string — for desktop sizing
 *   mobilePosition: object — CSS position for mobile canvas (default: bottom-right)
 */
export default function ThreeScene({
  objectType = 'cobblestone',
  scrollYRef,
  className = '',
  mobilePosition = { bottom: '24px', right: '24px' },
}) {
  const { isMobile } = useBreakpoint()
  const internalRef = useRef(0)
  const ref = scrollYRef ?? internalRef

  if (isMobile) {
    return (
      <div
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          pointerEvents: 'none',
          zIndex: 10,
          ...mobilePosition,
        }}
      >
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} />
          <ClayObject type={objectType} scrollY={null} />
        </Canvas>
      </div>
    )
  }

  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} />
        <ClayObject type={objectType} scrollY={ref} />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/three/ThreeScene.jsx
git commit -m "feat: add ThreeScene wrapper with mobile/desktop responsive canvas"
```

---

## Chunk 5: Section Components — Intro, Footsteps, Narrative

### Task 9: IntroSection

**Files:**
- Create: `src/components/sections/IntroSection.jsx`

- [ ] **Step 1: Create `src/components/sections/IntroSection.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import LayeredPhoto from '../ui/LayeredPhoto.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

// Photos to layer behind the door — sampled from multiple walks
// Note: filenames use hyphens (spaces normalised by convert-images.js)
const INTRO_PHOTOS = [
  { src: '/images/3Hasenheide10.jpg', style: { top: '8%', left: '-4%', width: '340px', transform: 'rotate(-4deg)', zIndex: 1 }, parallaxSpeed: 0.4 },
  { src: '/images/7Treptower-Park9.jpg', style: { top: '15%', right: '-2%', width: '280px', transform: 'rotate(5deg)', zIndex: 2 }, parallaxSpeed: 0.6 },
  { src: '/images/10Oranienplatz10.jpg', style: { bottom: '10%', left: '5%', width: '260px', transform: 'rotate(2deg)', zIndex: 1 }, parallaxSpeed: 0.3 },
  { src: '/images/12Körnerpark5.jpg', style: { bottom: '15%', right: '3%', width: '300px', transform: 'rotate(-3deg)', zIndex: 3 }, parallaxSpeed: 0.5 },
  { src: '/images/8Görlitzer6.jpg', style: { top: '40%', left: '2%', width: '200px', transform: 'rotate(6deg)', zIndex: 0 }, parallaxSpeed: 0.7 },
]

export default function IntroSection() {
  const sectionRef = useRef(null)

  // Parallax scroll for layered photos
  useEffect(() => {
    const photos = sectionRef.current.querySelectorAll('.layered-photo')
    const handlers = []

    photos.forEach((photo) => {
      const speed = parseFloat(photo.dataset.parallaxSpeed ?? 0.5)
      const handler = () => {
        const scrollY = window.scrollY
        photo.style.transform = `translateY(${scrollY * (1 - speed) * 0.3}px)`
      }
      window.addEventListener('scroll', handler, { passive: true })
      handlers.push(handler)
    })

    return () => {
      handlers.forEach((h) => window.removeEventListener('scroll', h))
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream"
    >
      {/* Layered photos behind door */}
      {INTRO_PHOTOS.map((photo, i) => (
        <LayeredPhoto key={i} {...photo} />
      ))}

      {/* 3D object — desktop: top-right, mobile: bottom-right corner */}
      <ThreeScene
        objectType="leaf"
        className="absolute top-8 right-8 w-48 h-48 hidden md:block"
        mobilePosition={{ top: '16px', right: '16px' }}
      />

      {/* Door box — centre stage */}
      <div className="relative z-20 flex flex-col items-center">
        <div
          className="door-box relative flex items-center justify-center text-center"
          style={{
            width: '280px',
            height: '380px',
            border: '3px solid #7c6f5e',
            borderRadius: '8px 8px 0 0',
            background: 'rgba(245, 240, 232, 0.88)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {/* Door knob */}
          <div
            className="absolute rounded-full"
            style={{
              width: '14px',
              height: '14px',
              background: '#a08060',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <p
            className="px-8 font-light leading-relaxed"
            style={{ fontSize: '20px', color: '#2d2520' }}
          >
            What if all you needed was a{' '}
            <strong className="font-bold">conscious walk?</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Import IntroSection in App.jsx**

Replace `src/App.jsx`:

```jsx
import IntroSection from './components/sections/IntroSection.jsx'

export default function App() {
  return (
    <main className="bg-cream">
      <IntroSection />
    </main>
  )
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Expected: Cream background, door box centred with text, layered photos behind it, slight parallax on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/IntroSection.jsx src/App.jsx
git commit -m "feat: add intro section with door box and layered photos"
```

---

### Task 10: FootstepsSection (first set)

**Files:**
- Create: `src/components/sections/FootstepsSection.jsx`

- [ ] **Step 1: Create `src/components/sections/FootstepsSection.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

// 8 footsteps alternating left/right, positioned along a diagonal path
const FOOTSTEP_POSITIONS = [
  { side: 'left',  top: '15%', left: '12%' },
  { side: 'right', top: '28%', left: '22%' },
  { side: 'left',  top: '38%', left: '35%' },
  { side: 'right', top: '48%', left: '46%' },
  { side: 'left',  top: '55%', left: '56%' },
  { side: 'right', top: '62%', left: '66%' },
  { side: 'left',  top: '68%', left: '75%' },
  { side: 'right', top: '74%', left: '84%' },
]

export default function FootstepsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.footstep-item')
    const triggers = []

    steps.forEach((step, i) => {
      const tween = gsap.fromTo(
        step,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${i * 80} center`,
            toggleActions: 'play none none reverse',
          },
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    // Only kill triggers created by this component
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-linen overflow-hidden"
      style={{ height: '80vh' }}
    >
      {FOOTSTEP_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="footstep-item absolute"
          style={{ top: pos.top, left: pos.left, opacity: 0 }}
        >
          <Footstep side={pos.side} scale={1} />
        </div>
      ))}

      <p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sand-accent text-sm tracking-widest uppercase"
        style={{ opacity: 0.6 }}
      >
        Keep walking ↓
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

```jsx
import IntroSection from './components/sections/IntroSection.jsx'
import FootstepsSection from './components/sections/FootstepsSection.jsx'

export default function App() {
  return (
    <main className="bg-cream">
      <IntroSection />
      <FootstepsSection />
    </main>
  )
}
```

- [ ] **Step 3: Verify scroll triggers footsteps**

Start dev server, scroll down. Each footstep should fade in diagonally as you scroll through the section.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/FootstepsSection.jsx src/App.jsx
git commit -m "feat: add footsteps section with GSAP scroll-triggered reveal"
```

---

### Task 11: NarrativeSection

**Files:**
- Create: `src/components/sections/NarrativeSection.jsx`

- [ ] **Step 1: Create `src/components/sections/NarrativeSection.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import LayeredPhoto from '../ui/LayeredPhoto.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

const NARRATIVE_PHOTOS = [
  { src: '/images/11Markthalle7.jpg', style: { top: '5%', right: '-3%', width: '360px', transform: 'rotate(-5deg)', zIndex: 1 }, parallaxSpeed: 0.45 },
  { src: '/images/4Kott2.jpg', style: { bottom: '8%', left: '-2%', width: '300px', transform: 'rotate(4deg)', zIndex: 2 }, parallaxSpeed: 0.6 },
  { src: '/images/7Treptower-Park13.jpg', style: { top: '35%', left: '3%', width: '220px', transform: 'rotate(-2deg)', zIndex: 0 }, parallaxSpeed: 0.35 },
  { src: '/images/12Körnerpark7.jpg', style: { bottom: '20%', right: '4%', width: '250px', transform: 'rotate(6deg)', zIndex: 3 }, parallaxSpeed: 0.55 },
]

export default function NarrativeSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const photos = sectionRef.current.querySelectorAll('.layered-photo')
    const handlers = []
    photos.forEach((photo) => {
      const speed = parseFloat(photo.dataset.parallaxSpeed ?? 0.5)
      const handler = () => {
        const rect = sectionRef.current.getBoundingClientRect()
        const relativeScroll = -rect.top
        photo.style.transform = `translateY(${relativeScroll * (1 - speed) * 0.25}px)`
      }
      window.addEventListener('scroll', handler, { passive: true })
      handlers.push(handler)
    })
    return () => handlers.forEach((h) => window.removeEventListener('scroll', h))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream"
    >
      {NARRATIVE_PHOTOS.map((photo, i) => (
        <LayeredPhoto key={i} {...photo} />
      ))}

      <ThreeScene
        objectType="cobblestone"
        className="absolute bottom-12 left-12 w-36 h-36 hidden md:block"
        mobilePosition={{ bottom: '16px', left: '16px' }}
      />

      {/* Text box */}
      <div
        className="relative z-20 max-w-lg mx-8 text-center"
        style={{
          background: 'rgba(245, 240, 232, 0.82)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          borderRadius: '4px',
          padding: '48px 40px',
        }}
      >
        <p
          className="font-light leading-relaxed"
          style={{ fontSize: '28px', color: '#2d2520' }}
        >
          When was the last time the city{' '}
          <strong className="font-bold">whispered its secrets</strong> to you?
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

```jsx
import IntroSection from './components/sections/IntroSection.jsx'
import FootstepsSection from './components/sections/FootstepsSection.jsx'
import NarrativeSection from './components/sections/NarrativeSection.jsx'

export default function App() {
  return (
    <main className="bg-cream">
      <IntroSection />
      <FootstepsSection />
      <NarrativeSection />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Dev server: scroll to narrative section, confirm layered photos and frosted text box.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/NarrativeSection.jsx src/App.jsx
git commit -m "feat: add narrative section with layered photos and whisper text"
```

---

## Chunk 6: Stamp, People & Road Fork Sections

### Task 12: StampSection

**Files:**
- Create: `src/components/sections/StampSection.jsx`

- [ ] **Step 1: Create `src/components/sections/StampSection.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

// Footsteps that grow in scale
const STAMP_FOOTSTEPS = [
  { side: 'left',  top: '10%', left: '8%',  scale: 0.7 },
  { side: 'right', top: '22%', left: '20%', scale: 0.85 },
  { side: 'left',  top: '32%', left: '34%', scale: 1.0 },
  { side: 'right', top: '40%', left: '48%', scale: 1.2 },
  { side: 'left',  top: '46%', left: '62%', scale: 1.45 },
]

export default function StampSection() {
  const sectionRef = useRef(null)
  const stampRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.stamp-step')
    const triggers = []

    // Animate footsteps in
    steps.forEach((step, i) => {
      const tween = gsap.fromTo(
        step,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${i * 100} center`,
            toggleActions: 'play none none reverse',
          },
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    // Stamp animation — triggers after all footsteps
    // rotate: -2 is included so GSAP doesn't strip the tilt when it takes over transform
    const stampTween = gsap.fromTo(
      stampRef.current,
      { opacity: 0, scale: 1.3, filter: 'blur(12px)', rotate: -2 },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        rotate: -2,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          toggleActions: 'play none none reverse',
        },
      }
    )
    if (stampTween.scrollTrigger) triggers.push(stampTween.scrollTrigger)

    // Only kill triggers created by this component
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-linen overflow-hidden"
      style={{ minHeight: '120vh' }}
    >
      {STAMP_FOOTSTEPS.map((pos, i) => (
        <div
          key={i}
          className="stamp-step absolute"
          style={{ top: pos.top, left: pos.left, opacity: 0 }}
        >
          <Footstep side={pos.side} scale={pos.scale} />
        </div>
      ))}

      {/* INRELATION stamp */}
      {/* Do NOT set transform here — GSAP owns the transform on stampRef */}
      <div
        ref={stampRef}
        className="absolute"
        style={{
          top: '52%',
          left: '50%',
          marginLeft: '-120px', /* rough centring; GSAP handles fine positioning */
          opacity: 0,
          border: '8px solid #2d2520',
          padding: '8px 28px',
          display: 'inline-block',
        }}
      >
        <p
          className="font-black tracking-tight leading-none text-center"
          style={{ fontSize: 'clamp(48px, 10vw, 96px)', color: '#2d2520' }}
        >
          IN
          <br />
          RELATION
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

Add `<StampSection />` after `<NarrativeSection />`.

- [ ] **Step 3: Verify**

Scroll to stamp section: footsteps appear and grow, then INRELATION stamp fades/blurs in.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/StampSection.jsx src/App.jsx
git commit -m "feat: add stamp section with growing footsteps and INRELATION reveal"
```

---

### Task 13: PeopleSection

**Files:**
- Create: `src/components/sections/PeopleSection.jsx`

- [ ] **Step 1: Create `src/components/sections/PeopleSection.jsx`**

```jsx
import ThreeScene from '../three/ThreeScene.jsx'

export default function PeopleSection() {
  return (
    <section className="relative min-h-screen bg-cream flex items-center justify-center overflow-hidden">
      <ThreeScene
        objectType="pigeon"
        className="absolute top-16 right-16 w-40 h-40 hidden md:block"
        mobilePosition={{ top: '16px', right: '16px' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-8">
        {/* Photo */}
        <div
          className="flex-shrink-0 overflow-hidden rounded-sm"
          style={{ width: '360px', maxWidth: '90vw', transform: 'rotate(-1.5deg)' }}
        >
          <img
            src="/images/IMG_2679.webp"
            alt="Blasius and Gurden, founders of In Relation"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-xs tracking-widest uppercase text-sand-accent mb-4 font-semibold">
            The walkers
          </p>
          <h2 className="text-4xl font-light mb-2" style={{ color: '#2d2520' }}>
            Blasius <span className="font-bold">&amp;</span> Gurden
          </h2>
          <p className="text-text-secondary font-light leading-relaxed mt-4 max-w-sm">
            Two people who believe that walking slowly through a city is a radical act.
            In Relation began as a conversation about attention, and grew into a practice.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

- [ ] **Step 3: Verify image loads**

Check that `IMG_2679.webp` exists in `public/images/` (the convert script should have created it). If not, run `node scripts/convert-images.js`.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/PeopleSection.jsx src/App.jsx
git commit -m "feat: add people section with Blasius and Gurden photo"
```

---

### Task 14: RoadFork section

**Files:**
- Create: `src/components/sections/RoadFork.jsx`

- [ ] **Step 1: Create `src/components/sections/RoadFork.jsx`**

```jsx
import { motion } from 'framer-motion'

export default function RoadFork() {
  return (
    <section className="relative bg-linen min-h-screen flex flex-col items-center justify-center overflow-hidden py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Pole */}
        <div
          className="w-1 bg-text-secondary"
          style={{ height: '80px', background: '#7c6f5e' }}
        />

        {/* Signs */}
        <motion.div
          className="flex gap-8 mt-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Left sign */}
          <div
            className="font-semibold text-sm tracking-wide px-5 py-2 rounded-sm"
            style={{
              background: '#c8b89a',
              color: '#2d2520',
              transform: 'rotate(-3deg)',
              clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
              paddingRight: '28px',
            }}
          >
            ← 12 Walks Done
          </div>

          {/* Right sign */}
          <div
            className="font-semibold text-sm tracking-wide px-5 py-2 rounded-sm"
            style={{
              background: '#2d2520',
              color: '#f5f0e8',
              transform: 'rotate(3deg)',
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)',
              paddingLeft: '28px',
            }}
          >
            Next Walks →
          </div>
        </motion.div>

        {/* Fork road lines */}
        <svg
          width="300"
          height="120"
          viewBox="0 0 300 120"
          className="mt-4"
          style={{ opacity: 0.3 }}
        >
          {/* Centre stem */}
          <line x1="150" y1="0" x2="150" y2="40" stroke="#7c6f5e" strokeWidth="3" />
          {/* Left fork */}
          <line x1="150" y1="40" x2="30" y2="120" stroke="#7c6f5e" strokeWidth="3" />
          {/* Right fork */}
          <line x1="150" y1="40" x2="270" y2="120" stroke="#7c6f5e" strokeWidth="3" />
        </svg>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

- [ ] **Step 3: Verify**

Scroll to road fork — signpost and fork lines animate in on entry.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/RoadFork.jsx src/App.jsx
git commit -m "feat: add road fork visual section with animated signpost"
```

---

## Chunk 7: Walk Cards & Walks Section

### Task 15: WalkJournal component

**Files:**
- Create: `src/components/cards/WalkJournal.jsx`

- [ ] **Step 1: Create `src/components/cards/WalkJournal.jsx`**

```jsx
/**
 * Expanded journal content for a single walk.
 * Shown/hidden by WalkCard via AnimatePresence.
 * No framer-motion import needed — motion.div lives in WalkCard.
 */
/**
 * WalkJournal renders plain content — no motion wrapper here.
 * The AnimatePresence motion.div is in WalkCard so AnimatePresence
 * can track the direct child and play exit animations correctly.
 */
export default function WalkJournal({ walk }) {
  return (
    <div>
      <div className="pt-6 pb-2">
        {/* Journal text */}
        <p
          className="font-light leading-relaxed text-text-secondary mb-6"
          style={{ fontSize: '15px', maxWidth: '600px' }}
        >
          {walk.journalText}
        </p>

        {/* Photos grid */}
        {walk.images.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {walk.images.slice(1).map((src, i) => (
              <div key={i} className="overflow-hidden rounded-sm aspect-[4/3]">
                <img
                  src={src}
                  alt={`${walk.name} walk photo ${i + 2}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Video if available */}
        {walk.video && (
          <div className="mt-4 overflow-hidden rounded-sm" style={{ maxWidth: '480px' }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={walk.videoPoster}
              className="w-full"
            >
              <source src={walk.video} />
            </video>
          </div>
        )}

        {/* Placeholder notice for Walk 2 */}
        {walk.hasPlaceholder && (
          <p className="text-xs text-sand-accent italic mt-2">
            Photos from this walk coming soon.
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the component renders without errors**

Temporarily import and render `WalkJournal` in `App.jsx` with a mock walk object to confirm it renders without errors:

```jsx
import WalkJournal from './components/cards/WalkJournal.jsx'
import { walks } from './data/walks.js'
// In App return: <WalkJournal walk={walks[0]} />
```

Start dev server, confirm no console errors, then remove the temp import.

- [ ] **Step 3: Commit**

```bash
git add src/components/cards/WalkJournal.jsx
git commit -m "feat: add WalkJournal expanded content component"
```

---

### Task 16: WalkCard component

**Files:**
- Create: `src/components/cards/WalkCard.jsx`

- [ ] **Step 1: Create `src/components/cards/WalkCard.jsx`**

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WalkJournal from './WalkJournal.jsx'

/**
 * Single walk card with expand/collapse.
 * isOpen / onToggle: controlled from WalksSection (one-open-at-a-time)
 */
export default function WalkCard({ walk, isOpen, onToggle }) {
  const leadImage = walk.images[0] ?? null

  return (
    <article
      className="border rounded-sm overflow-hidden transition-shadow"
      style={{
        borderColor: '#d4c4a8',
        background: '#faf8f4',
        boxShadow: isOpen ? '0 4px 24px rgba(45,37,32,0.1)' : 'none',
      }}
    >
      {/* Card header — always visible */}
      <div
        className="flex items-start gap-4 p-6 cursor-pointer select-none"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        {/* Walk number */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm"
          style={{
            width: '36px',
            height: '36px',
            background: '#2d2520',
            color: '#f5f0e8',
            fontSize: '12px',
          }}
        >
          {String(walk.id).padStart(2, '0')}
        </div>

        {/* Lead photo thumbnail */}
        {leadImage ? (
          <div
            className="flex-shrink-0 overflow-hidden rounded-sm"
            style={{ width: '80px', height: '60px' }}
          >
            <img
              src={leadImage}
              alt={walk.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0 rounded-sm flex items-center justify-center"
            style={{ width: '80px', height: '60px', background: '#e0d8cc' }}
          >
            <span className="text-xs text-sand-accent">soon</span>
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-widest uppercase text-sand-accent font-semibold mb-1">
            {walk.location}
          </p>
          <p
            className="font-light italic leading-snug"
            style={{ fontSize: '17px', color: '#2d2520' }}
          >
            "{walk.question}"
          </p>
        </div>

        {/* Expand indicator */}
        <div
          className="flex-shrink-0 self-center transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#a08060" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Expanded journal — motion.div is direct AnimatePresence child so exit plays */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="journal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6 relative">
              {/* Close button */}
              <button
                onClick={onToggle}
                className="absolute top-0 right-6 text-sand-accent hover:text-text-primary transition-colors"
                aria-label="Close journal"
                style={{ fontSize: '20px', lineHeight: 1 }}
              >
                ×
              </button>
              <WalkJournal walk={walk} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cards/WalkCard.jsx
git commit -m "feat: add WalkCard component with controlled expand/collapse"
```

---

### Task 17: WalksSection

**Files:**
- Create: `src/components/sections/WalksSection.jsx`

- [ ] **Step 1: Create `src/components/sections/WalksSection.jsx`**

```jsx
import { useState } from 'react'
import { walks } from '../../data/walks.js'
import WalkCard from '../cards/WalkCard.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

export default function WalksSection() {
  const [openId, setOpenId] = useState(null)

  function handleToggle(id) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="relative bg-cream py-24 px-6 md:px-16 overflow-hidden">
      <ThreeScene
        objectType="bench"
        className="absolute top-16 right-8 w-36 h-36 hidden md:block"
        mobilePosition={{ top: '16px', right: '16px' }}
      />

      {/* Section header */}
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-widest uppercase text-sand-accent font-semibold mb-3">
          Walks done
        </p>
        <h2 className="text-4xl font-light" style={{ color: '#2d2520' }}>
          The walks <strong className="font-bold">we've done</strong>
        </h2>
      </div>

      {/* Walk cards */}
      <div className="max-w-3xl flex flex-col gap-4">
        {walks.map((walk) => (
          <WalkCard
            key={walk.id}
            walk={walk}
            isOpen={openId === walk.id}
            onToggle={() => handleToggle(walk.id)}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

Add `<WalksSection />` after `<RoadFork />`.

- [ ] **Step 3: Verify**

Open walk cards, confirm only one can be open at a time. Journal expands and collapses with animation.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WalksSection.jsx src/components/cards/ src/App.jsx
git commit -m "feat: add walks section with 12 expandable walk cards"
```

---

## Chunk 8: Next Walks Section & Final App Assembly

### Task 18: NextWalksSection

**Files:**
- Create: `src/components/sections/NextWalksSection.jsx`

- [ ] **Step 1: Create `src/components/sections/NextWalksSection.jsx`**

```jsx
import { motion } from 'framer-motion'
import { nextWalks } from '../../data/walks.js'

export default function NextWalksSection() {
  return (
    <section className="relative bg-linen py-24 px-6 md:px-16 overflow-hidden">
      {/* Section header */}
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-widest uppercase text-sand-accent font-semibold mb-3">
          Coming up
        </p>
        <h2 className="text-4xl font-light" style={{ color: '#2d2520' }}>
          What's <strong className="font-bold">next</strong>
        </h2>
      </div>

      {/* Upcoming walk cards */}
      <div className="max-w-3xl flex flex-col gap-4 mb-16">
        {nextWalks.map((walk) => (
          <motion.div
            key={walk.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-6 p-6 rounded-sm"
            style={{ background: '#f5f0e8', border: '1px solid #d4c4a8' }}
          >
            <div
              className="flex-shrink-0 font-black"
              style={{ fontSize: '36px', color: '#c8b89a', lineHeight: 1 }}
            >
              {walk.id}
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#2d2520' }}>
                {walk.location}
              </p>
              <p className="text-sm text-text-secondary font-light mt-1">{walk.date}</p>
              <p className="text-sm text-text-secondary font-light mt-1">{walk.teaser}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Signal CTA */}
      <div className="max-w-3xl">
        <p className="text-text-secondary font-light mb-6 leading-relaxed max-w-md">
          Want to join a walk? We share details, dates, and locations through Signal.
          Come as you are.
        </p>

        <a
          href="https://signal.me/#placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-semibold transition-opacity hover:opacity-70"
          style={{
            border: '2px solid #2d2520',
            padding: '14px 24px',
            borderRadius: '4px',
            color: '#2d2520',
            textDecoration: 'none',
          }}
        >
          {/* Signal icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.47-4.52-1.28l-.32-.19-3.32.87.87-3.32-.19-.32A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          Join via Signal
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to App.jsx and finalise assembly**

Replace `src/App.jsx` with the complete assembly:

```jsx
import IntroSection from './components/sections/IntroSection.jsx'
import FootstepsSection from './components/sections/FootstepsSection.jsx'
import NarrativeSection from './components/sections/NarrativeSection.jsx'
import StampSection from './components/sections/StampSection.jsx'
import PeopleSection from './components/sections/PeopleSection.jsx'
import RoadFork from './components/sections/RoadFork.jsx'
import WalksSection from './components/sections/WalksSection.jsx'
import NextWalksSection from './components/sections/NextWalksSection.jsx'

export default function App() {
  return (
    <main className="bg-cream">
      <IntroSection />
      <FootstepsSection />
      <NarrativeSection />
      <StampSection />
      <PeopleSection />
      <RoadFork />
      <WalksSection />
      <NextWalksSection />
    </main>
  )
}
```

- [ ] **Step 3: Full end-to-end verify**

```bash
npm run dev
```

Walk through the entire page top to bottom. Check:
- [ ] Intro door box renders with layered photos
- [ ] Footsteps animate in on scroll
- [ ] Narrative text section with layered photos
- [ ] Stamp section: footsteps grow, INRELATION stamps in
- [ ] People section: Blasius & Gurden photo visible
- [ ] Road fork: signpost animates on entry
- [ ] All 12 walk cards render; only one opens at a time
- [ ] Walk 2 shows placeholder; Walk 6 has video element
- [ ] Next walks + Signal button renders

- [ ] **Step 4: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/NextWalksSection.jsx src/App.jsx
git commit -m "feat: add next walks section with signal CTA and finalise app assembly"
```

---

## Chunk 9: Build & Deployment Check

### Task 19: Production build verification

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `dist/` folder created, no build errors.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Open `http://localhost:4173` and verify all sections render correctly.

- [ ] **Step 3: Check for console errors**

Open browser devtools. No red errors should appear. Yellow warnings from Three.js/R3F are acceptable.

- [ ] **Step 4: Add `.gitignore` entries**

Ensure `dist/` is in `.gitignore` and `.superpowers/` is ignored:

```
# In .gitignore, add if not present:
dist/
.superpowers/
```

- [ ] **Step 5: Re-run all tests**

```bash
npx vitest run
```

Expected: all tests pass (data integrity + image conversion tests)

- [ ] **Step 6: Final commit**

```bash
git add .gitignore
git commit -m "chore: verify production build and update gitignore"
```

---

## Type Contract

The `threeObjectType` field in `walks.js` uses these exact string values — `ClayObject.jsx` must match them exactly:

| Value | Mesh |
|-------|------|
| `'leaf'` | Rounded sphere |
| `'cobblestone'` | RoundedBox |
| `'pigeon'` | Body + head spheres |
| `'bottle'` | Two cylinders |
| `'sign'` | Box + pole cylinder |
| `'bench'` | Seat box + two leg boxes |

---

## Notes for Implementation

**Image filename normalisation:** The `convert-images.js` script replaces spaces with hyphens in all output filenames (e.g. `5Frankfurter Allee1.HEIC` → `5Frankfurter-Allee1.webp`). All image paths in `walks.js`, `IntroSection`, and `NarrativeSection` already use the hyphenated form. Do not use spaced filenames in `<img src>` attributes.

**HEIC conversion on CI:** If deploying to a CI environment (Netlify, Vercel), Sharp requires a native binary. Add `sharp` to regular `dependencies` (not devDependencies) so it installs in CI. The convert script uses `predev`/`prebuild` hooks — CI runs `npm run build` which triggers `prebuild` automatically.

**React Three Fiber on mobile:** The `useBreakpoint` hook checks `window.innerWidth`. On first render (SSR or before hydration), it defaults to 1200 (desktop). This means 3D always renders initially — the hook corrects it on the client after mount. This is acceptable for this use case.

**ScrollTrigger cleanup:** Each section component accumulates its own `triggers` array during `useEffect`, pushing each `tween.scrollTrigger` reference. The cleanup function kills only those local triggers: `triggers.forEach(t => t.kill())`. Do not use `ScrollTrigger.getAll().forEach(t => t.kill())` — this global kill pattern breaks other sections in React StrictMode.
