"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface VOIDHubProps {
  isOpen: boolean
  onClose: () => void
  userProfile: any
  voidBalance: number
  psxBalance: number
  onNavigate: (route: string) => void
}

export function VOIDHub({ isOpen, onClose, userProfile, voidBalance, psxBalance, onNavigate }: VOIDHubProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    {
      id: "land",
      name: "LAND & REAL ESTATE",
      icon: "🏠",
      color: "from-emerald-500/30 to-cyan-500/30",
      borderColor: "border-emerald-400",
      apps: [
        { id: "land-inventory", name: "My Land", icon: "📦", route: "/land/inventory" },
        { id: "land-map", name: "City Map", icon: "🗺️", route: "/land/map" },
        { id: "marketplace", name: "Marketplace", icon: "🏪", route: "/land/marketplace" },
        { id: "real-estate", name: "Real Estate", icon: "🏢", route: "/land/real-estate" },
      ],
    },
    {
      id: "economy",
      name: "VOID ECONOMY",
      icon: "💎",
      color: "from-purple-500/30 to-pink-500/30",
      borderColor: "border-purple-400",
      apps: [
        { id: "void-token", name: "VOID Token", icon: "🌀", route: "/economy/void" },
        { id: "staking", name: "xVOID Vault", icon: "🔒", route: "/economy/staking" },
        { id: "fees", name: "Fee Distribution", icon: "💰", route: "/economy/fees" },
        { id: "psx", name: "PSX Treasury", icon: "🏛️", route: "/economy/psx" },
      ],
    },
    {
      id: "apps",
      name: "MINI-APPS",
      icon: "📱",
      color: "from-cyan-500/30 to-blue-500/30",
      borderColor: "border-cyan-400",
      apps: [
        { id: "sku-market", name: "SKU Market", icon: "🛍️", route: "/apps/sku-market" },
        { id: "hooks", name: "Hook Registry", icon: "🪝", route: "/apps/hooks" },
        { id: "casino", name: "Casino", icon: "🎰", route: "/apps/casino" },
        { id: "governance", name: "Governance", icon: "🗳️", route: "/apps/governance" },
      ],
    },
    {
      id: "social",
      name: "SOCIAL",
      icon: "👥",
      color: "from-pink-500/30 to-rose-500/30",
      borderColor: "border-pink-400",
      apps: [
        { id: "friends", name: "Friends", icon: "🤝", route: "/social/friends" },
        { id: "messages", name: "Messages", icon: "💬", route: "/social/messages" },
        { id: "voice", name: "Voice Chat", icon: "🎙️", route: "/social/voice" },
        { id: "party", name: "Party System", icon: "🎉", route: "/social/party" },
      ],
    },
    {
      id: "external",
      name: "BASE APPS",
      icon: "🔌",
      color: "from-yellow-500/30 to-orange-500/30",
      borderColor: "border-yellow-400",
      apps: [
        { id: "base-dex", name: "Base DEX", icon: "🔄", route: "/apps/external/base-dex", external: true },
        { id: "base-nft", name: "NFT Market", icon: "🖼️", route: "/apps/external/nft-market", external: true },
        { id: "base-social", name: "Social Hub", icon: "🌐", route: "/apps/external/social", external: true },
      ],
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Hub Panel */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="y2k-chrome-panel w-full max-w-6xl max-h-[90vh] overflow-hidden pointer-events-auto rounded-2xl"
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="relative p-6 border-b-2 border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black y2k-chrome-text tracking-wider">VOID HUB</h1>
                    <p className="text-sm text-gray-400 font-mono mt-1">Mission Control // PSX Agency Protocol</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-mono">VOID BALANCE</p>
                      <p className="text-2xl font-bold text-emerald-400">{voidBalance.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-mono">PSX BALANCE</p>
                      <p className="text-2xl font-bold text-purple-400">{psxBalance.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg bg-red-500/20 border-2 border-red-400 hover:bg-red-500/40 transition-colors"
                    >
                      <X className="w-6 h-6 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl overflow-hidden">
                    {userProfile?.avatarUrl && (
                      <img
                        src={userProfile.avatarUrl || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{userProfile?.username || "Agent"}</p>
                    <p className="text-xs text-gray-400 font-mono">0x1234...5678 // Level {userProfile?.level || 1}</p>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      className={`p-4 rounded-xl border-2 ${category.borderColor} bg-gradient-to-br ${category.color} cursor-pointer hover:scale-[1.02] transition-transform`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{category.icon}</span>
                        <h3 className="text-lg font-black y2k-chrome-text tracking-wider">{category.name}</h3>
                      </div>

                      <AnimatePresence>
                        {activeCategory === category.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {category.apps.map((app) => (
                              <motion.button
                                key={app.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNavigate(app.route)
                                  onClose()
                                }}
                                className="w-full p-3 rounded-lg bg-black/40 border border-white/20 hover:bg-black/60 hover:border-white/40 transition-all flex items-center gap-3"
                                whileHover={{ x: 4 }}
                              >
                                <span className="text-2xl">{app.icon}</span>
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-bold text-white">{app.name}</p>
                                  {(app as any).external && (
                                    <p className="text-xs text-yellow-400 font-mono">EXTERNAL</p>
                                  )}
                                </div>
                                <span className="text-white/60">→</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {activeCategory !== category.id && (
                        <p className="text-sm text-gray-400 font-mono">
                          {category.apps.length} apps // Click to expand
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/50">
                    <p className="text-xs text-gray-400 font-mono">LAND OWNED</p>
                    <p className="text-3xl font-black text-white">0</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50">
                    <p className="text-xs text-gray-400 font-mono">xVOID STAKED</p>
                    <p className="text-3xl font-black text-white">0</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50">
                    <p className="text-xs text-gray-400 font-mono">SKUs OWNED</p>
                    <p className="text-3xl font-black text-white">0</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-400/50">
                    <p className="text-xs text-gray-400 font-mono">FRIENDS</p>
                    <p className="text-3xl font-black text-white">3</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
