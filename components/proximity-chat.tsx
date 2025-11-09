"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { sendProximityMessage, subscribeToProximityChat } from "@/lib/supabase/chat-client"
import { useViewport } from "@/hooks/use-viewport"
import { useHaptic } from "@/lib/mobile-optimization-hooks"
import { HapticPattern } from "@/lib/mobile-optimization"

interface Message {
  id: string
  user: string
  text: string
  timestamp: number
  distance: number
}

interface ProximityChatProps {
  playerPosition: { x: number; z: number }
  currentZone?: any
  isOpen?: boolean
  onClose?: () => void
}

const EMOTES = [
  { id: "wave", icon: "👋", label: "Wave" },
  { id: "dance", icon: "💃", label: "Dance" },
  { id: "celebrate", icon: "🎉", label: "Celebrate" },
  { id: "thumbsup", icon: "👍", label: "Thumbs Up" },
  { id: "love", icon: "❤️", label: "Love" },
  { id: "laugh", icon: "😂", label: "Laugh" },
]

const DEMO_USERS = [
  { name: "CryptoKing", position: { x: 15, z: 10 } },
  { name: "NeonDreamer", position: { x: -20, z: -15 } },
  { name: "VoidWalker", position: { x: 35, z: -25 } },
  { name: "PixelMaster", position: { x: -40, z: 30 } },
]

