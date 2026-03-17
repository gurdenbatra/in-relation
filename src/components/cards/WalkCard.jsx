import { motion, AnimatePresence } from 'framer-motion'
import WalkJournal from './WalkJournal.jsx'

export default function WalkCard({ walk, isOpen, onToggle }) {
  const leadImage = walk.images[0] ?? null

  return (
    <article className="border rounded-sm overflow-hidden transition-shadow" style={{ borderColor: '#d4c4a8', background: '#faf8f4', boxShadow: isOpen ? '0 4px 24px rgba(45,37,32,0.1)' : 'none' }}>
      <div className="flex items-start gap-4 p-6 cursor-pointer select-none" onClick={onToggle} role="button" aria-expanded={isOpen} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onToggle()}>
        <div className="flex-shrink-0 flex items-center justify-center rounded-full font-bold" style={{ width: '36px', height: '36px', background: '#2d2520', color: '#f5f0e8', fontSize: '12px' }}>{String(walk.id).padStart(2, '0')}</div>
        {leadImage ? (
          <div className="flex-shrink-0 overflow-hidden rounded-sm" style={{ width: '80px', height: '60px' }}>
            <img src={leadImage} alt={walk.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className="flex-shrink-0 rounded-sm flex items-center justify-center" style={{ width: '80px', height: '60px', background: '#e0d8cc' }}>
            <span className="text-xs" style={{ color: '#a08060' }}>soon</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-widest uppercase font-semibold mb-1" style={{ color: '#a08060' }}>{walk.location}</p>
          <p className="font-light italic leading-snug" style={{ fontSize: '17px', color: '#2d2520' }}>"{walk.question}"</p>
        </div>
        <div className="flex-shrink-0 self-center transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="#a08060" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div key="journal" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }} transition={{ duration: 0.4, ease: 'easeOut' }} style={{ overflow: 'hidden' }}>
            <div className="px-6 pb-6 relative">
              <button onClick={onToggle} className="absolute top-0 right-6 transition-colors" aria-label="Close journal" style={{ fontSize: '20px', lineHeight: 1, color: '#a08060' }}>×</button>
              <WalkJournal walk={walk} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
