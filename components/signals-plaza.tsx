"use client"

export function SignalsPlaza() {
  return (
    <group position={[-400, 0, 0]}>
      {/* Main antenna tower */}
      <mesh position={[0, 40, 0]} castShadow>
        <cylinderGeometry args={[4, 8, 80, 6]} />
        <meshStandardMaterial
          color="#00D9FF"
          roughness={0.2}
          metalness={0.9}
          emissive="#00D9FF"
          emissiveIntensity={0.7}
          flatShading
        />
      </mesh>

      {/* Satellite dishes */}
      {[20, 40, 60].map((height, i) => (
        <group key={i} position={[0, height, 0]}>
          <mesh rotation={[Math.PI / 4, i * 0.5, 0]} position={[10, 0, 0]}>
            <sphereGeometry args={[6, 8, 8, 0, Math.PI]} />
            <meshStandardMaterial color="#FF006E" emissive="#FF006E" emissiveIntensity={1.5} flatShading />
          </mesh>
        </group>
      ))}

      {/* Signal wave rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 82, 0]} rotation={[0, i * (Math.PI / 3), 0]}>
          <torusGeometry args={[12 + i * 4, 0.8, 8, 16]} />
          <meshStandardMaterial
            color="#00D9FF"
            emissive="#00D9FF"
            emissiveIntensity={2.5}
            transparent
            opacity={0.6}
            flatShading
          />
        </mesh>
      ))}

      {/* Base platform */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[25, 30, 4, 8]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.5}
          metalness={0.5}
          emissive="#00D9FF"
          emissiveIntensity={0.3}
          flatShading
        />
      </mesh>
    </group>
  )
}
