/**
 * Land Registry API
 * Provides typed interface to interact with LandRegistry smart contract
 */

import { Address, parseEther } from 'viem';
import { Parcel, ZoneType, ParcelStatus, LicenseType } from './types';
import { CONTRACTS } from './contracts';

export class LandRegistryAPI {
  private contractAddress: Address;

  constructor(chainId?: number) {
    this.contractAddress = CONTRACTS.LAND_REGISTRY as Address;
  }

  /**
   * Convert parcel ID to grid coordinates
   */
  parcelIdToCoords(parcelId: number): { x: number; y: number } {
    const x = parcelId % 100;
    const y = Math.floor(parcelId / 100);
    return { x, y };
  }

  /**
   * Convert grid coordinates to parcel ID
   */
  coordsToParcelId(x: number, y: number): number {
    return y * 100 + x;
  }

  /**
   * Get world position from parcel ID (for 3D rendering)
   */
  getWorldPosition(parcelId: number): { x: number, y: number, z: number } {
    const { x, y } = this.parcelIdToCoords(parcelId);
    return {
      x: x * 40, // PARCEL_SIZE = 40 world units
      y: 0,
      z: y * 40
    };
  }

  /**
   * Parse contract parcel data into typed Parcel object
   */
  parseParcelData(
    parcelId: number,
    contractData: readonly [Address, bigint, number, boolean, number, bigint, number, number]
  ): Parcel {
    const [owner, price, zone, hasHouse, businessLicense, businessRevenue, x, y] = contractData;
    
    let status: ParcelStatus = ParcelStatus.NOT_FOR_SALE;
    if (!owner || owner === '0x0000000000000000000000000000000000000000') {
      status = ParcelStatus.FOR_SALE;
    } else if (price > 0n) {
      status = ParcelStatus.FOR_SALE;
    } else {
      status = ParcelStatus.OWNED;
    }

    return {
      parcelId,
      tokenId: parcelId,
      ownerAddress: owner === '0x0000000000000000000000000000000000000000' ? null : owner,
      worldId: 'VOID-1',
      gridX: x,
      gridY: y,
      layerZ: 0,
      zone: zone as ZoneType,
      zonePrice: this.getZonePrice(zone as ZoneType),
      status,
      buildingId: `building-${parcelId}`,
      hasHouse,
      businessLicense: businessLicense as LicenseType,
      businessRevenue,
      metadata: {
        rarity: 'common',
        traits: [],
        description: `Parcel #${parcelId} in VOID-1`,
        image: undefined
      }
    };
  }

  /**
   * Get zone pricing
   */
  getZonePrice(zone: ZoneType): bigint {
    const prices: Record<ZoneType, bigint> = {
      [ZoneType.PUBLIC]: parseEther('100'),
      [ZoneType.RESIDENTIAL]: parseEther('200'),
      [ZoneType.COMMERCIAL]: parseEther('300'),
      [ZoneType.PREMIUM]: parseEther('500'),
      [ZoneType.GLIZZY_WORLD]: parseEther('1000')
    };
    return prices[zone];
  }

  /**
   * Get license pricing
   */
  getLicensePrice(license: LicenseType): bigint {
    const prices: Record<LicenseType, bigint> = {
      [LicenseType.NONE]: 0n,
      [LicenseType.RETAIL]: parseEther('50'),
      [LicenseType.ENTERTAINMENT]: parseEther('75'),
      [LicenseType.SERVICES]: parseEther('50'),
      [LicenseType.GAMING]: parseEther('100')
    };
    return prices[license];
  }

  /**
   * Get zone name
   */
  getZoneName(zone: ZoneType): string {
    const names: Record<ZoneType, string> = {
      [ZoneType.PUBLIC]: 'Public',
      [ZoneType.RESIDENTIAL]: 'Residential',
      [ZoneType.COMMERCIAL]: 'Commercial',
      [ZoneType.PREMIUM]: 'Premium',
      [ZoneType.GLIZZY_WORLD]: 'Glizzy World'
    };
    return names[zone];
  }

