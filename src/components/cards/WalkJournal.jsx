// No framer-motion import needed — motion.div lives in WalkCard
export default function WalkJournal({ walk, galleryImages = [], videoPosterSrc }) {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontVariationSettings: "'wdth' 100, 'opsz' 18",
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: 1.6,
        color: '#6e604f',
        maxWidth: '36rem',
        marginBottom: '24px',
      }}>{walk.journalText}</p>
      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {galleryImages.map((src, i) => (
            <div key={src} className="overflow-hidden rounded-sm aspect-video">
              <img src={src} alt={`${walk.name} walk photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
      {walk.video && (
        <div className="mt-4 overflow-hidden rounded-sm" style={{ maxWidth: '480px' }}>
          <video autoPlay muted loop playsInline poster={videoPosterSrc ?? undefined} className="w-full">
            <source src={walk.video} />
          </video>
        </div>
      )}
      {walk.hasPlaceholder && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#a08060',
          marginTop: '10px',
        }}>Photos from this walk coming soon</p>
      )}
    </div>
  )
}
