import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

const CLAY = { roughness: 0.8, metalness: 0.0 }

const CONFIGS = {
  leaf:         { color: '#a8c890' },
  cobblestone:  { color: '#9a8e80' },
  pigeon:       { color: '#b8b0a8' },
  bottle:       { color: '#98b898' },
  sign:         { color: '#c8a878' },
  bench:        { color: '#8a7060' },
  fernsehturm:  { color: '#9a8e80' },
}

function LeafMesh({ color }) {
  return <mesh rotation={[0.3,0,0.5]}><sphereGeometry args={[0.6,8,6]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
}
function CobblestoneMesh({ color }) {
  return <RoundedBox args={[1,0.6,0.8]} radius={0.2} smoothness={4}><meshStandardMaterial color={color} {...CLAY} /></RoundedBox>
}
function PigeonMesh({ color }) {
  return <group>
    <mesh><sphereGeometry args={[0.5,10,8]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
    <mesh position={[0,0.5,0.3]}><sphereGeometry args={[0.25,8,6]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
  </group>
}
function BottleMesh({ color }) {
  return <group>
    <mesh position={[0,-0.2,0]}><cylinderGeometry args={[0.25,0.3,0.8,12]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
    <mesh position={[0,0.45,0]}><cylinderGeometry args={[0.1,0.25,0.5,12]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
  </group>
}
function SignMesh({ color }) {
  return <group>
    <mesh position={[0,0.3,0]}><boxGeometry args={[1.2,0.7,0.08]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
    <mesh position={[0,-0.4,0]}><cylinderGeometry args={[0.04,0.04,1,8]} /><meshStandardMaterial color="#7c6f5e" {...CLAY} /></mesh>
  </group>
}
function BenchMesh({ color }) {
  return <group>
    <mesh position={[0,0.1,0]}><boxGeometry args={[1.4,0.08,0.4]} /><meshStandardMaterial color={color} {...CLAY} /></mesh>
    <mesh position={[-0.5,-0.3,0]}><boxGeometry args={[0.08,0.5,0.4]} /><meshStandardMaterial color="#7c6f5e" {...CLAY} /></mesh>
    <mesh position={[0.5,-0.3,0]}><boxGeometry args={[0.08,0.5,0.4]} /><meshStandardMaterial color="#7c6f5e" {...CLAY} /></mesh>
  </group>
}

/** Berlin TV Tower (Fernsehturm): tall spike + sphere + two orbiting moons */
function FernsehturmMesh({ color }) {
  const moon1Ref = useRef()
  const moon2Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (moon1Ref.current) {
      moon1Ref.current.position.x = Math.cos(t * 0.6) * 0.9
      moon1Ref.current.position.z = Math.sin(t * 0.6) * 0.9
      moon1Ref.current.position.y = 0.35
    }
    if (moon2Ref.current) {
      moon2Ref.current.position.x = Math.cos(t * 0.35 + 2.1) * 1.4
      moon2Ref.current.position.z = Math.sin(t * 0.35 + 2.1) * 1.4
      moon2Ref.current.position.y = 0.25
    }
  })

  return <group>
    {/* Tower shaft */}
    <mesh position={[0, -0.3, 0]}>
      <cylinderGeometry args={[0.05, 0.09, 1.6, 8]} />
      <meshStandardMaterial color={color} {...CLAY} />
    </mesh>
    {/* Antenna spike */}
    <mesh position={[0, 0.75, 0]}>
      <cylinderGeometry args={[0.01, 0.04, 0.7, 8]} />
      <meshStandardMaterial color={color} {...CLAY} />
    </mesh>
    {/* Ball / observation sphere */}
    <mesh position={[0, 0.35, 0]}>
      <sphereGeometry args={[0.28, 14, 10]} />
      <meshStandardMaterial color={color} {...CLAY} />
    </mesh>
    {/* Moon 1 — closer, faster orbit */}
    <mesh ref={moon1Ref}>
      <sphereGeometry args={[0.1, 8, 6]} />
      <meshStandardMaterial color="#c8b89a" roughness={0.7} metalness={0} />
    </mesh>
    {/* Moon 2 — farther, slower orbit */}
    <mesh ref={moon2Ref}>
      <sphereGeometry args={[0.07, 8, 6]} />
      <meshStandardMaterial color="#a08060" roughness={0.7} metalness={0} />
    </mesh>
  </group>
}

const MESHES = {
  leaf:        LeafMesh,
  cobblestone: CobblestoneMesh,
  pigeon:      PigeonMesh,
  bottle:      BottleMesh,
  sign:        SignMesh,
  bench:       BenchMesh,
  fernsehturm: FernsehturmMesh,
}

export default function ClayObject({ type = 'cobblestone', scrollY }) {
  const groupRef = useRef()
  const config = CONFIGS[type] ?? CONFIGS.cobblestone
  const MeshComponent = MESHES[type] ?? MESHES.cobblestone

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.003
    if (scrollY?.current !== undefined) {
      groupRef.current.position.y = scrollY.current
    }
  })

  return <group ref={groupRef}><MeshComponent color={config.color} /></group>
}
