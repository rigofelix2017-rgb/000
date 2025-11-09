"use client"

import { useState } from "react"
import { BUILDINGS, ROADS, type Building, CITY_BOUNDS } from "@/lib/city-assets"
import { X, Home, Building2, Store, MapPin } from "lucide-react"

interface CityMapProps {
  playerPosition: { x: number; z: number }
  onClose: () => void
  onPropertyClick?: (building: Building) => void
}

export function CityMap({ playerPosition, onClose, onPropertyClick }: CityMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [filter, setFilter] = useState<"all" | "residential" | "commercial" | "mixed" | "special">("all")

  // Map dimensions
  const mapWidth = 400
  const mapHeight = 300
  const worldWidth = CITY_BOUNDS.maxX - CITY_BOUNDS.minX
  const worldHeight = CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ

  // Convert world coordinates to map coordinates
  const worldToMap = (x: number, z: number) => {
    const mapX = ((x - CITY_BOUNDS.minX) / worldWidth) * mapWidth
    const mapZ = ((z - CITY_BOUNDS.minZ) / worldHeight) * mapHeight
    return { x: mapX, y: mapZ }
  }

  const filteredBuildings = BUILDINGS.filter((b) => filter === "all" || b.type === filter)

  const getColorForType = (type: Building["type"]) => {
    switch (type) {
      case "residential":
        return "#10b981" // green
      case "commercial":
        return "#f59e0b" // amber
      case "mixed":
        return "#8b5cf6" // purple
      case "special":
        return "#06b6d4" // cyan
      default:
        return "#6b7280" // gray
    }
  }

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building)
    onPropertyClick?.(building)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="w-full max-w-5xl h-[90vh] bg-[#0a0f1a] border border-emerald-500/30 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/30 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Audiowide, sans-serif" }}>
              PSX CITY MAP
            </h2>
            <p className="text-sm text-emerald-400/80">Real-time location tracking & property registry</p>
          </div>
          <button
            onClick={onClose}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = "scale(0.9)"
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "scale(1)"
            }}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition active:scale-90"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 p-6 overflow-auto">
            <div
              className="relative bg-[#020617] border border-emerald-500/20 rounded-lg p-4"
              style={{ width: mapWidth, height: mapHeight, touchAction: "pan-x pan-y" }}
            >
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={(i * mapWidth) / 20}
                    y1={0}
                    x2={(i * mapWidth) / 20}
                    y2={mapHeight}
                    stroke="#10b981"
                    strokeWidth="0.5"
                  />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={(i * mapHeight) / 15}
                    x2={mapWidth}
                    y2={(i * mapHeight) / 15}
                    stroke="#10b981"
                    strokeWidth="0.5"
                    className="pointer-events-none"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                ))}
              </svg>

              {/* Roads */}
              {ROADS.map((road) => {
                const from = worldToMap(road.from[0], road.from[2])
                const to = worldToMap(road.to[0], road.to[2])
                return (
                  <line
                    key={road.id}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#52525b"
                    strokeWidth={(road.width / worldWidth) * mapWidth}
                    className="pointer-events-none"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                )
              })}

              {/* Buildings */}
              {filteredBuildings.map((building) => {
                const pos = worldToMap(building.x, building.z)
                const w = (building.width / worldWidth) * mapWidth
                const h = (building.depth / worldHeight) * mapHeight
                const isSelected = selectedBuilding?.id === building.id
                const color = getColorForType(building.type)

                return (
                  <div
                    key={building.id}
                    onClick={() => handleBuildingClick(building)}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = `scale(${isSelected ? 1.1 : 1.05})`
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = `scale(${isSelected ? 1.1 : 1})`
                    }}
                    className={`absolute cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-white scale-110 z-10" : "hover:scale-105"
                    }`}
                    style={{
                      left: pos.x - w / 2,
                      top: pos.y - h / 2,
                      width: w,
                      height: h,
                      backgroundColor: color,
                      opacity: isSelected ? 1 : 0.8,
                      boxShadow: isSelected ? `0 0 20px ${color}` : `0 0 8px ${color}80`,
                      WebkitTapHighlightColor: "transparent",
                    }}
                    title={building.id}
                  />
                )
              })}

              {/* Player position */}
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse z-20"
                style={{
                  left: worldToMap(playerPosition.x, playerPosition.z).x - 8,
                  top: worldToMap(playerPosition.x, playerPosition.z).y - 8,
                  boxShadow: "0 0 20px #3b82f6",
                }}
              />
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#10b981] rounded" />
                <span className="text-xs text-white">Residential</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#f59e0b] rounded" />
                <span className="text-xs text-white">Commercial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#8b5cf6] rounded" />
                <span className="text-xs text-white">Mixed Use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#06b6d4] rounded" />
                <span className="text-xs text-white">Special</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                <span className="text-xs text-white">Your Location</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-emerald-500/30 p-4 flex flex-col gap-4 bg-[#020617]/50 overflow-auto">
            {/* Filters */}
            <div>
              <h3 className="text-sm font-bold text-emerald-400 mb-2">FILTER BY TYPE</h3>
              <div className="flex flex-wrap gap-2">
                {["all", "residential", "commercial", "mixed", "special"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type as any)}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = "scale(0.95)"
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold transition active:scale-95 ${
                      filter === type
                        ? "bg-emerald-500 text-black"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Building Info */}
            {selectedBuilding && (
              <div className="flex-1 bg-[#0a0f1a] border border-emerald-500/30 rounded-lg p-4 overflow-auto">
                <div className="flex items-start gap-3 mb-4">
                  {selectedBuilding.type === "residential" && <Home className="w-6 h-6 text-emerald-400" />}
                  {selectedBuilding.type === "commercial" && <Store className="w-6 h-6 text-amber-400" />}
                  {selectedBuilding.type === "mixed" && <Building2 className="w-6 h-6 text-purple-400" />}
                  {selectedBuilding.type === "special" && <MapPin className="w-6 h-6 text-cyan-400" />}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">{selectedBuilding.id}</h4>
                    <p className="text-xs text-emerald-400/80 uppercase">{selectedBuilding.type}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p className="text-white font-mono">
                      X: {selectedBuilding.x}, Z: {selectedBuilding.z}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Dimensions:</span>
                    <p className="text-white">
                      {selectedBuilding.width} × {selectedBuilding.depth} × {selectedBuilding.height}
                    </p>
                  </div>
                  {selectedBuilding.forSale && (
                    <>
                      <div className="pt-3 border-t border-emerald-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-semibold">FOR SALE</span>
                          <span className="text-2xl font-bold text-white">
                            ${selectedBuilding.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition active:scale-95"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.transform = "scale(0.95)"
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        BUY PROPERTY
                      </button>
                    </>
                  )}
                  {!selectedBuilding.forSale && (
                    <div className="pt-3 border-t border-emerald-500/20">
                      <span className="text-red-400 font-semibold">NOT FOR SALE</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-[#0a0f1a] border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-xs font-bold text-emerald-400 mb-2">CITY STATS</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Total Properties:</span>
                  <span className="font-bold text-white">{BUILDINGS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>For Sale:</span>
                  <span className="font-bold text-emerald-400">{BUILDINGS.filter((b) => b.forSale).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Residential:</span>
                  <span className="font-bold text-green-400">
                    {BUILDINGS.filter((b) => b.type === "residential").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial:</span>
                  <span className="font-bold text-amber-400">
                    {BUILDINGS.filter((b) => b.type === "commercial").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
