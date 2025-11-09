"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMetaverseLand } from "@/lib/hooks/use-metaverse-land"
import { useAccount } from "wagmi"

interface PropertyOverlayProps {
  property: {
    id: number
    name: string
    zone: string
    price: string
    isListed: boolean
    owner?: string
    coordinates: { x: number; z: number }
  }
  onClose: () => void
}

export function PropertyOverlay({ property, onClose }: PropertyOverlayProps) {
  const { address } = useAccount()
  const { buyParcel, isPending } = useMetaverseLand()

  const isOwner = address?.toLowerCase() === property.owner?.toLowerCase()

  const handlePurchase = () => {
    buyParcel(property.id, property.price)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-slate-900 border-cyan-500/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-cyan-400">{property.name}</h3>
            <p className="text-slate-400">{property.zone}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Coordinates</p>
              <p className="text-slate-200 font-mono">
                X: {property.coordinates.x}, Z: {property.coordinates.z}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Token ID</p>
              <p className="text-slate-200 font-mono">#{property.id}</p>
            </div>
          </div>

          {property.owner && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Current Owner</p>
              <p className="text-slate-200 font-mono text-sm">
                {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
              </p>
              {isOwner && (
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                  You own this property
                </Badge>
              )}
            </div>
          )}

          {property.isListed && (
            <>
              <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Listed Price</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {property.price} VOID
                </p>
              </div>

              {!isOwner && (
                <Button
                  onClick={handlePurchase}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
                >
                  {isPending ? "Purchasing..." : "Buy Property"}
                </Button>
              )}
            </>
          )}

          {isOwner && (
            <div className="space-y-3">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <h4 className="font-semibold text-emerald-400 mb-2">Property Benefits</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Custom spawn point</li>
                  <li>• Buildable space for businesses</li>
                  <li>• Land appreciation potential</li>
                  <li>• 80% of metaverse revenue</li>
                </ul>
              </div>

              <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 bg-transparent">
                Manage Property
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
