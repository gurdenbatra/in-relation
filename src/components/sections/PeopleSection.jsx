import ThreeScene from '../three/ThreeScene.jsx'

export default function PeopleSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#f5f0e8' }}>
      <ThreeScene objectType="pigeon" className="absolute top-16 right-16 w-40 h-40 hidden md:block" mobilePosition={{ top: '16px', right: '16px' }} />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-4xl mx-8">
        <div className="flex-shrink-0 overflow-hidden rounded-sm" style={{ width: '360px', maxWidth: '90vw', transform: 'rotate(-1.5deg)' }}>
          <img src="/images/IMG_2679.webp" alt="Blasius and Gurden, founders of In Relation" className="w-full h-auto object-cover" loading="lazy" />
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: '#a08060' }}>The walkers</p>
          <h2 className="font-light mb-2" style={{ fontSize: '2.5rem', color: '#2d2520' }}>Blasius <strong className="font-bold">&amp;</strong> Gurden</h2>
          <p className="font-light leading-relaxed mt-4 max-w-sm" style={{ color: '#7c6f5e' }}>Two people who believe that walking slowly through a city is a radical act. In Relation began as a conversation about attention, and grew into a practice.</p>
        </div>
      </div>
    </section>
  )
}
