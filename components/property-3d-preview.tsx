"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Building } from "@/lib/city-assets"
import type * as THREE from "three"

interface Property3DPreviewProps {
  property: Building
}

function BuildingMesh({ property }: { property: Building }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Get color based on building type
  const getColor = () => {
    switch (property.type) {
      case "residential":
        return "#06FFA5" // Signature emerald chrome
      case "commercial":
        return "#9b59b6" // Purple chrome
      case "mixed":
        return "#00d4ff" // Cyan chrome
      case "special":
        return "#e74c3c" // Red chrome
      default:
        return "#7f8c8d" // Gray chrome
    }
  }

  const color = getColor()

  return (
    <group>
      {/* Main building structure with metallic chrome finish */}
      <mesh ref={meshRef} position={[0, property.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[property.width, property.height, property.depth]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Window details with neon glow */}
      {Array.from({ length: Math.floor(property.height / 3) }).map((_, floor) => (
        <group key={floor}>
          {Array.from({ length: Math.floor(property.width / 2) }).map((_, i) => (
            <mesh
              key={`front-${i}`}
              position={[i * 2 - property.width / 2 + 1, floor * 3 + 1, property.depth / 2 + 0.1]}
            >
              <boxGeometry args={[0.8, 1.2, 0.1]} />
              <meshStandardMaterial color="#06FFA5" emissive="#06FFA5" emissiveIntensity={1.2} />
            </mesh>
          ))}
          {Array.from({ length: Math.floor(property.depth / 2) }).map((_, i) => (
            <mesh
              key={`side-${i}`}
              position={[property.width / 2 + 0.1, floor * 3 + 1, i * 2 - property.depth / 2 + 1]}
            >
              <boxGeometry args={[0.1, 1.2, 0.8]} />
              <meshStandardMaterial color="#06FFA5" emissive="#06FFA5" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Metallic ground plane */}
      <mesh position={[0, -0.1, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.5} roughness={0.7} />
      </mesh>
    </group>
  )
}

function AutoRotatingCamera({ property }: { property: Building }) {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime()
    const radius = Math.max(property.width, property.depth) * 2
    const angle = time * 0.2

    camera.position.x = Math.sin(angle) * radius
    camera.position.z = Math.cos(angle) * radius
    camera.position.y = property.height * 1.2
    camera.lookAt(0, property.height / 2, 0)
  })

  return null
}

export function Property3DPreview({ property }: Property3DPreviewProps) {
  return (
    <div className="w-full h-64 bg-[#020617] border border-emerald-500/20 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [property.width * 1.5, property.height * 1.2, property.depth * 1.5], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />
        <BuildingMesh property={property} />
        <AutoRotatingCamera property={property} />
      </Canvas>
    </div>
  )
}
