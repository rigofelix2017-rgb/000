"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const DISTRICTS = [
  {
    name: "casino",
    start: 0,
    end: 199,
    color: "#FF006E",
    groundColor: "#1a0033",
  },
  {
    name: "business",
    start: 200,
    end: 399,
    color: "#8D99AE",
    groundColor: "#2B2D42",
  },
  {
    name: "social",
    start: 400,
    end: 599,
    color: "#06FFA5",
    groundColor: "#1a1a2e",
  },
  {
    name: "event",
    start: 600,
    end: 799,
    color: "#F72585",
    groundColor: "#0a0014",
  },
  {
    name: "glizzy",
    start: 800,
    end: 999,
    color: "#FFD700",
    groundColor: "#0f0a00",
  },
]

export function WorldGrid({ onDistrictChange, playerPosition }: any) {
  const gridRef = useRef<THREE.Group>(null)

  // Animate grid
  useFrame((state) => {
    if (gridRef.current) {
      // Subtle floating animation
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // Calculate current district
  const currentParcel = Math.floor(playerPosition.x / 25.6) + Math.floor(playerPosition.z / 25.6) * 50
  const currentDistrict = DISTRICTS.find((d) => currentParcel >= d.start && currentParcel <= d.end)

  return (
    <group ref={gridRef}>
      {/* Ground plane for each district */}
      {DISTRICTS.map((district, idx) => {
        const startCol = district.start % 50
        const startRow = Math.floor(district.start / 50)
        const endCol = district.end % 50
        const endRow = Math.floor(district.end / 50)

        const width = (endCol - startCol + 1) * 25.6
        const height = (endRow - startRow + 1) * 25.6
        const x = startCol * 25.6 - 640 + width / 2
        const z = startRow * 25.6 - 256 + height / 2

        return (
          <group key={district.name}>
            {/* District ground */}
            <mesh position={[x, -0.1, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[width, height, 20, 8]} />
              <meshStandardMaterial
                color={district.groundColor}
                roughness={0.8}
                metalness={0.2}
                flatShading // PS1 effect
              />
            </mesh>

            {/* District border glow */}
            <mesh position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[width + 1, height + 1]} />
              <meshBasicMaterial color={district.color} transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>

            {/* Grid lines (PS1 style) */}
            <gridHelper
              args={[width, endCol - startCol + 1, district.color, district.color]}
              position={[x, 0, z]}
              rotation={[0, 0, 0]}
            />
          </group>
        )
      })}

      {/* Buildings/Landmarks (random placement for demo) */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 1280
        const z = (Math.random() - 0.5) * 512
        const height = Math.random() * 10 + 5
        const width = Math.random() * 5 + 3

        return (
          <mesh key={i} position={[x, height / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[width, height, width, 1, Math.ceil(height), 1]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)}
              flatShading // PS1 effect
              roughness={0.9}
            />
          </mesh>
        )
      })}

      {/* Casino elements */}
      <group position={[-500, 0, -200]}>
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[20, 10, 20]} />
          <meshStandardMaterial color="#FF006E" flatShading emissive="#FF006E" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 10, 0]} color="#FF006E" intensity={2} distance={30} />
      </group>

      {/* Social district centerpiece */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 8, 0]} castShadow>
          <cylinderGeometry args={[10, 15, 16, 6]} />
          <meshStandardMaterial color="#06FFA5" flatShading emissive="#06FFA5" emissiveIntensity={0.3} />
        </mesh>
        <pointLight position={[0, 15, 0]} color="#06FFA5" intensity={3} distance={40} />
      </group>

      {/* Glizzy World entrance */}
      <group position={[500, 0, 200]}>
        <mesh position={[0, 10, 0]} castShadow>
          <coneGeometry args={[15, 20, 8]} />
          <meshStandardMaterial color="#FFD700" flatShading emissive="#FFD700" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 20, 0]} color="#FFD700" intensity={4} distance={50} />
      </group>
    </group>
  )
}
