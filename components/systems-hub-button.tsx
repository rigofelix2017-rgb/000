// Floating Systems Hub Button - Quick access to all 11 core systems
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Grid3x3, Sparkles } from "lucide-react"

interface SystemsHubButtonProps {
  onClick: () => void
  isMobile?: boolean
}

export function SystemsHubButton({ onClick, isMobile = false }: SystemsHubButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", damping: 12, stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        fixed z-40 group
        ${isMobile ? "bottom-24 right-4 w-16 h-16" : "bottom-6 right-6 w-14 h-14"}
        rounded-2xl
        bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500
        hover:from-purple-600 hover:via-pink-600 hover:to-orange-600
        shadow-2xl hover:shadow-purple-500/50
        border-2 border-white/20
        flex items-center justify-center
        transition-all duration-300
        overflow-hidden
      `}
      style={{
        boxShadow: isHovered
          ? "0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)"
          : "0 10px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity"
        style={{
          animation: "spin 3s linear infinite",
        }}
      />

      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-4 border-white/40"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <Grid3x3 className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>

      {/* Sparkle effect */}
      <motion.div
        className="absolute top-1 right-1"
        animate={{
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-3 h-3 text-yellow-300" fill="currentColor" />
      </motion.div>

      {/* Tooltip */}
      <div
        className={`
          absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg
          bg-black/90 backdrop-blur-sm border border-white/20
          text-xs font-medium whitespace-nowrap
          transition-all duration-200
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
        `}
      >
        <div className="flex flex-col items-end gap-1">
          <span className="text-white font-bold">Systems Hub</span>
          <span className="text-gray-400">
            Press <kbd className="px-1 bg-white/10 rounded">S</kbd> or click
          </span>
          <span className="text-purple-400 text-[10px]">11 core systems</span>
        </div>
      </div>

      {/* Badge indicator */}
      <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">11</span>
      </div>
    </motion.button>
  )
}
