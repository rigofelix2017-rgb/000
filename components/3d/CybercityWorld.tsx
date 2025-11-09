"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { parcelRegistry, PARCEL_CONFIG, type ParcelData } from "@/lib/parcel-system"
import { Text } from "@react-three/drei"

export function CybercityWorld({ selectedParcelId }: { selectedParcelId?: string }) {
  const parcels = useMemo(() => parcelRegistry.getAllParcels(), [])

  return (
    <group>
      {/* Dusk HDRI Sky */}
      <DuskSky />

      {/* Global Ambient Lighting */}
      <ambientLight intensity={0.3} color="#4a5568" />
      <hemisphereLight intensity={0.5} color="#6366f1" groundColor="#1e293b" />

      {/* Render all parcels */}
      {parcels.map((parcel) => (
        <Parcel key={parcel.parcelId} parcel={parcel} isSelected={parcel.parcelId === selectedParcelId} />
      ))}

      {/* Street Lights */}
      <StreetLights parcels={parcels} />

      {/* Ground plane with grass texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
    </group>
  )
}

function Parcel({ parcel, isSelected }: { parcel: ParcelData; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const markerRef = useRef<THREE.Mesh>(null)

  // Animate selection highlight
  useFrame((state) => {
    if (markerRef.current && parcel.status === "FOR_SALE") {
      markerRef.current.position.y = parcel.metadata.height + 2 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  // Street parcels - render road and sidewalks
  if (parcel.type === "STREET") {
    return <Street parcel={parcel} />
  }

  // DAO building
  if (parcel.type === "DAO") {
    return <DAOBuilding parcel={parcel} isSelected={isSelected} />
  }

  // Regular building
  const material = getBuildingMaterial(parcel)
  const color = getBuildingColor(parcel)

  return (
    <group position={[parcel.worldX, 0, parcel.worldZ]}>
      {/* Building mesh */}
      <mesh ref={meshRef} position={[0, parcel.metadata.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PARCEL_CONFIG.size * 0.9, parcel.metadata.height, PARCEL_CONFIG.size * 0.9]} />
        <meshStandardMaterial
          color={color}
          roughness={material.roughness}
          metalness={material.metalness}
          emissive={parcel.metadata.hasNeon ? color : "#000000"}
          emissiveIntensity={parcel.metadata.hasNeon ? 0.3 : 0}
        />
      </mesh>

      {/* Windows */}
      <Windows parcel={parcel} />

      {/* FOR SALE marker */}
      {parcel.status === "FOR_SALE" && (
        <group>
          {/* Glowing border */}
          <mesh position={[0, parcel.metadata.height / 2, 0]}>
            <boxGeometry args={[PARCEL_CONFIG.size * 0.95, parcel.metadata.height + 0.2, PARCEL_CONFIG.size * 0.95]} />
            <meshBasicMaterial color="#fbbf24" wireframe transparent opacity={0.6} />
          </mesh>

          {/* Holographic FOR SALE sign */}
          <mesh ref={markerRef} position={[0, parcel.metadata.height + 2, 0]} rotation={[0, Math.PI / 4, 0]}>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, parcel.metadata.height + 2, 0.01]}
            rotation={[0, Math.PI / 4, 0]}
            fontSize={0.5}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            FOR SALE
          </Text>
          <Text
            position={[0, parcel.metadata.height + 1.5, 0.01]}
            rotation={[0, Math.PI / 4, 0]}
            fontSize={0.3}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            ${(parcel.price / 1000).toFixed(0)}K
          </Text>
        </group>
      )}

      {/* Selection highlight */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[PARCEL_CONFIG.size * 0.45, PARCEL_CONFIG.size * 0.5, 32]} />
          <meshBasicMaterial color="#06FFA5" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

function Street({ parcel }: { parcel: ParcelData }) {
  return (
    <group position={[parcel.worldX, 0, parcel.worldZ]}>
      {/* Road surface */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[PARCEL_CONFIG.streetWidth, PARCEL_CONFIG.size]} />
        <meshStandardMaterial color="#2d3748" roughness={0.9} />
      </mesh>

      {/* Lane markings */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, PARCEL_CONFIG.size]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Sidewalks - raised 15cm */}
      <mesh
        position={[
          -PARCEL_CONFIG.streetWidth / 2 - PARCEL_CONFIG.sidewalkWidth / 2,
          PARCEL_CONFIG.sidewalkHeight / 2,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry args={[PARCEL_CONFIG.sidewalkWidth, PARCEL_CONFIG.sidewalkHeight, PARCEL_CONFIG.size]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      <mesh
        position={[
          PARCEL_CONFIG.streetWidth / 2 + PARCEL_CONFIG.sidewalkWidth / 2,
          PARCEL_CONFIG.sidewalkHeight / 2,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry args={[PARCEL_CONFIG.sidewalkWidth, PARCEL_CONFIG.sidewalkHeight, PARCEL_CONFIG.size]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
    </group>
  )
}

function DAOBuilding({ parcel, isSelected }: { parcel: ParcelData; isSelected: boolean }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={meshRef} position={[parcel.worldX, 0, parcel.worldZ]}>
      {/* Main tower */}
      <mesh position={[0, parcel.metadata.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, parcel.metadata.height, 20]} />
        <meshStandardMaterial
          color="#06FFA5"
          roughness={0.3}
          metalness={0.8}
          emissive="#06FFA5"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Spire */}
      <mesh position={[0, parcel.metadata.height + 5, 0]} castShadow>
        <coneGeometry args={[8, 10, 8]} />
        <meshStandardMaterial
          color="#06FFA5"
          roughness={0.2}
          metalness={0.9}
          emissive="#06FFA5"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Floating rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 15 + i * 8, 0]} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[10 + i * 2, 0.5, 16, 32]} />
          <meshStandardMaterial color="#06FFA5" emissive="#06FFA5" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[25, 25, 1, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* DAO Label */}
      <Text
        position={[0, parcel.metadata.height + 12, 0]}
        fontSize={3}
        color="#06FFA5"
        anchorX="center"
        anchorY="middle"
      >
        PSX DAO
      </Text>
    </group>
  )
}

