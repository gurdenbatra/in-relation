import { useEffect, useRef } from 'react'
import Footstep from '../ui/Footstep.jsx'

// Hero footstep trail: walks diagonally across the lower third
const HERO_STEPS = [
  { side: 'left',  left: '8%',  top: '68%' },
  { side: 'right', left: '17%', top: '72%' },
  { side: 'left',  left: '26%', top: '70%' },
  { side: 'right', left: '35%', top: '73%' },
  { side: 'left',  left: '44%', top: '70%' },
  { side: 'right', left: '53%', top: '73%' },
  { side: 'left',  left: '62%', top: '70%' },
  { side: 'right', left: '71%', top: '73%' },
  { side: 'left',  left: '80%', top: '70%' },
]

function clamp01(v) { return Math.max(0, Math.min(1, v)) }

export default function IntroSection() {
  const sectionRef    = useRef(null)
  const text1Ref      = useRef(null)
  const stepsRef      = useRef(null)
  const stampWrapRef  = useRef(null)
  const subtitleRef   = useRef(null)
  const stampLanded   = useRef(false)

  useEffect(() => {
    const handler = () => {
      const el = sectionRef.current
      if (!el) return
      const rect     = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = clamp01(-rect.top / scrollable)

      // Layer 1: question text (0 → 0.15)
      text1Ref.current.style.opacity   = clamp01(p / 0.15)
      text1Ref.current.style.transform = `translateY(${(1 - clamp01(p / 0.15)) * 18}px)`

      // Layer 2: footstep trail (0.18 → 0.38), each step offset
      const steps = stepsRef.current.children
      for (let i = 0; i < steps.length; i++) {
        const start = 0.18 + i * (0.20 / steps.length)
        steps[i].style.opacity = clamp01((p - start) / 0.06)
      }

      // Layer 3: IN RELATION stamp (0.38 → 0.55) — lands once
      const stampP = clamp01((p - 0.38) / 0.08)
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

      // Parallax: as we near end (0.6→1), drift stamp upward
      const drift = clamp01((p - 0.6) / 0.4) * -30
      stampWrapRef.current.style.marginTop = `${drift}px`

      // Layer 4: subtitle (0.58 → 0.75)
      subtitleRef.current.style.opacity   = clamp01((p - 0.58) / 0.15)
      subtitleRef.current.style.transform = `translateY(${(1 - clamp01((p - 0.58) / 0.15)) * 12}px)`
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    // Outer section is tall so scroll triggers the reveal sequence
    <section ref={sectionRef} style={{ height: '350vh' }}>
      {/* Sticky inner viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Background: video if available, else dark gradient fallback */}
        {/* TODO: replace with video path when a hero video is available */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #1a1208 0%, #2d2520 50%, #0e0c08 100%)',
        }} />

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
          <p style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(20px, 3.5vw, 38px)',
            color: '#ede8df',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}>
            When was the last time the city whispered its secrets to you?
          </p>
        </div>

        {/* === Layer 2: Footstep trail === */}
        <div ref={stepsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {HERO_STEPS.map((s, i) => (
            <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, opacity: 0 }}>
              <Footstep side={s.side} scale={0.9} style={{ filter: 'brightness(1.8) opacity(0.65)' }} />
            </div>
          ))}
        </div>

        {/* === Layer 3: IN RELATION stamp === */}
        <div
          ref={stampWrapRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(1.15)',
            opacity: 0,
            border: '7px solid rgba(245,240,232,0.9)',
            padding: '10px 32px',
            whiteSpace: 'nowrap',
            transition: 'margin-top 0.1s',
          }}
        >
          <p style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(44px, 10vw, 90px)',
            color: 'rgba(245,240,232,0.92)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textAlign: 'center',
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
          <p style={{
            fontWeight: 300,
            fontSize: 'clamp(16px, 2vw, 22px)',
            color: 'rgba(245,240,232,0.75)',
            letterSpacing: '0.04em',
          }}>
            What if all you needed was a conscious walk?
          </p>
        </div>

        {/* Scroll hint — fades out as user starts scrolling */}
        <p style={{
          position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
          fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(200,184,154,0.5)', userSelect: 'none',
        }}>
          scroll
        </p>
      </div>
    </section>
  )
}
