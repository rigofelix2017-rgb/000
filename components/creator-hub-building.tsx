"use client"

export function CreatorHubBuilding() {
  return (
    <group position={[600, 0, -600]}>
      {/* Main hub structure - cubic design */}
      <mesh position={[0, 25, 0]} castShadow receiveShadow>
        <boxGeometry args={[45, 50, 45]} />
        <meshStandardMaterial
          color="#A855F7"
          roughness={0.3}
          metalness={0.7}
          emissive="#A855F7"
          emissiveIntensity={0.6}
          flatShading
        />
      </mesh>

      {/* Floating platforms */}
      {[-15, 0, 15].map((offset, i) => (
        <mesh key={i} position={[offset, 35 + i * 8, 28]} castShadow>
          <boxGeometry args={[12, 2, 8]} />
          <meshStandardMaterial color="#F72585" emissive="#F72585" emissiveIntensity={1.2} flatShading />
        </mesh>
      ))}

      {/* Central energy beam */}
      <mesh position={[0, 52, 0]}>
        <cylinderGeometry args={[3, 3, 10, 8]} />
        <meshStandardMaterial
          color="#06FFA5"
          emissive="#06FFA5"
          emissiveIntensity={2.5}
          transparent
          opacity={0.7}
          flatShading
        />
      </mesh>

      {/* Corner crystals */}
      {[
        [-20, 20],
        [20, 20],
        [-20, -20],
        [20, -20],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 52, z]}>
          <coneGeometry args={[3, 8, 4]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} flatShading />
        </mesh>
      ))}
    </group>
  )
}
