import { getDistrictAt } from "./districts"

export interface ParcelData {
  parcelId: string
  gridX: number
  gridY: number
  worldX: number
  worldZ: number
  districtId: string
  owner: string | null
  status: "OWNED" | "FOR_SALE" | "NOT_FOR_SALE" | "DAO" | "PARK"
  type: "RESIDENTIAL" | "COMMERCIAL" | "MIXED" | "DAO" | "PARK" | "STREET"
  price: number
  metadata: {
    buildingStyle: string
    height: number
    floors: number
    materialVariant: "metal" | "wood" | "concrete" | "mixed"
    hasNeon: boolean
    windowPattern: number
  }
}

export const PARCEL_CONFIG = {
  size: 10, // 10m x 10m parcels
  streetWidth: 6, // 6m wide streets
  sidewalkWidth: 2, // 2m wide sidewalks
  sidewalkHeight: 0.15, // 15cm curb height
}

export function generateCityParcels(): ParcelData[] {
  const parcels: ParcelData[] = []
  const citySize = 800 // 800m x 800m city
  const gridSize = citySize / (PARCEL_CONFIG.size + PARCEL_CONFIG.streetWidth)

  for (let gridX = -gridSize / 2; gridX < gridSize / 2; gridX++) {
    for (let gridY = -gridSize / 2; gridY < gridSize / 2; gridY++) {
      const worldX = gridX * (PARCEL_CONFIG.size + PARCEL_CONFIG.streetWidth)
      const worldZ = gridY * (PARCEL_CONFIG.size + PARCEL_CONFIG.streetWidth)

      // Skip streets (every 2nd grid cell in each direction)
      if (gridX % 2 === 0 || gridY % 2 === 0) {
        // This is a street parcel
        parcels.push(createStreetParcel(gridX, gridY, worldX, worldZ))
        continue
      }

      // Get district for this location
      const district = getDistrictAt(worldX, worldZ)
      if (!district) continue

      // Create building parcel
      const parcel = createBuildingParcel(gridX, gridY, worldX, worldZ, district.id)
      parcels.push(parcel)
    }
  }

  // Add DAO parcels in spawn zone
  const daoParcel = createDAOParcel()
  parcels.push(daoParcel)

  return parcels
}

function createStreetParcel(gridX: number, gridY: number, worldX: number, worldZ: number): ParcelData {
  return {
    parcelId: `street-${gridX}-${gridY}`,
    gridX,
    gridY,
    worldX,
    worldZ,
    districtId: "street",
    owner: null,
    status: "NOT_FOR_SALE",
    type: "STREET",
    price: 0,
    metadata: {
      buildingStyle: "street",
      height: 0,
      floors: 0,
      materialVariant: "concrete",
      hasNeon: false,
      windowPattern: 0,
    },
  }
}

function createBuildingParcel(
  gridX: number,
  gridY: number,
  worldX: number,
  worldZ: number,
  districtId: string,
): ParcelData {
  const random = seededRandom(gridX, gridY)
  const isForSale = random() > 0.7 // 30% for sale
  const isOwned = !isForSale && random() > 0.5

  // Determine parcel type based on district
  let type: ParcelData["type"] = "RESIDENTIAL"
  let floors = 1 + Math.floor(random() * 3) // 1-3 floors for residential

  if (districtId === "commercial-east" || districtId === "defi-district") {
    type = random() > 0.3 ? "COMMERCIAL" : "MIXED"
    floors = 3 + Math.floor(random() * 8) // 3-10 floors for commercial
  } else if (districtId === "tech-sector") {
    type = "MIXED"
    floors = 2 + Math.floor(random() * 5) // 2-6 floors
  } else if (districtId === "entertainment-south") {
    type = "COMMERCIAL"
    floors = 2 + Math.floor(random() * 6) // 2-7 floors
  }

  const height = floors * 3 + random() * 2 // Each floor ~3m + variation

  // Material variants based on type
  const materials: ParcelData["metadata"]["materialVariant"][] = ["metal", "wood", "concrete", "mixed"]
  const materialVariant = materials[Math.floor(random() * materials.length)]

  // Building styles
  const styles = ["modern", "industrial", "traditional", "futuristic", "brutalist"]
  const buildingStyle = styles[Math.floor(random() * styles.length)]

  // Neon more likely on commercial buildings
  const hasNeon = type === "COMMERCIAL" ? random() > 0.3 : random() > 0.7

  const basePrice = calculateParcelPrice(type, floors, districtId)

  return {
    parcelId: `parcel-${gridX}-${gridY}`,
    gridX,
    gridY,
    worldX,
    worldZ,
    districtId,
    owner: isOwned
      ? `0x${Math.floor(random() * 1000000)
          .toString(16)
          .padStart(40, "0")}`
      : null,
    status: isForSale ? "FOR_SALE" : isOwned ? "OWNED" : "NOT_FOR_SALE",
    type,
    price: basePrice,
    metadata: {
      buildingStyle,
      height,
      floors,
      materialVariant,
      hasNeon,
      windowPattern: Math.floor(random() * 5),
    },
  }
}

