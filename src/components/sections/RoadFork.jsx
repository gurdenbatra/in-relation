import { motion } from 'framer-motion'

export default function RoadFork() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-24" style={{ background: '#ede8df' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7, ease: 'easeOut' }} className="flex flex-col items-center">
        <div className="w-1" style={{ height: '80px', background: '#7c6f5e' }} />
        <motion.div className="flex gap-8 mt-0" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="font-semibold text-sm tracking-wide px-5 py-2 rounded-sm" style={{ background: '#c8b89a', color: '#2d2520', transform: 'rotate(-3deg)', clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)', paddingRight: '28px' }}>← 12 Walks Done</div>
          <div className="font-semibold text-sm tracking-wide px-5 py-2 rounded-sm" style={{ background: '#2d2520', color: '#f5f0e8', transform: 'rotate(3deg)', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)', paddingLeft: '28px' }}>Next Walks →</div>
        </motion.div>
        <svg width="300" height="120" viewBox="0 0 300 120" className="mt-4" style={{ opacity: 0.3 }}>
          <line x1="150" y1="0" x2="150" y2="40" stroke="#7c6f5e" strokeWidth="3" />
          <line x1="150" y1="40" x2="30" y2="120" stroke="#7c6f5e" strokeWidth="3" />
          <line x1="150" y1="40" x2="270" y2="120" stroke="#7c6f5e" strokeWidth="3" />
        </svg>
      </motion.div>
    </section>
  )
}
