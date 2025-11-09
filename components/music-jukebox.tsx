"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Music, Play, Pause, SkipForward, ThumbsUp, Volume2 } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  url: string
  votes: number
  addedBy: string
}

interface MusicJukeboxProps {
  isOpen: boolean
  onClose: () => void
  voidBalance: number
  onVote: (trackId: string, cost: number) => void
}

export function MusicJukebox({ isOpen, onClose, voidBalance, onVote }: MusicJukeboxProps) {
  const [tracks, setTracks] = useState<Track[]>([
    { id: "1", title: "Neon Dreams", artist: "Synthwave Collective", url: "#", votes: 12, addedBy: "CryptoKnight" },
    { id: "2", title: "Digital Void", artist: "Cyber Beats", url: "#", votes: 8, addedBy: "MetaBuilder" },
    { id: "3", title: "Future City", artist: "Retro Wave", url: "#", votes: 15, addedBy: "VoidExplorer" },
    { id: "4", title: "Chrome Hearts", artist: "Y2K Vibes", url: "#", votes: 6, addedBy: "NeonRunner" },
  ])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const voteCost = 10

  const handleVote = (trackId: string) => {
    if (voidBalance >= voteCost) {
      setTracks((prev) =>
        prev
          .map((track) => (track.id === trackId ? { ...track, votes: track.votes + 1 } : track))
          .sort((a, b) => b.votes - a.votes),
      )
      onVote(trackId, voteCost)
    }
  }

  const handleNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id)
    const nextTrack = tracks[(currentIndex + 1) % tracks.length]
    setCurrentTrack(nextTrack)
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
        className="y2k-chrome-panel p-6 w-full max-w-2xl rounded-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold y2k-chrome-text flex items-center gap-2">
              <Music className="w-6 h-6" />
              Community Jukebox
            </h2>
            <p className="text-sm text-gray-400 font-mono">Vote for tracks with VOID tokens</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {currentTrack && (
          <div className="bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-2 border-purple-500/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Music className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Now Playing</p>
                <p className="text-xl font-bold text-white">{currentTrack.title}</p>
                <p className="text-sm text-gray-300">{currentTrack.artist}</p>
                <p className="text-xs text-gray-500 mt-1">Added by {currentTrack.addedBy}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400 w-12">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Queue (Vote to prioritize)</h3>
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                track.id === currentTrack?.id
                  ? "bg-cyan-500/20 border-2 border-cyan-500/50"
                  : "bg-black/40 border border-gray-700 hover:border-cyan-500/30"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                <div>
                  <p className="font-bold text-white">{track.title}</p>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                  <p className="text-xs text-gray-500">by {track.addedBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{track.votes}</p>
                  <p className="text-xs text-gray-500">votes</p>
                </div>
                <motion.button
                  onClick={() => handleVote(track.id)}
                  disabled={voidBalance < voteCost}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                    voidBalance < voteCost
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{voteCost}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <p className="text-xs text-gray-300">
            <strong className="text-purple-400">Your balance:</strong> {voidBalance.toLocaleString()} VOID • Voting
            costs {voteCost} VOID per track
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
