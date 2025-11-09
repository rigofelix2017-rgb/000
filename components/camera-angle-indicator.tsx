"use client"

import { motion } from "framer-motion"
import { useViewport } from "@/hooks/use-viewport"

interface CameraAngleIndicatorProps {
  angle: "close" | "medium" | "far"
}

export function CameraAngleIndicator({ angle }: CameraAngleIndicatorProps) {
  const viewport = useViewport()

  const labels = {
    close: "CLOSE",
    medium: "MEDIUM",
    far: "FAR",
  }

  if (viewport.size === "mobile-portrait") return null

  return (
    <motion.div
      className={`fixed ${viewport.isMobile ? "bottom-32 right-3" : viewport.isTablet ? "bottom-40 right-4" : "bottom-48 right-6"} z-30 pointer-events-none`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      <div className={`y2k-chrome-panel rounded-xl ${viewport.isMobile ? "p-2 px-3" : "p-3 px-4"}`}>
        <p className={`${viewport.isMobile ? "text-[10px]" : "text-xs"} text-gray-400 font-mono mb-1`}>CAMERA</p>
        <p className={`${viewport.isMobile ? "text-base" : "text-lg"} font-black y2k-chrome-text`}>{labels[angle]}</p>
        <p className={`${viewport.isMobile ? "text-[10px]" : "text-xs"} text-gray-500 font-mono mt-1`}>Press V</p>
      </div>
    </motion.div>
  )
}
