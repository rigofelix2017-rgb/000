"use client"

export function PSXHQBuilding() {
  return (
    <group position={[0, 0, -120]}>
      {/* Main tower */}
      <mesh position={[0, 25, 0]} castShadow receiveShadow>
        <boxGeometry args={[40, 50, 40]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.3}
          metalness={0.7}
          emissive="#06FFA5"
          emissiveIntensity={0.6}
          flatShading
        />
      </mesh>

      {/* Neon bands */}
      <mesh position={[0, 35, 0]}>
        <torusGeometry args={[22, 0.8, 8, 32]} />
        <meshStandardMaterial color="#06FFA5" emissive="#06FFA5" emissiveIntensity={2} flatShading />
      </mesh>

      <mesh position={[0, 15, 0]}>
        <torusGeometry args={[22, 0.8, 8, 32]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2} flatShading />
      </mesh>

      {/* Entrance area */}
      <mesh position={[0, 5, 22]} castShadow>
        <boxGeometry args={[20, 10, 4]} />
        <meshStandardMaterial color="#06FFA5" emissive="#06FFA5" emissiveIntensity={0.8} flatShading />
      </mesh>

      {/* Logo hologram */}
      <mesh position={[0, 52, 0]}>
        <sphereGeometry args={[5, 8, 8]} />
        <meshStandardMaterial
          color="#06FFA5"
          emissive="#06FFA5"
          emissiveIntensity={3}
          transparent
          opacity={0.7}
          flatShading
        />
      </mesh>
    </group>
  )
}
