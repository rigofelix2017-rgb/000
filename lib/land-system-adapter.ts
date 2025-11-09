/**
 * LAND SYSTEM INTEGRATION ADAPTER
 * Bridges the new blockchain-based land system with existing parcel-system and real-estate-system
 */

import { type Parcel, type Building, ZoneType } from "./land/types"
import { type ParcelData } from "./parcel-system"
import { type PropertyListing } from "./real-estate-system"

/**
 * Convert new Parcel to legacy ParcelData format
 */
export function parcelToParcelData(parcel: Parcel): ParcelData {
  return {
    parcelId: `parcel-${parcel.parcelId}`,
    gridX: parcel.gridX,
    gridY: parcel.gridY,
    worldX: parcel.gridX * 16, // Convert grid to world coords
    worldZ: parcel.gridY * 16,
    districtId: ZoneType[parcel.zone].toLowerCase(),
    owner: parcel.owner || null,
    status: parcel.status as any, // Status enums are compatible
    type: ZoneType[parcel.zone] as any, // Zone types map to type
    price: Number(parcel.basePrice),
    metadata: {
      buildingStyle: parcel.metadata?.rarity || "modern",
      height: 0, // Will be set from Building
      floors: 1,
      materialVariant: "mixed",
      hasNeon: false,
      windowPattern: 5,
    },
  }
}

/**
 * Convert Building to PropertyListing format
 */
export function buildingToPropertyListing(
  building: Building,
  parcel: Parcel,
): PropertyListing {
  const isOwned = parcel.status === "OWNED"
  
  return {
    building: {
      id: `parcel-${parcel.parcelId}`,
      position: {
        x: parcel.gridX * 16,
        y: 0,
        z: parcel.gridY * 16,
      },
      dimensions: {
        width: building.baseWidth,
        depth: building.baseDepth,
        height: building.totalHeight,
      },
      type: building.archetype.toLowerCase() as any,
      style: building.archetype,
      price: Number(parcel.basePrice),
    } as any,
    isOwned,
    owner: parcel.owner || undefined,
    listingPrice: Number(parcel.salePrice || parcel.basePrice),
    appreciation: 0,
    monthlyIncome: parcel.businessRevenue ? Number(parcel.businessRevenue) / 30 : undefined,
  }
}

/**
 * Sync parcel ownership changes to legacy systems
 */
export function syncParcelOwnership(
  parcelId: string,
  newOwner: string,
  purchasePrice: number,
) {
  // This would update the legacy PropertyRegistry
  // For now, just log the event
  console.log(`[Land System] Parcel ${parcelId} purchased by ${newOwner} for ${purchasePrice}`)
}

/**
 * Get all parcels in a format compatible with existing 3D world
 */
export async function getLegacyParcelsForWorld(): Promise<ParcelData[]> {
  // This would fetch from the new land system and convert
  // Placeholder for now - implement when land system hooks are connected
  return []
}

/**
 * Migrate existing parcel ownership data to new land system
 */
export async function migrateExistingParcels(
  existingParcels: ParcelData[],
): Promise<void> {
  console.log(`[Migration] Starting migration of ${existingParcels.length} parcels...`)
  
  // This would:
  // 1. Map each ParcelData to Parcel format
  // 2. Update blockchain registry (if needed)
  // 3. Store in new database tables
  // 4. Verify 1:1 mapping
  
  for (const parcel of existingParcels) {
    if (parcel.owner) {
      console.log(`[Migration] Migrating owned parcel ${parcel.parcelId} owner: ${parcel.owner}`)
      // TODO: Call land registry contract to sync ownership
    }
  }
  
  console.log(`[Migration] Migration complete!`)
}