function createDAOParcel(): ParcelData {
  return {
    parcelId: "dao-hq",
    gridX: 0,
    gridY: 0,
    worldX: 0,
    worldZ: 0,
    districtId: "spawn-zone",
    owner: null,
    status: "DAO",
    type: "DAO",
    price: 0,
    metadata: {
      buildingStyle: "cyber-temple",
      height: 50,
      floors: 12,
      materialVariant: "mixed",
      hasNeon: true,
      windowPattern: 5,
    },
  }
}

function calculateParcelPrice(type: ParcelData["type"], floors: number, districtId: string): number {
  const basePrice = 10000
  const typeMultiplier = {
    RESIDENTIAL: 1.0,
    COMMERCIAL: 2.0,
    MIXED: 1.5,
    DAO: 0,
    PARK: 0,
    STREET: 0,
  }[type]

  const districtMultiplier =
    {
      "spawn-zone": 3.0,
      "residential-north": 1.0,
      "commercial-east": 2.0,
      "defi-district": 2.5,
      "entertainment-south": 1.8,
      "social-plaza": 1.5,
      "tech-sector": 2.2,
      "luxury-district": 4.0,
      "industrial-zone": 0.8,
    }[districtId] || 1.0

  return Math.floor(basePrice * typeMultiplier * districtMultiplier * (1 + floors * 0.2))
}

function seededRandom(x: number, y: number) {
  let seed = x * 374761393 + y * 668265263
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

class ParcelRegistry {
  private parcels: Map<string, ParcelData> = new Map()

  constructor() {
    const generatedParcels = generateCityParcels()
    generatedParcels.forEach((p) => this.parcels.set(p.parcelId, p))
  }

  getAllParcels(): ParcelData[] {
    return Array.from(this.parcels.values())
  }

  getParcelById(id: string): ParcelData | undefined {
    return this.parcels.get(id)
  }

  getParcelAt(worldX: number, worldZ: number): ParcelData | undefined {
    const gridX = Math.round(worldX / (PARCEL_CONFIG.size + PARCEL_CONFIG.streetWidth))
    const gridY = Math.round(worldZ / (PARCEL_CONFIG.size + PARCEL_CONFIG.streetWidth))
    return Array.from(this.parcels.values()).find((p) => p.gridX === gridX && p.gridY === gridY)
  }

  getParcelsForSale(): ParcelData[] {
    return this.getAllParcels().filter((p) => p.status === "FOR_SALE")
  }

  getParcelsByDistrict(districtId: string): ParcelData[] {
    return this.getAllParcels().filter((p) => p.districtId === districtId)
  }

  getParcelsByOwner(owner: string): ParcelData[] {
    return this.getAllParcels().filter((p) => p.owner === owner)
  }

  purchaseParcel(parcelId: string, buyer: string): boolean {
    const parcel = this.parcels.get(parcelId)
    if (!parcel || parcel.status !== "FOR_SALE") return false

    parcel.owner = buyer
    parcel.status = "OWNED"
    return true
  }

  listParcelForSale(parcelId: string, price: number): boolean {
    const parcel = this.parcels.get(parcelId)
    if (!parcel || parcel.status !== "OWNED") return false

    parcel.price = price
    parcel.status = "FOR_SALE"
    return true
  }
}

export const parcelRegistry = new ParcelRegistry()
