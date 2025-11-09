"use client"

import { motion } from "framer-motion"
import { useViewport } from "@/hooks/use-viewport"

interface MinimapProps {
  playerPosition: { x: number; y: number; z: number }
  currentZone: any
}

const ZONES = [
  { id: "psx-hq", position: { x: 0, z: 0 }, color: "#06FFA5", radius: 9, name: "PSX HQ" },
  { id: "dex-plaza", position: { x: 40, z: -20 }, color: "#00D9FF", radius: 10, name: "DEX" },
  { id: "casino-strip", position: { x: -50, z: -35 }, color: "#FF006E", radius: 12, name: "Casino" },
  { id: "housing", position: { x: 60, z: 30 }, color: "#8B5CF6", radius: 14, name: "Housing" },
  { id: "signal-lab", position: { x: -20, z: 35 }, color: "#F72585", radius: 10, name: "Signal" },
]

export function Minimap({ playerPosition, currentZone }: MinimapProps) {
  const viewport = useViewport()

  const worldToMap = (worldPos: number) => {
    const mapSize = 150
    const worldSize = 200
    return (worldPos / worldSize) * mapSize
  }

  const getMapSize = () => {
    if (viewport.size === "mobile-portrait") return { width: 140, height: 140 }
    if (viewport.isMobile) return { width: 160, height: 160 }
    if (viewport.isTablet) return { width: 180, height: 180 }
    return { width: 200, height: 200 }
  }

  const mapSize = getMapSize()

  return (
    <motion.div
      className={`fixed top-4 right-4 pointer-events-auto z-40`}
      style={{
        width: `${mapSize.width}px`,
        height: `${mapSize.height}px`,
      }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 2.5, type: "spring", stiffness: 200, damping: 20 }}
    >
      <div
        className="w-full h-full rounded-2xl p-3 backdrop-blur-xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(40, 40, 50, 0.95), rgba(50, 50, 60, 0.95))",
          border: "3px solid rgba(6, 255, 165, 0.5)",
          boxShadow:
            "0 0 40px rgba(6, 255, 165, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
            backgroundSize: "200% 200%",
            animation: "chromeShine 8s ease infinite",
          }}
        />

        <div className="text-cyan-400 text-xs font-bold mb-2 text-center tracking-widest relative z-10 glow-text">
          VOID MAP
        </div>

        <div
          className="relative w-full h-[calc(100%-36px)] rounded-lg border overflow-hidden"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            borderColor: "rgba(6, 255, 165, 0.4)",
            boxShadow: "inset 0 0 20px rgba(6, 255, 165, 0.1)",
          }}
        >
          {ZONES.map((zone) => {
            const mapX = worldToMap(zone.position.x) + mapSize.width / 2
            const mapZ = worldToMap(zone.position.z) + mapSize.height / 2 - 36
            const isActive = currentZone?.id === zone.id

            return (
              <div
                key={zone.id}
                className="absolute transition-all duration-300"
                style={{
                  left: `${mapX}px`,
                  top: `${mapZ}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="absolute rounded-full opacity-20"
                  style={{
                    width: `${zone.radius * 1.2}px`,
                    height: `${zone.radius * 1.2}px`,
                    backgroundColor: zone.color,
                    transform: "translate(-50%, -50%)",
                    left: "50%",
                    top: "50%",
                  }}
                />

                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all ${isActive ? "scale-150" : ""}`}
                  style={{
                    backgroundColor: isActive ? zone.color : "rgba(0, 0, 0, 0.5)",
                    borderColor: zone.color,
                    boxShadow: `0 0 ${isActive ? "15px" : "8px"} ${zone.color}`,
                  }}
                />

                {isActive && (
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-sm"
                    style={{
                      color: zone.color,
                      background: "rgba(0, 0, 0, 0.8)",
                      border: `1px solid ${zone.color}50`,
                      textShadow: `0 0 8px ${zone.color}`,
                    }}
                  >
                    {zone.name}
                  </div>
                )}
              </div>
            )
          })}

          <div
            className="absolute z-10 transition-all duration-100"
            style={{
              left: `${worldToMap(playerPosition.x) + mapSize.width / 2}px`,
              top: `${worldToMap(playerPosition.z) + mapSize.height / 2 - 36}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <div
                className="w-2.5 h-2.5 bg-white rounded-full border-2 border-cyan-400"
                style={{
                  boxShadow: "0 0 10px rgba(6, 255, 165, 0.8)",
                }}
              />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-cyan-400/50 rounded-full animate-ping" />
            </div>
          </div>

          <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/60 font-bold">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-cyan-400">N</span>
              <div className="flex gap-3 items-center">
                <span>W</span>
                <span className="text-cyan-400 text-xs">◆</span>
                <span>E</span>
              </div>
              <span>S</span>
            </div>
          </div>
        </div>

        <div
          className="mt-2 text-center text-[9px] font-mono font-bold tracking-wider"
          style={{
            color: "rgba(6, 255, 165, 0.9)",
            textShadow: "0 0 8px rgba(6, 255, 165, 0.6)",
          }}
        >
          [{Math.floor(playerPosition.x)}, {Math.floor(playerPosition.z)}]
        </div>
      </div>

      <style jsx>{`
        @keyframes chromeShine {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  )
}
