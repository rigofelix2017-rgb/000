"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useParcelsPage } from "@/lib/land/hooks"
import { Parcel, ParcelStatus, LicenseType } from "@/lib/land/types"
import { landRegistryAPI } from "@/lib/land/registry-api"
import { Text } from "@react-three/drei"

const PARCEL_SIZE = 40; // 40 world units per parcel
const PARCEL_SPACING = 16; // 16 unit spacing between parcels

export function CybercityWorld({ selectedParcelId }: { selectedParcelId?: string }) {
  // Load parcels from new land system (500 at a time)
  const { parcels, isLoading } = useParcelsPage(1, 500);

  if (isLoading) {
    return (
      <group>
        <Text position={[0, 10, 0]} fontSize={5} color="#00ffff">
          Loading Parcels...
        </Text>
      </group>
    );
  }

  return (
    <group>
      {/* Dusk HDRI Sky */}
      <DuskSky />

      {/* Global Ambient Lighting */}
      <ambientLight intensity={0.3} color="#4a5568" />
      <hemisphereLight intensity={0.5} color="#6366f1" groundColor="#1e293b" />

      {/* Render all parcels */}
      {parcels.map((parcel) => {
        const isSelected = selectedParcelId === `parcel-${parcel.parcelId}`;
        return <ParcelBuilding key={parcel.parcelId} parcel={parcel} isSelected={isSelected} />
      })}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
    </group>
  )
}

// Windows component for new land system buildings
function WindowsNew({ buildingHeight }: { buildingHeight: number }) {
  const windowRows = Math.floor(buildingHeight / 5);
  const windows = [];

  for (let i = 0; i < windowRows; i++) {
    const y = (i * 5) + 2.5 - buildingHeight / 2;
    
    // Front windows
    windows.push(
      <mesh key={`front-${i}`} position={[0, y, PARCEL_SIZE * 0.46]}>
        <planeGeometry args={[PARCEL_SIZE * 0.8, 4]} />
        <meshBasicMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    );
    
    // Back windows
    windows.push(
      <mesh key={`back-${i}`} position={[0, y, -PARCEL_SIZE * 0.46]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[PARCEL_SIZE * 0.8, 4]} />
        <meshBasicMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    );
  }

  return <>{windows}</>;
}

function ParcelBuilding({ parcel, isSelected }: { parcel: Parcel; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  // Calculate world position
  const worldPos = landRegistryAPI.getWorldPosition(parcel.parcelId);
  
  // Calculate building height based on zone and distance from center
  const distance = landRegistryAPI.getDistanceFromCenter(parcel.gridX, parcel.gridY);
  let buildingHeight = 20; // Default
  
  // Premium zone = tallest buildings (50-100 units)
  if (parcel.zone === 3) buildingHeight = 50 + Math.random() * 50;
  // Commercial = tall (30-60 units)
  else if (parcel.zone === 2) buildingHeight = 30 + Math.random() * 30;
  // Residential = medium (20-40 units)
  else if (parcel.zone === 1) buildingHeight = 20 + Math.random() * 20;
  // Public = low (10-25 units)
  else buildingHeight = 10 + Math.random() * 15;

  // Taller in the center
  if (distance < 20) buildingHeight *= 1.5;

  // Animate FOR_SALE marker
  useFrame((state) => {
    if (markerRef.current && parcel.status === ParcelStatus.FOR_SALE) {
      markerRef.current.position.y = buildingHeight + 3 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  // Get building color based on zone
  const getBuildingColor = (): string => {
    switch (parcel.zone) {
      case 0: return "#4a5568"; // Public - Gray
      case 1: return "#3b82f6"; // Residential - Blue
      case 2: return "#f59e0b"; // Commercial - Amber
      case 3: return "#8b5cf6"; // Premium - Purple
      case 4: return "#ec4899"; // Glizzy World - Pink
      default: return "#6b7280";
    }
  };

  // Get ownership outline color
  const getOwnershipColor = (): string | null => {
    if (parcel.status === ParcelStatus.FOR_SALE) return "#fbbf24"; // Amber
    if (parcel.status === ParcelStatus.OWNED) return "#00ff88"; // Cyan-green
    if (parcel.status === ParcelStatus.DAO_OWNED) return "#ff00ff"; // Magenta
    return null;
  };

  const buildingColor = getBuildingColor();
  const ownershipColor = getOwnershipColor();
  const hasNeon = parcel.zone === 2 || parcel.zone === 4; // Commercial and Glizzy World

  return (
    <group position={[worldPos.x, 0, worldPos.z]}>
      {/* Main Building */}
      <mesh ref={meshRef} position={[0, buildingHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PARCEL_SIZE * 0.9, buildingHeight, PARCEL_SIZE * 0.9]} />
        <meshStandardMaterial
          color={buildingColor}
          roughness={0.7}
          metalness={0.3}
          emissive={hasNeon ? buildingColor : "#000000"}
          emissiveIntensity={hasNeon ? 0.2 : 0}
        />
      </mesh>

      {/* Windows */}
      <WindowsNew buildingHeight={buildingHeight} />

      {/* OWNERSHIP VISUALIZATION */}
      {ownershipColor && (
        <mesh position={[0, buildingHeight / 2, 0]}>
          <boxGeometry args={[PARCEL_SIZE * 0.95, buildingHeight + 0.5, PARCEL_SIZE * 0.95]} />
          <meshBasicMaterial 
            color={ownershipColor} 
            wireframe 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}

      {/* FOR SALE Hologram */}
      {parcel.status === ParcelStatus.FOR_SALE && (
        <group>
          <mesh ref={markerRef} position={[0, buildingHeight + 3, 0]} rotation={[0, Math.PI / 4, 0]}>
            <planeGeometry args={[6, 3]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, buildingHeight + 3, 0.01]}
            rotation={[0, Math.PI / 4, 0]}
            fontSize={0.8}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            FOR SALE
          </Text>
        </group>
      )}

      {/* OWNED Badge */}
      {parcel.status === ParcelStatus.OWNED && parcel.ownerAddress && (
        <group>
          {/* Top beam */}
          <mesh position={[0, buildingHeight + 2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
            <meshBasicMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.6} />
          </mesh>
          {/* Owner badge */}
          <Text
            position={[0, buildingHeight + 5, 0]}
            fontSize={0.5}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
          >
            OWNED
          </Text>
        </group>
      )}

      {/* DAO Badge */}
      {parcel.status === ParcelStatus.DAO_OWNED && (
        <group>
          <mesh position={[0, buildingHeight + 5, 0]}>
            <cylinderGeometry args={[3, 3, 0.5, 32]} />
            <meshBasicMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
          </mesh>
          <Text
            position={[0, buildingHeight + 5.5, 0]}
            fontSize={1.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            DAO
          </Text>
        </group>
      )}

      {/* Business License Badge */}
      {parcel.businessLicense !== LicenseType.NONE && (
        <mesh position={[PARCEL_SIZE * 0.4, buildingHeight * 0.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial 
            color={getBusinessLicenseColor(parcel.businessLicense)} 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, buildingHeight / 2, 0]}>
          <boxGeometry args={[PARCEL_SIZE, buildingHeight + 1, PARCEL_SIZE]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function getBusinessLicenseColor(license: LicenseType): string {
  switch (license) {
    case LicenseType.RETAIL: return "#10b981"; // Green
    case LicenseType.ENTERTAINMENT: return "#f59e0b"; // Amber
    case LicenseType.SERVICES: return "#3b82f6"; // Blue
    case LicenseType.GAMING: return "#ec4899"; // Pink
    default: return "#6b7280";
  }
}
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