function Windows({ parcel }: { parcel: ParcelData }) {
  const windows = []
  const floors = parcel.metadata.floors
  const floorHeight = parcel.metadata.height / floors

  for (let floor = 0; floor < floors; floor++) {
    const y = floor * floorHeight + floorHeight / 2
    const isLit = Math.random() > 0.2 // 80% of windows are lit for cyberpunk vibe

    // Front and back windows
    for (let side = 0; side < 2; side++) {
      windows.push(
        <mesh key={`window-fb-${floor}-${side}`} position={[0, y, (side === 0 ? 1 : -1) * (PARCEL_CONFIG.size * 0.45)]}>
          <planeGeometry args={[PARCEL_CONFIG.size * 0.7, floorHeight * 0.6]} />
          <meshStandardMaterial
            color={isLit ? "#06FFA5" : "#1a1a2e"}
            emissive={isLit ? "#06FFA5" : "#000000"}
            emissiveIntensity={isLit ? 0.8 : 0} // Brighter neon glow
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>,
      )
    }
  }

  return <group>{windows}</group>
}

function StreetLights({ parcels }: { parcels: ParcelData[] }) {
  const streetParcels = parcels.filter((p) => p.type === "STREET")
  const lights = []

  streetParcels.forEach((parcel, i) => {
    if (i % 3 === 0) {
      lights.push(
        <group key={`light-${parcel.parcelId}`} position={[parcel.worldX, 0, parcel.worldZ]}>
          {/* Chrome light pole */}
          <mesh position={[-PARCEL_CONFIG.streetWidth / 2 - PARCEL_CONFIG.sidewalkWidth, 4, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 8, 16]} />
            <meshStandardMaterial color="#95a5a6" metalness={0.95} roughness={0.2} />
          </mesh>

          {/* Neon light fixture with Y2K glow */}
          <mesh position={[-PARCEL_CONFIG.streetWidth / 2 - PARCEL_CONFIG.sidewalkWidth, 8, 0]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial
              color="#06FFA5"
              emissive="#06FFA5"
              emissiveIntensity={2}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>

          {/* Stronger point light for cyberpunk atmosphere */}
          <pointLight
            position={[-PARCEL_CONFIG.streetWidth / 2 - PARCEL_CONFIG.sidewalkWidth, 8, 0]}
            color="#06FFA5"
            intensity={80}
            distance={40}
            castShadow
          />
        </group>,
      )
    }
  })

  return <>{lights}</>
}

function DuskSky() {
  const skyRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (skyRef.current) {
      skyRef.current.rotation.y = state.clock.elapsedTime * 0.01
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
            vec3 topColor = vec3(0.02, 0.05, 0.15); // Deep emo blue-black at zenith
            vec3 horizonColor = vec3(0.35, 0.15, 0.5); // Purple emo horizon
            vec3 bottomColor = vec3(0.6, 0.2, 0.35); // Pink-purple near ground
            
            float h = normalize(vNormal.y);
            vec3 skyColor = mix(bottomColor, horizonColor, smoothstep(-0.2, 0.3, h));
            skyColor = mix(skyColor, topColor, smoothstep(0.3, 1.0, h));
            
            diffuseColor.rgb = skyColor;
            `,
          )
        }}
      />
    </mesh>
  )
}

function getBuildingMaterial(parcel: ParcelData) {
  switch (parcel.metadata.materialVariant) {
    case "metal":
      return { roughness: 0.2, metalness: 0.95 } // More chrome metallic
    case "wood":
      return { roughness: 0.7, metalness: 0.3 } // Slightly metallic wood
    case "concrete":
      return { roughness: 0.6, metalness: 0.4 } // Industrial chrome concrete
    case "mixed":
      return { roughness: 0.4, metalness: 0.7 } // Y2K mixed materials
  }
}

function getBuildingColor(parcel: ParcelData): string {
  const colors = {
    RESIDENTIAL: ["#2c3e50", "#34495e", "#7f8c8d", "#95a5a6"], // Metallic grays
    COMMERCIAL: ["#8e44ad", "#9b59b6", "#e74c3c", "#c0392b"], // Neon purples and reds
    MIXED: ["#16a085", "#1abc9c", "#06FFA5", "#00d4ff"], // Cyan/emerald chrome
  }

  const typeColors = colors[parcel.type as keyof typeof colors] || colors.RESIDENTIAL
  const random = ((parcel.gridX * 374761393 + parcel.gridY * 668265263) % 4294967296) / 4294967296
  return typeColors[Math.floor(random * typeColors.length)]
}
