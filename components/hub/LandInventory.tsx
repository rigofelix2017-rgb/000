"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Grid3x3, List, MapPin, DollarSign } from "lucide-react"
import { propertyRegistry } from "@/lib/real-estate-system"

interface LandInventoryProps {
  walletAddress: string
  onViewOnMap: (parcel: any) => void
  onManageParcel: (parcel: any) => void
}

export function LandInventory({ walletAddress, onViewOnMap, onManageParcel }: LandInventoryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterOwnership, setFilterOwnership] = useState<"mine" | "all" | "forsale">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "location" | "size">("price")

  const parcels = useMemo(() => {
    let data =
      filterOwnership === "mine"
        ? propertyRegistry.getOwnedProperties(walletAddress)
        : filterOwnership === "forsale"
          ? propertyRegistry.getAvailableProperties()
          : propertyRegistry.getAllListings()

    // Apply search
    if (searchQuery) {
      data = data.filter(
        (p) =>
          p.building.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sort
    data.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.listingPrice - a.listingPrice
        case "location":
          return a.building.x - b.building.x
        case "size":
          return b.building.width * b.building.depth - a.building.width * a.building.depth
        default:
          return 0
      }
    })

    return data
  }, [filterOwnership, searchQuery, sortBy, walletAddress])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black y2k-chrome-text tracking-wider">LAND INVENTORY</h2>
          <p className="text-sm text-gray-400 font-mono mt-1">{parcels.length} parcels found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border-2 transition-all ${
              viewMode === "grid"
                ? "bg-emerald-500/30 border-emerald-400"
                : "bg-black/20 border-white/20 hover:border-white/40"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border-2 transition-all ${
              viewMode === "list"
                ? "bg-emerald-500/30 border-emerald-400"
                : "bg-black/20 border-white/20 hover:border-white/40"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-black/30 border-2 border-white/10">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border-2 border-white/20 text-white placeholder-gray-500 focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Ownership Filter */}
        <select
          value={filterOwnership}
          onChange={(e) => setFilterOwnership(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:border-emerald-400 transition-colors"
        >
          <option value="all">All Parcels</option>
          <option value="mine">My Land</option>
          <option value="forsale">For Sale</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded-lg bg-black/40 border-2 border-white/20 text-white focus:border-emerald-400 transition-colors"
        >
          <option value="price">Sort by Price</option>
          <option value="location">Sort by Location</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      {/* Parcels Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        {parcels.map((parcel) => (
          <motion.div
            key={parcel.building.id}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-400/30 hover:border-emerald-400 transition-all cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => onViewOnMap(parcel)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{parcel.building.id}</h3>
                <p className="text-xs text-gray-400 font-mono uppercase">{parcel.building.type}</p>
              </div>
              {parcel.isOwned && (
                <span className="px-2 py-1 rounded bg-purple-500/30 border border-purple-400 text-xs font-bold text-purple-300">
                  OWNED
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="font-mono">
                  [{parcel.building.x}, {parcel.building.z}]
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Grid3x3 className="w-4 h-4" />
                <span>
                  {parcel.building.width}×{parcel.building.depth} // {parcel.building.width * parcel.building.depth}{" "}
                  units²
                </span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <DollarSign className="w-4 h-4" />
                <span>{parcel.listingPrice.toLocaleString()} VOID</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewOnMap(parcel)
                }}
                className="flex-1 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold hover:bg-cyan-500/40 transition-colors"
              >
                VIEW ON MAP
              </button>
              {parcel.isOwned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onManageParcel(parcel)
                  }}
                  className="flex-1 py-2 rounded-lg bg-purple-500/20 border border-purple-400 text-purple-300 text-xs font-bold hover:bg-purple-500/40 transition-colors"
                >
                  MANAGE
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {parcels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 font-mono">No parcels found</p>
        </div>
      )}
    </div>
  )
}
