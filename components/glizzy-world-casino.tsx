"use client"

export function GlizzyWorldCasino() {
  return (
    <group position={[-600, 0, -600]}>
      {/* Main casino building */}
      <mesh position={[0, 20, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[30, 35, 40, 8]} />
        <meshStandardMaterial
          color="#FF006E"
          roughness={0.2}
          metalness={0.8}
          emissive="#FF006E"
          emissiveIntensity={0.8}
          flatShading
        />
      </mesh>

      {/* Neon ring around top */}
      <mesh position={[0, 42, 0]}>
        <torusGeometry args={[32, 1.5, 8, 32]} />
        <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={3} flatShading />
      </mesh>

      {/* Rotating hologram sign */}
      <mesh position={[0, 50, 0]}>
        <boxGeometry args={[20, 8, 2]} />
        <meshStandardMaterial
          color="#FF006E"
          emissive="#FF006E"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
          flatShading
        />
      </mesh>

      {/* Entrance pillars */}
      {[-15, 15].map((x, i) => (
        <mesh key={i} position={[x, 10, 38]} castShadow>
          <boxGeometry args={[4, 20, 4]} />
          <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} flatShading />
        </mesh>
      ))}

      {/* Floor lights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[40, 32]} />
        <meshStandardMaterial color="#FF006E" emissive="#FF006E" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
