import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import * as landAPI from "@/lib/web3/land-parcels"
import type { LandParcel } from "@/lib/web3/land-parcels"

/**
 * Hook to fetch all land parcels
 */
export function useAllLandParcels() {
  return useQuery({
    queryKey: ["land-parcels"],
    queryFn: landAPI.getAllLandParcels,
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to fetch a single land parcel by ID
 */
export function useLandParcel(id: string | null) {
  return useQuery({
    queryKey: ["land-parcel", id],
    queryFn: () => (id ? landAPI.getLandParcelById(id) : null),
    enabled: !!id,
  })
}

/**
 * Hook to fetch land parcels owned by the connected wallet
 */
export function useMyLandParcels() {
  const { address } = useAccount()

  return useQuery({
    queryKey: ["my-land-parcels", address],
    queryFn: () => (address ? landAPI.getLandParcelsByOwner(address) : []),
    enabled: !!address,
  })
}

/**
 * Hook to fetch available land parcels for sale
 */
export function useAvailableLandParcels() {
  return useQuery({
    queryKey: ["available-land-parcels"],
    queryFn: landAPI.getAvailableLandParcels,
    staleTime: 15000, // 15 seconds
  })
}

/**
 * Hook to fetch land parcels in a district
 */
export function useLandParcelsByDistrict(districtId: string | null) {
  return useQuery({
    queryKey: ["land-parcels-district", districtId],
    queryFn: () => (districtId ? landAPI.getLandParcelsByDistrict(districtId) : []),
    enabled: !!districtId,
  })
}

/**
 * Hook to fetch land registry statistics
 */
export function useLandRegistryStats() {
  return useQuery({
    queryKey: ["land-registry-stats"],
    queryFn: landAPI.getLandRegistryStats,
    staleTime: 60000, // 1 minute
  })
}

/**
 * Hook to list land for sale
 */
export function useListLandForSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: string }) => landAPI.listLandForSale(id, price),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["my-land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["available-land-parcels"] })
    },
  })
}

/**
 * Hook to buy land
 */
export function useBuyLand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: string }) => landAPI.buyLand(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["my-land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["available-land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["land-registry-stats"] })
    },
  })
}

/**
 * Hook to transfer land
 */
export function useTransferLand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, to }: { id: string; to: string }) => landAPI.transferLand(id, to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["my-land-parcels"] })
    },
  })
}

/**
 * Hook to stake land
 */
export function useStakeLand() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: string }) => landAPI.stakeLand(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["my-land-parcels"] })
      queryClient.invalidateQueries({ queryKey: ["land-registry-stats"] })
    },
  })
}

/**
 * Hook to update land metadata
 */
export function useUpdateLandMetadata() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, metadata }: { id: string; metadata: LandParcel["metadata"] }) =>
      landAPI.updateLandMetadata(id, metadata),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["land-parcel", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["land-parcels"] })
    },
  })
}
