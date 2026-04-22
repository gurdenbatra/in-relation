import { useRef, useState, useEffect, useCallback } from 'react'
import Footstep from '../ui/Footstep.jsx'

// Footstep trails for left/right click animations
const LEFT_STEPS  = [5, 4, 3, 2, 1, 0].map((i) => ({ side: i % 2 === 0 ? 'left' : 'right', x: `${20 - i * 7}%`, y: `${50 + (i % 2 === 0 ? -4 : 4)}%` }))
const RIGHT_STEPS = [0, 1, 2, 3, 4, 5].map((i) => ({ side: i % 2 === 0 ? 'left' : 'right', x: `${50 + i * 7}%`, y: `${50 + (i % 2 === 0 ? -4 : 4)}%` }))

export default function RoadFork() {
  const sectionRef        = useRef(null)
  const [walking, setWalking]           = useState(null) // 'left' | 'right' | null
  const [walkStep, setWalkStep]         = useState(-1)
  const [scrollAttempts, setScrollAttempts] = useState(0)
  const [dareVisible, setDareVisible]   = useState(false)
  const [unlocked, setUnlocked]         = useState(false)
  const [hoverFork, setHoverFork]       = useState(null) // 'left' | 'right' | null
  const scrollResistRef = useRef(false)

  // Scroll resistance: count attempts and eventually unlock
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      scrollResistRef.current = entry.isIntersecting && !unlocked
    }, { threshold: 0.6 })
    observer.observe(section)

    const handleWheel = (e) => {
      if (!scrollResistRef.current || unlocked) return
      if (e.deltaY < 10) return // only downward scroll
      e.preventDefault()
      setScrollAttempts((prev) => {
        const next = prev + 1
        if (next >= 3) {
          setDareVisible(true)
          setTimeout(() => {
            setUnlocked(true)
            scrollResistRef.current = false
          }, 1800)
        }
        return next
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      observer.disconnect()
      window.removeEventListener('wheel', handleWheel)
    }
  }, [unlocked])

  const animateWalk = useCallback((direction) => {
    if (walking) return
    setWalking(direction)
    setWalkStep(0)
    const steps = direction === 'left' ? LEFT_STEPS : RIGHT_STEPS
    let i = 0
    const interval = setInterval(() => {
      i++
      setWalkStep(i)
      if (i >= steps.length) {
        clearInterval(interval)
        // Scroll to target section after walk animation
        setTimeout(() => {
          const targetId = direction === 'left' ? 'walks-done' : 'next-walks'
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
          setWalking(null)
          setWalkStep(-1)
        }, 300)
      }
    }, 160)
  }, [walking])

  const steps = walking === 'left' ? LEFT_STEPS : RIGHT_STEPS

  const branchTransition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, stroke-width 0.35s ease'

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#ede8df' }}
    >
      {/* Road path SVG — branches nudge on button hover */}
      <svg
        width="320" height="200" viewBox="0 0 320 200"
        className="pointer-events-none"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -40%)' }}
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <line x1="160" y1="0" x2="160" y2="80" stroke="#7c6f5e" strokeWidth="4" opacity={0.2} />
          <g
            style={{
              transform:
                hoverFork === 'left'
                  ? 'translate(-8px, 4px) rotate(-2.5deg)'
                  : 'translate(0, 0) rotate(0deg)',
              transformOrigin: '160px 80px',
              transition: branchTransition,
              opacity: hoverFork === 'left' ? 0.42 : hoverFork === 'right' ? 0.14 : 0.22,
            }}
          >
            <line
              x1="160" y1="80" x2="20" y2="200"
              stroke="#7c6f5e"
              strokeWidth={hoverFork === 'left' ? 5 : 4}
              style={{ transition: 'stroke-width 0.35s ease' }}
            />
          </g>
          <g
            style={{
              transform:
                hoverFork === 'right'
                  ? 'translate(8px, 4px) rotate(2.5deg)'
                  : 'translate(0, 0) rotate(0deg)',
              transformOrigin: '160px 80px',
              transition: branchTransition,
              opacity: hoverFork === 'right' ? 0.42 : hoverFork === 'left' ? 0.14 : 0.22,
            }}
          >
            <line
              x1="160" y1="80" x2="300" y2="200"
              stroke="#7c6f5e"
              strokeWidth={hoverFork === 'right' ? 5 : 4}
              style={{ transition: 'stroke-width 0.35s ease' }}
            />
          </g>
        </g>
      </svg>

      {/* Walking footstep animation overlay */}
      {walking && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {steps.slice(0, walkStep + 1).map((s, i) => (
            <div key={i} style={{ position: 'absolute', left: s.x, top: s.y, opacity: 1 - (walkStep - i) * 0.15 }}>
              <Footstep side={s.side} scale={0.9} />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col w-full max-w-4xl mx-auto px-4">
        {/* Fork label — larger, higher in section */}
        <p
          className="text-center uppercase shrink-0"
          style={{
            fontFamily: 'var(--font-sans)',
            fontVariationSettings: "'wdth' 100, 'opsz' 14",
            fontWeight: 600,
            color: '#a08060',
            opacity: 0.88,
            fontSize: 'clamp(0.9375rem, 2.4vw, 1.1875rem)',
            letterSpacing: '0.22em',
            lineHeight: 1.35,
            paddingTop: 'clamp(3.5rem, 10vh, 5.5rem)',
            paddingBottom: '0.5rem',
          }}
        >
          where do you want to go?
        </p>

        <div className="flex-1 flex flex-col items-center justify-center gap-10 min-h-[min(280px,40vh)]">
          {/* Two fork buttons */}
          <div className="flex gap-6 md:gap-12 items-center">
            {/* Left: walks done */}
            <button
              type="button"
              onClick={() => animateWalk('left')}
              onMouseEnter={() => setHoverFork('left')}
              onMouseLeave={() => setHoverFork(null)}
              className="group flex flex-col items-center gap-3 transition-opacity duration-300"
              style={{ opacity: walking === 'right' ? 0.3 : 1 }}
            >
              <div
                className="flex items-center gap-2 px-6 py-3 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariationSettings: "'wdth' 90, 'opsz' 14",
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  background: hoverFork === 'left' ? '#b8a888' : '#c8b89a',
                  color: '#2d2520',
                  fontSize: '14px',
                  clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
                  paddingRight: '32px',
                  boxShadow: hoverFork === 'left' ? '0 10px 28px rgba(45,37,32,0.14)' : '0 4px 14px rgba(45,37,32,0.06)',
                  transform:
                    walking === 'left'
                      ? 'translateX(-8px) scale(1)'
                      : hoverFork === 'left'
                        ? 'translateX(-6px) scale(1.04)'
                        : 'translateX(0) scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease, box-shadow 0.35s ease',
                }}
              >
                ← and now we write
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: '#7c6f5e', textTransform: 'uppercase' }}>walks done</span>
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '60px', background: '#7c6f5e', opacity: 0.3 }} />

            {/* Right: next walks */}
            <button
              type="button"
              onClick={() => animateWalk('right')}
              onMouseEnter={() => setHoverFork('right')}
              onMouseLeave={() => setHoverFork(null)}
              className="group flex flex-col items-center gap-3 transition-opacity duration-300"
              style={{ opacity: walking === 'left' ? 0.3 : 1 }}
            >
              <div
                className="flex items-center gap-2 px-6 py-3 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontVariationSettings: "'wdth' 90, 'opsz' 14",
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  background: hoverFork === 'right' ? '#3d342c' : '#2d2520',
                  color: '#f5f0e8',
                  fontSize: '14px',
                  clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)',
                  paddingLeft: '32px',
                  boxShadow: hoverFork === 'right' ? '0 12px 32px rgba(45,37,32,0.28)' : '0 4px 14px rgba(45,37,32,0.12)',
                  transform:
                    walking === 'right'
                      ? 'translateX(8px) scale(1)'
                      : hoverFork === 'right'
                        ? 'translateX(6px) scale(1.04)'
                        : 'translateX(0) scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease, box-shadow 0.35s ease',
                }}
              >
                and now we walk →
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: '#7c6f5e', textTransform: 'uppercase' }}>what's next</span>
            </button>
          </div>

          {/* Scroll hint (before unlocked) */}
          {!unlocked && scrollAttempts === 0 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#a08060', opacity: 0.5, marginTop: '4px' }}>
              choose a path or keep scrolling
            </p>
          )}
        </div>

        {/* Dare line — lower in section, display typography */}
        <div
          className="shrink-0 text-center"
          style={{
            paddingBottom: 'clamp(2.5rem, 8vh, 5rem)',
            paddingTop: '1.5rem',
            opacity: dareVisible ? 1 : 0,
            transform: dareVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* A dare is a statement, not a question — goes upright, heavy Fraunces.
              The wonky soft axis keeps it warm, not aggressive. */}
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'WONK' 1",
              fontSize: 'clamp(1.75rem, 4.4vw, 3rem)',
              fontWeight: 700,
              fontStyle: 'normal',
              color: '#2d2520',
              letterSpacing: '-0.022em',
              lineHeight: 1.05,
              maxWidth: '14em',
              margin: '0 auto',
              textWrap: 'balance',
            }}
          >
            Dare to take a walk with us.
          </p>
        </div>
      </div>
    </section>
  )
}
