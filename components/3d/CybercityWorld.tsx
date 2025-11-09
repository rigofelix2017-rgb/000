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
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    );
    
    // Back windows
    windows.push(
      <mesh key={`back-${i}`} position={[0, y, -PARCEL_SIZE * 0.46]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[PARCEL_SIZE * 0.8, 4]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    );
  }

  return <>{windows}</>;
}

function ParcelBuilding({ parcel, isSelected }: { parcel: Parcel; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  // Calculate world position (string parcelId now supported)
  const worldPos = landRegistryAPI.getWorldPosition(parcel.parcelId);
  
  // Calculate building height based on TIER (not zone)
  // CORE tier: 60-120 floors (tallest)
  // RING tier: 30-60 floors
  // FRONTIER tier: 15-40 floors
  let buildingHeight = 20; // Default
  
  if (parcel.tier === 'CORE') {
    buildingHeight = 60 + Math.random() * 60; // 60-120 units
  } else if (parcel.tier === 'RING') {
    buildingHeight = 30 + Math.random() * 30; // 30-60 units
  } else { // FRONTIER
    buildingHeight = 15 + Math.random() * 25; // 15-40 units
  }

  // DAO Plaza gets special treatment (ultra tall)
  if (parcel.district === 'DAO') {
    buildingHeight = 80 + Math.random() * 40; // 80-120 units
  }

  // Animate FOR_SALE marker
  useFrame((state) => {
    if (markerRef.current && parcel.status === ParcelStatus.FOR_SALE) {
      markerRef.current.position.y = buildingHeight + 3 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  // Get building color based on DISTRICT (not zone)
  const getBuildingColor = (): string => {
    switch (parcel.district) {
      case 'GAMING': return "#ef4444";      // Red - Gaming District
      case 'BUSINESS': return "#3b82f6";    // Blue - Business District
      case 'SOCIAL': return "#ec4899";      // Pink - Social District
      case 'DEFI': return "#10b981";        // Green - DeFi District
      case 'RESIDENTIAL': return "#8b5cf6"; // Violet - Residential
      case 'DAO': return "#9333ea";         // Purple - DAO Plaza
      case 'PUBLIC': return "#6b7280";      // Gray - Public spaces
      default: return "#4a5568";
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
  // Gaming, Business, and Social districts have neon
  const hasNeon = parcel.district === 'GAMING' || parcel.district === 'BUSINESS' || parcel.district === 'SOCIAL';
  
  // Chrome/metallic for CORE tier, concrete for FRONTIER
  const isChromeBuilding = parcel.tier === 'CORE' && (parcel.district === 'BUSINESS' || parcel.district === 'DEFI');
  const metalness = isChromeBuilding ? 0.9 : 0.3;
  const roughness = isChromeBuilding ? 0.1 : 0.7;
  
  // Tall buildings get rooftop features
  const hasTallBuilding = buildingHeight > 60;

  return (
    <group position={[worldPos.x, 0, worldPos.z]}>
      {/* Main Building */}
      <mesh ref={meshRef} position={[0, buildingHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[PARCEL_SIZE * 0.9, buildingHeight, PARCEL_SIZE * 0.9]} />
        <meshStandardMaterial
          color={buildingColor}
          roughness={roughness}
          metalness={metalness}
          emissive={hasNeon ? buildingColor : "#000000"}
          emissiveIntensity={hasNeon ? 0.3 : 0}
        />
      </mesh>
      
      {/* Rooftop Helipad (for tall CORE buildings) */}
      {hasTallBuilding && parcel.tier === 'CORE' && (
        <mesh position={[0, buildingHeight + 1, 0]}>
          <cylinderGeometry args={[4, 4, 0.5, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

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
      {parcel.status === ParcelStatus.OWNED && parcel.owner && (
        <group>
          {/* Top beam */}
          <mesh position={[0, buildingHeight + 2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.6} />
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
            <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1.5} />
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

// DuskSky component for atmospheric background  
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
