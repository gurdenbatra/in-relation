import { motion } from 'framer-motion'
import { nextWalks } from '../../data/walks.js'

export default function NextWalksSection() {
  return (
    <section
      id="next-walks"
      className="relative overflow-hidden"
      style={{ background: '#ede8df', paddingTop: '80px', paddingBottom: '80px' }}
    >
      {/* Section header — mirrors walks-done layout */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 28px',
          marginBottom: '56px',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#a08060',
          marginBottom: '14px',
        }}>
          coming up
        </p>
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
            walk
          </em>
        </h2>
      </div>

      {/* Next walk cards — same structure as WalkCard but simpler (no images yet) */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 0', marginBottom: '64px' }}>
        {nextWalks.map((walk, idx) => (
          <motion.article
            key={walk.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.1 }}
            style={{
              width: '100%',
              borderBottom: '1px solid #d4c4a8',
              background: '#f5f0e8',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              minHeight: '200px',
            }}
          >
            {/* Walk number column */}
            <div
              style={{
                width: '72px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '32px 0 32px 28px',
                borderRight: '1px solid #e0d8cc',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontVariationSettings: "'opsz' 144, 'SOFT' 40, 'WONK' 1",
                  fontFeatureSettings: '"tnum", "lnum"',
                  fontWeight: 800,
                  fontSize: '48px',
                  lineHeight: 1,
                  color: '#d4c4a8',
                  letterSpacing: '-0.04em',
                }}
              >
                {String(walk.id).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#a08060',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {walk.date}
              </span>
            </div>

            {/* Content column */}
            <div style={{ padding: '32px 32px 32px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Location placeholder */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontVariationSettings: "'wdth' 100, 'opsz' 14",
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#a08060',
                    marginBottom: '14px',
                  }}
                >
                  {walk.location}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 96, 'SOFT' 60, 'WONK' 1",
                    fontSize: 'clamp(22px, 3.4vw, 34px)',
                    color: '#2d2520',
                    lineHeight: 1.22,
                    letterSpacing: '-0.01em',
                    marginBottom: '16px',
                    textWrap: 'balance',
                  }}
                >
                  {walk.teaser}
                </h3>
              </div>

              {/* Future indicator */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#a08060',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#c8b89a',
                    animation: 'pulse 2s infinite',
                  }}
                />
                Upcoming
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Signal CTA */}
      {/* <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 28px' }}>
        <p
          className="font-light mb-6 leading-relaxed max-w-md"
          style={{ color: '#7c6f5e' }}
        >
          Want to join a walk? We share details, dates, and locations through Signal. Come as you are.
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.47-4.52-1.28l-.32-.19-3.32.87.87-3.32-.19-.32A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          Join via Signal
        </a>
      </div> */}
    </section>
  )
}
