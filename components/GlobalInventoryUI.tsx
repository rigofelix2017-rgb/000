"use client"

import { useState, useMemo } from "react"
import { parcelRegistry, type ParcelData } from "@/lib/parcel-system"
import { Search, Building2 } from "lucide-react"

export function GlobalInventoryUI({ onSelectParcel }: { onSelectParcel: (parcelId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ParcelData["status"] | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<ParcelData["type"] | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<"price" | "height" | "district">("price")

  const allParcels = useMemo(() => parcelRegistry.getAllParcels(), [])

  const filteredParcels = useMemo(() => {
    let filtered = allParcels.filter((p) => p.type !== "STREET") // Exclude streets

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    if (typeFilter !== "ALL") {
      filtered = filtered.filter((p) => p.type === typeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.districtId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price") return b.price - a.price
      if (sortBy === "height") return b.metadata.height - a.metadata.height
      if (sortBy === "district") return a.districtId.localeCompare(b.districtId)
      return 0
    })

    return filtered
  }, [allParcels, statusFilter, typeFilter, searchTerm, sortBy])

  const stats = useMemo(() => {
    const forSale = allParcels.filter((p) => p.status === "FOR_SALE")
    const owned = allParcels.filter((p) => p.status === "OWNED")
    const totalValue = allParcels.reduce((sum, p) => sum + p.price, 0)

    return {
      total: allParcels.length,
      forSale: forSale.length,
      owned: owned.length,
      totalValue,
      avgPrice: forSale.length > 0 ? forSale.reduce((sum, p) => sum + p.price, 0) / forSale.length : 0,
    }
  }, [allParcels])

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
            GLOBAL LAND INVENTORY
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-mono">{filteredParcels.length} parcels shown</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono">TOTAL PARCELS</p>
          <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-slate-800/50 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono">FOR SALE</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats.forSale}</p>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono">OWNED</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{stats.owned}</p>
        </div>
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono">TOTAL VALUE</p>
          <p className="text-xl font-black text-purple-400 mt-1">${(stats.totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-slate-800/50 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-mono">AVG PRICE</p>
          <p className="text-xl font-black text-amber-400 mt-1">${(stats.avgPrice / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search parcels or districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Status</option>
          <option value="FOR_SALE">For Sale</option>
          <option value="OWNED">Owned</option>
          <option value="NOT_FOR_SALE">Not For Sale</option>
          <option value="DAO">DAO</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Types</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="MIXED">Mixed</option>
          <option value="DAO">DAO</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
        >
          <option value="price">Sort by Price</option>
          <option value="height">Sort by Height</option>
          <option value="district">Sort by District</option>
        </select>
      </div>

      {/* Parcel List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-slate-800/50">
        {filteredParcels.map((parcel) => (
          <button
            key={parcel.parcelId}
            onClick={() => onSelectParcel(parcel.parcelId)}
            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 transition-all text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold font-mono">{parcel.parcelId}</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono">{parcel.type}</span>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm font-mono">
                  <div>
                    <span className="text-slate-400 text-xs">District</span>
                    <p className="text-white font-bold">{parcel.districtId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Location</span>
                    <p className="text-white font-bold">
                      [{parcel.gridX}, {parcel.gridY}]
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Floors</span>
                    <p className="text-white font-bold">{parcel.metadata.floors}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Material</span>
                    <p className="text-white font-bold capitalize">{parcel.metadata.materialVariant}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {parcel.status === "FOR_SALE" && (
                  <>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-mono font-bold border border-emerald-500/40">
                      FOR SALE
                    </span>
                    <p className="text-2xl font-black text-cyan-400">${parcel.price.toLocaleString()}</p>
                  </>
                )}
                {parcel.status === "OWNED" && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-mono font-bold border border-blue-500/40">
                    OWNED
                  </span>
                )}
                {parcel.status === "DAO" && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg font-mono font-bold border border-purple-500/40">
                    DAO HQ
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
