import ThreeScene from '../three/ThreeScene.jsx'

export default function PeopleSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#f5f0e8' }}>
      {/* Berlin TV Tower with two orbiting moons — replaces pigeon */}
      <ThreeScene objectType="fernsehturm" className="absolute top-16 right-16 w-44 h-44 hidden md:block" mobilePosition={{ top: '16px', right: '16px' }} />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-8">
        <div className="flex-shrink-0 overflow-hidden rounded-sm" style={{ width: '360px', maxWidth: '90vw', transform: 'rotate(-1.5deg)' }}>
          <img src="/images/IMG_2679.webp" alt="Blasius and Gurden, founders of In Relation" className="w-full h-auto object-cover" loading="lazy" />
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#a08060',
            marginBottom: '18px',
          }}>
            We found ourselves asking these questions
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'WONK' 1",
            fontWeight: 400,
            fontSize: 'clamp(2.25rem, 5.5vw, 3.5rem)',
            color: '#2d2520',
            letterSpacing: '-0.022em',
            lineHeight: 1.02,
            marginBottom: '8px',
          }}>
            Blasius{' '}
            <em style={{
              fontStyle: 'italic',
              fontWeight: 500,
              fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1",
            }}>
              &amp;
            </em>{' '}
            Gurden
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontVariationSettings: "'wdth' 100, 'opsz' 18",
            fontWeight: 400,
            fontSize: '17px',
            lineHeight: 1.55,
            color: '#7c6f5e',
            marginTop: '20px',
            maxWidth: '26rem',
          }}>
            Two people who believe that walking slowly through a city is a radical act. In Relation began as a conversation about attention, and grew into a practice.
          </p>
        </div>
      </div>
    </section>
  )
}
