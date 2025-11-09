"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Package, Zap, Palette, ImageIcon, Wrench } from "lucide-react"
import { useViewport } from "@/hooks/use-viewport"

interface EnhancedInventorySystemProps {
  isOpen: boolean
  onClose: () => void
}

type InventoryTab = "items" | "powerups" | "cosmetics" | "nfts" | "tools"

const TABS: { id: InventoryTab; label: string; icon: any }[] = [
  { id: "items", label: "Items", icon: Package },
  { id: "powerups", label: "Power-Ups", icon: Zap },
  { id: "cosmetics", label: "Cosmetics", icon: Palette },
  { id: "nfts", label: "NFTs", icon: ImageIcon },
  { id: "tools", label: "Tools", icon: Wrench },
]

export function EnhancedInventorySystem({ isOpen, onClose }: EnhancedInventorySystemProps) {
  const viewport = useViewport()
  const isMobile = viewport.isMobile
  const [activeTab, setActiveTab] = useState<InventoryTab>("items")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0 }}
        >
          <motion.div
            className={`w-full ${isMobile ? "max-w-md" : "max-w-6xl"} max-h-[85vh] flex flex-col y2k-chrome-panel rounded-2xl overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className={`${isMobile ? "text-2xl" : "text-3xl"} font-black y2k-chrome-text`}>INVENTORY</h2>
                  <p className="text-sm text-gray-400">Manage your items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`${isMobile ? "w-12 h-12" : "w-10 h-10"} flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors`}
              >
                <X className={`${isMobile ? "w-7 h-7" : "w-6 h-6"} text-red-400`} />
              </button>
            </div>

            <div className="flex border-b border-white/20 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 ${isMobile ? "px-4 py-3 min-w-[90px]" : "px-6 py-4"} flex items-center justify-center gap-2 font-bold transition-all ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className={isMobile ? "text-sm" : "text-base"}>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className={`flex-1 overflow-y-auto ${isMobile ? "p-3" : "p-6"}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "items" && (
                    <div
                      className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"}`}
                    >
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl bg-black/60 border-2 border-cyan-400/30 hover:border-cyan-400 transition-all cursor-pointer ${isMobile ? "p-3" : "p-4"} flex flex-col items-center justify-center`}
                        >
                          <div className={`${isMobile ? "text-3xl mb-1" : "text-4xl mb-2"}`}>📦</div>
                          <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 text-center`}>
                            Item {i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "powerups" && (
                    <div
                      className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"}`}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl bg-black/60 border-2 border-purple-400/30 hover:border-purple-400 transition-all cursor-pointer ${isMobile ? "p-3" : "p-4"} flex flex-col items-center justify-center`}
                        >
                          <div className={`${isMobile ? "text-3xl mb-1" : "text-4xl mb-2"}`}>⚡</div>
                          <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 text-center`}>
                            Power-Up {i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "cosmetics" && (
                    <div
                      className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"}`}
                    >
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl bg-black/60 border-2 border-pink-400/30 hover:border-pink-400 transition-all cursor-pointer ${isMobile ? "p-3" : "p-4"} flex flex-col items-center justify-center`}
                        >
                          <div className={`${isMobile ? "text-3xl mb-1" : "text-4xl mb-2"}`}>👕</div>
                          <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 text-center`}>
                            Cosmetic {i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "nfts" && (
                    <div
                      className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}`}
                    >
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl bg-black/60 border-2 border-yellow-400/30 hover:border-yellow-400 transition-all cursor-pointer ${isMobile ? "p-3" : "p-4"} flex flex-col items-center justify-center`}
                        >
                          <div className={`${isMobile ? "text-3xl mb-1" : "text-4xl mb-2"}`}>🖼️</div>
                          <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 text-center`}>
                            NFT #{i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "tools" && (
                    <div
                      className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"}`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl bg-black/60 border-2 border-orange-400/30 hover:border-orange-400 transition-all cursor-pointer ${isMobile ? "p-3" : "p-4"} flex flex-col items-center justify-center`}
                        >
                          <div className={`${isMobile ? "text-3xl mb-1" : "text-4xl mb-2"}`}>🔧</div>
                          <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 text-center`}>
                            Tool {i + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
