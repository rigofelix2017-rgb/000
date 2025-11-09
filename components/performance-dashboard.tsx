"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Wifi, Users, Zap, X } from "lucide-react"
import { useViewport } from "@/hooks/use-viewport"

interface PerformanceDashboardProps {
  isMinimized?: boolean
}

export function PerformanceDashboard({ isMinimized = false }: PerformanceDashboardProps) {
  const viewport = useViewport()
  const [fps, setFps] = useState(60)
  const [latency, setLatency] = useState(45)
  const [playerCount, setPlayerCount] = useState(12)
  const isMobile = viewport.isMobile

  useEffect(() => {
    // Simulate FPS monitoring
    const fpsInterval = setInterval(() => {
      setFps(Math.floor(55 + Math.random() * 10))
    }, 1000)

    // Simulate latency monitoring
    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(30 + Math.random() * 30))
    }, 2000)

    return () => {
      clearInterval(fpsInterval)
      clearInterval(latencyInterval)
    }
  }, [])

  const getFpsColor = () => {
    if (fps >= 55) return "text-green-400"
    if (fps >= 30) return "text-yellow-400"
    return "text-red-400"
  }

  const getLatencyColor = () => {
    if (latency <= 50) return "text-green-400"
    if (latency <= 100) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${isMobile ? "top-6 right-4 w-64" : "top-1/4 right-6 w-72"} z-[200] y2k-chrome-panel p-4 rounded-xl pointer-events-auto`}
        initial={{ scale: 0, opacity: 0, x: 100 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0, opacity: 0, x: 100 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold y2k-chrome-text flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance
          </h3>
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "l" })
              window.dispatchEvent(event)
            }}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
          >
            <X className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">FPS</span>
            </div>
            <span className={`text-lg font-bold ${getFpsColor()}`}>{fps}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-cyan-400`} />
              <span className="text-xs text-gray-400">Latency</span>
            </div>
            <span className={`text-lg font-bold ${getLatencyColor()}`}>{latency}ms</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} text-purple-400`} />
              <span className="text-xs text-gray-400">Online</span>
            </div>
            <span className={`text-lg font-bold text-white`}>{playerCount}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex gap-2">
            <div
              className={`flex-1 ${isMobile ? "h-2" : "h-1"} rounded-full ${fps >= 55 ? "bg-green-400" : fps >= 30 ? "bg-yellow-400" : "bg-red-400"}`}
            />
            <div
              className={`flex-1 ${isMobile ? "h-2" : "h-1"} rounded-full ${latency <= 50 ? "bg-green-400" : latency <= 100 ? "bg-yellow-400" : "bg-red-400"}`}
            />
            <div className={`flex-1 ${isMobile ? "h-2" : "h-1"} rounded-full bg-cyan-400`} />
          </div>
          <p className={`${isMobile ? "text-xs" : "text-[10px]"} text-gray-500 mt-1 text-center`}>
            System Status: Optimal
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
