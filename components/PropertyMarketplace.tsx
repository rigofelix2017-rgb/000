"use client"

import { useState, useEffect } from "react"
import { propertyRegistry, type PropertyListing } from "@/lib/real-estate-system"
import type { Building as BuildingType } from "@/lib/city-assets"
import { X, Home, Building2, Store, MapPin, TrendingUp } from "lucide-react"
import { PropertyMiniMap } from "./property-mini-map"
import { Property3DPreview } from "./property-3d-preview"

interface PropertyMarketplaceProps {
  isOpen: boolean
  onClose: () => void
  walletAddress: string
  voidBalance: number
  onPurchase: (property: PropertyListing) => void
}

export function PropertyMarketplace({
  isOpen,
  onClose,
  walletAddress,
  voidBalance,
  onPurchase,
}: PropertyMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<"available" | "owned" | "all">("available")
  const [filterType, setFilterType] = useState<"all" | BuildingType["type"]>("all")
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      refreshListings()
    }
  }, [isOpen, activeTab, filterType, walletAddress])

  const refreshListings = () => {
    let data: PropertyListing[] = []

    if (activeTab === "available") {
      data = propertyRegistry.getAvailableProperties()
    } else if (activeTab === "owned") {
      data = propertyRegistry.getOwnedProperties(walletAddress)
    } else {
      data = propertyRegistry.getAllListings()
    }

    if (filterType !== "all") {
      data = data.filter((l) => l.building.type === filterType)
    }

    setListings(data)
    setPortfolioStats(propertyRegistry.getPortfolioStats(walletAddress))
  }

  const handlePurchase = (listing: PropertyListing) => {
    if (voidBalance >= listing.listingPrice) {
      const success = propertyRegistry.purchaseProperty(listing.building.id, walletAddress, listing.listingPrice)
      if (success) {
        onPurchase(listing)
        refreshListings()
        setSelectedProperty(null)
      }
    }
  }

  const getIconForType = (type: BuildingType["type"]) => {
    switch (type) {
      case "residential":
        return <Home className="w-5 h-5" />
      case "commercial":
        return <Store className="w-5 h-5" />
      case "mixed":
        return <Building2 className="w-5 h-5" />
      case "special":
        return <MapPin className="w-5 h-5" />
    }
  }

  const getColorForType = (type: BuildingType["type"]) => {
    switch (type) {
      case "residential":
        return "text-green-400"
      case "commercial":
        return "text-amber-400"
      case "mixed":
        return "text-purple-400"
      case "special":
        return "text-cyan-400"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-7xl h-[90vh] bg-[#0a0f1a] border border-emerald-500/30 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-emerald-500/30">
          <div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Audiowide, sans-serif" }}>
              PROPERTY MARKETPLACE
            </h2>
            <p className="text-sm text-emerald-400/80">Buy, sell, and manage your real estate portfolio</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Portfolio Stats */}
        {portfolioStats && portfolioStats.propertiesOwned > 0 && (
          <div className="p-6 border-b border-emerald-500/30 bg-[#020617]/50">
            <h3 className="text-sm font-bold text-emerald-400 mb-3">YOUR PORTFOLIO</h3>
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-gray-400">Properties</p>
                <p className="text-2xl font-bold text-white">{portfolioStats.propertiesOwned}</p>
              </div>
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-emerald-400">${portfolioStats.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold text-blue-400">${portfolioStats.totalInvested.toLocaleString()}</p>
              </div>
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-gray-400">Profit/Loss</p>
                <p
                  className={`text-2xl font-bold ${
                    portfolioStats.totalProfit >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${portfolioStats.totalProfit.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-purple-400">${portfolioStats.monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Filters */}
          <div className="w-64 border-r border-emerald-500/30 p-4 bg-[#020617]/50 flex flex-col gap-4">
            {/* Tabs */}
            <div>
              <h3 className="text-xs font-bold text-emerald-400 mb-2">VIEW</h3>
              <div className="space-y-1">
                {[
                  { id: "available", label: "For Sale", count: propertyRegistry.getAvailableProperties().length },
                  {
                    id: "owned",
                    label: "My Properties",
                    count: propertyRegistry.getOwnedProperties(walletAddress).length,
                  },
                  { id: "all", label: "All Properties", count: propertyRegistry.getAllListings().length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full px-3 py-2 rounded text-sm font-semibold text-left transition flex items-center justify-between ${
                      activeTab === tab.id
                        ? "bg-emerald-500 text-black"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-xs">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h3 className="text-xs font-bold text-emerald-400 mb-2">PROPERTY TYPE</h3>
              <div className="space-y-1">
                {[
                  { id: "all", label: "All Types" },
                  { id: "residential", label: "Residential" },
                  { id: "commercial", label: "Commercial" },
                  { id: "mixed", label: "Mixed Use" },
                  { id: "special", label: "Special" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilterType(type.id as any)}
                    className={`w-full px-3 py-2 rounded text-xs font-semibold text-left transition ${
                      filterType === type.id
                        ? "bg-emerald-500 text-black"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Balance */}
            <div className="mt-auto bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">VOID BALANCE</p>
              <p className="text-xl font-bold text-white">${voidBalance.toLocaleString()}</p>
            </div>
          </div>

          {/* Property Listings */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.building.id}
                  onClick={() => setSelectedProperty(listing)}
                  className={`bg-[#020617] border rounded-lg p-4 cursor-pointer transition hover:scale-105 ${
                    selectedProperty?.building.id === listing.building.id
                      ? "border-emerald-500 ring-2 ring-emerald-500/50"
                      : "border-emerald-500/20 hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`${getColorForType(listing.building.type)}`}>
                      {getIconForType(listing.building.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white truncate">{listing.building.id}</h4>
                      <p className="text-xs text-gray-400 uppercase">{listing.building.type}</p>
                    </div>
                    {listing.isOwned && (
                      <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                        OWNED
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-bold text-white">${listing.listingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white">
                        {listing.building.width}×{listing.building.depth}×{listing.building.height}
                      </span>
                    </div>
                    {listing.appreciation !== 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Value:</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            listing.appreciation > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {listing.appreciation > 0 ? "+" : ""}
                          {listing.appreciation.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {listing.monthlyIncome && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Income:</span>
                        <span className="font-bold text-purple-400">+${listing.monthlyIncome.toLocaleString()}/mo</span>
                      </div>
                    )}
                  </div>

                  {!listing.isOwned && listing.building.forSale && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(listing)
                      }}
                      disabled={voidBalance < listing.listingPrice}
                      className={`w-full mt-3 px-3 py-2 rounded text-xs font-bold transition ${
                        voidBalance >= listing.listingPrice
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {voidBalance >= listing.listingPrice ? "BUY NOW" : "INSUFFICIENT FUNDS"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {listings.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-bold">No properties found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              </div>
            )}
          </div>

          {/* Property Details Panel */}
          {selectedProperty && (
            <div className="w-96 border-l border-emerald-500/30 p-6 bg-[#020617]/50 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-2">BUILDING PREVIEW</h4>
                  <Property3DPreview property={selectedProperty.building} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-2">LOCATION ON MAP</h4>
                  <PropertyMiniMap
                    property={selectedProperty.building}
                    selectedPropertyId={selectedProperty.building.id}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${getColorForType(selectedProperty.building.type)}`}>
                      {getIconForType(selectedProperty.building.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{selectedProperty.building.id}</h3>
                      <p className="text-sm text-gray-400 uppercase">{selectedProperty.building.type}</p>
                    </div>
                  </div>
                  {selectedProperty.isOwned && (
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded inline-block">
                      YOU OWN THIS PROPERTY
                    </div>
                  )}
                </div>

                <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3">PROPERTY DETAILS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white font-mono">
                        [{selectedProperty.building.x}, {selectedProperty.building.z}]
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Dimensions:</span>
                      <span className="text-white">
                        {selectedProperty.building.width} × {selectedProperty.building.depth} ×{" "}
                        {selectedProperty.building.height}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Square Units:</span>
                      <span className="text-white">
                        {selectedProperty.building.width * selectedProperty.building.depth}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0f1a] border border-emerald-500/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3">FINANCIAL INFO</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Current Price</p>
                      <p className="text-3xl font-bold text-white">${selectedProperty.listingPrice.toLocaleString()}</p>
                    </div>
                    {selectedProperty.appreciation !== 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp
                          className={`w-4 h-4 ${selectedProperty.appreciation > 0 ? "text-green-400" : "text-red-400"}`}
                        />
                        <span
                          className={`font-bold ${
                            selectedProperty.appreciation > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {selectedProperty.appreciation > 0 ? "+" : ""}
                          {selectedProperty.appreciation.toFixed(2)}% value change
                        </span>
                      </div>
                    )}
                    {selectedProperty.monthlyIncome && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Monthly Rental Income</p>
                        <p className="text-xl font-bold text-purple-400">
                          +${selectedProperty.monthlyIncome.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!selectedProperty.isOwned && selectedProperty.building.forSale && (
                  <button
                    onClick={() => handlePurchase(selectedProperty)}
                    disabled={voidBalance < selectedProperty.listingPrice}
                    className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition ${
                      voidBalance >= selectedProperty.listingPrice
                        ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {voidBalance >= selectedProperty.listingPrice
                      ? `PURCHASE FOR $${selectedProperty.listingPrice.toLocaleString()}`
                      : "INSUFFICIENT FUNDS"}
                  </button>
                )}

                {!selectedProperty.building.forSale && !selectedProperty.isOwned && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-red-400">NOT FOR SALE</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
