import { useEffect, useRef, useMemo } from 'react'
import Footstep from '../ui/Footstep.jsx'

/** Even arc-length spacing; count + spine length set stride (roomier than ultra-dense). */
const HERO_STEP_COUNT = 12
/** Index along the path where the IN RELATION stamp sits (middle of the walk). */
const STAMP_STEP_INDEX = Math.floor(HERO_STEP_COUNT / 2)
const SPINE_SAMPLES = 96

/** Small deterministic PRNG so each page load gets a different winding path. */
function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function cubicBezier2D(p0, p1, p2, p3, t) {
  const u = 1 - t
  const uu = u * u
  const tt = t * t
  const left =
    uu * u * p0.left +
    3 * uu * t * p1.left +
    3 * u * tt * p2.left +
    tt * t * p3.left
  const top =
    uu * u * p0.top +
    3 * uu * t * p1.top +
    3 * u * tt * p2.top +
    tt * t * p3.top
  return { left, top }
}

/**
 * Walking path: random S-curve spine, then **equal arc-length** samples so spacing
 * stays even (similar to FootstepsSection). Shorter spine segment = closer prints.
 */
function buildHeroSteps(rand) {
  const start = {
    left: 82 + rand() * 12,
    top: 22 + rand() * 9,
  }
  const end = {
    left: 6 + rand() * 11,
    top: 68 + rand() * 12,
  }
  const p0 = start
  const p3 = end
  const p1 = {
    left: 12 + rand() * 22,
    top: lerp(start.top, end.top, 0.2 + rand() * 0.14) + (rand() - 0.5) * 14,
  }
  const p2 = {
    left: 68 + rand() * 24,
    top: lerp(start.top, end.top, 0.52 + rand() * 0.14) + (rand() - 0.5) * 16,
  }

  const waveAmp = 3.5 + rand() * 4
  const waveCycles = 0.75 + rand() * 0.55
  const wavePhase = rand() * Math.PI * 2
  const driftPhase = rand() * Math.PI * 2
  const driftAmpL = 5 + rand() * 6
  const driftAmpT = 2.5 + rand() * 3

  // Use most of the Bézier so the path is longer → more space between prints
  const tLo = 0.02 + rand() * 0.025
  const tHi = 0.98 - rand() * 0.025

  const spine = []
  for (let j = 0; j < SPINE_SAMPLES; j++) {
    const u = SPINE_SAMPLES <= 1 ? 0 : j / (SPINE_SAMPLES - 1)
    const t = lerp(tLo, tHi, u)
    spine.push(cubicBezier2D(p0, p1, p2, p3, t))
  }

  const dist = [0]
  for (let j = 1; j < SPINE_SAMPLES; j++) {
    const dx = spine[j].left - spine[j - 1].left
    const dy = spine[j].top - spine[j - 1].top
    dist.push(dist[j - 1] + Math.hypot(dx, dy))
  }
  const totalLen = dist[SPINE_SAMPLES - 1] || 1

  function pointOnSpineAtLength(s) {
    let j = 0
    while (j < SPINE_SAMPLES - 1 && dist[j + 1] < s) j++
    const seg = dist[j + 1] - dist[j] || 1
    const u = (s - dist[j]) / seg
    return {
      left: lerp(spine[j].left, spine[j + 1].left, u),
      top: lerp(spine[j].top, spine[j + 1].top, u),
    }
  }

  const steps = []
  for (let i = 0; i < HERO_STEP_COUNT; i++) {
    const tParam = HERO_STEP_COUNT <= 1 ? 0 : i / (HERO_STEP_COUNT - 1)
    const s = tParam * totalLen
    let { left, top } = pointOnSpineAtLength(s)

    const driftL =
      Math.sin(tParam * Math.PI * 2.1 + driftPhase) * driftAmpL +
      Math.sin(tParam * Math.PI * 4.4 + driftPhase * 1.3) * (driftAmpL * 0.38)
    const driftT =
      Math.cos(tParam * Math.PI * 1.9 + driftPhase * 0.7) * driftAmpT

    left +=
      driftL +
      Math.sin(tParam * Math.PI * 2 * waveCycles + wavePhase) * waveAmp
    top +=
      driftT +
      Math.cos(tParam * Math.PI * 2 * waveCycles * 0.85 + wavePhase * 0.8) * (waveAmp * 0.42)

    top += (i % 2) * 1.15
    left = Math.max(3, Math.min(95, left))
    top = Math.max(8, Math.min(91, top))
    steps.push({
      side: i % 2 === 0 ? 'left' : 'right',
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      scale: 0.76 + tParam * 0.42,
    })
  }
  return steps
}

