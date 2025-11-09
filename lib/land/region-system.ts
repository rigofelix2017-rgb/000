/**
 * Region System
 * Manages multi-region architecture for infinite land expansion
 */

import { Region, World, ExpansionCampaign, Address } from './types';

const REGION_SIZE = 1600;  // 40×40 parcels = 1,600 world units
const REGION_GAP = 200;    // 200 world unit gap between regions

/**
 * Region Manager - Handles multiple regions/worlds
 */
export class RegionManager {
  private regions: Map<string, Region> = new Map();
  private worlds: Map<string, World> = new Map();
  private campaigns: Map<string, ExpansionCampaign> = new Map();

  /**
   * Initialize with genesis region
   */
  constructor() {
    this.createGenesisWorld();
  }

  /**
   * Create VOID genesis world and region
   */
  private createGenesisWorld(): void {
    // Create VOID world
    const voidWorld: World = {
      worldId: 'VOID',
      name: 'VOID Metaverse',
      description: 'The genesis world of PSX-VOID ecosystem',
      ownerAddress: '0x0000000000000000000000000000000000000000' as Address, // DAO address
      ownerType: 'ecosystem',
      regionCount: 1,
      genesisRegionId: 'VOID-GENESIS',
      treasuryAddress: '0x0000000000000000000000000000000000000000' as Address,
      creatorRoyalty: 0,
      ecosystemRoyalty: 100,
      founderBenefits: true,
      theme: 'cyberpunk-metropolis',
      logo: '/void-logo.png',
      website: 'https://psx.void',
      status: 'active',
      launchDate: new Date('2025-01-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.worlds.set('VOID', voidWorld);

    // Create genesis region
    const genesisRegion: Region = {
      regionId: 'VOID-GENESIS',
      worldId: 'VOID',
      gridWidth: 40,
      gridHeight: 40,
      totalParcels: 1600,
      worldPosition: {
        offsetX: 0,
        offsetZ: 0
      },
      status: 'active',
      name: 'Genesis District',
      description: 'The first 1,600 parcels of VOID',
      theme: 'cyberpunk-core',
      launchDate: new Date('2025-01-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.regions.set('VOID-GENESIS', genesisRegion);
  }

  /**
   * Get world by ID
   */
  getWorld(worldId: string): World | undefined {
    return this.worlds.get(worldId);
  }

  /**
   * Get region by ID
   */
  getRegion(regionId: string): Region | undefined {
    return this.regions.get(regionId);
  }

  /**
   * List all regions in a world
   */
  getRegionsByWorld(worldId: string): Region[] {
    return Array.from(this.regions.values()).filter(r => r.worldId === worldId);
  }

  /**
   * Create new region (for expansion)
   */
  createRegion(
    worldId: string,
    regionName: string,
    gridWidth: number = 40,
    gridHeight: number = 40,
    creatorAddress?: Address
  ): Region {
    const world = this.worlds.get(worldId);
    if (!world) throw new Error(`World ${worldId} not found`);

    const existingRegions = this.getRegionsByWorld(worldId);
    const regionIndex = existingRegions.length;
    const regionId = `${worldId}-EXPANSION-${regionIndex}`;

    // Calculate world position (spiral pattern)
    const worldPosition = this.calculateRegionPosition(regionIndex);

    const newRegion: Region = {
      regionId,
      worldId,
      gridWidth,
      gridHeight,
      totalParcels: gridWidth * gridHeight,
      worldPosition,
      status: 'minting',
      name: regionName,
      description: `Expansion region ${regionIndex + 1} for ${world.name}`,
      theme: world.theme,
      creatorAddress,
      launchDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.regions.set(regionId, newRegion);
    
    // Update world region count
    world.regionCount = existingRegions.length + 1;
    this.worlds.set(worldId, world);

    return newRegion;
  }

  /**
   * Calculate region position in spiral pattern
   */
  private calculateRegionPosition(regionIndex: number): { offsetX: number; offsetZ: number } {
    if (regionIndex === 0) {
      return { offsetX: 0, offsetZ: 0 };  // Genesis at center
    }

    // Spiral positions: East, South, West, North, then expand outward
    const spiralPattern = [
      { offsetX: REGION_SIZE + REGION_GAP, offsetZ: 0 },                    // East
      { offsetX: 0, offsetZ: REGION_SIZE + REGION_GAP },                    // South
      { offsetX: -(REGION_SIZE + REGION_GAP), offsetZ: 0 },                 // West
      { offsetX: 0, offsetZ: -(REGION_SIZE + REGION_GAP) },                 // North
      { offsetX: (REGION_SIZE + REGION_GAP) * 2, offsetZ: 0 },              // East x2
      { offsetX: (REGION_SIZE + REGION_GAP), offsetZ: REGION_SIZE + REGION_GAP },  // SE
      { offsetX: 0, offsetZ: (REGION_SIZE + REGION_GAP) * 2 },              // South x2
      { offsetX: -(REGION_SIZE + REGION_GAP), offsetZ: REGION_SIZE + REGION_GAP }, // SW
      { offsetX: -(REGION_SIZE + REGION_GAP) * 2, offsetZ: 0 },             // West x2
      { offsetX: -(REGION_SIZE + REGION_GAP), offsetZ: -(REGION_SIZE + REGION_GAP) }, // NW
      { offsetX: 0, offsetZ: -(REGION_SIZE + REGION_GAP) * 2 },             // North x2
      { offsetX: (REGION_SIZE + REGION_GAP), offsetZ: -(REGION_SIZE + REGION_GAP) }  // NE
    ];

    const patternIndex = (regionIndex - 1) % spiralPattern.length;
    return spiralPattern[patternIndex];
  }

  /**
   * Create new world (for partners/creators)
   */
  createWorld(
    worldId: string,
    name: string,
    ownerAddress: Address,
    ownerType: 'ecosystem' | 'partner' | 'creator',
    config: {
      creatorRoyalty?: number;
      ecosystemRoyalty?: number;
      founderBenefits?: boolean;
    } = {}
  ): World {
    if (this.worlds.has(worldId)) {
      throw new Error(`World ${worldId} already exists`);
    }

    const genesisRegionId = `${worldId}-GENESIS`;

    const newWorld: World = {
      worldId,
      name,
      description: `${name} metaverse world`,
      ownerAddress,
      ownerType,
      regionCount: 0,
      genesisRegionId,
      treasuryAddress: ownerAddress,
      creatorRoyalty: config.creatorRoyalty ?? 70,
      ecosystemRoyalty: config.ecosystemRoyalty ?? 30,
      founderBenefits: config.founderBenefits ?? false,
      theme: 'custom',
      logo: '',
      status: 'active',
      launchDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.worlds.set(worldId, newWorld);
    return newWorld;
  }

  /**
   * Create expansion campaign
   */
  createExpansionCampaign(
    regionId: string,
    config: {
      name: string;
      description: string;
      basePrice: bigint;
      pricingModel?: 'flat' | 'linear' | 'bonding';
      maxPerWallet?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): ExpansionCampaign {
    const region = this.regions.get(regionId);
    if (!region) throw new Error(`Region ${regionId} not found`);

    const campaignId = `${regionId}-CAMPAIGN`;

    const campaign: ExpansionCampaign = {
      campaignId,
      regionId,
      worldId: region.worldId,
      name: config.name,
      description: config.description,
      theme: region.theme,
      totalParcels: region.totalParcels,
      parcelsAvailable: region.totalParcels,
      parcelsMinted: 0,
      startDate: config.startDate ?? new Date(),
      endDate: config.endDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      phases: [
        {
          phaseId: `${campaignId}-PUBLIC`,
          name: 'Public Sale',
          startDate: config.startDate ?? new Date(),
          endDate: config.endDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxMints: region.totalParcels,
          mintedCount: 0,
          priceMultiplier: 1.0,
          eligibility: 'public',
          status: 'active'
        }
      ],
      pricingModel: config.pricingModel ?? 'flat',
      basePrice: config.basePrice,
      currentPrice: config.basePrice,
      approvedBy: '0x0000000000000000000000000000000000000000' as Address,
      votesFor: 0n,
      votesAgainst: 0n,
      maxPerWallet: config.maxPerWallet ?? 10,
      requiresFounderStatus: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.campaigns.set(campaignId, campaign);
    
    // Update region status
    region.status = 'minting';
    region.mintCampaignId = campaignId;
    this.regions.set(regionId, region);

    return campaign;
  }

  /**
   * Get active campaigns
   */
  getActiveCampaigns(): ExpansionCampaign[] {
    return Array.from(this.campaigns.values()).filter(c => c.status === 'active');
  }

  /**
   * Get campaign by ID
   */
  getCampaign(campaignId: string): ExpansionCampaign | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Get all worlds
   */
  getAllWorlds(): World[] {
    return Array.from(this.worlds.values());
  }

  /**
   * Get all regions
   */
  getAllRegions(): Region[] {
    return Array.from(this.regions.values());
  }
}

// Export singleton instance
export const regionManager = new RegionManager();
