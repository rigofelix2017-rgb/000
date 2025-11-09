/**
 * UNIFIED LAND SYSTEM - MASTER IMPLEMENTATION
 * Consolidates all land/parcel/property logic into one cohesive system
 *
 * Data Flow:
 * 1. Blockchain (MetaverseLand contract) = Source of truth for ownership
 * 2. Supabase (properties table) = Cached state + metadata
 * 3. ParcelRegistry (client-side) = Visual representation + UI state
 *
 * This module provides a single API for all land operations
 */

import { getDistrictAt } from "../districts"
import type { District } from "../districts"

export interface UnifiedParcel {
  // Core identification
  parcelId: string
  tokenId?: number // On-chain NFT token ID (if minted)

  // Grid mapping
  gridX: number
  gridY: number
  worldX: number
  worldZ: number

  // District assignment
  districtId: string
  districtName: string

  // Ownership
  owner: string | null // Wallet address
  status: "OWNED" | "FOR_SALE" | "NOT_FOR_SALE" | "DAO_OWNED" | "RESERVED"

  // Type classification
  type: "RESIDENTIAL" | "COMMERCIAL" | "MIXED" | "DAO" | "PARK" | "INFRASTRUCTURE" | "STREET"

  // Pricing
  basePrice: number
  currentPrice: number
  listPrice?: number // If FOR_SALE

  // Building metadata
  metadata: {
    buildingType: string // "house", "tower", "shop", etc.
    buildingStyle: string // "modern", "industrial", "cyber-temple"
    height: number
    floors: number
    materialVariant: "metal" | "wood" | "concrete" | "mixed"
    hasNeon: boolean
    windowPattern: number
    rarity?: string
    traits?: Record<string, any>
  }

  // Timestamps
  createdAt: number
  updatedAt: number
  mintedAt?: number
  purchasedAt?: number
}

export const LAND_CONFIG = {
  citySize: 800, // 800m x 800m total city
  parcelSize: 10, // 10m x 10m parcels
  streetWidth: 6, // 6m wide streets
  sidewalkWidth: 2, // 2m sidewalks
  sidewalkHeight: 0.15, // 15cm curb height
  streetLightSpacing: 3, // Every 3 parcels
}

export function generateCityGrid(): UnifiedParcel[] {
  const parcels: UnifiedParcel[] = []
  const gridSize = Math.floor(LAND_CONFIG.citySize / (LAND_CONFIG.parcelSize + LAND_CONFIG.streetWidth))

  for (let gridX = -gridSize / 2; gridX < gridSize / 2; gridX++) {
    for (let gridY = -gridSize / 2; gridY < gridSize / 2; gridY++) {
      const worldX = gridX * (LAND_CONFIG.parcelSize + LAND_CONFIG.streetWidth)
      const worldZ = gridY * (LAND_CONFIG.parcelSize + LAND_CONFIG.streetWidth)

      // Determine if this is a street
      if (gridX % 2 === 0 || gridY % 2 === 0) {
        parcels.push(createStreetParcel(gridX, gridY, worldX, worldZ))
        continue
      }

      // Get district
      const district = getDistrictAt(worldX, worldZ)
      if (!district) continue

      // Check if this should be DAO HQ
      if (district.id === "spawn-zone" && gridX === 0 && gridY === 0) {
        parcels.push(createDAOHeadquarters(gridX, gridY, worldX, worldZ, district))
        continue
      }

      // Create building parcel
      parcels.push(createBuildingParcel(gridX, gridY, worldX, worldZ, district))
    }
  }

  return parcels
}