/** Scroll phase (0–1 within intro section). Longer windows = slower, calmer reveal. */
const Q_IN_END = 0.18
const STEPS_START = 0.22
/** First leg of prints (before stamp at path middle). */
const PRE_STEP_WINDOW = 0.21
/** Second leg (after stamp); trail continues across the screen. */
const POST_STEP_WINDOW = 0.32
const STEP_FADE = 0.072
/** Stamp lands near end of first leg — middle of the walk, not the last print. */
const STAMP_START = STEPS_START + PRE_STEP_WINDOW * 0.88
const STAMP_FADE = 0.11
const POST_STEPS_START = STAMP_START + 0.065
const TEXT_FADE_OUT_START = 0.48
const TEXT_FADE_OUT_END = 0.64
const SUBTITLE_START = 0.66
const SUBTITLE_FADE = 0.17
const DRIFT_START = 0.68

function clamp01(v) { return Math.max(0, Math.min(1, v)) }

export default function IntroSection() {
  const sectionRef    = useRef(null)
  const text1Ref      = useRef(null)
  const stepsRef      = useRef(null)
  const stampWrapRef  = useRef(null)
  const subtitleRef   = useRef(null)
  const stampLanded   = useRef(false)

  const heroSteps = useMemo(() => {
    const seed =
      typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]
        : (Date.now() ^ (Math.floor(Math.random() * 0xffffffff) >>> 0)) >>> 0
    return buildHeroSteps(mulberry32(seed))
  }, [])

  useEffect(() => {
    const handler = () => {
      const el = sectionRef.current
      if (!el) return
      const rect     = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = clamp01(-rect.top / scrollable)

      // Layer 1: question — fades in first; holds; eases out as stamp dominates
      const qIn = clamp01(p / Q_IN_END)
      const qOut =
        p < TEXT_FADE_OUT_START
          ? 1
          : 1 - clamp01((p - TEXT_FADE_OUT_START) / (TEXT_FADE_OUT_END - TEXT_FADE_OUT_START)) * 0.92
      text1Ref.current.style.opacity = qIn * qOut
      text1Ref.current.style.transform = `translateY(${(1 - qIn) * 18}px)`

      // Layer 2: footsteps — first leg → stamp at path middle → second leg
      const n = HERO_STEP_COUNT
      const preCount = STAMP_STEP_INDEX
      const postCount = n - STAMP_STEP_INDEX - 1
      let childIdx = 0
      const stepEls = stepsRef.current.children
      for (let i = 0; i < n; i++) {
        if (i === STAMP_STEP_INDEX) continue
        const el = stepEls[childIdx++]
        let revealAt
        if (i < STAMP_STEP_INDEX) {
          revealAt =
            preCount > 0 ? STEPS_START + (i / preCount) * PRE_STEP_WINDOW * 0.92 : STEPS_START
        } else {
          const j = i - STAMP_STEP_INDEX - 1
          revealAt =
            postCount > 0
              ? POST_STEPS_START + (j / postCount) * POST_STEP_WINDOW * 0.92
              : POST_STEPS_START
        }
        el.style.opacity = clamp01((p - revealAt) / STEP_FADE)
      }

      // Layer 3: IN RELATION — same landing behavior, after trail builds
      const stampP = clamp01((p - STAMP_START) / STAMP_FADE)
      if (stampP > 0.5 && !stampLanded.current) {
        stampLanded.current = true
        stampWrapRef.current.classList.add('stamp-landed')
      }
      if (stampP === 0) {
        stampLanded.current = false
        stampWrapRef.current.classList.remove('stamp-landed')
        stampWrapRef.current.style.opacity = 0
      } else {
        stampWrapRef.current.style.opacity = stampP
      }

      // Parallax: drift stamp upward late in the scroll
      const drift = clamp01((p - DRIFT_START) / (1 - DRIFT_START)) * -30
      stampWrapRef.current.style.marginTop = `${drift}px`

      // Layer 4: subtitle
      subtitleRef.current.style.opacity = clamp01((p - SUBTITLE_START) / SUBTITLE_FADE)
      subtitleRef.current.style.transform = `translateY(${(1 - clamp01((p - SUBTITLE_START) / SUBTITLE_FADE)) * 12}px)`
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    // Outer section is tall so scroll triggers the reveal sequence
    <section ref={sectionRef} style={{ height: '430vh' }}>
      {/* Sticky inner viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Background: solid under masked video so faded regions read as a calm plate behind type */}
        <div
          aria-hidden
          style={{ position: 'absolute', inset: 0, background: '#2d2520' }}
        />
        {/* Video with vertical opacity mask — weaker coverage behind headline, stamp, and subtitle */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 14%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0.2) 82%, rgba(255,255,255,0) 94%)',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskImage:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 14%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,0.2) 82%, rgba(255,255,255,0) 94%)',
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
          }}
        >
          <source src="/20240422_080204.mp4" type="video/mp4" />
        </video>

        {/* Subtle vignette overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }} />

        {/* === Layer 1: Opening question === */}
        <div
          ref={text1Ref}
          style={{
            position: 'absolute', top: '22%', left: 0, right: 0,
            textAlign: 'center', padding: '0 5vw',
            opacity: 0, transition: 'opacity 0.1s, transform 0.1s',
          }}
        >
          {/* Hero whisper — Fraunces italic, organic (WONK=1, SOFT=100).
              Bigger + tighter than before. Intentional line breaks so the sentence
              reads as three breaths, with "whispered its secrets" carrying the weight. */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1",
            fontSize: 'clamp(30px, 6vw, 76px)',
            color: '#ede8df',
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
            textWrap: 'balance',
            maxWidth: '18ch',
            margin: '0 auto',
          }}>
            When was the last time the city{' '}
            <em style={{
              fontStyle: 'italic',
              fontWeight: 500,
              fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
              color: '#faf6ec',
            }}>
              whispered its secrets
            </em>{' '}
            to you?
          </p>
        </div>

        {/* === Layer 2: Footstep trail (middle index is stamp only) === */}
        <div ref={stepsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
          {heroSteps.map((s, i) =>
            i === STAMP_STEP_INDEX ? null : (
              <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, opacity: 0 }}>
                <Footstep side={s.side} scale={s.scale} style={{ filter: 'brightness(1.45) opacity(0.58)' }} />
              </div>
            ),
          )}
        </div>

        {/* === Layer 3: IN RELATION stamp — anchored to midpoint of path === */}
        {/* IN RELATION stamp — Fraunces 900 at opsz 144 (the "inky" preset).
            Tight negative tracking so the letters crowd like real stamped ink.
            Thicker frame, subtle tilt, dual shadow for a pressed-into-paper feel. */}
        <div
          ref={stampWrapRef}
          className="intro-stamp-wrap"
          style={{
            position: 'absolute',
            top: heroSteps[STAMP_STEP_INDEX]?.top ?? '50%',
            left: heroSteps[STAMP_STEP_INDEX]?.left ?? '50%',
            transform: 'translate(-50%, -50%) rotate(-2.4deg) scale(1.12)',
            opacity: 0,
            border: '9px solid rgba(245,240,232,0.92)',
            boxShadow: 'inset 0 0 0 2px rgba(245,240,232,0.18), 0 2px 0 rgba(0,0,0,0.18)',
            padding: '6px 34px 14px',
            whiteSpace: 'nowrap',
            transition: 'margin-top 0.1s',
            zIndex: 6,
          }}
        >
          <div className="stamp-impact-foot">
            <Footstep side="right" scale={1.35} style={{ filter: 'brightness(1.3) opacity(0.95)' }} />
          </div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontVariationSettings: "'opsz' 144, 'SOFT' 20, 'WONK' 1",
            fontSize: 'clamp(64px, 15.5vw, 184px)',
            color: 'rgba(245,240,232,0.96)',
            letterSpacing: '-0.035em',
            lineHeight: 0.84,
            textAlign: 'center',
            textTransform: 'uppercase',
            textShadow: '0 0 1px rgba(245,240,232,0.18)',
          }}>
            IN<br />RELATION
          </p>
        </div>

        {/* === Layer 4: Subtitle === */}
        <div
          ref={subtitleRef}
          style={{
            position: 'absolute', bottom: '18%', left: 0, right: 0,
            textAlign: 'center', padding: '0 5vw',
            opacity: 0, transition: 'opacity 0.1s, transform 0.1s',
          }}
        >
          {/* Subtitle — Fraunces italic, quote preset. Bigger than before so it
              answers the whisper instead of muttering after it. Widened tracking
              gives it the breath of a spoken question. */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontVariationSettings: "'opsz' 96, 'SOFT' 60, 'WONK' 1",
            fontSize: 'clamp(20px, 3.4vw, 40px)',
            color: 'rgba(245,240,232,0.82)',
            letterSpacing: '0.002em',
            lineHeight: 1.25,
            textWrap: 'balance',
            maxWidth: '22ch',
            margin: '0 auto',
          }}>
            What if all you needed was a{' '}
            <span style={{ fontWeight: 500, color: 'rgba(250,246,236,0.94)' }}>
              conscious walk
            </span>?
          </p>
        </div>

        {/* Scroll hint — fades out as user starts scrolling */}
        <p style={{
          position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'rgba(200,184,154,0.55)', userSelect: 'none',
        }}>
          scroll ↓
        </p>
      </div>
    </section>
  )
}
