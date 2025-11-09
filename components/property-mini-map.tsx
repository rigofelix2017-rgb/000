"use client"

import { useMemo } from "react"
import type { Building } from "@/lib/city-assets"
import { MapPin } from "lucide-react"

interface PropertyMiniMapProps {
  property: Building
  selectedPropertyId?: string
  onClick?: () => void
}

export function PropertyMiniMap({ property, selectedPropertyId, onClick }: PropertyMiniMapProps) {
  // Map dimensions - showing the full VOID city grid
  const mapWidth = 300
  const mapHeight = 300
  const gridSize = 200 // The city is roughly 200x200 units

  // Convert property position to map coordinates
  const propertyMapX = ((property.x + gridSize / 2) / gridSize) * mapWidth
  const propertyMapY = ((property.z + gridSize / 2) / gridSize) * mapHeight

  // District boundaries for reference
  const districts = useMemo(
    () => [
      { name: "Commerce Central", x: 85, y: 85, width: 30, height: 30, color: "#00ffff" },
      { name: "Gaming District", x: 50, y: 50, width: 40, height: 40, color: "#a855f7" },
      { name: "Art & Culture", x: 120, y: 50, width: 40, height: 40, color: "#ec4899" },
      { name: "DeFi District", x: 50, y: 140, width: 40, height: 40, color: "#3b82f6" },
      { name: "Social District", x: 120, y: 140, width: 40, height: 40, color: "#f59e0b" },
      { name: "Residential North", x: 85, y: 20, width: 30, height: 25, color: "#10b981" },
      { name: "Residential South", x: 85, y: 170, width: 30, height: 25, color: "#10b981" },
      { name: "Residential East", x: 170, y: 85, width: 25, height: 30, color: "#10b981" },
      { name: "Residential West", x: 5, y: 85, width: 25, height: 30, color: "#10b981" },
    ],
    [],
  )

  const isSelected = selectedPropertyId === property.id

  return (
    <div
      className={`relative bg-[#020617] border rounded-lg overflow-hidden cursor-pointer transition ${
        isSelected
          ? "border-emerald-500 ring-2 ring-emerald-500/50"
          : "border-emerald-500/20 hover:border-emerald-500/50"
      }`}
      onClick={onClick}
      style={{ width: mapWidth, height: mapHeight }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* District boundaries */}
      {districts.map((district) => (
        <div
          key={district.name}
          className="absolute border opacity-20"
          style={{
            left: (district.x / gridSize) * mapWidth,
            top: (district.y / gridSize) * mapHeight,
            width: (district.width / gridSize) * mapWidth,
            height: (district.height / gridSize) * mapHeight,
            borderColor: district.color,
          }}
        />
      ))}

      {/* Property marker */}
      <div
        className="absolute flex items-center justify-center transition-all duration-300"
        style={{
          left: propertyMapX - 16,
          top: propertyMapY - 16,
          animation: isSelected ? "pulse 2s infinite" : "none",
        }}
      >
        <MapPin className={`w-8 h-8 ${isSelected ? "text-emerald-400" : "text-amber-400"}`} fill="currentColor" />
      </div>

      {/* Coordinates label */}
      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-mono text-emerald-400">
        [{property.x}, {property.z}]
      </div>

      {/* District label */}
      <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white">
        {property.district || "VOID City"}
      </div>
    </div>
  )
}
