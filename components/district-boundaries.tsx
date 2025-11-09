"use client"

import { useMemo } from "react"
import { DISTRICTS } from "@/lib/districts"
import * as THREE from "three"

interface DistrictBoundariesProps {
  highlightedDistrictId?: string | null
}

export function DistrictBoundaries({ highlightedDistrictId }: DistrictBoundariesProps) {
  const boundaries = useMemo(() => {
    return DISTRICTS.filter((d) => d.id !== "spawn-zone").map((district) => ({
      id: district.id,
      x: district.centerX,
      z: district.centerZ,
      sizeX: district.sizeX,
      sizeZ: district.sizeZ,
      color: district.color,
    }))
  }, [])

  return (
    <group>
      {boundaries.map((boundary) => {
        const isHighlighted = highlightedDistrictId === boundary.id

        return (
          <group key={boundary.id} position={[boundary.x, 0.05, boundary.z]}>
            {/* District floor with subtle color tint */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[boundary.sizeX, boundary.sizeZ]} />
              <meshStandardMaterial
                color={boundary.color}
                transparent
                opacity={isHighlighted ? 0.15 : 0.05}
                emissive={boundary.color}
                emissiveIntensity={isHighlighted ? 0.3 : 0.1}
              />
            </mesh>

            {/* District border lines */}
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(boundary.sizeX, boundary.sizeZ)]} />
              <lineBasicMaterial
                color={boundary.color}
                transparent
                opacity={isHighlighted ? 0.9 : 0.4}
                linewidth={isHighlighted ? 3 : 1}
              />
            </lineSegments>

            {/* Corner markers */}
            {[
              [-boundary.sizeX / 2, -boundary.sizeZ / 2],
              [boundary.sizeX / 2, -boundary.sizeZ / 2],
              [boundary.sizeX / 2, boundary.sizeZ / 2],
              [-boundary.sizeX / 2, boundary.sizeZ / 2],
            ].map(([offsetX, offsetZ], idx) => (
              <mesh key={idx} position={[offsetX, 0.1, offsetZ]}>
                <cylinderGeometry args={[2, 2, 0.5, 8]} />
                <meshStandardMaterial
                  color={boundary.color}
                  emissive={boundary.color}
                  emissiveIntensity={isHighlighted ? 1.2 : 0.6}
                  transparent
                  opacity={isHighlighted ? 0.9 : 0.6}
                />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}