  /**
   * Get license name
   */
  getLicenseName(license: LicenseType): string {
    const names: Record<LicenseType, string> = {
      [LicenseType.NONE]: 'None',
      [LicenseType.RETAIL]: 'Retail',
      [LicenseType.ENTERTAINMENT]: 'Entertainment',
      [LicenseType.SERVICES]: 'Services',
      [LicenseType.GAMING]: 'Gaming'
    };
    return names[license];
  }

  /**
   * Calculate distance from center (for height determination)
   */
  getDistanceFromCenter(x: number, y: number): number {
    const centerX = 50;
    const centerY = 50;
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  }

  /**
   * Check if coordinates are in downtown core
   */
  isDowntownCore(x: number, y: number): boolean {
    return x >= 40 && x <= 60 && y >= 40 && y <= 60;
  }

  /**
   * Get district for coordinates
   */
  getDistrict(x: number, y: number): string {
    if (this.isDowntownCore(x, y)) return 'Downtown Core';
    if (y < 40) return 'Residential North';
    if (y > 60) return 'Industrial South';
    if (x < 40 || x > 60) return 'Glizzy World';
    return 'Mixed District';
  }

  /**
   * Filter parcels by status
   */
  filterByStatus(parcels: Parcel[], status: ParcelStatus): Parcel[] {
    return parcels.filter(p => p.status === status);
  }

  /**
   * Filter parcels by zone
   */
  filterByZone(parcels: Parcel[], zone: ZoneType): Parcel[] {
    return parcels.filter(p => p.zone === zone);
  }

  /**
   * Filter parcels by owner
   */
  filterByOwner(parcels: Parcel[], owner: Address): Parcel[] {
    return parcels.filter(p => p.ownerAddress?.toLowerCase() === owner.toLowerCase());
  }

  /**
   * Search parcels by ID
   */
  searchByParcelId(parcels: Parcel[], searchId: number): Parcel | undefined {
    return parcels.find(p => p.parcelId === searchId);
  }

  /**
   * Sort parcels by price
   */
  sortByPrice(parcels: Parcel[], ascending: boolean = true): Parcel[] {
    return [...parcels].sort((a, b) => {
      const aPrice = a.zonePrice;
      const bPrice = b.zonePrice;
      return ascending ? Number(aPrice - bPrice) : Number(bPrice - aPrice);
    });
  }

  /**
   * Get parcels for sale
   */
  getForSaleParcels(parcels: Parcel[]): Parcel[] {
    return parcels.filter(p => p.status === ParcelStatus.FOR_SALE);
  }

  /**
   * Get owned parcels
   */
  getOwnedParcels(parcels: Parcel[]): Parcel[] {
    return parcels.filter(p => p.status === ParcelStatus.OWNED);
  }

  /**
   * Get DAO parcels
   */
  getDAOParcels(parcels: Parcel[]): Parcel[] {
    return parcels.filter(p => p.status === ParcelStatus.DAO_OWNED);
  }

  /**
   * Calculate total value of parcels
   */
  calculateTotalValue(parcels: Parcel[]): bigint {
    return parcels.reduce((sum, p) => sum + p.zonePrice, 0n);
  }

  /**
   * Get statistics for parcels
   */
  getStatistics(parcels: Parcel[]) {
    return {
      total: parcels.length,
      forSale: this.getForSaleParcels(parcels).length,
      owned: this.getOwnedParcels(parcels).length,
      daoOwned: this.getDAOParcels(parcels).length,
      withHouses: parcels.filter(p => p.hasHouse).length,
      withBusinesses: parcels.filter(p => p.businessLicense !== LicenseType.NONE).length,
      totalValue: this.calculateTotalValue(parcels),
      byZone: {
        public: parcels.filter(p => p.zone === ZoneType.PUBLIC).length,
        residential: parcels.filter(p => p.zone === ZoneType.RESIDENTIAL).length,
        commercial: parcels.filter(p => p.zone === ZoneType.COMMERCIAL).length,
        premium: parcels.filter(p => p.zone === ZoneType.PREMIUM).length,
        glizzyWorld: parcels.filter(p => p.zone === ZoneType.GLIZZY_WORLD).length
      }
    };
  }

