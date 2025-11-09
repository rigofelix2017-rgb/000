"use client"

import { useRef } from "react"
import type * as THREE from "three"

type Props = {
  modelPath: string
  x: number
  z: number
  height: number
}

export function ModelBuilding({ modelPath, x, z, height }: Props) {
  const group = useRef<THREE.Group>(null)

  // Simple vertical scaling for PS1-style
  const scaleY = height
  const baseScale = 1

  // Use different colors for variety
  const getColor = () => {
    const hash = modelPath.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colors = ["#10b981", "#f59e0b", "#a855f7", "#3b82f6", "#ef4444"]
    return colors[hash % colors.length]
  }

  const color = getColor()

  return (
    <group ref={group} position={[x, 0, z]} scale={[baseScale, scaleY, baseScale]} castShadow receiveShadow>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  )
}
