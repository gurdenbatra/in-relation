import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint.js'
import ClayObject from './ClayObject.jsx'

export default function ThreeScene({ objectType = 'cobblestone', scrollYRef, className = '', mobilePosition = { bottom: '24px', right: '24px' } }) {
  const { isMobile } = useBreakpoint()
  const internalRef = useRef(0)
  const ref = scrollYRef ?? internalRef

  if (isMobile) {
    return (
      <div style={{ position: 'absolute', width: 120, height: 120, pointerEvents: 'none', zIndex: 10, ...mobilePosition }}>
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={0.8} />
          <ClayObject type={objectType} scrollY={null} />
        </Canvas>
      </div>
    )
  }

  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} />
        <ClayObject type={objectType} scrollY={ref} />
      </Canvas>
    </div>
  )
}
