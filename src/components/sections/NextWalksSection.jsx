import { motion } from 'framer-motion'
import { nextWalks } from '../../data/walks.js'

export default function NextWalksSection() {
  return (
    <section className="relative py-24 px-6 md:px-16 overflow-hidden" style={{ background: '#ede8df' }}>
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: '#a08060' }}>Coming up</p>
        <h2 className="font-light" style={{ fontSize: '2.5rem', color: '#2d2520' }}>What's <strong className="font-bold">next</strong></h2>
      </div>
      <div className="max-w-3xl flex flex-col gap-4 mb-16">
        {nextWalks.map((walk) => (
          <motion.div key={walk.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease: 'easeOut' }} className="flex items-center gap-6 p-6 rounded-sm" style={{ background: '#f5f0e8', border: '1px solid #d4c4a8' }}>
            <div className="flex-shrink-0 font-black" style={{ fontSize: '36px', color: '#c8b89a', lineHeight: 1 }}>{walk.id}</div>
            <div>
              <p className="font-semibold" style={{ color: '#2d2520' }}>{walk.location}</p>
              <p className="text-sm font-light mt-1" style={{ color: '#7c6f5e' }}>{walk.date}</p>
              <p className="text-sm font-light mt-1" style={{ color: '#7c6f5e' }}>{walk.teaser}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="max-w-3xl">
        <p className="font-light mb-6 leading-relaxed max-w-md" style={{ color: '#7c6f5e' }}>Want to join a walk? We share details, dates, and locations through Signal. Come as you are.</p>
        <a href="https://signal.me/#placeholder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold transition-opacity hover:opacity-70" style={{ border: '2px solid #2d2520', padding: '14px 24px', borderRadius: '4px', color: '#2d2520', textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.65 0-3.2-.47-4.52-1.28l-.32-.19-3.32.87.87-3.32-.19-.32A7.93 7.93 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" /></svg>
          Join via Signal
        </a>
      </div>
    </section>
  )
}
