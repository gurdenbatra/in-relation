import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

// Natural walking trail: left-right alternating, offset laterally, moving forward (diagonal)
const FOOTSTEP_POSITIONS = [
  { side: 'left',  top: '17%', left: '11%', scale: 0.95 },
  { side: 'right', top: '25%', left: '20%', scale: 1.02 },
  { side: 'left',  top: '33%', left: '28%', scale: 1.0 },
  { side: 'right', top: '41%', left: '39%', scale: 1.08 },
  { side: 'left',  top: '49%', left: '49%', scale: 1.06 },
  { side: 'right', top: '56%', left: '59%', scale: 1.12 },
  { side: 'left',  top: '63%', left: '69%', scale: 1.1 },
  { side: 'right', top: '70%', left: '79%', scale: 1.16 },
]

export default function FootstepsSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const steps = sectionRef.current.querySelectorAll('.footstep-item')
    const triggers = []
    steps.forEach((step, i) => {
      const tween = gsap.fromTo(
        step,
        { opacity: 0, scale: 0.72, y: 12, rotate: sideToAngle(i) },
        {
          opacity: 1, scale: 1, y: 0, rotate: sideToAngle(i), duration: 0.45, ease: 'power2.out',
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
          <Footstep side={pos.side} scale={pos.scale} />
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

function sideToAngle(index) {
  return index % 2 === 0 ? 3 : -3
}
