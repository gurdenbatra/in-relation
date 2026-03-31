import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

// Natural walking trail: left-right alternating, offset laterally, moving forward (diagonal)
const FOOTSTEP_POSITIONS = [
  { side: 'left',  top: '18%', left: '10%' },
  { side: 'right', top: '26%', left: '20%' },
  { side: 'left',  top: '34%', left: '30%' },
  { side: 'right', top: '42%', left: '40%' },
  { side: 'left',  top: '50%', left: '50%' },
  { side: 'right', top: '57%', left: '60%' },
  { side: 'left',  top: '63%', left: '70%' },
  { side: 'right', top: '69%', left: '80%' },
]

export default function FootstepsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.footstep-item')
    const triggers = []
    steps.forEach((step, i) => {
      const tween = gsap.fromTo(
        step,
        { opacity: 0, scale: 0.75 },
        {
          opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${i * 75} center`,
            toggleActions: 'play none none reverse',
          },
          onComplete: () => {
            // Gradually fade out the imprint after it lands
            gsap.to(step, { opacity: 0.3, duration: 1.2, delay: 0.3, ease: 'power1.in' })
          },
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '80vh', background: '#ede8df' }}
    >
      {FOOTSTEP_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="footstep-item absolute"
          style={{ top: pos.top, left: pos.left, opacity: 0 }}
        >
          <Footstep side={pos.side} scale={1.1} />
        </div>
      ))}
      <p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm tracking-widest uppercase"
        style={{ opacity: 0.5, color: '#a08060' }}
      >
        and now we walk ↓
      </p>
    </section>
  )
}
