"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"
import { ROADS } from "@/lib/city-assets"

export function StreetLights() {
  const [model, setModel] = useState<THREE.Group | null>(null)

  useEffect(() => {
    const loader = new THREE.ObjectLoader()

    // Try loading the GLB
    fetch("/models/street-light.glb")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        // For now, create a simple procedural street light
        // since GLB loading has issues in this environment
        const lightGroup = new THREE.Group()

        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 4, 8)
        const poleMaterial = new THREE.MeshStandardMaterial({
          color: "#2a2a2a",
          roughness: 0.6,
          metalness: 0.8,
        })
        const pole = new THREE.Mesh(poleGeometry, poleMaterial)
        pole.position.y = 2
        lightGroup.add(pole)

        // Arm extending toward street
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8)
        const arm = new THREE.Mesh(armGeometry, poleMaterial)
        arm.rotation.z = Math.PI / 2
        arm.position.y = 4
        arm.position.x = 0.75
        lightGroup.add(arm)

        // Light bulb housing
        const housingGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.3)
        const housingMaterial = new THREE.MeshStandardMaterial({
          color: "#1a1a1a",
          roughness: 0.4,
          metalness: 0.9,
        })
        const housing = new THREE.Mesh(housingGeometry, housingMaterial)
        housing.position.y = 3.8
        housing.position.x = 1.5
        lightGroup.add(housing)

        // Glowing bulb
        const bulbGeometry = new THREE.SphereGeometry(0.15, 16, 16)
        const bulbMaterial = new THREE.MeshStandardMaterial({
          color: "#ffeb3b",
          emissive: "#ffeb3b",
          emissiveIntensity: 2,
        })
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
        bulb.position.y = 3.8
        bulb.position.x = 1.5
        lightGroup.add(bulb)

        setModel(lightGroup)
      })
      .catch(() => {
        // Fallback: create simple procedural light
        const lightGroup = new THREE.Group()

        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 4, 8)
        const poleMaterial = new THREE.MeshStandardMaterial({
          color: "#2a2a2a",
          roughness: 0.6,
          metalness: 0.8,
        })
        const pole = new THREE.Mesh(poleGeometry, poleMaterial)
        pole.position.y = 2
        lightGroup.add(pole)

        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8)
        const arm = new THREE.Mesh(armGeometry, poleMaterial)
        arm.rotation.z = Math.PI / 2
        arm.position.y = 4
        arm.position.x = 0.75
        lightGroup.add(arm)

        const housingGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.3)
        const housingMaterial = new THREE.MeshStandardMaterial({
          color: "#1a1a1a",
          roughness: 0.4,
          metalness: 0.9,
        })
        const housing = new THREE.Mesh(housingGeometry, housingMaterial)
        housing.position.y = 3.8
        housing.position.x = 1.5
        lightGroup.add(housing)

        const bulbGeometry = new THREE.SphereGeometry(0.15, 16, 16)
        const bulbMaterial = new THREE.MeshStandardMaterial({
          color: "#ffeb3b",
          emissive: "#ffeb3b",
          emissiveIntensity: 2,
        })
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
        bulb.position.y = 3.8
        bulb.position.x = 1.5
        lightGroup.add(bulb)

        setModel(lightGroup)
      })
  }, [])

  if (!model) return null

  // Generate street light positions along roads
  const lightPositions: Array<{ x: number; z: number; rotation: number }> = []

  ROADS.forEach((road) => {
    const from = new THREE.Vector3(road.from[0], 0, road.from[2])
    const to = new THREE.Vector3(road.to[0], 0, road.to[2])
    const length = from.distanceTo(to)
    const direction = to.clone().sub(from).normalize()

    // Calculate perpendicular direction for sidewalk offset
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)

    // Place lights every 20 units along the road
    const spacing = 20
    const numLights = Math.floor(length / spacing)

    for (let i = 0; i <= numLights; i++) {
      const t = (i * spacing) / length
      const position = from.clone().lerp(to, t)

      // Calculate rotation so light faces the street (90 degrees from road direction)
      const angle = Math.atan2(direction.x, direction.z)

      // Place lights on both sides of the road
      // Left side (bulb points right toward street)
      const leftOffset = perpendicular.clone().multiplyScalar(-(road.width / 2 + 2))
      lightPositions.push({
        x: position.x + leftOffset.x,
        z: position.z + leftOffset.z,
        rotation: angle + Math.PI / 2, // 90 degrees so bulb points to street
      })

      // Right side (bulb points left toward street)
      const rightOffset = perpendicular.clone().multiplyScalar(road.width / 2 + 2)
      lightPositions.push({
        x: position.x + rightOffset.x,
        z: position.z + rightOffset.z,
        rotation: angle - Math.PI / 2, // -90 degrees so bulb points to street
      })
    }
  })

  return (
    <group>
      {lightPositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]} rotation={[0, pos.rotation, 0]}>
          <primitive object={model.clone()} />
          {/* Add point light for illumination */}
          <pointLight position={[1.5, 3.8, 0]} color="#ffeb3b" intensity={15} distance={12} decay={2} />
        </group>
      ))}
    </group>
  )
}
