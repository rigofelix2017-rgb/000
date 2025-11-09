"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { unifiedLandRegistry, LAND_CONFIG, type UnifiedParcel } from "@/lib/land/unified-land-system"
import { StreetLightingSystem, StreetParcel, DAOHeadquartersBuilding, BuildingParcel } from "@/components/3d"

export function UnifiedCybercityWorld({ selectedParcelId }: { selectedParcelId?: string }) {
  const parcels = useMemo(() => unifiedLandRegistry.getAllParcels(), [])

  return (
    <group>
      {/* Dusk HDRI Sky with gradient */}
      <DuskHDRISky />

      {/* Global lighting setup */}
      <ambientLight intensity={0.3} color="#4a5568" />
      <hemisphereLight intensity={0.5} color="#6366f1" groundColor="#1e293b" />
      <directionalLight position={[50, 100, 50]} intensity={0.5} castShadow />

      {/* Render all parcels */}
      {parcels.map((parcel) => (
        <ParcelRenderer key={parcel.parcelId} parcel={parcel} isSelected={parcel.parcelId === selectedParcelId} />
      ))}

      {/* Street lights system */}
      <StreetLightingSystem parcels={parcels} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[LAND_CONFIG.citySize * 2, LAND_CONFIG.citySize * 2]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>
    </group>
  )
}

function ParcelRenderer({ parcel, isSelected }: { parcel: UnifiedParcel; isSelected: boolean }) {
  if (parcel.type === "STREET") {
    return <StreetParcel parcel={parcel} />
  }

  if (parcel.type === "DAO") {
    return <DAOHeadquartersBuilding parcel={parcel} isSelected={isSelected} />
  }

  return <BuildingParcel parcel={parcel} isSelected={isSelected} />
}

function DuskHDRISky() {
  const skyRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (skyRef.current) {
      skyRef.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  return (
    <mesh ref={skyRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            `
            vec3 zenithColor = vec3(0.05, 0.08, 0.2); // Darker blue-violet overhead
            vec3 horizonColor = vec3(0.5, 0.25, 0.6); // Purple at horizon
            vec3 groundColor = vec3(0.9, 0.5, 0.3); // Warm orange near ground
            
            float h = normalize(vNormal.y);
            vec3 skyColor = mix(groundColor, horizonColor, smoothstep(-0.2, 0.4, h));
            skyColor = mix(skyColor, zenithColor, smoothstep(0.4, 1.0, h));
            
            diffuseColor.rgb = skyColor;
            `,
          )
        }}
      />
    </mesh>
  )
}
