"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function PlayerCharacter({ position, onMove }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const velocity = useRef({ x: 0, z: 0 })
  const keys = useRef({ w: false, a: false, s: false, d: false })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W") keys.current.w = true
      if (e.key === "a" || e.key === "A") keys.current.a = true
      if (e.key === "s" || e.key === "S") keys.current.s = true
      if (e.key === "d" || e.key === "D") keys.current.d = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W") keys.current.w = false
      if (e.key === "a" || e.key === "A") keys.current.a = false
      if (e.key === "s" || e.key === "S") keys.current.s = false
      if (e.key === "d" || e.key === "D") keys.current.d = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return

    // Calculate movement
    const speed = 0.5
    if (keys.current.w) velocity.current.z -= speed
    if (keys.current.s) velocity.current.z += speed
    if (keys.current.a) velocity.current.x -= speed
    if (keys.current.d) velocity.current.x += speed

    // Apply velocity
    meshRef.current.position.x += velocity.current.x
    meshRef.current.position.z += velocity.current.z

    // Friction
    velocity.current.x *= 0.9
    velocity.current.z *= 0.9

    // Bounds
    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -640, 640)
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -256, 256)

    // Update position callback
    onMove({
      x: meshRef.current.position.x,
      z: meshRef.current.position.z,
    })

    // Bobbing animation
    meshRef.current.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.2

    // Rotation based on movement
    if (velocity.current.x !== 0 || velocity.current.z !== 0) {
      meshRef.current.rotation.y = Math.atan2(velocity.current.x, velocity.current.z)
    }
  })

  return (
    <group>
      {/* Placeholder character (low-poly PS1 style) */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        {/* Body */}
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#00FFFF" flatShading />
      </mesh>

      {/* Head */}
      <mesh position={[position.x, 2.5, position.z]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#FF00FF" flatShading />
      </mesh>

      {/* Glow effect */}
      <pointLight position={[position.x, 2, position.z]} color="#00FFFF" intensity={1} distance={5} />
    </group>
  )
}
