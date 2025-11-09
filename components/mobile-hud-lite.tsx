"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, MessageCircle, Map, Search, Home, Zap, Gem, Gamepad2, Send } from "lucide-react"
import {
  sendProximityMessage,
  sendGlobalMessage,
  subscribeToProximityChat,
  subscribeToGlobalChat,
} from "@/lib/supabase/chat-client"

interface MobileHUDLiteProps {
  userProfile: any
  playerPosition: { x: number; z: number }
  currentZone: any
  voidBalance: number
  psxBalance: number
  onOpenFullMenu: () => void
  onToggleMode?: () => void
  onMapOpen?: () => void
  onQuestOpen?: () => void
  onRealEstateOpen?: () => void
  onPowerUpOpen?: () => void
  onPledgeOpen?: () => void
  onSKUMarketOpen?: () => void
}

export function MobileHUDLite({
  userProfile,
  playerPosition,
  currentZone,
  voidBalance,
  psxBalance,
  onOpenFullMenu,
  onToggleMode,
  onMapOpen,
  onQuestOpen,
  onRealEstateOpen,
  onPowerUpOpen,
  onPledgeOpen,
  onSKUMarketOpen,
}: MobileHUDLiteProps) {
  const [proxMessages, setProxMessages] = useState<any[]>([])
  const [globalMessages, setGlobalMessages] = useState<any[]>([])
  const [proxInput, setProxInput] = useState("")
  const [globalInput, setGlobalInput] = useState("")

  useEffect(() => {
    const proxSub = subscribeToProximityChat(currentZone?.id || null, (message) => {
      setProxMessages((prev) => [...prev, message].slice(-10))
    })

    const globalSub = subscribeToGlobalChat((message) => {
      setGlobalMessages((prev) => [...prev, message].slice(-20))
    })

    return () => {
      proxSub.then((sub) => sub?.unsubscribe())
      globalSub.then((sub) => sub?.unsubscribe())
    }
  }, [currentZone])

  const handleProxSend = async () => {
    if (!proxInput.trim()) return
    await sendProximityMessage(
      userProfile.walletAddress || "0x1234",
      userProfile.username,
      proxInput,
      currentZone?.id || null,
      playerPosition,
    )
    setProxInput("")
  }

  const handleGlobalSend = async () => {
    if (!globalInput.trim()) return
    await sendGlobalMessage(userProfile.walletAddress || "0x1234", userProfile.username, globalInput)
    setGlobalInput("")
  }

  const handleAppClick = (callback: (() => void) | undefined, appName: string) => {
    if (callback) {
      callback()
    }
  }

  const apps = [
    {
      icon: <Map className="w-4 h-4" />,
      label: "M",
      name: "Map",
      onClick: () => handleAppClick(onMapOpen, "Map"),
    },
    {
      icon: <Search className="w-4 h-4" />,
      label: "Q",
      name: "Quests",
      onClick: () => handleAppClick(onQuestOpen, "Quests"),
    },
    {
      icon: <Home className="w-4 h-4" />,
      label: "R",
      name: "Real Estate",
      onClick: () => handleAppClick(onRealEstateOpen, "Real Estate"),
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "B",
      name: "Boosts",
      onClick: () => handleAppClick(onPowerUpOpen, "Boosts"),
    },
    {
      icon: <Gem className="w-4 h-4" />,
      label: "X",
      name: "PSX Pledge",
      onClick: () => handleAppClick(onPledgeOpen, "PSX Pledge"),
    },
    {
      icon: <Gamepad2 className="w-4 h-4" />,
      label: "G",
      name: "Gaming",
      onClick: () => handleAppClick(onSKUMarketOpen, "Gaming"),
    },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col">
      <motion.button
        onClick={() => {
          onToggleMode?.()
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.95)"
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
        className="fixed top-2 right-2 z-[70] pointer-events-auto rounded-xl px-4 py-2.5 flex items-center gap-1.5 shadow-[0_0_30px_rgba(6,182,212,0.8)] border-2 border-cyan-400 active:scale-95 transition-all duration-200"
        initial={{ opacity: 0, scale: 0.5, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 200 }}
        style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.3))",
          backdropFilter: "blur(10px)",
          WebkitTapHighlightColor: "transparent",
        }}
        aria-label="Switch to ROAM mode"
      >
        <span className="text-xl">🎮</span>
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-cyan-400 font-mono font-black tracking-widest leading-none">ROAM</span>
          <span className="text-[7px] text-gray-400 font-mono">TAP</span>
        </div>
      </motion.button>

      <motion.div
        className="pointer-events-auto y2k-chrome-panel m-2 rounded-lg p-1.5 mt-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border border-purple-400/50 overflow-hidden flex-shrink-0">
            {userProfile.avatarUrl?.startsWith("data:") || userProfile.avatarUrl?.startsWith("http") ? (
              <img
                src={userProfile.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm">{userProfile.avatarUrl || "👤"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="y2k-chrome-text font-bold text-[10px] truncate">{userProfile.username}</p>
            <p className="text-gray-400 font-mono text-[8px] truncate">0x572e...2f2b</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-gray-400 text-[8px]">
              📍 [{Math.floor(playerPosition.x)},{Math.floor(playerPosition.z)}]
            </p>
            <p className="text-gray-400 text-[7px]">Zone:</p>
            <p className="y2k-chrome-text font-bold text-[9px]">{currentZone?.name || "PSX HQ"}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto pointer-events-auto px-2 pb-2" style={{ scrollbarWidth: "thin" }}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="y2k-chrome-panel rounded-lg p-2" style={{ height: "70px" }}>
            <p className="text-gray-400 text-[9px] font-mono">VOID</p>
            <p className="y2k-chrome-text font-black text-lg leading-none mt-1">{(voidBalance / 1000).toFixed(1)}K</p>
            <p className="text-green-400 text-[9px] font-bold mt-1">+5.2%+</p>
          </div>

          <div className="y2k-chrome-panel rounded-lg p-2" style={{ height: "70px" }}>
            <p className="text-gray-400 text-[9px] font-mono">PSX</p>
            <p className="y2k-chrome-text font-black text-lg leading-none mt-1">{(psxBalance / 1000).toFixed(0)}K</p>
            <p className="text-gray-500 text-[8px] mt-1">+{((psxBalance * 100) / 1000).toFixed(0)}K</p>
          </div>

          <div className="y2k-chrome-panel rounded-lg p-2" style={{ height: "70px" }}>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <p className="text-gray-400 text-[8px] font-mono">ONLINE</p>
            </div>
            <p className="text-cyan-400 text-lg font-bold mt-1">3</p>
            <p className="text-gray-500 text-[8px]">online now</p>
          </div>

          <div className="y2k-chrome-panel rounded-lg p-1" style={{ height: "70px" }}>
            <div className="relative w-full h-full bg-black/60 rounded border border-cyan-500/40">
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(6,255,165,1)] animate-pulse" />
              <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-pink-400 rounded-full" />
              <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full" />
              <div className="absolute text-[7px] bottom-0.5 right-0.5 text-cyan-400 font-mono">
                [{Math.floor(playerPosition.x / 10)}.{Math.floor(playerPosition.z / 10)}]
              </div>
            </div>
          </div>
        </div>

        <div className="y2k-chrome-panel rounded-lg p-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
            <p className="text-gray-300 text-xs font-bold">PROXIMITY CHAT</p>
          </div>

          <div className="max-h-20 overflow-y-auto mb-2 space-y-1">
            {proxMessages.length === 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm border border-cyan-400/50">
                  C
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-bold">CryptoKnight</p>
                  <p className="text-gray-400 text-[9px]">0xaBc...1234</p>
                </div>
                <span className="text-[9px] text-gray-400">Gaming District</span>
              </div>
            )}
            {proxMessages.map((msg, i) => (
              <div key={i} className="text-[10px]">
                <span className="text-cyan-400 font-bold">{msg.sender_username}:</span>
                <span className="text-gray-300 ml-1">{msg.message}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              value={proxInput}
              onChange={(e) => setProxInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleProxSend()}
              placeholder="Say hi..."
              className="flex-1 bg-black/40 border border-cyan-500/30 rounded px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              onClick={handleProxSend}
              className="bg-cyan-500/20 border border-cyan-500/50 rounded p-1 hover:bg-cyan-500/30"
            >
              <Send className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        <div className="y2k-chrome-panel rounded-lg p-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-gray-300 text-xs font-bold">GLOBAL CHAT</p>
          </div>

          <div className="max-h-20 overflow-y-auto mb-2 space-y-1">
            {globalMessages.length === 0 && (
              <>
                <div className="text-[10px]">
                  <span className="text-purple-400 font-bold">VoidWalker:</span>
                  <span className="text-gray-300 ml-1">GM everyone! 🌅</span>
                </div>
                <div className="text-[10px]">
                  <span className="text-cyan-400 font-bold">PSXLord:</span>
                  <span className="text-gray-300 ml-1">Just pledged 1000 PSX 💎</span>
                </div>
              </>
            )}
            {globalMessages.map((msg, i) => (
              <div key={i} className="text-[10px]">
                <span className="text-purple-400 font-bold">{msg.sender_username}:</span>
                <span className="text-gray-300 ml-1">{msg.message}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="text"
              value={globalInput}
              onChange={(e) => setGlobalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGlobalSend()}
              placeholder="Message..."
              className="flex-1 bg-black/40 border border-purple-500/30 rounded px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/60"
            />
            <button
              onClick={handleGlobalSend}
              className="bg-purple-500/20 border border-purple-500/50 rounded p-1 hover:bg-purple-500/30"
            >
              <Send className="w-3 h-3 text-purple-400" />
            </button>
          </div>
        </div>

        <div className="y2k-chrome-panel rounded-lg p-2">
          <p className="text-gray-300 text-[9px] font-bold mb-2">APPS</p>
          <div className="grid grid-cols-6 gap-1">
            {apps.map((app, i) => (
              <button
                key={i}
                onClick={app.onClick}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.95)"
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                }}
                className="y2k-chrome-panel rounded-lg p-2 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:bg-cyan-500/10"
                style={{ height: "48px", WebkitTapHighlightColor: "transparent" }}
                aria-label={app.name}
              >
                <div className="text-cyan-400 mb-0.5">{app.icon}</div>
                <span className="text-[8px] text-gray-300 font-mono font-bold">{app.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
