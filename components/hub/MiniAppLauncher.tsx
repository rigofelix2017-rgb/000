"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Star, Clock, TrendingUp } from "lucide-react"

interface MiniApp {
  id: string
  name: string
  description: string
  icon: string
  category: "internal" | "external"
  route?: string
  embedUrl?: string
  featured?: boolean
  stats?: {
    users?: number
    volume?: string
  }
}

interface MiniAppLauncherProps {
  onLaunch: (app: MiniApp) => void
}

export function MiniAppLauncher({ onLaunch }: MiniAppLauncherProps) {
  const [filter, setFilter] = useState<"all" | "internal" | "external">("all")

  const miniApps: MiniApp[] = [
    {
      id: "sku-market",
      name: "SKU Marketplace",
      description: "Buy, sell, and trade creator SKUs",
      icon: "🛍️",
      category: "internal",
      route: "/apps/sku-market",
      featured: true,
      stats: { users: 1250, volume: "45K VOID" },
    },
    {
      id: "hooks-registry",
      name: "Hook Registry",
      description: "Register and manage V4 hooks",
      icon: "🪝",
      category: "internal",
      route: "/apps/hooks",
      stats: { users: 89 },
    },
    {
      id: "casino",
      name: "Casino Games",
      description: "Slots, blackjack, and more",
      icon: "🎰",
      category: "internal",
      route: "/apps/casino",
      featured: true,
      stats: { users: 2100, volume: "120K VOID" },
    },
    {
      id: "governance",
      name: "DAO Governance",
      description: "Vote on proposals and manage the DAO",
      icon: "🗳️",
      category: "internal",
      route: "/apps/governance",
      stats: { users: 450 },
    },
    {
      id: "base-dex",
      name: "Base DEX",
      description: "Trade on Base with zero fees",
      icon: "🔄",
      category: "external",
      embedUrl: "https://base-dex.example.com",
      featured: true,
      stats: { volume: "2.5M USD" },
    },
    {
      id: "base-nft",
      name: "NFT Marketplace",
      description: "Mint and trade NFTs on Base",
      icon: "🖼️",
      category: "external",
      embedUrl: "https://nft-market.example.com",
      stats: { users: 3200 },
    },
    {
      id: "base-social",
      name: "Social Hub",
      description: "Connect with the Base community",
      icon: "🌐",
      category: "external",
      embedUrl: "https://social.example.com",
      stats: { users: 5400 },
    },
  ]

  const filteredApps = miniApps.filter((app) => filter === "all" || app.category === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black y2k-chrome-text tracking-wider">MINI-APP LAUNCHER</h2>
        <p className="text-sm text-gray-400 font-mono mt-1">Internal ecosystem apps + external Base integrations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-2 rounded-xl bg-black/30 border-2 border-white/10 w-fit">
        {[
          { id: "all", label: "All Apps" },
          { id: "internal", label: "Internal" },
          { id: "external", label: "Base Apps" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              filter === tab.id
                ? "bg-cyan-500/30 border-2 border-cyan-400 text-cyan-300"
                : "bg-black/20 border-2 border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Featured Apps */}
      {filter === "all" && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-black text-white">FEATURED</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {miniApps
              .filter((app) => app.featured)
              .map((app) => (
                <motion.div
                  key={app.id}
                  className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 cursor-pointer hover:scale-[1.02] transition-transform"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onLaunch(app)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-5xl">{app.icon}</span>
                    {app.category === "external" && <ExternalLink className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{app.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{app.description}</p>
                  {app.stats && (
                    <div className="flex gap-4 text-xs text-gray-300 font-mono">
                      {app.stats.users && <span>👥 {app.stats.users}</span>}
                      {app.stats.volume && <span>💰 {app.stats.volume}</span>}
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* All Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredApps.map((app) => (
          <motion.div
            key={app.id}
            className={`p-4 rounded-xl border-2 cursor-pointer hover:scale-[1.02] transition-all ${
              app.category === "internal"
                ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/30 hover:border-cyan-400"
                : "bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-400/30 hover:border-orange-400"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onLaunch(app)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">{app.icon}</span>
              {app.category === "external" && (
                <span className="px-2 py-1 rounded bg-orange-500/30 border border-orange-400 text-xs font-bold text-orange-300">
                  BASE
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{app.name}</h4>
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{app.description}</p>
            {app.stats && (
              <div className="flex gap-3 text-xs text-gray-300 font-mono">
                {app.stats.users && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{app.stats.users}</span>
                  </div>
                )}
                {app.stats.volume && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{app.stats.volume}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
