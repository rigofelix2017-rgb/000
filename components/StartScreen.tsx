"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const isConnected = true
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-black">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(6, 255, 165, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 80%, rgba(255, 0, 110, 0.15) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute inset-0 scanlines opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-8">
        {!showMenu ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <motion.div
              className="mb-8"
              animate={{
                textShadow: [
                  "0 0 20px #ffffff, 0 0 40px #06FFA5",
                  "0 0 30px #ffffff, 0 0 60px #00D9FF",
                  "0 0 20px #ffffff, 0 0 40px #FF006E",
                  "0 0 20px #ffffff, 0 0 40px #06FFA5",
                ],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <h1 className="text-8xl font-black chrome-text mb-4 glow-text">VOID</h1>
              <p className="text-2xl font-bold text-cyan-400 tracking-widest glow-text">PSX AGENCY PROTOCOL</p>
            </motion.div>

            <motion.p
              className="text-gray-300 text-lg mb-12 max-w-2xl glow-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Enter a cyberpunk metaverse powered by Base. Trade, explore, and build your agency.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(true)}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-xl font-bold glow-text"
              style={{
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.5), 0 0 50px rgba(6, 255, 165, 0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              ENTER THE VOID
            </motion.button>

            <motion.p
              className="text-gray-400 text-sm mt-6 font-mono glow-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Press any key to continue...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-black/90 backdrop-blur-2xl border-2 border-cyan-400/50 rounded-2xl p-8">
              <h2 className="text-4xl font-black chrome-text mb-6 glow-text">WELCOME TO THE VOID</h2>

              <div className="mb-8 bg-cyan-500/20 border border-cyan-400/50 rounded-xl p-4">
                <p className="text-cyan-400 font-bold text-center glow-text">
                  Demo Mode - Wallet Integration Coming Soon
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
                  <h3 className="text-cyan-400 font-bold mb-2 glow-text">Starting Location</h3>
                  <p className="text-gray-200 text-sm glow-text">
                    You will spawn at <span className="text-cyan-400 font-bold">PSX HQ</span> - the command center for
                    all creators
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                  <h3 className="text-purple-400 font-bold mb-2 glow-text">Controls</h3>
                  <p className="text-gray-200 text-sm glow-text">
                    WASD to move, Shift to sprint, E to interact, Tab for dashboard, V to change camera
                  </p>
                </div>

                <div className="bg-pink-500/10 border border-pink-400/30 rounded-xl p-4">
                  <h3 className="text-pink-400 font-bold mb-2 glow-text">Explore Zones</h3>
                  <p className="text-gray-200 text-sm glow-text">
                    Visit PSX HQ, DEX Plaza, Casino Strip, Housing District, and Signal Lab
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-xl font-bold glow-text"
                style={{
                  boxShadow: "0 0 30px rgba(255, 255, 255, 0.4), 0 0 50px rgba(6, 255, 165, 0.5)",
                }}
              >
                ENTER WORLD
              </motion.button>

              <p className="text-gray-400 text-xs text-center mt-4 font-mono glow-text">
                Ready to enter. Click ENTER WORLD to begin your journey.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
