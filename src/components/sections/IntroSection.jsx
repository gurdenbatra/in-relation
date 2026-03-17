import { useEffect, useRef } from 'react'
import LayeredPhoto from '../ui/LayeredPhoto.jsx'
import ThreeScene from '../three/ThreeScene.jsx'

const INTRO_PHOTOS = [
  { src: '/images/3Hasenheide10.jpg', style: { top: '8%', left: '-4%', width: '340px', transform: 'rotate(-4deg)', zIndex: 1 }, parallaxSpeed: 0.4 },
  { src: '/images/7Treptower-Park9.jpg', style: { top: '15%', right: '-2%', width: '280px', transform: 'rotate(5deg)', zIndex: 2 }, parallaxSpeed: 0.6 },
  { src: '/images/10Oranienplatz10.jpg', style: { bottom: '10%', left: '5%', width: '260px', transform: 'rotate(2deg)', zIndex: 1 }, parallaxSpeed: 0.3 },
  { src: '/images/12Körnerpark5.jpg', style: { bottom: '15%', right: '3%', width: '300px', transform: 'rotate(-3deg)', zIndex: 3 }, parallaxSpeed: 0.5 },
  { src: '/images/8Görlitzer6.jpg', style: { top: '40%', left: '2%', width: '200px', transform: 'rotate(6deg)', zIndex: 0 }, parallaxSpeed: 0.7 },
]

export default function IntroSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const photos = sectionRef.current.querySelectorAll('.layered-photo')
    const handlers = []
    photos.forEach((photo) => {
      const speed = parseFloat(photo.dataset.parallaxSpeed ?? 0.5)
      const handler = () => {
        const scrollY = window.scrollY
        photo.style.transform = `translateY(${scrollY * (1 - speed) * 0.3}px)`
      }
      window.addEventListener('scroll', handler, { passive: true })
      handlers.push(handler)
    })
    return () => handlers.forEach((h) => window.removeEventListener('scroll', h))
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#f5f0e8' }}>
      {INTRO_PHOTOS.map((photo, i) => <LayeredPhoto key={i} {...photo} />)}
      <ThreeScene objectType="leaf" className="absolute top-8 right-8 w-48 h-48 hidden md:block" mobilePosition={{ top: '16px', right: '16px' }} />
      <div className="relative z-20 flex flex-col items-center">
        <div className="relative flex items-center justify-center text-center" style={{ width: '280px', height: '380px', border: '3px solid #7c6f5e', borderRadius: '8px 8px 0 0', background: 'rgba(245,240,232,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          <div className="absolute rounded-full" style={{ width: '14px', height: '14px', background: '#a08060', right: '20px', top: '50%', transform: 'translateY(-50%)' }} />
          <p className="px-8 font-light leading-relaxed" style={{ fontSize: '20px', color: '#2d2520' }}>
            What if all you needed was a <strong className="font-bold">conscious walk?</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
