"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const APPS = [
  { id: "map", name: "Map", icon: "📍", color: "#06FFA5" },
  { id: "shop", name: "Shop", icon: "🛒", color: "#FF006E" },
  { id: "chat", name: "Chat", icon: "💬", color: "#3A86FF" },
  { id: "games", name: "Games", icon: "🎮", color: "#FFD700" },
  { id: "friends", name: "Friends", icon: "👥", color: "#F72585" },
  { id: "land", name: "My Land", icon: "🏠", color: "#8338EC" },
  { id: "settings", name: "Settings", icon: "⚙️", color: "#8D99AE" },
  { id: "stats", name: "Stats", icon: "📊", color: "#06FFA5" },
  { id: "dex", name: "DEX", icon: "💱", color: "#FFD700" },
  { id: "signals", name: "SIGNALS", icon: "📡", color: "#FF006E", external: true },
  { id: "events", name: "EVENTS", icon: "🎫", color: "#F72585", external: true },
  { id: "flix", name: "FLIX", icon: "📺", color: "#8338EC", external: true },
]

const NOTIFICATIONS = [
  { id: "1", title: "Item Sold", message: "Your NFT sold for 500 VOID", time: "2m ago" },
  { id: "2", title: "New Friend Request", message: "Player_042 wants to connect", time: "5m ago" },
  { id: "3", title: "Event Starting", message: "Concert in 10 minutes", time: "10m ago" },
]

interface PhoneInterfaceProps {
  isOpen: boolean
  onClose: () => void
  onOpenGame: (game: string) => void
}

export function PhoneInterface({ isOpen, onClose, onOpenGame }: PhoneInterfaceProps) {
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-0 top-0 h-screen w-[420px] z-50"
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Phone Frame */}
          <div
            className="h-full bg-black/95 backdrop-blur-xl border-l-4 overflow-hidden relative"
            style={{
              borderImage: "linear-gradient(180deg, #06FFA5, #FF006E, #FFD700) 1",
              boxShadow: "0 0 40px rgba(6, 255, 165, 0.5), inset 0 0 40px rgba(255, 0, 110, 0.2)",
            }}
          >
            {/* Status Bar */}
            <div
              className="px-4 py-3 flex justify-between items-center relative"
              style={{
                background: "linear-gradient(135deg, #1a0033 0%, #0a0014 100%)",
              }}
            >
              <div className="flex gap-3">
                <span className="text-cyan-400 text-lg">📶</span>
                <span className="text-green-400 text-lg">🔋</span>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                  <span className="text-yellow-400 text-lg">🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {NOTIFICATIONS.length}
                  </span>
                </button>
              </div>
              <div className="text-cyan-400 font-mono text-sm">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute top-16 left-0 right-0 z-10 max-h-[300px] overflow-y-auto"
                  initial={{ y: -300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  {NOTIFICATIONS.map((notif, index) => (
                    <motion.div
                      key={notif.id}
                      className="mx-2 mt-2 p-3 rounded-lg overflow-hidden backdrop-blur-xl border"
                      style={{
                        background: "linear-gradient(135deg, rgba(6, 255, 165, 0.1), rgba(255, 0, 110, 0.1))",
                        borderColor: "rgba(6, 255, 165, 0.3)",
                      }}
                      initial={{ x: -400, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-cyan-400 font-bold text-sm">{notif.title}</h4>
                        <span className="text-gray-500 text-xs">{notif.time}</span>
                      </div>
                      <p className="text-gray-300 text-xs">{notif.message}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* App Screen */}
            <div className="h-[calc(100%-140px)] p-4 overflow-y-auto">
              {currentApp ? (
                <AppRenderer appId={currentApp} onBack={() => setCurrentApp(null)} onOpenGame={onOpenGame} />
              ) : (
                <motion.div className="grid grid-cols-4 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {APPS.map((app, index) => (
                    <motion.button
                      key={app.id}
                      onClick={() => {
                        if (app.id === "games") {
                          setCurrentApp("games")
                        } else if (app.id === "shop") {
                          onOpenGame("shop")
                          onClose()
                        } else if (app.id === "dex") {
                          setCurrentApp("dex")
                        } else {
                          setCurrentApp(app.id)
                        }
                      }}
                      className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${app.color}20, ${app.color}05)`,
                        border: `2px solid ${app.color}40`,
                        boxShadow: `0 0 20px ${app.color}40`,
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.05, type: "spring" }}
                    >
                      {app.external && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                      <span className="text-4xl">{app.icon}</span>
                      <span className="text-white text-xs font-mono">{app.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Navigation Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-4 flex justify-around"
              style={{
                background: "linear-gradient(135deg, #1a0033 0%, #0a0014 100%)",
                borderTop: "2px solid rgba(6, 255, 165, 0.3)",
              }}
            >
              <button
                onClick={() => setCurrentApp(null)}
                className="text-cyan-400 hover:text-cyan-300 transition flex flex-col items-center gap-1"
              >
                <span className="text-xl">🏠</span>
                <span className="text-xs">Home</span>
              </button>
              {currentApp && (
                <button
                  onClick={() => setCurrentApp(null)}
                  className="text-purple-400 hover:text-purple-300 transition flex flex-col items-center gap-1"
                >
                  <span className="text-xl">⬅️</span>
                  <span className="text-xs">Back</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-red-400 hover:text-red-300 transition flex flex-col items-center gap-1"
              >
                <span className="text-xl">✕</span>
                <span className="text-xs">Close</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AppRenderer({ appId, onBack, onOpenGame }: any) {
  if (appId === "games") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Casino Games
        </h2>
        <div className="space-y-3">
          <GameCard
            name="Slot Machine"
            icon="🎰"
            color="#FF006E"
            onClick={() => {
              onOpenGame("slots")
              onBack()
            }}
          />
          <GameCard
            name="Dice Roll"
            icon="🎲"
            color="#FFD700"
            onClick={() => {
              onOpenGame("dice")
              onBack()
            }}
          />
          <GameCard
            name="Poker"
            icon="🃏"
            color="#8338EC"
            onClick={() => {
              onOpenGame("poker")
              onBack()
            }}
          />
        </div>
      </div>
    )
  }

  if (appId === "dex") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
          VOID DEX
        </h2>
        <div className="bg-black/50 rounded-lg p-4 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm mb-2">Swap Tokens</p>
          <div className="space-y-2">
            <input type="number" placeholder="0.0" className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg" />
            <div className="text-center text-purple-400">⇅</div>
            <input type="number" placeholder="0.0" className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg" />
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-bold">
              Swap
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center">0.20% fee • V4 Hooks Active</div>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <p className="text-gray-400">App content for {appId}</p>
      <p className="text-xs text-gray-600 mt-2">Coming soon...</p>
    </div>
  )
}

function GameCard({ name, icon, color, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full p-4 rounded-lg flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}05)`,
        border: `2px solid ${color}40`,
        boxShadow: `0 0 20px ${color}40`,
      }}
      whileHover={{ x: 5 }}
    >
      <span className="text-5xl">{icon}</span>
      <div className="flex-1 text-left">
        <h3 className="text-white font-bold">{name}</h3>
        <p className="text-gray-400 text-xs">Click to play</p>
      </div>
      <span className="text-white text-2xl">▶</span>
    </motion.button>
  )
}
