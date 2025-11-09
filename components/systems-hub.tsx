// Systems Hub - Central access to all 11 core metaverse systems
// Mobile-optimized interface for accessing all game systems

"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { AchievementSystem } from "@/components/systems/achievement-system"
import { QuestSystem } from "@/components/systems/quest-system"
import { LeaderboardsSystem } from "@/components/systems/leaderboards-system"
import { TradingSystem } from "@/components/systems/trading-system"
import { CraftingSystem } from "@/components/systems/crafting-system"
import { AuctionHouse } from "@/components/systems/auction-house"
import { BankSystem } from "@/components/systems/bank-system"
import { EmoteSystem } from "@/components/systems/emote-system"
import { PhotoMode } from "@/components/systems/photo-mode"
import { PartySystem } from "@/components/systems/party-system"
import { EventCalendar } from "@/components/systems/event-calendar"

interface SystemsHubProps {
  isOpen: boolean
  onClose: () => void
}

interface SystemDefinition {
  id: string
  name: string
  icon: string
  description: string
  component: React.ComponentType
  category: "social" | "economy" | "progression" | "creative"
  hotkey?: string
}

const SYSTEMS: SystemDefinition[] = [
  {
    id: "achievements",
    name: "Achievements",
    icon: "🏆",
    description: "Track your accomplishments and earn rewards",
    component: AchievementSystem,
    category: "progression",
    hotkey: "A",
  },
  {
    id: "quests",
    name: "Quests",
    icon: "⚔️",
    description: "Daily, weekly, and seasonal quests",
    component: QuestSystem,
    category: "progression",
    hotkey: "Q",
  },
  {
    id: "leaderboards",
    name: "Leaderboards",
    icon: "🏅",
    description: "Compete with players worldwide",
    component: LeaderboardsSystem,
    category: "social",
    hotkey: "L",
  },
  {
    id: "party",
    name: "Party",
    icon: "👥",
    description: "Form parties and play together",
    component: PartySystem,
    category: "social",
    hotkey: "H",
  },
  {
    id: "trading",
    name: "Trading",
    icon: "🔄",
    description: "Trade items with other players",
    component: TradingSystem,
    category: "economy",
    hotkey: "T",
  },
  {
    id: "auction",
    name: "Auction House",
    icon: "🔨",
    description: "Buy and sell items at auction",
    component: AuctionHouse,
    category: "economy",
    hotkey: "U",
  },
  {
    id: "bank",
    name: "Bank",
    icon: "🏦",
    description: "Store items and stake VOID",
    component: BankSystem,
    category: "economy",
    hotkey: "K",
  },
  {
    id: "crafting",
    name: "Crafting",
    icon: "⚒️",
    description: "Craft items and equipment",
    component: CraftingSystem,
    category: "progression",
    hotkey: "C",
  },
  {
    id: "emotes",
    name: "Emotes",
    icon: "💃",
    description: "Express yourself with emotes",
    component: EmoteSystem,
    category: "creative",
    hotkey: "Z",
  },
  {
    id: "photo",
    name: "Photo Mode",
    icon: "📷",
    description: "Capture amazing screenshots",
    component: PhotoMode,
    category: "creative",
    hotkey: "Y",
  },
  {
    id: "events",
    name: "Events",
    icon: "📅",
    description: "View and join world events",
    component: EventCalendar,
    category: "social",
    hotkey: "W",
  },
]

const CATEGORY_LABELS = {
  social: "Social",
  economy: "Economy",
  progression: "Progression",
  creative: "Creative",
}

const CATEGORY_COLORS = {
  social: "from-blue-500/20 to-cyan-500/20 border-blue-400",
  economy: "from-green-500/20 to-emerald-500/20 border-green-400",
  progression: "from-purple-500/20 to-pink-500/20 border-purple-400",
  creative: "from-orange-500/20 to-yellow-500/20 border-orange-400",
}

export function SystemsHub({ isOpen, onClose }: SystemsHubProps) {
  const [activeSystem, setActiveSystem] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<"all" | "social" | "economy" | "progression" | "creative">(
    "all",
  )

  const activeSystemDef = SYSTEMS.find((s) => s.id === activeSystem)
  const ActiveComponent = activeSystemDef?.component

  const filteredSystems = selectedCategory === "all" ? SYSTEMS : SYSTEMS.filter((s) => s.category === selectedCategory)

  const categories = ["all", ...Array.from(new Set(SYSTEMS.map((s) => s.category)))]

  React.useEffect(() => {
    if (!isOpen || activeSystem) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const system = SYSTEMS.find((s) => s.hotkey?.toLowerCase() === e.key.toLowerCase())
      if (system) {
        e.preventDefault()
        setActiveSystem(system.id)
      }

      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, activeSystem, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !activeSystem) {
          onClose()
        }
      }}
    >
      {/* Active System View */}
      {activeSystem && ActiveComponent ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full h-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button
              onClick={() => setActiveSystem(null)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium flex items-center gap-2"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {activeSystemDef.icon} {activeSystemDef.name}
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Content */}
          <div className="flex-1 overflow-auto p-6">
            <ActiveComponent />
          </div>
        </motion.div>
      ) : (
        // Systems Grid View
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-5xl max-h-[85vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Systems Hub
              </h1>
              <p className="text-sm text-gray-400 mt-1">Access all 11 core metaverse systems</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-white/20 text-white scale-105"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {category === "all" ? "All Systems" : CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </button>
            ))}
          </div>

          {/* Systems Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSystems.map((system) => (
                <motion.button
                  key={system.id}
                  onClick={() => setActiveSystem(system.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[system.category]} border-2 text-left transition-all hover:shadow-lg hover:shadow-${system.category}/20`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{system.icon}</span>
                    {system.hotkey && (
                      <span className="px-2 py-1 rounded bg-black/30 text-xs font-mono font-bold">{system.hotkey}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{system.name}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{system.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer Hint */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <p className="text-center text-sm text-gray-400">
              Press <kbd className="px-2 py-1 rounded bg-white/10 font-mono font-bold">S</kbd> to toggle Systems Hub •
              Click any system or use its hotkey to open
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
