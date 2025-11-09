"use client"

export function DeFiDistrictTower() {
  return (
    <group position={[-250, 0, 0]}>
      {/* Main tower base */}
      <mesh position={[0, 15, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 30, 20]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.6}
          metalness={0.4}
          emissive="#8B5CF6"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Upper tower section */}
      <mesh position={[0, 35, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 20, 15]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.5}
          metalness={0.5}
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Top spire */}
      <mesh position={[0, 50, 0]} castShadow>
        <coneGeometry args={[8, 15, 4]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Accent lights */}
      {[10, 20, 30, 40].map((y) => (
        <pointLight key={y} position={[0, y, 0]} color="#8B5CF6" intensity={0.5} distance={15} />
      ))}
    </group>
  )
}
