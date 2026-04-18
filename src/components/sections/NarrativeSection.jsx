import { useEffect, useRef } from 'react'
import LayeredPhoto from '../ui/LayeredPhoto.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

const NARRATIVE_PHOTOS = [
  { src: '/images/11Markthalle7.webp', style: { top: '5%', right: '-3%', width: '360px', transform: 'rotate(-5deg)', zIndex: 1 }, parallaxSpeed: 0.45 },
  { src: '/images/4Kott2.webp', style: { bottom: '8%', left: '-2%', width: '300px', transform: 'rotate(4deg)', zIndex: 2 }, parallaxSpeed: 0.6 },
  { src: '/images/7Treptower-Park13.webp', style: { top: '35%', left: '3%', width: '220px', transform: 'rotate(-2deg)', zIndex: 0 }, parallaxSpeed: 0.35 },
  { src: '/images/12Körnerpark7.webp', style: { bottom: '20%', right: '4%', width: '250px', transform: 'rotate(6deg)', zIndex: 3 }, parallaxSpeed: 0.55 },
]

export default function NarrativeSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const photos = sectionRef.current.querySelectorAll('.layered-photo')
    const handlers = []
    photos.forEach((photo) => {
      const speed = parseFloat(photo.dataset.parallaxSpeed ?? 0.5)
      const handler = () => {
        const rect = sectionRef.current.getBoundingClientRect()
        const relativeScroll = -rect.top
        photo.style.transform = `translateY(${relativeScroll * (1 - speed) * 0.25}px)`
      }
      window.addEventListener('scroll', handler, { passive: true })
      handlers.push(handler)
    })
    return () => handlers.forEach((h) => window.removeEventListener('scroll', h))
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#f5f0e8' }}>
      {NARRATIVE_PHOTOS.map((photo, i) => <LayeredPhoto key={i} {...photo} />)}
      <ThreeScene objectType="cobblestone" className="absolute bottom-12 left-12 w-36 h-36 hidden md:block" mobilePosition={{ bottom: '16px', left: '16px' }} />
      <div className="relative z-20 max-w-lg mx-8 text-center" style={{ background: 'rgba(245,240,232,0.82)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '4px', padding: '48px 40px' }}>
        <p className="font-light leading-relaxed" style={{ fontSize: '28px', color: '#2d2520' }}>
          When was the last time the city <strong className="font-bold">whispered its secrets</strong> to you?
        </p>
      </div>
    </section>
  )
}
