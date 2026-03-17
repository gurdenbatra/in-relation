import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

const CLAY = { roughness: 0.8, metalness: 0.0 }

const CONFIGS = {
  leaf:        { color: '#a8c890' },
  cobblestone: { color: '#9a8e80' },
  pigeon:      { color: '#b8b0a8' },
  bottle:      { color: '#98b898' },
  sign:        { color: '#c8a878' },
  bench:       { color: '#8a7060' },
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

const MESHES = { leaf: LeafMesh, cobblestone: CobblestoneMesh, pigeon: PigeonMesh, bottle: BottleMesh, sign: SignMesh, bench: BenchMesh }

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
