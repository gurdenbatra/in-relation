import { useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footstep from '../ui/Footstep.jsx'

gsap.registerPlugin(ScrollTrigger)

/** Fixed trail endpoints (same as original layout). */
const PATH_START = { left: 11, top: 17 }
const PATH_END = { left: 79, top: 70 }
const FOOTSTEP_COUNT = 8
const SPINE_SAMPLES = 72

function mulberry32(seed) {
  let a = seed >>> 0
  return function rand() {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function cubicBezier2D(p0, p1, p2, p3, t) {
  const u = 1 - t
  const uu = u * u
  const tt = t * t
  const left =
    uu * u * p0.left +
    3 * uu * t * p1.left +
    3 * u * tt * p2.left +
    tt * t * p3.left
  const top =
    uu * u * p0.top +
    3 * uu * t * p1.top +
    3 * u * tt * p2.top +
    tt * t * p3.top
  return { left, top }
}

/**
 * Same idea as the hero: random S-curve + smooth drift, equal arc-length steps.
 * First and last prints are pinned to PATH_START / PATH_END.
 */
function buildFootstepPath(rand) {
  const p0 = { left: PATH_START.left, top: PATH_START.top }
  const p3 = { left: PATH_END.left, top: PATH_END.top }
  const p1 = {
    left: 14 + rand() * 28,
    top: lerp(p0.top, p3.top, 0.18 + rand() * 0.14) + (rand() - 0.5) * 16,
  }
  const p2 = {
    left: 52 + rand() * 28,
    top: lerp(p0.top, p3.top, 0.48 + rand() * 0.14) + (rand() - 0.5) * 16,
  }

  const waveAmp = 3 + rand() * 3.5
  const waveCycles = 0.7 + rand() * 0.55
  const wavePhase = rand() * Math.PI * 2
  const driftPhase = rand() * Math.PI * 2
  const driftAmpL = 4 + rand() * 5
  const driftAmpT = 2 + rand() * 2.5

  const spine = []
  for (let j = 0; j < SPINE_SAMPLES; j++) {
    const u = SPINE_SAMPLES <= 1 ? 0 : j / (SPINE_SAMPLES - 1)
    spine.push(cubicBezier2D(p0, p1, p2, p3, u))
  }

  const dist = [0]
  for (let j = 1; j < SPINE_SAMPLES; j++) {
    const dx = spine[j].left - spine[j - 1].left
    const dy = spine[j].top - spine[j - 1].top
    dist.push(dist[j - 1] + Math.hypot(dx, dy))
  }
  const totalLen = dist[SPINE_SAMPLES - 1] || 1

  function pointOnSpineAtLength(s) {
    let j = 0
    while (j < SPINE_SAMPLES - 1 && dist[j + 1] < s) j++
    const seg = dist[j + 1] - dist[j] || 1
    const u = (s - dist[j]) / seg
    return {
      left: lerp(spine[j].left, spine[j + 1].left, u),
      top: lerp(spine[j].top, spine[j + 1].top, u),
    }
  }

  const steps = []
  for (let i = 0; i < FOOTSTEP_COUNT; i++) {
    const tParam = FOOTSTEP_COUNT <= 1 ? 0 : i / (FOOTSTEP_COUNT - 1)
    const s = tParam * totalLen
    let { left, top } = pointOnSpineAtLength(s)

    const driftL =
      Math.sin(tParam * Math.PI * 2.1 + driftPhase) * driftAmpL +
      Math.sin(tParam * Math.PI * 4.2 + driftPhase * 1.2) * (driftAmpL * 0.35)
    const driftT =
      Math.cos(tParam * Math.PI * 1.85 + driftPhase * 0.65) * driftAmpT

    left +=
      driftL +
      Math.sin(tParam * Math.PI * 2 * waveCycles + wavePhase) * waveAmp
    top +=
      driftT +
      Math.cos(tParam * Math.PI * 2 * waveCycles * 0.85 + wavePhase * 0.8) * (waveAmp * 0.4)

    top += (i % 2) * 1.1
    left = Math.max(4, Math.min(94, left))
    top = Math.max(10, Math.min(88, top))

    const scale = lerp(0.95, 1.16, tParam)
    steps.push({
      side: i % 2 === 0 ? 'left' : 'right',
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      scale,
    })
  }

  steps[0] = {
    side: 'left',
    left: `${PATH_START.left}%`,
    top: `${PATH_START.top}%`,
    scale: 0.95,
  }
  steps[FOOTSTEP_COUNT - 1] = {
    side: 'right',
    left: `${PATH_END.left}%`,
    top: `${PATH_END.top}%`,
    scale: 1.16,
  }

  return steps
}

export default function FootstepsSection() {
  const sectionRef = useRef(null)

  const footstepPositions = useMemo(() => {
    const seed =
      typeof crypto !== 'undefined' && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0]
        : (Date.now() ^ (Math.floor(Math.random() * 0xffffffff) >>> 0)) >>> 0
    return buildFootstepPath(mulberry32(seed))
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const steps = section.querySelectorAll('.footstep-item')
    const triggers = []
    steps.forEach((step, i) => {
      const tween = gsap.fromTo(
        step,
        { opacity: 0, scale: 0.72, y: 12, rotate: sideToAngle(i) },
        {
          opacity: 1, scale: 1, y: 0, rotate: sideToAngle(i), duration: 0.45, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: `top+=${i * 75} center`,
            toggleActions: 'play none none reverse',
          },
          onComplete: () => {
            gsap.to(step, { opacity: 0.3, duration: 1.2, delay: 0.3, ease: 'power1.in' })
          },
        }
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => triggers.forEach((t) => t.kill())
  }, [footstepPositions])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '80vh', background: '#ede8df' }}
    >
      {footstepPositions.map((pos, i) => (
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
