"use client"

import * as THREE from "three"

type Props = {
  player: {
    x: number
    y: number
    z: number
    ry: number
    wallet?: string | null
  }
}

export function RemotePlayer3D({ player }: Props) {
  const bodyColor = "#06FFA5"
  const accentColor = "#00D9FF"
  const darkAccent = "#020617"

  return (
    <group position={[player.x, player.y, player.z]} rotation={[0, player.ry, 0]}>
      {/* Simplified version of player character for performance */}
      {/* Torso */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.7, 1.1, 0.4]} />
        <meshStandardMaterial
          color={darkAccent}
          metalness={0.4}
          roughness={0.5}
          emissive={new THREE.Color(bodyColor)}
          emissiveIntensity={0.25}
          flatShading
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.3}
          roughness={0.5}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={0.5}
          flatShading
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Name tag ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, 0.5, 12]} />
        <meshStandardMaterial
          color="#06FFA5"
          emissive="#06FFA5"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
          flatShading
        />
      </mesh>

      {/* Wallet indicator light */}
      {player.wallet && <pointLight color={"#38BDF8"} intensity={0.8} distance={8} decay={2} position={[0, 1.4, 0]} />}
    </group>
  )
}
