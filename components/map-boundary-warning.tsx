"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Map } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"

interface MapBoundaryWarningProps {
  playerPosition: { x: number; z: number }
  onOpenMap: () => void
}

const MAP_BOUNDS = {
  minX: -150,
  maxX: 150,
  minZ: -120,
  maxZ: 120,
}

const WARNING_THRESHOLD = 20

export function MapBoundaryWarning({ playerPosition, onOpenMap }: MapBoundaryWarningProps) {
  const [showWarning, setShowWarning] = useState(false)
  const [direction, setDirection] = useState("")

  useEffect(() => {
    const { x, z } = playerPosition
    const distToWest = x - MAP_BOUNDS.minX
    const distToEast = MAP_BOUNDS.maxX - x
    const distToNorth = z - MAP_BOUNDS.minZ
    const distToSouth = MAP_BOUNDS.maxZ - z

    const minDist = Math.min(distToWest, distToEast, distToNorth, distToSouth)

    if (minDist < WARNING_THRESHOLD) {
      setShowWarning(true)
      if (minDist === distToWest) setDirection("WEST")
      else if (minDist === distToEast) setDirection("EAST")
      else if (minDist === distToNorth) setDirection("NORTH")
      else setDirection("SOUTH")
    } else {
      setShowWarning(false)
    }
  }, [playerPosition])

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
        >
          <div className="bg-red-900/95 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 shadow-2xl max-w-md">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 animate-pulse" />
              <div>
                <h3 className="text-red-200 font-bold text-lg mb-2">MAP BOUNDARY AHEAD</h3>
                <p className="text-red-300 text-sm mb-4">
                  You're approaching the {direction} edge of the VOID. Use the map to teleport to other areas.
                </p>
                <Button onClick={onOpenMap} className="w-full bg-red-600 hover:bg-red-500 text-white">
                  <Map className="w-4 h-4 mr-2" />
                  Open Map to Teleport
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
