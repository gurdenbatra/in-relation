import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

const FOOTSTEP_POSITIONS = [
  { side: 'left',  top: '15%', left: '12%' },
  { side: 'right', top: '28%', left: '22%' },
  { side: 'left',  top: '38%', left: '35%' },
  { side: 'right', top: '48%', left: '46%' },
  { side: 'left',  top: '55%', left: '56%' },
  { side: 'right', top: '62%', left: '66%' },
  { side: 'left',  top: '68%', left: '75%' },
  { side: 'right', top: '74%', left: '84%' },
]

export default function FootstepsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.footstep-item')
    const triggers = []
    steps.forEach((step, i) => {
      const tween = gsap.fromTo(step, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.4,
        scrollTrigger: { trigger: sectionRef.current, start: `top+=${i * 80} center`, toggleActions: 'play none none reverse' },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ height: '80vh', background: '#ede8df' }}>
      {FOOTSTEP_POSITIONS.map((pos, i) => (
        <div key={i} className="footstep-item absolute" style={{ top: pos.top, left: pos.left, opacity: 0 }}>
          <Footstep side={pos.side} scale={1} />
        </div>
      ))}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm tracking-widest uppercase" style={{ opacity: 0.6, color: '#a08060' }}>Keep walking ↓</p>
    </section>
  )
}