  /**
   * MOCK DATA GENERATOR
   * Generates realistic parcel data for development/testing without deployed contract
   */
  generateMockParcels(count: number = 10000): Parcel[] {
    const parcels: Parcel[] = [];
    
    for (let i = 0; i < count; i++) {
      const x = i % 100;
      const y = Math.floor(i / 100);
      const zone = this.determineZoneFromCoords(x, y);
      const random = this.seededRandom(i);
      
      // 30% for sale, 60% owned, 10% DAO/restricted
      const randStatus = random();
      let status: ParcelStatus;
      let owner: Address | null = null;
      
      if (randStatus < 0.3) {
        status = ParcelStatus.FOR_SALE;
      } else if (randStatus < 0.9) {
        status = ParcelStatus.OWNED;
        owner = this.generateMockAddress(i);
      } else {
        status = ParcelStatus.DAO_OWNED;
        owner = '0xDAODAODAODAODAODAODAODAODAODAODAODAO0' as Address;
      }

      const hasHouse = random() > 0.5;
      const hasLicense = random() > 0.7;
      const businessLicense = hasLicense 
        ? (Math.floor(random() * 4) + 1) as LicenseType
        : LicenseType.NONE;

      parcels.push({
        parcelId: i,
        tokenId: i,
        ownerAddress: owner,
        worldId: 'VOID-1',
        gridX: x,
        gridY: y,
        layerZ: 0,
        zone,
        zonePrice: this.getZonePrice(zone),
        status,
        listingPrice: status === ParcelStatus.FOR_SALE ? this.getZonePrice(zone) : undefined,
        buildingId: `building-${i}`,
        hasHouse,
        businessLicense,
        businessRevenue: hasLicense ? BigInt(Math.floor(random() * 10000)) : 0n,
        metadata: {
          rarity: this.getMockRarity(zone, x, y),
          traits: this.getMockTraits(zone, x, y),
          description: `Parcel #${i} in ${this.getZoneName(zone)}`,
          image: undefined
        }
      });
    }

    return parcels;
  }

  private seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  private generateMockAddress(seed: number): Address {
    const hex = seed.toString(16).padStart(40, '0');
    return `0x${hex}` as Address;
  }

  private determineZoneFromCoords(x: number, y: number): ZoneType {
    const centerX = 50;
    const centerY = 50;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance < 10) return ZoneType.PREMIUM;
    if (distance < 20) return ZoneType.COMMERCIAL;
    if (distance < 35) return ZoneType.RESIDENTIAL;
    if (distance < 50) return ZoneType.PUBLIC;
    return ZoneType.GLIZZY_WORLD;
  }

  private getMockRarity(zone: ZoneType, x: number, y: number): string {
    const distance = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
    if (zone === ZoneType.PREMIUM || distance < 5) return 'legendary';
    if (zone === ZoneType.COMMERCIAL || distance < 15) return 'rare';
    if (distance < 30) return 'uncommon';
    return 'common';
  }

  private getMockTraits(zone: ZoneType, x: number, y: number): string[] {
    const traits: string[] = [];
    if (x === 0 || x === 99 || y === 0 || y === 99) traits.push('edge-lot');
    if (x % 10 === 0 || y % 10 === 0) traits.push('main-avenue');
    if (x === 50 && y === 50) traits.push('center-plaza');
    if (zone === ZoneType.PREMIUM) traits.push('premium-zone');
    return traits;
  }
}

export const landRegistryAPI = new LandRegistryAPI();
