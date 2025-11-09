"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"

export function SKUInventory() {
  const { isConnected } = useAccount()

  // Mock inventory - in production would fetch from contract
  const mockInventory = [
    {
      id: 1,
      name: "Retro Racer N64",
      quantity: 1,
      category: "game",
      image: "/retro-racing-game.jpg",
    },
    {
      id: 2,
      name: "Cyberpunk Skin Pack",
      quantity: 1,
      category: "skin",
      image: "/cyberpunk-skin.jpg",
    },
  ]

  if (!isConnected) {
    return (
      <Card className="p-8 bg-slate-900/50 border-slate-800 text-center">
        <p className="text-slate-400">Connect your wallet to view your SKU inventory</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your SKUs</h2>
      <p className="text-slate-400 mb-6">
        Your universal content library - use these across all Agency Ecosystem products
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockInventory.map((item) => (
          <div key={item.id} className="relative group cursor-pointer">
            <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <Badge className="absolute top-2 right-2 bg-black/60 text-white border-none">×{item.quantity}</Badge>
            <p className="mt-2 text-sm font-medium text-slate-300 truncate">{item.name}</p>
          </div>
        ))}
      </div>

      {mockInventory.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="mb-4">No SKUs in your inventory yet</p>
          <Button
            onClick={() => (window.location.href = "/marketplace")}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500"
          >
            Browse Marketplace
          </Button>
        </div>
      )}
    </Card>
  )
}
