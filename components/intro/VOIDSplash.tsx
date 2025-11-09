"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useViewport } from "@/hooks/use-viewport"

interface VOIDSplashProps {
  onComplete: () => void
}

export function VOIDSplash({ onComplete }: VOIDSplashProps) {
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const viewport = useViewport()

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchIntensity(Math.random())
    }, 100)

    const timer = setTimeout(onComplete, 4000)

    return () => {
      clearInterval(glitchInterval)
      clearTimeout(timer)
    }
  }, [onComplete])

  const getTextSize = () => {
    if (viewport.isMobile) {
      return viewport.size === "mobile-portrait" ? "text-6xl" : "text-7xl"
    }
    if (viewport.isTablet) return "text-8xl"
    return "text-[12rem]"
  }

  const getSubtitleSize = () => {
    if (viewport.isMobile) return "text-lg"
    if (viewport.isTablet) return "text-xl"
    return "text-3xl"
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(6, 255, 165, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 217, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 0, 110, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring", damping: 10 }}
      >
        <motion.h1
          className={`${getTextSize()} font-black text-white`}
          style={{
            textShadow: `
              0 0 40px rgba(6, 255, 165, ${0.8 + glitchIntensity * 0.2}),
              0 0 80px rgba(0, 217, 255, ${0.6 + glitchIntensity * 0.2}),
              0 0 120px rgba(255, 0, 110, ${0.4 + glitchIntensity * 0.2}),
              ${glitchIntensity * 10}px 0 20px rgba(255, 0, 0, ${glitchIntensity * 0.5}),
              ${-glitchIntensity * 10}px 0 20px rgba(0, 255, 255, ${glitchIntensity * 0.5})
            `,
            transform: `translate(${glitchIntensity * 5}px, ${glitchIntensity * 5}px)`,
          }}
          animate={{
            textShadow: [
              "0 0 40px rgba(6, 255, 165, 0.8)",
              "0 0 80px rgba(0, 217, 255, 0.8)",
              "0 0 40px rgba(255, 0, 110, 0.8)",
              "0 0 40px rgba(6, 255, 165, 0.8)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          VOID
        </motion.h1>

        <motion.div
          className={`text-center ${viewport.isMobile ? "mt-4" : "mt-8"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className={`text-cyan-400 ${getSubtitleSize()} font-bold tracking-widest`}>PSX AGENCY PROTOCOL</p>
          <p className={`text-gray-400 ${viewport.isMobile ? "text-sm" : "text-xl"} mt-4 font-mono`}>
            Initializing metaverse...
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
    </motion.div>
  )
}
