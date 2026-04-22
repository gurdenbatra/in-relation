import { useState, useEffect, useRef } from 'react'
import { walks } from '../../data/walks.js'
import WalkCard from '../cards/WalkCard.jsx'

/** Two stick figures on a bench. When `standing` is true they animate upright. */
function BenchFigures({ standing }) {
  return (
    <svg
      width="120" height="80" viewBox="0 0 120 80" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    >
      {/* Bench seat */}
      <rect x="10" y="54" width="100" height="5" rx="2.5" fill="#c8b89a"/>
      {/* Bench legs */}
      <rect x="16" y="59" width="4" height="16" rx="2" fill="#c8b89a"/>
      <rect x="100" y="59" width="4" height="16" rx="2" fill="#c8b89a"/>

      {/* Figure 1 (left) */}
      <g
        style={{
          transform: standing ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.6s ease-out',
          transformOrigin: '38px 54px',
        }}
      >
        {/* Head */}
        <circle cx="38" cy="28" r="7" fill="#a08060"/>
        {/* Body */}
        <line x1="38" y1="35" x2="38" y2="54" stroke="#a08060" strokeWidth="3" strokeLinecap="round"/>
        {/* Arms — relaxed when sitting, slightly raised when standing */}
        <line x1="38" y1="40" x2={standing ? '26' : '28'} y2={standing ? '36' : '48'} stroke="#a08060" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="38" y1="40" x2={standing ? '50' : '48'} y2={standing ? '36' : '48'} stroke="#a08060" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Legs */}
        <line x1="38" y1="54" x2={standing ? '32' : '30'} y2={standing ? '68' : '62'} stroke="#a08060" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="38" y1="54" x2={standing ? '44' : '46'} y2={standing ? '68' : '62'} stroke="#a08060" strokeWidth="2.5" strokeLinecap="round"/>
      </g>

      {/* Figure 2 (right) */}
      <g
        style={{
          transform: standing ? 'translateY(-10px)' : 'translateY(0)',
          transition: 'transform 0.6s ease-out 0.15s',
          transformOrigin: '82px 54px',
        }}
      >
        {/* Head */}
        <circle cx="82" cy="28" r="7" fill="#7c6f5e"/>
        {/* Body */}
        <line x1="82" y1="35" x2="82" y2="54" stroke="#7c6f5e" strokeWidth="3" strokeLinecap="round"/>
        {/* Arms */}
        <line x1="82" y1="40" x2={standing ? '70' : '72'} y2={standing ? '36' : '48'} stroke="#7c6f5e" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="82" y1="40" x2={standing ? '94' : '92'} y2={standing ? '36' : '48'} stroke="#7c6f5e" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Legs */}
        <line x1="82" y1="54" x2={standing ? '76' : '74'} y2={standing ? '68' : '62'} stroke="#7c6f5e" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="82" y1="54" x2={standing ? '88' : '90'} y2={standing ? '68' : '62'} stroke="#7c6f5e" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

export default function WalksSection() {
  const [openId, setOpenId]     = useState(null)
  const [standing, setStanding] = useState(false)
  const sectionRef = useRef(null)

  function handleToggle(id) { setOpenId((prev) => (prev === id ? null : id)) }

  const walkCount = walks.length
  const walksDoneLabel = `${walkCount} walk${walkCount === 1 ? '' : 's'} done`

  // Trigger sit→stand when user reaches the NextWalks section
  useEffect(() => {
    const nextWalksSection = document.getElementById('next-walks')
    if (!nextWalksSection) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStanding(true) },
      { threshold: 0.3 }
    )
    observer.observe(nextWalksSection)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="walks-done"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#f5f0e8', paddingTop: '80px', paddingBottom: '80px' }}
    >
      {/* Section header */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 28px',
          marginBottom: '56px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#a08060',
              marginBottom: '14px',
            }}>
              {walksDoneLabel}
            </p>
            {/* Display pair: roman Fraunces + italic emphasis. The italic on the
                verb is the whole point — the action of "writing" leans in. */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1",
              fontWeight: 400,
              fontSize: 'clamp(2.25rem, 6.2vw, 4rem)',
              color: '#2d2520',
              letterSpacing: '-0.022em',
              lineHeight: 1,
            }}>
              and now we{' '}
              <em style={{
                fontStyle: 'italic',
                fontWeight: 600,
                fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1",
              }}>
                write
              </em>
            </h2>
          </div>
          {/* Bench illustration with sit→stand animation */}
          <BenchFigures standing={standing} />
        </div>
      </div>

      {/* Walk cards — full width, stacked */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 0' }}>
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