function createStreetParcel(gridX: number, gridY: number, worldX: number, worldZ: number): UnifiedParcel {
  return {
    parcelId: `street-${gridX}-${gridY}`,
    gridX,
    gridY,
    worldX,
    worldZ,
    districtId: "infrastructure",
    districtName: "Street",
    owner: null,
    status: "NOT_FOR_SALE",
    type: "STREET",
    basePrice: 0,
    currentPrice: 0,
    metadata: {
      buildingType: "street",
      buildingStyle: "asphalt",
      height: 0,
      floors: 0,
      materialVariant: "concrete",
      hasNeon: false,
      windowPattern: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function createDAOHeadquarters(
  gridX: number,
  gridY: number,
  worldX: number,
  worldZ: number,
  district: District,
): UnifiedParcel {
  return {
    parcelId: "dao-hq-0-0",
    tokenId: 1, // Reserved token ID for DAO
    gridX,
    gridY,
    worldX,
    worldZ,
    districtId: district.id,
    districtName: district.name,
    owner: null,
    status: "DAO_OWNED",
    type: "DAO",
    basePrice: 0,
    currentPrice: 0,
    metadata: {
      buildingType: "governance",
      buildingStyle: "cyber-temple",
      height: 50,
      floors: 12,
      materialVariant: "mixed",
      hasNeon: true,
      windowPattern: 5,
      rarity: "legendary",
      traits: {
        landmark: true,
        votingPower: "unlimited",
        ceremonySpace: true,
      },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function createBuildingParcel(
  gridX: number,
  gridY: number,
  worldX: number,
  worldZ: number,
  district: District,
): UnifiedParcel {
  const random = seededRandom(gridX, gridY)

  // Determine ownership and sale status
  const isForSale = random() > 0.7 // 30% for sale
  const isOwned = !isForSale && random() > 0.5

  // Determine type based on district
  let type: UnifiedParcel["type"] = "RESIDENTIAL"
  let floors = 1 + Math.floor(random() * 3) // 1-3 floors for residential

  if (district.id === "commercial-east" || district.id === "defi-district") {
    type = random() > 0.3 ? "COMMERCIAL" : "MIXED"
    floors = 3 + Math.floor(random() * 8) // 3-10 floors
  } else if (district.id === "tech-sector") {
    type = "MIXED"
    floors = 2 + Math.floor(random() * 5)
  } else if (district.id === "entertainment-south") {
    type = "COMMERCIAL"
    floors = 2 + Math.floor(random() * 6)
  }

  const height = floors * 3 + random() * 2

  // Material selection
  const materials: UnifiedParcel["metadata"]["materialVariant"][] = ["metal", "wood", "concrete", "mixed"]
  const materialVariant = materials[Math.floor(random() * materials.length)]

  // Building styles
  const styles = ["modern", "industrial", "traditional", "futuristic", "brutalist"]
  const buildingStyle = styles[Math.floor(random() * styles.length)]

  // Building types
  const buildingTypes =
    type === "RESIDENTIAL"
      ? ["house", "apartment", "villa", "townhouse"]
      : type === "COMMERCIAL"
        ? ["shop", "office", "tower", "mall"]
        : ["mixed-use", "loft", "complex"]
  const buildingType = buildingTypes[Math.floor(random() * buildingTypes.length)]

  const hasNeon = type === "COMMERCIAL" ? random() > 0.3 : random() > 0.7

  const basePrice = calculateParcelPrice(type, floors, district.id)

  return {
    parcelId: `parcel-${gridX}-${gridY}`,
    gridX,
    gridY,
    worldX,
    worldZ,
    districtId: district.id,
    districtName: district.name,
    owner: isOwned ? generateMockOwner(random) : null,
    status: isForSale ? "FOR_SALE" : isOwned ? "OWNED" : "NOT_FOR_SALE",
    type,
    basePrice,
    currentPrice: basePrice,
    listPrice: isForSale ? basePrice : undefined,
    metadata: {
      buildingType,
      buildingStyle,
      height,
      floors,
      materialVariant,
      hasNeon,
      windowPattern: Math.floor(random() * 5),
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function calculateParcelPrice(type: UnifiedParcel["type"], floors: number, districtId: string): number {
  const basePrice = 10000

  const typeMultipliers = {
    RESIDENTIAL: 1.0,
    COMMERCIAL: 2.0,
    MIXED: 1.5,
    DAO: 0,
    PARK: 0,
    INFRASTRUCTURE: 0,
    STREET: 0,
  }

  const districtMultipliers: Record<string, number> = {
    "spawn-zone": 3.0,
    "residential-north": 1.0,
    "commercial-east": 2.0,
    "defi-district": 2.5,
    "entertainment-south": 1.8,
    "social-plaza": 1.5,
    "tech-sector": 2.2,
    "luxury-district": 4.0,
    "industrial-zone": 0.8,
  }

  const typeMultiplier = typeMultipliers[type]
  const districtMultiplier = districtMultipliers[districtId] || 1.0

  return Math.floor(basePrice * typeMultiplier * districtMultiplier * (1 + floors * 0.2))
}

function seededRandom(x: number, y: number) {
  let seed = x * 374761393 + y * 668265263
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function generateMockOwner(random: () => number): string {
  return `0x${Math.floor(random() * 1000000)
    .toString(16)
    .padStart(40, "0")}`
}

class UnifiedLandRegistry {
  private parcels: Map<string, UnifiedParcel> = new Map()
  private ownerIndex: Map<string, Set<string>> = new Map()
  private districtIndex: Map<string, Set<string>> = new Map()

  constructor() {
    this.initialize()
  }

  private initialize() {
    const generated = generateCityGrid()
    generated.forEach((parcel) => {
      this.parcels.set(parcel.parcelId, parcel)

      // Build indices
      if (parcel.owner) {
        if (!this.ownerIndex.has(parcel.owner)) {
          this.ownerIndex.set(parcel.owner, new Set())
        }
        this.ownerIndex.get(parcel.owner)!.add(parcel.parcelId)
      }

      if (!this.districtIndex.has(parcel.districtId)) {
        this.districtIndex.set(parcel.districtId, new Set())
      }
      this.districtIndex.get(parcel.districtId)!.add(parcel.parcelId)
    })
  }

  // Query methods
  getAllParcels(): UnifiedParcel[] {
    return Array.from(this.parcels.values())
  }

  getParcelById(id: string): UnifiedParcel | undefined {
    return this.parcels.get(id)
  }

  getParcelAt(worldX: number, worldZ: number): UnifiedParcel | undefined {
    const gridX = Math.round(worldX / (LAND_CONFIG.parcelSize + LAND_CONFIG.streetWidth))
    const gridY = Math.round(worldZ / (LAND_CONFIG.parcelSize + LAND_CONFIG.streetWidth))
    return Array.from(this.parcels.values()).find((p) => p.gridX === gridX && p.gridY === gridY)
  }

  getParcelsForSale(): UnifiedParcel[] {
    return this.getAllParcels().filter((p) => p.status === "FOR_SALE")
  }

  getParcelsByOwner(owner: string): UnifiedParcel[] {
    const parcelIds = this.ownerIndex.get(owner) || new Set()
    return Array.from(parcelIds)
      .map((id) => this.parcels.get(id)!)
      .filter(Boolean)
  }

  getParcelsByDistrict(districtId: string): UnifiedParcel[] {
    const parcelIds = this.districtIndex.get(districtId) || new Set()
    return Array.from(parcelIds)
      .map((id) => this.parcels.get(id)!)
      .filter(Boolean)
  }

  getDAOParcels(): UnifiedParcel[] {
    return this.getAllParcels().filter((p) => p.type === "DAO" || p.status === "DAO_OWNED")
  }

  // Mutation methods (will trigger blockchain transactions in production)
  purchaseParcel(parcelId: string, buyer: string): boolean {
    const parcel = this.parcels.get(parcelId)
    if (!parcel || parcel.status !== "FOR_SALE") return false

    // Remove from old owner index
    if (parcel.owner) {
      this.ownerIndex.get(parcel.owner)?.delete(parcelId)
    }

    // Update parcel
    parcel.owner = buyer
    parcel.status = "OWNED"
    parcel.purchasedAt = Date.now()
    parcel.updatedAt = Date.now()
    parcel.listPrice = undefined

    // Add to new owner index
    if (!this.ownerIndex.has(buyer)) {
      this.ownerIndex.set(buyer, new Set())
    }
    this.ownerIndex.get(buyer)!.add(parcelId)

    return true
  }

  listParcelForSale(parcelId: string, price: number): boolean {
    const parcel = this.parcels.get(parcelId)
    if (!parcel || parcel.status !== "OWNED") return false

    parcel.status = "FOR_SALE"
    parcel.listPrice = price
    parcel.currentPrice = price
    parcel.updatedAt = Date.now()

    return true
  }

  delistParcel(parcelId: string): boolean {
    const parcel = this.parcels.get(parcelId)
    if (!parcel || parcel.status !== "FOR_SALE") return false

    parcel.status = "OWNED"
    parcel.listPrice = undefined
    parcel.updatedAt = Date.now()

    return true
  }

  // Statistics
  getRegistryStats() {
    const all = this.getAllParcels()
    const forSale = all.filter((p) => p.status === "FOR_SALE")
    const owned = all.filter((p) => p.status === "OWNED")
    const daoOwned = all.filter((p) => p.status === "DAO_OWNED")

    return {
      totalParcels: all.length,
      buildableParcels: all.filter((p) => p.type !== "STREET").length,
      forSale: forSale.length,
      owned: owned.length,
      daoOwned: daoOwned.length,
      totalValue: all.reduce((sum, p) => sum + p.currentPrice, 0),
      avgPrice: forSale.length > 0 ? forSale.reduce((sum, p) => sum + p.currentPrice, 0) / forSale.length : 0,
    }
  }
}

export const unifiedLandRegistry = new UnifiedLandRegistry()

export const {
  getAllParcels,
  getParcelById,
  getParcelAt,
  getParcelsForSale,
  getParcelsByOwner,
  getParcelsByDistrict,
  getDAOParcels,
  purchaseParcel,
  listParcelForSale,
  delistParcel,
  getRegistryStats,
} = {
  getAllParcels: () => unifiedLandRegistry.getAllParcels(),
  getParcelById: (id: string) => unifiedLandRegistry.getParcelById(id),
  getParcelAt: (x: number, z: number) => unifiedLandRegistry.getParcelAt(x, z),
  getParcelsForSale: () => unifiedLandRegistry.getParcelsForSale(),
  getParcelsByOwner: (owner: string) => unifiedLandRegistry.getParcelsByOwner(owner),
  getParcelsByDistrict: (id: string) => unifiedLandRegistry.getParcelsByDistrict(id),
  getDAOParcels: () => unifiedLandRegistry.getDAOParcels(),
  purchaseParcel: (id: string, buyer: string) => unifiedLandRegistry.purchaseParcel(id, buyer),
  listParcelForSale: (id: string, price: number) => unifiedLandRegistry.listParcelForSale(id, price),
  delistParcel: (id: string) => unifiedLandRegistry.delistParcel(id),
  getRegistryStats: () => unifiedLandRegistry.getRegistryStats(),
}
