"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface PowerUp {
  id: string
  name: string
  icon: string
  description: string
  duration: number // seconds
  cost: number
  color: string
  effect: string
}

const POWERUPS: PowerUp[] = [
  {
    id: "speed-boost",
    name: "Speed Boost",
    icon: "⚡",
    description: "Run 2x faster for limited time",
    duration: 30,
    cost: 50,
    color: "#FFD700",
    effect: "speed",
  },
  {
    id: "super-sprint",
    name: "Super Sprint",
    icon: "🔥",
    description: "Sprint 3x faster with no stamina drain",
    duration: 45,
    cost: 100,
    color: "#FF4500",
    effect: "super-speed",
  },
  {
    id: "neon-trail",
    name: "Neon Trail",
    icon: "✨",
    description: "Leave a glowing neon trail behind you",
    duration: 60,
    cost: 75,
    color: "#00D9FF",
    effect: "trail",
  },
  {
    id: "double-jump",
    name: "Anti-Grav",
    icon: "🚀",
    description: "Jump higher and glide through the air",
    duration: 30,
    cost: 120,
    color: "#8B5CF6",
    effect: "jump",
  },
]

interface PowerUpStoreProps {
  isOpen: boolean
  onClose: () => void
  balance: number
  onPurchase: (powerUp: PowerUp) => void
}

export function PowerUpStore({ isOpen, onClose, balance, onPurchase }: PowerUpStoreProps) {
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-4xl rounded-3xl border-4 border-purple-500 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #0a0a0f, #1a0a2e)",
            boxShadow: "0 0 60px #8B5CF680",
          }}
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
        >
          {/* Header */}
          <div
            className="p-8 border-b-2 border-purple-500/50"
            style={{
              background: "linear-gradient(90deg, #1a0a2e, #0a0a0f, #1a0a2e)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-5xl font-black tracking-wider mb-2"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, white, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 40px #8B5CF6",
                  }}
                >
                  POWER-UP STORE
                </h2>
                <p className="text-gray-400 font-mono text-sm">Temporary boosts to enhance your VOID experience</p>
              </div>
              <motion.button
                className="w-14 h-14 rounded-full border-2 border-white/50 text-white font-bold text-xl hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                ✕
              </motion.button>
            </div>

            {/* Balance display */}
            <div className="mt-6 flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600/30 to-transparent rounded-2xl px-6 py-3 border-2 border-purple-500/50">
                <p className="text-purple-400 font-mono text-xs tracking-widest">YOUR BALANCE</p>
                <p className="text-4xl font-black text-white mt-1">{balance.toLocaleString()}</p>
                <p className="text-gray-400 text-xs font-bold mt-1">VOID</p>
              </div>
            </div>
          </div>

          {/* Power-ups grid */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-6">
              {POWERUPS.map((powerup, idx) => (
                <motion.div
                  key={powerup.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div
                    className="absolute inset-0 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ background: powerup.color }}
                  />

                  <motion.button
                    className="relative w-full rounded-2xl border-4 p-6 text-left backdrop-blur-xl bg-black/60"
                    style={{
                      borderColor: powerup.color,
                      boxShadow: `0 0 30px ${powerup.color}40, inset 0 0 30px ${powerup.color}20`,
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPowerUp(powerup)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="text-6xl"
                        style={{
                          filter: `drop-shadow(0 0 20px ${powerup.color})`,
                        }}
                      >
                        {powerup.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-2" style={{ color: powerup.color }}>
                          {powerup.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">{powerup.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="px-3 py-1 rounded-lg border-2 font-bold text-sm"
                              style={{
                                borderColor: powerup.color,
                                color: powerup.color,
                                background: `${powerup.color}20`,
                              }}
                            >
                              {powerup.duration}s
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Cost</p>
                            <p className="text-2xl font-black text-white">{powerup.cost}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Purchase confirmation modal */}
        <AnimatePresence>
          {selectedPowerUp && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPowerUp(null)}
            >
              <motion.div
                className="max-w-md w-full rounded-3xl border-4 p-8"
                style={{
                  borderColor: selectedPowerUp.color,
                  background: "linear-gradient(180deg, #000000, #1a1a2e)",
                  boxShadow: `0 0 80px ${selectedPowerUp.color}80`,
                }}
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div
                    className="text-8xl mb-4"
                    style={{
                      filter: `drop-shadow(0 0 30px ${selectedPowerUp.color})`,
                    }}
                  >
                    {selectedPowerUp.icon}
                  </div>
                  <h3 className="text-4xl font-black mb-4" style={{ color: selectedPowerUp.color }}>
                    {selectedPowerUp.name}
                  </h3>
                  <p className="text-gray-300 mb-6">{selectedPowerUp.description}</p>

                  <div className="bg-white/5 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Duration</span>
                      <span className="text-white font-bold">{selectedPowerUp.duration}s</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Cost</span>
                      <span className="text-white font-bold">{selectedPowerUp.cost} VOID</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Your Balance</span>
                      <span
                        className="font-bold"
                        style={{ color: balance >= selectedPowerUp.cost ? "#00FF88" : "#FF4444" }}
                      >
                        {balance} VOID
                      </span>
                    </div>
                  </div>

                  {balance >= selectedPowerUp.cost ? (
                    <motion.button
                      className="w-full py-4 rounded-xl border-4 font-black text-xl mb-3"
                      style={{
                        borderColor: selectedPowerUp.color,
                        color: selectedPowerUp.color,
                        background: `linear-gradient(90deg, ${selectedPowerUp.color}30, transparent)`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onPurchase(selectedPowerUp)
                        setSelectedPowerUp(null)
                      }}
                    >
                      PURCHASE NOW
                    </motion.button>
                  ) : (
                    <div className="w-full py-4 rounded-xl border-4 border-red-500 text-red-500 font-black text-xl mb-3 text-center">
                      INSUFFICIENT FUNDS
                    </div>
                  )}

                  <motion.button
                    className="w-full py-3 rounded-xl border-2 border-gray-600 text-gray-400 font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPowerUp(null)}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
