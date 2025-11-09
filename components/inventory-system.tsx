"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Package, Shirt, Sparkles, Trophy } from "lucide-react"

interface InventorySystemProps {
  isOpen: boolean
  onClose: () => void
}

interface InventoryItem {
  id: string
  name: string
  type: "weapon" | "clothing" | "consumable" | "collectible" | "sku"
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: string
  quantity: number
  description: string
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "1",
    name: "Cyber Sword",
    type: "weapon",
    rarity: "legendary",
    icon: "⚔️",
    quantity: 1,
    description: "A legendary plasma blade",
  },
  {
    id: "2",
    name: "Neon Jacket",
    type: "clothing",
    rarity: "epic",
    icon: "🧥",
    quantity: 1,
    description: "Y2K style jacket with LED trim",
  },
  {
    id: "3",
    name: "Health Pack",
    type: "consumable",
    rarity: "common",
    icon: "💊",
    quantity: 5,
    description: "Restores 50 HP",
  },
  {
    id: "4",
    name: "Golden Trophy",
    type: "collectible",
    rarity: "rare",
    icon: "🏆",
    quantity: 1,
    description: "Won from casino games",
  },
  {
    id: "5",
    name: "Music NFT",
    type: "sku",
    rarity: "epic",
    icon: "🎵",
    quantity: 3,
    description: "Exclusive tracks from TUNES",
  },
  {
    id: "6",
    name: "Event Ticket",
    type: "sku",
    rarity: "rare",
    icon: "🎫",
    quantity: 2,
    description: "Access to virtual concerts",
  },
]

export function InventorySystem({ isOpen, onClose }: InventorySystemProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "weapons" | "clothing" | "skus">("all")

  const rarityColors = {
    common: "#8D99AE",
    rare: "#06FFA5",
    epic: "#A855F7",
    legendary: "#FFD700",
  }

  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "weapons") return item.type === "weapon"
    if (activeTab === "clothing") return item.type === "clothing"
    if (activeTab === "skus") return item.type === "sku"
    return true
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <motion.div
            className="w-full max-w-5xl bg-gradient-to-br from-black via-purple-950 to-black border-2 border-green-500 rounded-3xl overflow-hidden liquid-metal shadow-neon-green"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/80 border-b-2 border-green-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold chrome-text">INVENTORY</h2>
                <p className="text-gray-400 text-sm mt-1">Manage your items and SKUs</p>
              </div>
              <button
                onClick={onClose}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.9)"
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                }}
                className="w-12 h-12 rounded-full border-2 border-green-500 bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition active:scale-90"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <X className="w-6 h-6 text-green-400" />
              </button>
            </div>

            <div className="bg-black/60 border-b border-green-500/30 px-6 flex gap-2 overflow-x-auto">
              {[
                { id: "all", label: "All Items", icon: Package },
                { id: "weapons", label: "Weapons", icon: Sparkles },
                { id: "clothing", label: "Clothing", icon: Shirt },
                { id: "skus", label: "SKUs", icon: Trophy },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)"
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                  }}
                  className={`px-6 py-3 font-mono text-sm transition border-b-2 flex items-center gap-2 active:scale-95 flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex h-[500px] overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto" style={{ touchAction: "pan-y" }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredInventory.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onTouchStart={(e) => {
                        e.currentTarget.style.transform = "scale(0.95)"
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      className={`relative aspect-square bg-black/60 backdrop-blur border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition ${
                        selectedItem?.id === item.id ? "border-green-500 shadow-neon-green" : "border-gray-700"
                      }`}
                      style={{
                        borderColor: selectedItem?.id === item.id ? rarityColors[item.rarity] : undefined,
                        WebkitTapHighlightColor: "transparent",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="absolute top-2 right-2 w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: rarityColors[item.rarity],
                          boxShadow: `0 0 10px ${rarityColors[item.rarity]}`,
                        }}
                      />

                      <div className="text-5xl mb-2">{item.icon}</div>

                      <p className="text-white text-xs font-mono text-center">{item.name}</p>

                      {item.quantity > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/80 border border-green-500 rounded-full px-2 py-0.5">
                          <span className="text-green-400 text-xs font-mono">×{item.quantity}</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="w-full sm:w-80 bg-black/80 border-l-2 border-green-500/30 p-6 overflow-auto">
                {selectedItem ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div
                      className="aspect-square bg-black/60 border-2 rounded-2xl flex items-center justify-center"
                      style={{ borderColor: rarityColors[selectedItem.rarity] }}
                    >
                      <div className="text-8xl">{selectedItem.icon}</div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                        <span
                          className="text-xs font-mono px-2 py-1 rounded-full border"
                          style={{
                            color: rarityColors[selectedItem.rarity],
                            borderColor: rarityColors[selectedItem.rarity],
                          }}
                        >
                          {selectedItem.rarity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{selectedItem.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Type:</span>
                        <span className="text-green-400 font-mono">{selectedItem.type}</span>
                      </div>
                      {selectedItem.quantity > 1 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                          <span>Quantity:</span>
                          <span className="text-green-400 font-mono">×{selectedItem.quantity}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        className="w-full bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 rounded-xl py-3 text-green-400 font-mono transition active:scale-95"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.transform = "scale(0.95)"
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        USE ITEM
                      </button>
                      <button
                        className="w-full bg-purple-500/20 hover:bg-purple-500/30 border-2 border-purple-500 rounded-xl py-3 text-purple-400 font-mono transition active:scale-95"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.transform = "scale(0.95)"
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        TRADE
                      </button>
                      {selectedItem.type === "sku" && (
                        <button
                          className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-500 rounded-xl py-3 text-cyan-400 font-mono transition active:scale-95"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                          onTouchStart={(e) => {
                            e.currentTarget.style.transform = "scale(0.95)"
                          }}
                          onTouchEnd={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        >
                          VIEW IN MARKETPLACE
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-center">
                    <div>
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-mono text-sm">Select an item to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
