"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ delay: progress >= 100 ? 0.5 : 0, duration: 1 }}
      style={{ pointerEvents: progress >= 100 ? "none" : "auto" }}
    >
      <div className="text-center max-w-md">
        {/* Logo Animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-8xl mb-8"
        >
          ⚡
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl font-black mb-4 chrome-text"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          VOID
        </motion.h1>

        <p className="text-gray-400 font-mono text-sm mb-8">Loading PS1-style metaverse...</p>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-cyan-400 font-mono text-xs mt-2">{Math.floor(progress)}%</p>

        {/* Loading Messages */}
        <div className="mt-8 h-16">
          {progress < 30 && (
            <motion.p className="text-gray-500 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Initializing 50×20 world grid...
            </motion.p>
          )}
          {progress >= 30 && progress < 60 && (
            <motion.p className="text-gray-500 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Loading district assets...
            </motion.p>
          )}
          {progress >= 60 && progress < 90 && (
            <motion.p className="text-gray-500 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Activating V4 hooks...
            </motion.p>
          )}
          {progress >= 90 && (
            <motion.p className="text-green-400 text-xs font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Ready! Press P for Phone, D for Dashboard
            </motion.p>
          )}
        </div>
      </div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-20" />
    </motion.div>
  )
}
