"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX, Users } from "lucide-react"

interface Player {
  id: string
  name: string
  position: { x: number; z: number }
  isSpeaking: boolean
  volume: number
}

interface VoiceChatSystemProps {
  currentPosition: { x: number; z: number }
  proximityRadius?: number
  isOpen: boolean
  onClose: () => void
}

export function VoiceChatSystem({ currentPosition, proximityRadius = 20, isOpen, onClose }: VoiceChatSystemProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([])
  const [activeConnections, setActiveConnections] = useState(0)
  const mediaStream = useRef<MediaStream | null>(null)
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())

  useEffect(() => {
    // Mock nearby players for demo
    setNearbyPlayers([
      { id: "1", name: "CryptoKnight", position: { x: 5, z: 3 }, isSpeaking: false, volume: 0.8 },
      { id: "2", name: "VoidExplorer", position: { x: -2, z: 8 }, isSpeaking: true, volume: 0.6 },
      { id: "3", name: "MetaBuilder", position: { x: 10, z: -5 }, isSpeaking: false, volume: 0.4 },
    ])
  }, [])

  const startVoiceChat = async () => {
    try {
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsEnabled(true)
      setActiveConnections(nearbyPlayers.length)
    } catch (err) {
      console.error("[v0] Failed to access microphone:", err)
    }
  }

  const stopVoiceChat = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop())
      mediaStream.current = null
    }
    peerConnections.current.forEach((pc) => pc.close())
    peerConnections.current.clear()
    setIsEnabled(false)
    setActiveConnections(0)
  }

  const toggleMute = () => {
    if (mediaStream.current) {
      mediaStream.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const getDistance = (player: Player) => {
    const dx = player.position.x - currentPosition.x
    const dz = player.position.z - currentPosition.z
    return Math.sqrt(dx * dx + dz * dz)
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="y2k-chrome-panel p-6 w-full max-w-md rounded-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold y2k-chrome-text">Proximity Voice</h2>
            <p className="text-sm text-gray-400 font-mono">
              {isEnabled ? `${activeConnections} active connections` : "WebRTC Voice Chat"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <motion.button
              onClick={isEnabled ? stopVoiceChat : startVoiceChat}
              className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isEnabled
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isEnabled ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isEnabled ? "Disconnect" : "Connect"}
            </motion.button>

            {isEnabled && (
              <motion.button
                onClick={toggleMute}
                className={`py-4 px-6 rounded-xl font-bold flex items-center justify-center transition-all ${
                  isMuted ? "bg-gray-700 hover:bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>
            )}
          </div>

          <div className="bg-black/40 rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-gray-300">Nearby Players ({nearbyPlayers.length})</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {nearbyPlayers.map((player) => {
                const distance = getDistance(player)
                const inRange = distance <= proximityRadius

                return (
                  <motion.div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                      inRange ? "bg-cyan-500/10 border border-cyan-500/30" : "bg-gray-800/50 opacity-50"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${player.isSpeaking ? "bg-green-400 animate-pulse" : "bg-gray-600"}`}
                      />
                      <span className="text-sm font-mono text-white">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{distance.toFixed(1)}m</span>
                      {inRange && (
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{ width: `${player.volume * 100}%` }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-purple-400">Proximity Voice:</strong> Players within {proximityRadius}m radius can
              hear you. Volume decreases with distance.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
