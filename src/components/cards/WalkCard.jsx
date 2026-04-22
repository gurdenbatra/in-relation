import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WalkJournal from './WalkJournal.jsx'
import { walkImageAssets } from '../../data/walkImageAssets.js'

function pickDisplayFromPool(urls) {
  if (!urls?.length) return { cover: null, inline: null, journalGallery: [] }
  if (urls.length === 1) {
    return { cover: urls[0], inline: null, journalGallery: [] }
  }
  const a = Math.floor(Math.random() * urls.length)
  let b = Math.floor(Math.random() * urls.length)
  for (let n = 0; n < 24 && b === a; n++) {
    b = Math.floor(Math.random() * urls.length)
  }
  const used = new Set([urls[a], urls[b]])
  const journalGallery = urls.filter((u) => !used.has(u))
  return { cover: urls[a], inline: urls[b], journalGallery }
}

export default function WalkCard({ walk, isOpen, onToggle }) {
  const pool = walkImageAssets[walk.id] ?? []
  const [display] = useState(() => pickDisplayFromPool(pool))
  const { cover, inline, journalGallery } = display
  const coverImage = cover
  const inlineImage = inline

  return (
    <article
      style={{
        width: '100%',
        borderBottom: '1px solid #d4c4a8',
        paddingBottom: isOpen ? '0' : '0',
        background: '#faf8f4',
      }}
    >
      {/* Card header — always visible */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0',
          minHeight: '380px',
        }}
      >
        {/* Left column: walk number + date */}
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

        {/* Right column: cover image + text */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Cover image — large and dominant */}
          {coverImage ? (
            <div
              style={{
                width: '100%',
                height: '260px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={coverImage}
                alt={`${walk.name} walk`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '260px',
                background: '#e0d8cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: '#a08060', textTransform: 'uppercase' }}>Photos coming soon</span>
            </div>
          )}

          {/* Text area */}
          <div style={{ padding: '28px 32px 24px 32px', flex: 1 }}>
            {/* Location label */}
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

            {/* Walk question — Fraunces italic, quote preset. Curly quotes (these
                are real spoken questions), tighter leading, more size. */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontVariationSettings: "'opsz' 96, 'SOFT' 60, 'WONK' 1",
                fontSize: 'clamp(24px, 3.8vw, 40px)',
                color: '#2d2520',
                lineHeight: 1.18,
                letterSpacing: '-0.012em',
                marginBottom: '28px',
                maxWidth: '640px',
                textWrap: 'balance',
              }}
            >
              {'\u201C'}{walk.question}{'\u201D'}
            </h3>

            {/* Inline second image, if available */}
            {inlineImage && (
              <div
                style={{
                  width: '220px',
                  height: '160px',
                  overflow: 'hidden',
                  float: 'right',
                  marginLeft: '28px',
                  marginBottom: '12px',
                  borderRadius: '2px',
                }}
              >
                <img
                  src={inlineImage}
                  alt={`${walk.name} walk detail`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>
            )}

            {/* Journal toggle button */}
            <button
              onClick={onToggle}
              aria-expanded={isOpen}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#7c6f5e',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginTop: '8px',
                clear: 'both',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#2d2520' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#7c6f5e' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transition: 'transform 0.3s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ↓
              </span>
              {isOpen ? 'close notes' : 'read our notes'}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable journal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="journal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '40px 32px 48px calc(72px + 32px)',
                borderTop: '1px solid #e0d8cc',
                background: '#f5f0e8',
              }}
            >
              <WalkJournal
                walk={walk}
                galleryImages={journalGallery}
                videoPosterSrc={coverImage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
