"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface ZoneInteractionProps {
  zone: any
  onAction: (action: string) => void
}

export function ZoneInteraction({ zone, onAction }: ZoneInteractionProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showFullInfo, setShowFullInfo] = useState(false)

  useEffect(() => {
    setShowPrompt(true)
    setShowFullInfo(false)
    return () => setShowPrompt(false)
  }, [zone])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "q" || e.key === "Q") {
        setShowFullInfo(!showFullInfo)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [showFullInfo])

  if (!zone) return null

  return (
    <>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <motion.div
          className="relative mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", damping: 15 }}
        >
          <div
            className="absolute inset-0 blur-xl opacity-60"
            style={{
              background: `radial-gradient(ellipse, ${zone.color}, transparent)`,
            }}
          />
          <div
            className="relative bg-gradient-to-r from-transparent via-black/95 to-transparent backdrop-blur-2xl border-y-4 px-16 py-4"
            style={{
              borderColor: zone.color,
              boxShadow: `0 0 30px ${zone.color}40, inset 0 0 30px ${zone.color}20`,
            }}
          >
            <h2
              className="text-5xl font-black text-center tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${zone.color}, white, ${zone.color})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `0 0 40px ${zone.color}`,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
              }}
            >
              {zone.title}
            </h2>
            {zone.subtitle && (
              <p className="text-center text-gray-300 font-mono text-sm mt-2 tracking-widest">{zone.subtitle}</p>
            )}
          </div>

          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8"
            style={{
              background: `linear-gradient(to bottom, transparent, ${zone.color})`,
              boxShadow: `0 0 15px ${zone.color}`,
            }}
          />
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8"
            style={{
              background: `linear-gradient(to top, transparent, ${zone.color})`,
              boxShadow: `0 0 15px ${zone.color}`,
            }}
          />
        </motion.div>

        <div className="flex flex-col gap-4 items-center">
          <motion.button
            className="relative group pointer-events-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(zone.actions?.[0]?.id || "enter")}
          >
            <div
              className="absolute inset-0 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: zone.color }}
            />
            <div
              className="relative bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border-4 rounded-2xl px-10 py-5"
              style={{
                borderColor: zone.color,
                boxShadow: `0 0 40px ${zone.color}60, inset 0 0 40px ${zone.color}20`,
              }}
            >
              <div className="flex items-center gap-6">
                <motion.div
                  className="w-16 h-16 rounded-xl border-4 flex items-center justify-center font-black text-4xl"
                  style={{
                    borderColor: zone.color,
                    color: zone.color,
                    boxShadow: `0 0 30px ${zone.color}, inset 0 0 20px ${zone.color}40`,
                    background: `radial-gradient(circle, ${zone.color}20, transparent)`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 30px ${zone.color}, inset 0 0 20px ${zone.color}40`,
                      `0 0 50px ${zone.color}, inset 0 0 30px ${zone.color}60`,
                      `0 0 30px ${zone.color}, inset 0 0 20px ${zone.color}40`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  E
                </motion.div>
                <div className="text-left">
                  <p className="text-white font-black text-2xl tracking-wide">
                    {zone.actions?.[0]?.label || "ENTER ZONE"}
                  </p>
                  <p className="text-gray-400 font-mono text-sm mt-1">Press [E] to interact</p>
                </div>
              </div>
            </div>
          </motion.button>

          <motion.div
            className="relative"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative bg-black/80 backdrop-blur border-2 border-gray-600 rounded-xl px-6 py-3 hover:border-white transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-lg text-gray-300"
                  style={{ borderColor: "#666" }}
                >
                  Q
                </div>
                <p className="text-gray-300 font-bold">View Zone Info</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFullInfo && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-8 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullInfo(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="border-4 rounded-t-3xl p-6"
                style={{
                  borderColor: zone.color,
                  background: `linear-gradient(135deg, #000000, #1a1a2e, #000000)`,
                  boxShadow: `0 0 60px ${zone.color}80, inset 0 0 60px ${zone.color}30`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="text-6xl"
                      style={{
                        filter: `drop-shadow(0 0 20px ${zone.color})`,
                      }}
                    >
                      {zone.icon}
                    </div>
                    <div>
                      <h3
                        className="text-4xl font-black tracking-wide"
                        style={{
                          background: `linear-gradient(135deg, ${zone.color}, white)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {zone.title}
                      </h3>
                      <p className="text-gray-400 font-mono text-sm mt-1">{zone.subtitle}</p>
                    </div>
                  </div>
                  <motion.button
                    className="w-12 h-12 rounded-full border-2 border-white/50 text-white font-bold hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFullInfo(false)}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              <div
                className="border-x-4 border-b-4 rounded-b-3xl p-8"
                style={{
                  borderColor: zone.color,
                  background: "linear-gradient(180deg, #0a0a0f, #1a1a2e)",
                  boxShadow: `0 0 60px ${zone.color}60`,
                }}
              >
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{zone.description}</p>

                <div className="space-y-3">
                  <h4 className="text-white font-bold text-xl mb-4 tracking-wide">AVAILABLE ACTIONS:</h4>
                  {zone.actions?.map((action: any, idx: number) => (
                    <motion.button
                      key={action.id}
                      className="w-full text-left p-4 rounded-xl border-2 hover:scale-105 transition-transform"
                      style={{
                        borderColor: action.primary ? zone.color : "#444",
                        background: action.primary
                          ? `linear-gradient(90deg, ${zone.color}20, transparent)`
                          : "rgba(20, 20, 30, 0.6)",
                      }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        onAction(action.id)
                        setShowFullInfo(false)
                      }}
                    >
                      <p className="font-bold text-lg" style={{ color: action.primary ? zone.color : "#fff" }}>
                        {action.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
