import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WalkJournal from './WalkJournal.jsx'

export default function WalkCard({ walk, isOpen, onToggle }) {
  const coverImage  = walk.images[0] ?? null
  const inlineImage = walk.images[1] ?? null

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
              fontWeight: 900,
              fontSize: '36px',
              lineHeight: 1,
              color: '#d4c4a8',
              letterSpacing: '-0.03em',
            }}
          >
            {String(walk.id).padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
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
              <span style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#a08060', textTransform: 'uppercase' }}>Photos coming soon</span>
            </div>
          )}

          {/* Text area */}
          <div style={{ padding: '28px 32px 24px 32px', flex: 1 }}>
            {/* Location label */}
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#a08060',
                marginBottom: '12px',
              }}
            >
              {walk.location}
            </p>

            {/* Walk question — headline */}
            <h3
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(22px, 3.5vw, 36px)',
                color: '#2d2520',
                lineHeight: 1.3,
                marginBottom: '28px',
                maxWidth: '640px',
              }}
            >
              "{walk.question}"
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
                gap: '6px',
                fontSize: '12px',
                letterSpacing: '0.1em',
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
              <WalkJournal walk={walk} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
