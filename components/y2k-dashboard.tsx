"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Y2KDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function Y2KDashboard({ isOpen, onClose }: Y2KDashboardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto"
          initial={{ y: -800, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -800, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div
            className="mx-4 mt-4 rounded-3xl overflow-hidden relative border-2"
            style={{
              background: "linear-gradient(135deg, #0a0014 0%, #1a0033 50%, #0a0014 100%)",
              borderImage: "linear-gradient(135deg, #06FFA5, #00D9FF, #8B5CF6, #FF006E) 1",
              boxShadow: "0 20px 60px rgba(6, 255, 165, 0.2), 0 0 100px rgba(0, 217, 255, 0.15)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6, 255, 165, 0.3) 0%, rgba(0, 217, 255, 0.3) 25%, rgba(139, 92, 246, 0.3) 50%, rgba(255, 0, 110, 0.3) 75%, rgba(6, 255, 165, 0.3) 100%)",
                backgroundSize: "400% 400%",
                animation: "liquidMetalFlow 15s ease infinite",
              }}
            />

            <div className="p-6 border-b border-cyan-500/20 relative backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <h2
                  className="text-4xl font-black tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #06FFA5 0%, #00D9FF 50%, #8B5CF6 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 20px rgba(6, 255, 165, 0.5))",
                    fontFamily: "monospace",
                  }}
                >
                  Y2K DASHBOARD
                </h2>
                <button
                  onClick={onClose}
                  className="text-red-400 hover:text-red-300 transition-all text-3xl hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-cyan-400 text-sm mt-2 font-mono tracking-wider">REAL-TIME STATS • VOID ECOSYSTEM</p>
            </div>

            <div className="p-6 grid grid-cols-4 gap-4">
              <StatCard label="VOID Balance" value="10,500" change="+5.2%" icon="💎" color="cyan" />
              <StatCard label="Land Owned" value="3" change="+1" icon="🏠" color="purple" />
              <StatCard label="Items Sold" value="127" change="+12" icon="🛒" color="pink" />
              <StatCard label="Friends Online" value="8" change="" icon="👥" color="yellow" />
            </div>

            <div className="px-6 pb-6">
              <h3
                className="text-xl font-bold mb-4 tracking-tight"
                style={{
                  background: "linear-gradient(90deg, #06FFA5, #00D9FF, #FF006E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(6, 255, 165, 0.3))",
                }}
              >
                Recent Activity
              </h3>
              <div className="space-y-2">
                <ActivityItem icon="💰" text="Received 500 VOID from land rental" time="2m ago" color="#06FFA5" />
                <ActivityItem icon="🎰" text="Won 250 VOID at slot machine" time="15m ago" color="#FFD700" />
                <ActivityItem icon="🛍️" text="Purchased NFT for 100 VOID" time="1h ago" color="#FF006E" />
                <ActivityItem icon="👋" text="New friend request from Player_089" time="2h ago" color="#8338EC" />
              </div>
            </div>

            <div className="px-6 pb-6">
              <div
                className="h-48 rounded-xl relative overflow-hidden backdrop-blur-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 255, 165, 0.08), rgba(0, 217, 255, 0.08))",
                  border: "2px solid rgba(6, 255, 165, 0.3)",
                  boxShadow: "0 0 30px rgba(6, 255, 165, 0.15)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center">
                    <p className="text-cyan-400 text-lg font-bold tracking-wide">Portfolio Value</p>
                    <p className="text-white text-4xl font-black mt-2 chrome-text">$15,750</p>
                    <p className="text-green-400 text-sm mt-1 font-semibold">+12.5% this week ↑</p>
                  </div>
                </div>
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(6, 255, 165, 0.2), rgba(0, 217, 255, 0.15) 40%, transparent 70%)",
                    filter: "blur(50px)",
                  }}
                  animate={{
                    x: [0, 80, -40, 0],
                    y: [0, 40, -20, 0],
                    scale: [1, 1.15, 0.95, 1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(139, 92, 246, 0.2), rgba(255, 0, 110, 0.15) 40%, transparent 70%)",
                    filter: "blur(50px)",
                  }}
                  animate={{
                    x: [0, -60, 50, 0],
                    y: [0, -30, 40, 0],
                    scale: [1, 0.9, 1.1, 1],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes liquidMetalFlow {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatCard({ label, value, change, icon, color }: any) {
  const colors = {
    cyan: {
      bg: "rgba(6, 255, 165, 0.08)",
      border: "rgba(6, 255, 165, 0.4)",
      text: "#06FFA5",
      shadow: "rgba(6, 255, 165, 0.2)",
    },
    purple: {
      bg: "rgba(139, 92, 246, 0.08)",
      border: "rgba(139, 92, 246, 0.4)",
      text: "#8B5CF6",
      shadow: "rgba(139, 92, 246, 0.2)",
    },
    pink: {
      bg: "rgba(255, 0, 110, 0.08)",
      border: "rgba(255, 0, 110, 0.4)",
      text: "#FF006E",
      shadow: "rgba(255, 0, 110, 0.2)",
    },
    yellow: {
      bg: "rgba(255, 215, 0, 0.08)",
      border: "rgba(255, 215, 0, 0.4)",
      text: "#FFD700",
      shadow: "rgba(255, 215, 0, 0.2)",
    },
  }

  const colorScheme = colors[color as keyof typeof colors]

  return (
    <motion.div
      className="p-4 rounded-xl relative overflow-hidden backdrop-blur-sm"
      style={{
        background: colorScheme.bg,
        border: `2px solid ${colorScheme.border}`,
        boxShadow: `0 0 20px ${colorScheme.shadow}`,
      }}
      whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${colorScheme.shadow}` }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-3xl">{icon}</span>
        {change && <span className="text-green-400 text-xs font-bold px-2 py-1 rounded bg-green-400/10">{change}</span>}
      </div>
      <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black tracking-tight" style={{ color: colorScheme.text }}>
        {value}
      </p>
    </motion.div>
  )
}

function ActivityItem({ icon, text, time, color }: any) {
  return (
    <motion.div
      className="p-3 rounded-lg flex items-center gap-3 backdrop-blur-sm"
      style={{
        background: `linear-gradient(90deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}30`,
      }}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ x: 4, borderColor: `${color}60` }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-white text-sm font-medium">{text}</p>
        <p className="text-gray-500 text-xs font-mono">{time}</p>
      </div>
    </motion.div>
  )
}
