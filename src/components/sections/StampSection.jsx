import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

const STAMP_FOOTSTEPS = [
  { side: 'left',  top: '10%', left: '8%',  scale: 0.7 },
  { side: 'right', top: '22%', left: '20%', scale: 0.85 },
  { side: 'left',  top: '32%', left: '34%', scale: 1.0 },
  { side: 'right', top: '40%', left: '48%', scale: 1.2 },
  { side: 'left',  top: '46%', left: '62%', scale: 1.45 },
]

export default function StampSection() {
  const sectionRef = useRef(null)
  const stampRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.stamp-step')
    const triggers = []

    steps.forEach((step, i) => {
      const tween = gsap.fromTo(step, { opacity: 0, scale: 0.5 }, {
        opacity: 1, scale: 1, duration: 0.35,
        scrollTrigger: { trigger: sectionRef.current, start: `top+=${i * 100} center`, toggleActions: 'play none none reverse' },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    const stampTween = gsap.fromTo(stampRef.current,
      { opacity: 0, scale: 1.3, filter: 'blur(12px)', rotate: -2 },
      { opacity: 1, scale: 1, filter: 'blur(0px)', rotate: -2, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'center center', toggleActions: 'play none none reverse' } }
    )
    if (stampTween.scrollTrigger) triggers.push(stampTween.scrollTrigger)

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ minHeight: '120vh', background: '#ede8df' }}>
      {STAMP_FOOTSTEPS.map((pos, i) => (
        <div key={i} className="stamp-step absolute" style={{ top: pos.top, left: pos.left, opacity: 0 }}>
          <Footstep side={pos.side} scale={pos.scale} />
        </div>
      ))}
      <div ref={stampRef} className="absolute" style={{ top: '52%', left: '50%', marginLeft: '-120px', opacity: 0, border: '8px solid #2d2520', padding: '8px 28px', display: 'inline-block' }}>
        <p className="font-black tracking-tight leading-none text-center" style={{ fontSize: 'clamp(48px,10vw,96px)', color: '#2d2520' }}>IN<br />RELATION</p>
      </div>
    </section>
  )
}
