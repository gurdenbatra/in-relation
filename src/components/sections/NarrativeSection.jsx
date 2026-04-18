import { useEffect, useRef, useMemo } from 'react'
import LayeredPhoto from '../ui/LayeredPhoto.jsx'
import ThreeScene from '../three/ThreeScene.jsx'
import { walkImageAssets } from '../../data/walkImageAssets.js'

function pickRandom(urls) {
  if (!urls?.length) return null
  return urls[Math.floor(Math.random() * urls.length)]
}

const NARRATIVE_LAYOUT = [
  { walkId: 11, style: { top: '5%', right: '-3%', width: '360px', transform: 'rotate(-5deg)', zIndex: 1 }, parallaxSpeed: 0.45 },
  { walkId: 4, style: { bottom: '8%', left: '-2%', width: '300px', transform: 'rotate(4deg)', zIndex: 2 }, parallaxSpeed: 0.6 },
  { walkId: 7, style: { top: '35%', left: '3%', width: '220px', transform: 'rotate(-2deg)', zIndex: 0 }, parallaxSpeed: 0.35 },
  { walkId: 12, style: { bottom: '20%', right: '4%', width: '250px', transform: 'rotate(6deg)', zIndex: 3 }, parallaxSpeed: 0.55 },
]

export default function NarrativeSection() {
  const sectionRef = useRef(null)

  const narrativePhotos = useMemo(
    () =>
      NARRATIVE_LAYOUT.map((entry) => ({
        src: pickRandom(walkImageAssets[entry.walkId]),
        style: entry.style,
        parallaxSpeed: entry.parallaxSpeed,
      })).filter((p) => p.src),
    [],
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const photos = section.querySelectorAll('.layered-photo')
    const handlers = []
    photos.forEach((photo) => {
      const speed = parseFloat(photo.dataset.parallaxSpeed ?? 0.5)
      const handler = () => {
        const rect = section.getBoundingClientRect()
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
      {narrativePhotos.map((photo, i) => (
        <LayeredPhoto key={`${photo.src}-${i}`} {...photo} />
      ))}
      <ThreeScene objectType="cobblestone" className="absolute bottom-12 left-12 w-36 h-36 hidden md:block" mobilePosition={{ bottom: '16px', left: '16px' }} />
      <div className="relative z-20 max-w-lg mx-8 text-center" style={{ background: 'rgba(245,240,232,0.82)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', borderRadius: '4px', padding: '48px 40px' }}>
        <p className="font-light leading-relaxed" style={{ fontSize: '28px', color: '#2d2520' }}>
          When was the last time the city <strong className="font-bold">whispered its secrets</strong> to you?
        </p>
      </div>
    </section>
  )
}