export function ProximityChat({ playerPosition, currentZone, isOpen = false, onClose }: ProximityChatProps) {
  const viewport = useViewport()
  const haptic = useHaptic()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showEmotes, setShowEmotes] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentDistrict = currentZone?.name || "Gaming District"
  const isMobile = viewport.isMobile

  const calculateDistance = (pos1: { x: number; z: number }, pos2: { x: number; z: number }) => {
    const dx = pos1.x - pos2.x
    const dz = pos1.z - pos2.z
    return Math.sqrt(dx * dx + dz * dz)
  }

  const addDemoMessage = () => {
    const demoMessages = [
      "Hey, anyone want to trade?",
      "This metaverse is incredible!",
      "Where's the casino?",
      "Anyone seen the new power-ups?",
      "LFG!",
      "Just bought a hover car!",
    ]

    const randomUser = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)]
    const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)]
    const distance = calculateDistance(playerPosition, randomUser.position)

    if (distance < 50) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: randomUser.name,
        text: randomMessage,
        timestamp: Date.now(),
        distance,
      }

      setMessages((prev) => [...prev, newMessage])
    }
  }

  useEffect(() => {
    const interval = setInterval(addDemoMessage, 5000 + Math.random() * 10000)
    return () => clearInterval(interval)
  }, [playerPosition])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!currentDistrict) return

    const subscription = subscribeToProximityChat(currentDistrict, (message) => {
      const distance = calculateDistance(playerPosition, {
        x: message.position_x || 0,
        z: message.position_z || 0,
      })

      if (distance < 50) {
        const newMessage: Message = {
          id: message.id,
          user: message.sender_username,
          text: message.message,
          timestamp: new Date(message.created_at).getTime(),
          distance,
        }
        setMessages((prev) => [...prev.slice(-20), newMessage])
      }
    })

    return () => {
      subscription.then((sub) => sub?.unsubscribe())
    }
  }, [currentDistrict, playerPosition])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    haptic(HapticPattern.LIGHT)
    await sendProximityMessage("0x1234...5678", "You", inputValue, currentDistrict, playerPosition)

    setInputValue("")
  }

  const handleEmote = async (emote: (typeof EMOTES)[0]) => {
    haptic(HapticPattern.MEDIUM)
    await sendProximityMessage("0x1234...5678", "You", `${emote.icon} ${emote.label}`, currentDistrict, playerPosition)

    setShowEmotes(false)
  }

  if (isOpen && onClose) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ paddingBottom: viewport.isMobile ? "env(safe-area-inset-bottom)" : 0 }}
      >
        <motion.div
          className={`w-full ${isMobile ? "max-w-sm" : "max-w-md"} max-h-[85vh]`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div className="y2k-chrome-panel rounded-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <div>
                    <h3 className="y2k-chrome-text font-black text-sm">PROXIMITY CHAT</h3>
                    <p className="text-gray-300 text-[10px] font-mono">Range: 50m • {DEMO_USERS.length} nearby</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`${viewport.isMobile ? "p-2 text-xl" : "p-1.5"} hover:bg-white/10 rounded transition-colors`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={`${isMobile ? "h-80" : "h-96"} overflow-y-auto p-3 space-y-2`}>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex flex-col ${message.user === "You" ? "items-end" : "items-start"}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`${viewport.isMobile ? "text-sm" : "text-xs"} font-bold ${message.user === "You" ? "text-purple-400" : "text-cyan-400"}`}
                      >
                        {message.user}
                      </p>
                      {message.distance > 0 && (
                        <p className={`${viewport.isMobile ? "text-sm" : "text-xs"} text-gray-500 font-mono`}>
                          {Math.floor(message.distance)}m
                        </p>
                      )}
                    </div>
                    <div
                      className={`rounded-xl ${viewport.isMobile ? "px-4 py-3" : "px-3 py-2"} max-w-xs ${
                        message.user === "You"
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      <p className={`${viewport.isMobile ? "text-base" : "text-sm"} break-words`}>{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {showEmotes && (
                <motion.div
                  className={`border-t border-purple-400/50 bg-black/80 ${viewport.isMobile ? "p-3" : "p-2"}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="grid grid-cols-6 gap-2">
                    {EMOTES.map((emote) => (
                      <motion.button
                        key={emote.id}
                        className={`aspect-square rounded-lg border border-purple-400/50 bg-gray-900 hover:bg-purple-900/50 hover:border-purple-400 transition-colors flex items-center justify-center ${viewport.isMobile ? "text-2xl" : "text-xl"}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEmote(emote)}
                      >
                        {emote.icon}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-3 border-t border-white/20 bg-gradient-to-r from-white/10 to-transparent">
              <div className="flex gap-2">
                <motion.button
                  className="w-10 h-10 rounded-lg border border-white/40 text-white/80 text-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEmotes(!showEmotes)}
                >
                  😀
                </motion.button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 rounded-lg border border-white/30 bg-black/60 text-white placeholder-gray-400 focus:border-white/60 focus:outline-none font-mono text-sm"
                />
                <motion.button
                  className="px-4 py-2 rounded-lg border border-white/50 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold hover:from-gray-300 hover:to-gray-400 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                >
                  SEND
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-4 py-3 y2k-chrome-panel rounded-lg transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div className="text-left">
              <div className="font-bold y2k-chrome-text text-sm">PROXIMITY CHAT</div>
              <div className="text-xs text-gray-300/70">Range: 50m • {DEMO_USERS.length} nearby</div>
            </div>
          </div>
          <ChevronUp className="w-5 h-5 text-white/70" />
        </button>
      ) : (
        <motion.div
          className="y2k-chrome-panel rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-3 border-b border-white/20 bg-gradient-to-r from-white/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <h3 className="y2k-chrome-text font-black text-sm">PROXIMITY CHAT</h3>
                  <p className="text-gray-300 text-[10px] font-mono">Range: 50m • {DEMO_USERS.length} nearby</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-3 space-y-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex flex-col ${message.user === "You" ? "items-end" : "items-start"}`}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-xs font-bold ${message.user === "You" ? "text-purple-400" : "text-cyan-400"}`}>
                      {message.user}
                    </p>
                    {message.distance > 0 && (
                      <p className="text-xs text-gray-500 font-mono">{Math.floor(message.distance)}m</p>
                    )}
                  </div>
                  <div
                    className={`rounded-xl px-3 py-2 max-w-xs ${
                      message.user === "You"
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <AnimatePresence>
            {showEmotes && (
              <motion.div
                className="border-t border-purple-400/50 bg-black/80 p-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="grid grid-cols-6 gap-2">
                  {EMOTES.map((emote) => (
                    <motion.button
                      key={emote.id}
                      className="aspect-square rounded-lg border border-purple-400/50 bg-gray-900 hover:bg-purple-900/50 hover:border-purple-400 transition-colors flex items-center justify-center text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmote(emote)}
                    >
                      {emote.icon}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-3 border-t border-white/20 bg-gradient-to-r from-white/10 to-transparent">
            <div className="flex gap-2">
              <motion.button
                className="w-8 h-8 rounded-lg border border-white/40 text-white/80 text-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmotes(!showEmotes)}
              >
                😀
              </motion.button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type message..."
                className="flex-1 px-3 py-2 rounded-lg border border-white/30 bg-black/60 text-white placeholder-gray-400 focus:border-white/60 focus:outline-none font-mono text-sm"
              />
              <motion.button
                className="px-4 py-2 rounded-lg border border-white/50 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold hover:from-gray-300 hover:to-gray-400 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
              >
                SEND
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
