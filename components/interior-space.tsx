"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useViewport } from "@/hooks/use-viewport"

interface InteriorSpaceProps {
  zone: any
  isOpen: boolean
  onExit: () => void
}

const INTERIOR_DESIGNS = {
  "psx-hq": {
    name: "PSX Agency HQ",
    bgColor: "from-slate-950 via-emerald-950 to-slate-950",
    accentColor: "#06FFA5",
    items: [
      { name: "Mission Terminal", icon: "🖥️", position: "top-20 left-20" },
      { name: "IP Registry", icon: "📋", position: "top-20 right-20" },
      { name: "Creator Lounge", icon: "🛋️", position: "bottom-20 left-1/4" },
      { name: "Conference Room", icon: "📊", position: "bottom-20 right-1/4" },
    ],
  },
  "dex-plaza": {
    name: "DEX Trading Floor",
    bgColor: "from-slate-950 via-cyan-950 to-slate-950",
    accentColor: "#00D9FF",
    items: [
      { name: "Trading Terminal", icon: "📈", position: "top-1/4 left-1/3" },
      { name: "Liquidity Pools", icon: "💧", position: "top-1/4 right-1/3" },
      { name: "Analytics Desk", icon: "📊", position: "bottom-1/3 left-1/4" },
      { name: "Portfolio Manager", icon: "💼", position: "bottom-1/3 right-1/4" },
    ],
  },
  "casino-strip": {
    name: "Neon Casino",
    bgColor: "from-slate-950 via-pink-950 to-slate-950",
    accentColor: "#FF006E",
    items: [
      { name: "Slot Machines", icon: "🎰", position: "top-1/3 left-1/4" },
      { name: "Dice Tables", icon: "🎲", position: "top-1/3 right-1/4" },
      { name: "VIP Lounge", icon: "👑", position: "bottom-1/4 left-1/3" },
      { name: "Prize Counter", icon: "🏆", position: "bottom-1/4 right-1/3" },
    ],
  },
  housing: {
    name: "Creator Apartment",
    bgColor: "from-slate-950 via-purple-950 to-slate-950",
    accentColor: "#8B5CF6",
    items: [
      { name: "Workspace", icon: "💻", position: "top-1/4 left-1/4" },
      { name: "Storage Unit", icon: "📦", position: "top-1/4 right-1/4" },
      { name: "Living Area", icon: "🛋️", position: "bottom-1/3 left-1/3" },
      { name: "Customization Hub", icon: "🎨", position: "bottom-1/3 right-1/3" },
    ],
  },
  "signal-lab": {
    name: "Signal Processing Lab",
    bgColor: "from-slate-950 via-rose-950 to-slate-950",
    accentColor: "#F72585",
    items: [
      { name: "Cipher Terminal", icon: "🔐", position: "top-1/3 left-1/3" },
      { name: "Lore Archive", icon: "📚", position: "top-1/3 right-1/3" },
      { name: "Transmission Deck", icon: "📡", position: "bottom-1/4 left-1/4" },
      { name: "Decoder Station", icon: "🎯", position: "bottom-1/4 right-1/4" },
    ],
  },
}

export function InteriorSpace({ zone, isOpen, onExit }: InteriorSpaceProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const viewport = useViewport()

  const interior = zone ? INTERIOR_DESIGNS[zone.id as keyof typeof INTERIOR_DESIGNS] : null

  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "x" || e.key === "X") && isOpen) {
        onExit()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onExit])

  if (!interior || !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${interior.bgColor}`}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(${interior.accentColor}40 1px, transparent 1px),
              linear-gradient(90deg, ${interior.accentColor}40 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 scanlines mix-blend-overlay" />

        {/* Header */}
        <motion.div
          className={`absolute top-0 left-0 right-0 ${viewport.isMobile ? "p-4" : "p-8"}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 20 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2
                className={`${viewport.isMobile ? "text-2xl" : viewport.isTablet ? "text-3xl" : "text-5xl"} font-black tracking-wider`}
                style={{
                  background: `linear-gradient(135deg, ${interior.accentColor}, white)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: `0 0 40px ${interior.accentColor}`,
                }}
              >
                {interior.name}
              </h2>
              {viewport.size !== "mobile-portrait" && (
                <p className="text-gray-400 font-mono mt-2 text-sm">INTERIOR SPACE • SECURE CONNECTION</p>
              )}
            </div>

            <div className="relative z-50">
              <motion.button
                className={`${viewport.isMobile ? "px-3 py-2 text-sm" : "px-6 py-3"} rounded-xl border-2 border-white/50 text-white font-bold backdrop-blur-xl bg-black/50 hover:bg-white/10 transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExit}
              >
                {viewport.isMobile ? "X" : "EXIT [X]"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Interactive items */}
        <div className={`absolute inset-0 ${viewport.isMobile ? "p-4 pt-20" : "p-8"}`}>
          {viewport.isMobile ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-16">
              {interior.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1, type: "spring", damping: 15 }}
                >
                  <motion.button
                    className="group relative w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItem(item.name)}
                  >
                    <div
                      className="absolute inset-0 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: interior.accentColor }}
                    />
                    <div
                      className="relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center backdrop-blur-xl bg-black/60 p-3"
                      style={{
                        borderColor: interior.accentColor,
                        boxShadow: `0 0 20px ${interior.accentColor}60`,
                      }}
                    >
                      <div className="text-3xl mb-1">{item.icon}</div>
                      <p className="text-[10px] font-bold text-center" style={{ color: interior.accentColor }}>
                        {item.name}
                      </p>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              {interior.items.map((item, idx) => (
                <motion.div
                  key={item.name}
                  className={`absolute ${item.position}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1, type: "spring", damping: 15 }}
                >
                  <motion.button
                    className="group relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(item.name)}
                  >
                    <div
                      className="absolute inset-0 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: interior.accentColor }}
                    />
                    <div
                      className="relative w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center backdrop-blur-xl bg-black/60"
                      style={{
                        borderColor: interior.accentColor,
                        boxShadow: `0 0 30px ${interior.accentColor}60, inset 0 0 30px ${interior.accentColor}20`,
                      }}
                    >
                      <div className="text-5xl mb-2">{item.icon}</div>
                      <p className="text-xs font-bold text-center px-2" style={{ color: interior.accentColor }}>
                        {item.name}
                      </p>
                    </div>
                    <motion.div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 px-4 py-2 rounded-lg text-white text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ boxShadow: `0 0 20px ${interior.accentColor}` }}
                    >
                      Click to interact
                    </motion.div>
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Item detail modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-8 bg-black/70 backdrop-blur-xl z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="max-w-lg w-full rounded-3xl border-4 p-8 bg-gradient-to-br from-black via-gray-900 to-black"
                style={{
                  borderColor: interior.accentColor,
                  boxShadow: `0 0 60px ${interior.accentColor}80`,
                }}
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-3xl font-black mb-4" style={{ color: interior.accentColor }}>
                  {selectedItem}
                </h3>
                <p className="text-gray-300 mb-6">
                  This feature is currently under development. Future updates will add full functionality to this
                  interactive element.
                </p>
                <motion.button
                  className="w-full py-3 rounded-xl border-2 font-bold"
                  style={{
                    borderColor: interior.accentColor,
                    color: interior.accentColor,
                    background: `linear-gradient(90deg, ${interior.accentColor}20, transparent)`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem(null)}
                >
                  CLOSE
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom instructions */}
        {!viewport.isMobile && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-full px-8 py-4 border-2 border-white/30">
              <p className="text-white font-mono text-sm">Click items to interact • Press [X] or [ESC] to exit</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
