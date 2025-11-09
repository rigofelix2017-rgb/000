"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, UserPlus, Users, UserCheck, UserX, Search, MessageCircle, MapPin } from "lucide-react"
import { useAccount } from "wagmi"
import { useHaptic } from "@/lib/mobile-optimization-hooks"
import { HapticPattern } from "@/lib/mobile-optimization"

interface Friend {
  id: string
  wallet: string
  username: string
  status: "online" | "offline" | "in-game"
  location?: string
  position?: { x: number; z: number }
  lastSeen?: string
}

interface FriendRequest {
  id: string
  wallet: string
  username: string
  timestamp: string
}

interface FriendSystemProps {
  isOpen: boolean
  onClose: () => void
}

export function FriendSystem({ isOpen, onClose }: FriendSystemProps) {
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">("friends")
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      wallet: "0xabcd...1234",
      username: "CryptoKnight",
      status: "online",
      location: "PSX HQ District",
    },
    {
      id: "2",
      wallet: "0xefgh...5678",
      username: "VoidExplorer",
      status: "in-game",
      location: "DeFi District",
    },
    {
      id: "3",
      wallet: "0xijkl...9012",
      username: "MetaTrader",
      status: "offline",
      lastSeen: "2h ago",
    },
  ])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "1",
      wallet: "0xmnop...3456",
      username: "Player_042",
      timestamp: "5m ago",
    },
    {
      id: "2",
      wallet: "0xqrst...7890",
      username: "GlizzyLord",
      timestamp: "1h ago",
    },
  ])
  const { address } = useAccount()
  const walletAddress = address || ""
  const haptic = useHaptic()

  const handleSendFriendRequest = async (targetWallet: string) => {
    haptic(HapticPattern.LIGHT)
    console.log("[v0] Sending friend request to:", targetWallet)
    // TODO: Implement API call to send friend request
  }

  const handleAcceptRequest = async (requestId: string) => {
    haptic(HapticPattern.SUCCESS)
    const request = friendRequests.find((r) => r.id === requestId)
    if (request) {
      setFriends([
        ...friends,
        {
          id: requestId,
          wallet: request.wallet,
          username: request.username,
          status: "online",
        },
      ])
      setFriendRequests(friendRequests.filter((r) => r.id !== requestId))
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    haptic(HapticPattern.LIGHT)
    console.log("[v0] Rejecting friend request:", requestId)
    setFriendRequests(friendRequests.filter((r) => r.id !== requestId))
  }

  const handleRemoveFriend = async (friendId: string) => {
    haptic(HapticPattern.WARNING)
    console.log("[v0] Removing friend:", friendId)
    setFriends(friends.filter((f) => f.id !== friendId))
  }

  const filteredFriends = friends.filter(
    (f) => f.username.toLowerCase().includes(searchQuery.toLowerCase()) || f.wallet.includes(searchQuery),
  )

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(80, 80, 90, 0.7) 0%, rgba(40, 40, 50, 0.85) 100%)",
        backdropFilter: "blur(24px) saturate(180%) brightness(0.9)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-10 left-10 w-96 h-96"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 30% 40%, rgba(220, 220, 230, 0.15) 0%, transparent 50%)",
            filter: "blur(40px)",
            transform: "rotate(-25deg) skewX(-15deg)",
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 60% 70%, rgba(200, 200, 220, 0.12) 0%, transparent 45%)",
            filter: "blur(35px)",
            transform: "rotate(35deg) skewY(20deg)",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(240, 240, 250, 0.1) 0%, transparent 50%)",
            filter: "blur(30px)",
            transform: "rotate(-45deg)",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-3xl h-[80vh] rounded-2xl overflow-hidden flex flex-col relative"
        style={{
          background: "linear-gradient(135deg, rgba(100, 100, 110, 0.35) 0%, rgba(80, 80, 90, 0.4) 100%)",
          backdropFilter: "blur(32px) saturate(200%) brightness(1.05)",
          border: "3px solid rgba(255, 255, 255, 0.45)",
          boxShadow:
            "0 0 60px rgba(255, 255, 255, 0.35), 0 20px 80px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(255, 255, 255, 0.12), inset 0 4px 0 rgba(255, 255, 255, 0.6), inset 0 -4px 10px rgba(0, 0, 0, 0.3)",
        }}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3, type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              repeating-linear-gradient(13deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(77deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px),
              radial-gradient(ellipse at 25% 65%, rgba(255,255,255,0.08) 0%, transparent 45%),
              radial-gradient(ellipse at 75% 35%, rgba(255,255,255,0.06) 0%, transparent 40%)
            `,
            opacity: 0.6,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(ellipse 100% 90% at 70% 50%, rgba(255,255,255,0.12) 0%, transparent 45%)
            `,
            animation: "organicShine 12s ease-in-out infinite",
            mixBlendMode: "overlay",
          }}
        />

        <div
          className="border-b-2 px-6 py-4 relative z-10"
          style={{
            background: "linear-gradient(90deg, rgba(100,100,110,0.4) 0%, rgba(80,80,90,0.5) 100%)",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-cyan-400 [text-shadow:_0_0_30px_rgb(6_255_165_/_50%)]">
                FRIEND SYSTEM
              </h2>
              <p className="text-sm text-cyan-300/70 mt-1 font-mono">
                Connect with {friends.length} friends • {friendRequests.length} pending requests
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all duration-200 text-slate-400 hover:text-cyan-400 border border-transparent hover:border-cyan-500/30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all font-mono ${
                activeTab === "friends"
                  ? "bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,255,165,0.5)]"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-cyan-400"
              }`}
            >
              <Users className="w-4 h-4" />
              FRIENDS ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all font-mono relative ${
                activeTab === "requests"
                  ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-pink-400"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              REQUESTS ({friendRequests.length})
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                  {friendRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all font-mono ${
                activeTab === "search"
                  ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-emerald-400"
              }`}
            >
              <Search className="w-4 h-4" />
              SEARCH
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          {activeTab === "friends" && (
            <div className="space-y-3">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-mono">No friends yet. Start connecting!</p>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-xl font-bold">
                            {friend.username[0].toUpperCase()}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                              friend.status === "online"
                                ? "bg-emerald-500"
                                : friend.status === "in-game"
                                  ? "bg-yellow-500"
                                  : "bg-slate-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold font-mono">{friend.username}</p>
                          <p className="text-slate-400 text-xs font-mono">{friend.wallet}</p>
                          {friend.status === "online" || friend.status === "in-game" ? (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              <p className="text-cyan-400 text-xs font-mono">{friend.location}</p>
                            </div>
                          ) : (
                            <p className="text-slate-500 text-xs font-mono mt-1">Last seen: {friend.lastSeen}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition-all">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        {friend.status !== "offline" && (
                          <button className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 transition-all">
                            <MapPin className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-3">
              {friendRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-mono">No pending requests</p>
                </div>
              ) : (
                friendRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    className="bg-slate-800/50 border border-pink-500/20 rounded-lg p-4 hover:border-pink-500/40 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl font-bold">
                          {request.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold font-mono">{request.username}</p>
                          <p className="text-slate-400 text-xs font-mono">{request.wallet}</p>
                          <p className="text-slate-500 text-xs font-mono mt-1">{request.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-bold text-sm transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "search" && (
            <div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by username or wallet address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                />
              </div>

              <div className="space-y-3">
                {searchQuery.length > 2 && (
                  <>
                    {[
                      { wallet: "0xuv wx...4321", username: "TokenMaster" },
                      { wallet: "0xyzab...8765", username: "NFTCollector" },
                    ].map((result, i) => (
                      <motion.div
                        key={i}
                        className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/40 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xl font-bold">
                              {result.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-bold font-mono">{result.username}</p>
                              <p className="text-slate-400 text-xs font-mono">{result.wallet}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSendFriendRequest(result.wallet)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/50"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add Friend
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
                {searchQuery.length <= 2 && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-mono">Enter at least 3 characters to search</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
