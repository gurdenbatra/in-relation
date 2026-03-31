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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#ede8df' }}
    >
      {/* Road path SVG */}
      <svg
        width="320" height="200" viewBox="0 0 320 200"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -40%)', opacity: 0.18 }}
      >
        <line x1="160" y1="0" x2="160" y2="80" stroke="#7c6f5e" strokeWidth="4"/>
        <line x1="160" y1="80" x2="20" y2="200" stroke="#7c6f5e" strokeWidth="4"/>
        <line x1="160" y1="80" x2="300" y2="200" stroke="#7c6f5e" strokeWidth="4"/>
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

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Fork label */}
        <p className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#a08060', opacity: 0.7 }}>
          where do you want to go?
        </p>

        {/* Two fork buttons */}
        <div className="flex gap-6 md:gap-12 items-center">
          {/* Left: walks done */}
          <button
            onClick={() => animateWalk('left')}
            className="group flex flex-col items-center gap-3 transition-opacity"
            style={{ opacity: walking === 'right' ? 0.3 : 1 }}
          >
            <div
              className="flex items-center gap-2 font-semibold tracking-wide px-6 py-3 transition-all"
              style={{
                background: '#c8b89a',
                color: '#2d2520',
                fontSize: '14px',
                clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
                paddingRight: '32px',
                transform: walking === 'left' ? 'translateX(-8px)' : 'none',
                transition: 'transform 0.3s',
              }}
            >
              ← and now we write
            </div>
            <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#7c6f5e', textTransform: 'uppercase' }}>walks done</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '60px', background: '#7c6f5e', opacity: 0.3 }} />

          {/* Right: next walks */}
          <button
            onClick={() => animateWalk('right')}
            className="group flex flex-col items-center gap-3 transition-opacity"
            style={{ opacity: walking === 'left' ? 0.3 : 1 }}
          >
            <div
              className="flex items-center gap-2 font-semibold tracking-wide px-6 py-3 transition-all"
              style={{
                background: '#2d2520',
                color: '#f5f0e8',
                fontSize: '14px',
                clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)',
                paddingLeft: '32px',
                transform: walking === 'right' ? 'translateX(8px)' : 'none',
                transition: 'transform 0.3s',
              }}
            >
              and now we walk →
            </div>
            <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#7c6f5e', textTransform: 'uppercase' }}>what's next</span>
          </button>
        </div>

        {/* Dare line — appears after 3 scroll attempts */}
        <div
          style={{
            marginTop: '24px',
            opacity: dareVisible ? 1 : 0,
            transform: dareVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 300, color: '#2d2520', letterSpacing: '0.02em' }}>
            Dare to take a walk with us.
          </p>
        </div>

        {/* Scroll hint (before unlocked) */}
        {!unlocked && scrollAttempts === 0 && (
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a08060', opacity: 0.5, marginTop: '8px' }}>
            choose a path or keep scrolling
          </p>
        )}
      </div>
    </section>
  )
}
