import { useState } from 'react'
import { walks } from '../../data/walks.js'
import WalkCard from '../cards/WalkCard.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

export default function WalksSection() {
  const [openId, setOpenId] = useState(null)
  function handleToggle(id) { setOpenId((prev) => (prev === id ? null : id)) }

  return (
    <section className="relative py-24 px-6 md:px-16 overflow-hidden" style={{ background: '#f5f0e8' }}>
      <ThreeScene objectType="bench" className="absolute top-16 right-8 w-36 h-36 hidden md:block" mobilePosition={{ top: '16px', right: '16px' }} />
      <div className="max-w-3xl mb-12">
        <p className="text-xs tracking-widest uppercase font-semibold mb-3" style={{ color: '#a08060' }}>Walks done</p>
        <h2 className="font-light" style={{ fontSize: '2.5rem', color: '#2d2520' }}>The walks <strong className="font-bold">we've done</strong></h2>
      </div>
      <div className="max-w-3xl flex flex-col gap-4">
        {walks.map((walk) => <WalkCard key={walk.id} walk={walk} isOpen={openId === walk.id} onToggle={() => handleToggle(walk.id)} />)}
      </div>
    </section>
  )
}
