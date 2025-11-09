"use client"

import { useState, useMemo, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Scene3D } from "./scene-3d"
import { PsxOverlay } from "./psx-overlay"
import { MobileTouchControls } from "./mobile-touch-controls"
import { useMobileDetection } from "@/lib/use-mobile-detection"
import { GovernancePortal } from "./governance-portal"
import { GlobalChat } from "./GlobalChat"
import { ProximityChat } from "./proximity-chat"
import { CyberpunkCityMap } from "./cyberpunk-city-map"
import { WalletConnectButton } from "./wallet-connect-button"
import { Map } from "lucide-react"
import { ZONES } from "@/lib/zones"

export function GameShell() {
  const HQ_ZONE = useMemo(() => ZONES.find((z) => z.id === "psx-hq"), [])
  const HQ_SPAWN = useMemo(
    () =>
      HQ_ZONE
        ? {
            x: HQ_ZONE.position.x,
            y: 0,
            z: HQ_ZONE.position.z + HQ_ZONE.radius + 4, // Spawn radius + 4 away (outside detection radius of radius + 2)
          }
        : { x: 0, y: 0, z: 12 }, // Fallback if HQ zone not found
    [HQ_ZONE],
  )

  const [gameState, setGameState] = useState<"start" | "playing">("start")
  const [playerPos, setPlayerPos] = useState(HQ_SPAWN)
  const [currentZone, setCurrentZone] = useState<any | null>(null)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  const isMobile = useMobileDetection()

  const [showGovernancePortal, setShowGovernancePortal] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const mobileVectorRef = useRef({ x: 0, z: 0 })
  const mobileSprintingRef = useRef(false)

  const handleMobileMove = (vector: { x: number; z: number }) => {
    mobileVectorRef.current = vector
  }

  const handleMobileSprint = (sprinting: boolean) => {
    mobileSprintingRef.current = sprinting
  }

  const handleZoneEnter = (zone: any) => {
    setCurrentZone(zone)
  }

  const handleZoneExit = () => {
    setCurrentZone(null)
  }

  const handleZoneInteract = (zone: any) => {
    if (zone.id === "psx-hq") {
      setShowGovernancePortal(true)
      setControlsEnabled(false)
    }
  }

  const handleCloseGovernance = () => {
    setShowGovernancePortal(false)
    setControlsEnabled(true)
  }

  const handleTeleport = (x: number, z: number) => {
    setPlayerPos({ x, y: 0, z })
    setControlsEnabled(true)
  }

  const handleMapToggle = () => {
    setShowMap(!showMap)
    setControlsEnabled(showMap)
  }

  const handleCloseMap = () => {
    setShowMap(false)
    setControlsEnabled(true)
  }

  if (gameState === "start") {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="text-6xl mb-4">◆</div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            PSX VOID
          </h1>
          <p className="text-slate-400 text-lg">Enter the metaverse - Own land, trade SKUs, build the network</p>
          <div className="flex flex-col gap-4 items-center">
            <WalletConnectButton />
            <button
              onClick={() => {
                setPlayerPos(HQ_SPAWN)
                setCurrentZone(null)
                setGameState("playing")
              }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all text-lg"
            >
              Enter City
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      <Canvas
        shadows
        className="w-full h-full block [image-rendering:pixelated]"
        camera={{ fov: 50, near: 0.5, far: 500, position: [0, 8, 12] }}
        dpr={isMobile ? 1 : [1, 1.7]}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <Scene3D
          playerPosition={playerPos}
          onPlayerMove={setPlayerPos}
          onZoneEnter={handleZoneEnter}
          onZoneExit={handleZoneExit}
          onZoneInteract={handleZoneInteract}
          controlsEnabled={controlsEnabled}
          mobileMovement={mobileVectorRef.current}
          mobileSprinting={mobileSprintingRef.current}
          isMobile={isMobile}
        />
      </Canvas>

      <div className="fixed top-4 right-4 z-40">
        <WalletConnectButton />
      </div>

      {currentZone && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md border-2 border-cyan-400/70 rounded-xl px-6 py-4 max-w-md z-50 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentZone.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-cyan-300 text-lg">{currentZone.title}</h3>
              <p className="text-sm text-slate-300">{currentZone.subtitle}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-400/40 rounded-lg py-2 px-4">
            <span className="text-xs text-slate-300">Press</span>
            <kbd className="px-2 py-1 bg-emerald-500 text-white font-bold rounded text-sm">E</kbd>
            <span className="text-xs text-slate-300">to enter</span>
          </div>
        </div>
      )}

      <button
        onClick={handleMapToggle}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 px-4 py-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 rounded-lg text-white font-bold transition-all backdrop-blur-sm"
      >
        <Map className="w-5 h-5 text-cyan-400" />
        <span>City Map</span>
      </button>

      <div className="fixed bottom-4 right-4 z-40 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2">
        <p className="text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">WASD</span> = Move |{" "}
          <span className="text-cyan-400 font-semibold">Space/C</span> = Up/Down |{" "}
          <span className="text-cyan-400 font-semibold">Shift</span> = Sprint |{" "}
          <span className="text-cyan-400 font-semibold">M</span> = Map
        </p>
      </div>

      <PsxOverlay />

      {isMobile && (
        <MobileTouchControls onMove={handleMobileMove} onSprint={handleMobileSprint} visible={controlsEnabled} />
      )}

      <div className="fixed left-4 bottom-4 z-30 flex flex-col-reverse gap-3 max-w-sm pointer-events-none">
        <div className="pointer-events-auto">
          <GlobalChat />
        </div>
        <div className="pointer-events-auto">
          <ProximityChat playerPosition={{ x: playerPos.x, z: playerPos.z }} />
        </div>
      </div>

      {showGovernancePortal && <GovernancePortal onClose={handleCloseGovernance} />}

      {showMap && (
        <CyberpunkCityMap
          playerPosition={{ x: playerPos.x, z: playerPos.z }}
          onTeleport={handleTeleport}
          onClose={handleCloseMap}
        />
      )}
    </div>
  )
}
