"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface VehicleProps {
  position: [number, number, number]
  rotation: number
  color: string
  onInteract: () => void
  isNearby: boolean
}

export function Vehicle({ position, rotation, color, onInteract, isNearby }: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return

    // Subtle hover animation
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.02
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Vehicle body - cyberpunk hover car */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.8, 4.5]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.5, 0.5]} castShadow>
        <boxGeometry args={[2.2, 0.6, 1.5]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.8}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hover pads */}
      {[-0.9, 0.9].map((x, i) =>
        [-1.3, 1.3].map((z, j) => (
          <mesh key={`pad-${i}-${j}`} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.4, 0.3, 0.2, 16]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.3}
              emissive={new THREE.Color("#00D9FF")}
              emissiveIntensity={0.8}
            />
          </mesh>
        )),
      )}

      {/* Neon underglow */}
      <pointLight position={[0, -0.5, 0]} intensity={3} distance={8} color={color} />

      {/* Headlights */}
      <pointLight position={[0, 0.2, 2.5]} intensity={5} distance={15} color="#FFFFFF" />

      {/* Interaction indicator */}
      {isNearby && (
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
