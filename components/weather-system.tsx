"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface WeatherSystemProps {
  type: "rain" | "clear"
  intensity?: number
}

export function WeatherSystem({ type, intensity = 1.0 }: WeatherSystemProps) {
  const rainGroupRef = useRef<THREE.Points>(null)
  const splashesRef = useRef<THREE.Points>(null)

  const rainParticles = useMemo(() => {
    const count = type === "rain" ? 5000 : 0
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 50 + 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      velocities[i] = 0.8 + Math.random() * 0.4
    }

    return { positions, velocities }
  }, [type])

  const splashParticles = useMemo(() => {
    const count = type === "rain" ? 1000 : 0
    const positions = new Float32Array(count * 3)
    const lifetimes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = 0.1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      lifetimes[i] = Math.random()
    }

    return { positions, lifetimes }
  }, [type])

  useFrame((_, delta) => {
    if (type !== "rain") return

    if (rainGroupRef.current) {
      const positions = rainGroupRef.current.geometry.attributes.position.array as Float32Array
      const velocities = rainParticles.velocities

      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] -= velocities[i] * delta * 60 * intensity

        // Reset particle if it hits ground
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3] = (Math.random() - 0.5) * 200
          positions[i * 3 + 1] = 50 + Math.random() * 20
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200
        }
      }

      rainGroupRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (splashesRef.current) {
      const positions = splashesRef.current.geometry.attributes.position.array as Float32Array
      const lifetimes = splashParticles.lifetimes

      for (let i = 0; i < positions.length / 3; i++) {
        lifetimes[i] -= delta * 2

        if (lifetimes[i] <= 0) {
          positions[i * 3] = (Math.random() - 0.5) * 200
          positions[i * 3 + 1] = 0.1
          positions[i * 3 + 2] = (Math.random() - 0.5) * 200
          lifetimes[i] = 0.5 + Math.random() * 0.5
        }
      }

      splashesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  if (type !== "rain") return null

  return (
    <group>
      <points ref={rainGroupRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={rainParticles.positions.length / 3}
            array={rainParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#00D9FF"
          transparent
          opacity={0.6 * intensity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={splashesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={splashParticles.positions.length / 3}
            array={splashParticles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          color="#06FFA5"
          transparent
          opacity={0.4 * intensity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
