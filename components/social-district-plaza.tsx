"use client"

export function SocialDistrictPlaza() {
  return (
    <group position={[-250, 0, -250]}>
      {/* Central plaza platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[25, 25, 1, 32]} />
        <meshStandardMaterial
          color="#1a2e1a"
          roughness={0.7}
          metalness={0.3}
          emissive="#10B981"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Central fountain/sculpture */}
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[3, 5, 10, 8]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.7}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Surrounding pillars */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 18
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <mesh key={i} position={[x, 4, z]} castShadow>
            <cylinderGeometry args={[1.5, 1.5, 8, 8]} />
            <meshStandardMaterial
              color="#0a0a0a"
              roughness={0.6}
              metalness={0.4}
              emissive="#10B981"
              emissiveIntensity={0.4}
            />
          </mesh>
        )
      })}

      {/* Ambient light for the plaza */}
      <pointLight position={[0, 10, 0]} color="#10B981" intensity={1} distance={40} />
    </group>
  )
}
