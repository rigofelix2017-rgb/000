"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useOrientation } from "@/hooks/use-orientation"

interface MobileHUDControllerProps {
  children: React.ReactNode
  userProfile: any
  playerPosition: { x: number; z: number }
  currentZone: any
  voidBalance: number
  psxBalance: number
}

export function MobileHUDController({
  children,
  userProfile,
  playerPosition,
  currentZone,
  voidBalance,
  psxBalance,
}: MobileHUDControllerProps) {
  const [hudMode, setHudMode] = useState<"full" | "lite" | "hidden">("lite")
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const orientation = useOrientation()
  const isPortrait = orientation === "portrait"

  if (!isMobile || !isPortrait) {
    return <>{children}</>
  }

  return (
    <>
      {/* Dropdown Menu Button */}
      <motion.button
        className="fixed top-2 right-2 z-50 y2k-chrome-panel p-2 rounded-lg pointer-events-auto"
        onClick={() => setMenuOpen(!menuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-12 right-2 z-50 y2k-chrome-panel rounded-lg p-2 pointer-events-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${
                hudMode === "lite" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => {
                setHudMode("lite")
                setMenuOpen(false)
              }}
            >
              <Eye className="w-4 h-4" />
              Lite HUD
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 mt-1 ${
                hudMode === "hidden" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => {
                setHudMode("hidden")
                setMenuOpen(false)
              }}
            >
              <EyeOff className="w-4 h-4" />
              Game Mode
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 mt-1 ${
                hudMode === "full" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => {
                setHudMode("full")
                setMenuOpen(false)
              }}
            >
              <Eye className="w-4 h-4" />
              Full HUD
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lite HUD Overlay */}
      <AnimatePresence>
        {hudMode === "lite" && (
          <motion.div
            className="fixed top-2 left-2 z-40 pointer-events-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Compact Profile Card */}
            <div className="y2k-chrome-panel rounded-lg p-2 w-48 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border border-white/40 overflow-hidden text-sm">
                  {userProfile.avatarUrl.startsWith("data:") || userProfile.avatarUrl.startsWith("http") ? (
                    <img
                      src={userProfile.avatarUrl || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userProfile.avatarUrl}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="y2k-chrome-text font-bold text-[10px] truncate">{userProfile.username}</p>
                  <p className="text-gray-300 font-mono text-[8px] truncate">0x12...78</p>
                  <p className="text-white/80 font-mono text-[8px]">
                    [{Math.floor(playerPosition.x)}, {Math.floor(playerPosition.z)}]
                  </p>
                </div>
              </div>
              <div className="pt-1 mt-1 border-t border-white/20">
                <p className="text-gray-300 text-[8px]">Zone:</p>
                <p className="y2k-chrome-text font-bold text-[10px] truncate">
                  {currentZone ? currentZone.name : "VOID"}
                </p>
              </div>
            </div>

            {/* Currency Display */}
            <div className="flex gap-2">
              <div className="y2k-chrome-panel rounded-lg p-2 flex-1">
                <p className="text-gray-300 font-mono text-[8px]">VOID</p>
                <p className="y2k-chrome-text font-bold text-sm">{(voidBalance / 1000).toFixed(1)}K</p>
                <p className="text-green-400 text-[8px]">+5.2%</p>
              </div>
              <div className="y2k-chrome-panel rounded-lg p-2 flex-1">
                <p className="text-gray-300 font-mono text-[8px]">PSX</p>
                <p className="y2k-chrome-text font-bold text-sm">{(psxBalance / 1000).toFixed(0)}K</p>
                <p className="text-gray-400 text-[8px]">+{((psxBalance * 100) / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full HUD */}
      {hudMode === "full" && children}

      {/* Hidden Mode - Show nothing except dropdown */}
      {hudMode === "hidden" && null}
    </>
  )
}
