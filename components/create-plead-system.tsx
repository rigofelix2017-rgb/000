"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Coins } from "lucide-react"

interface CreatePleadSystemProps {
  isOpen: boolean
  onClose: () => void
  onEarnVoid: (amount: number) => void
}

export function CreatePleadSystem({ isOpen, onClose, onEarnVoid }: CreatePleadSystemProps) {
  const [pledContent, setPledContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState(0)

  const handleSubmit = async () => {
    if (pledContent.length < 10) return

    setIsSubmitting(true)

    // Calculate VOID earned based on content length and quality
    const wordCount = pledContent.trim().split(/\s+/).length
    const baseReward = 50
    const wordBonus = Math.min(wordCount * 2, 200) // Max 200 bonus
    const totalEarned = baseReward + wordBonus

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setEarnedAmount(totalEarned)
    onEarnVoid(totalEarned)

    setTimeout(() => {
      setPledContent("")
      setEarnedAmount(0)
      setIsSubmitting(false)
      onClose()
    }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="y2k-chrome-panel w-full max-w-2xl rounded-2xl overflow-hidden relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative px-6 py-4 flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, rgba(80, 80, 90, 0.35), rgba(70, 70, 85, 0.3))",
                borderBottom: "2px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-cyan-400" style={{ filter: "drop-shadow(0 0 10px #22D3EE)" }} />
                <h2
                  className="text-xl font-black font-mono"
                  style={{
                    background: "linear-gradient(135deg, #FFFFFF, #22D3EE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))",
                  }}
                >
                  CREATE & PLEAD
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                style={{ color: "#EF4444" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-white font-mono text-sm">Share your creation, earn VOID tokens</p>
                <p className="text-gray-400 text-xs mt-1">Minimum 10 words • Earn 50-250 VOID per plead</p>
              </div>

              {!earnedAmount ? (
                <>
                  <div>
                    <textarea
                      value={pledContent}
                      onChange={(e) => setPledContent(e.target.value)}
                      placeholder="Share your creative work, idea, or contribution to the VOID metaverse..."
                      className="w-full h-48 rounded-xl p-4 font-mono text-sm resize-none"
                      style={{
                        background: "rgba(30, 30, 40, 0.6)",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                        color: "#FFFFFF",
                      }}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400">
                        {
                          pledContent
                            .trim()
                            .split(/\s+/)
                            .filter((w) => w.length > 0).length
                        }{" "}
                        words
                      </p>
                      <p className="text-xs text-cyan-400">
                        Potential: {50 + Math.min(pledContent.trim().split(/\s+/).length * 2, 200)} VOID
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={pledContent.length < 10 || isSubmitting}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting
                        ? "rgba(34, 211, 238, 0.3)"
                        : "linear-gradient(135deg, #22D3EE, #06FFA5)",
                      color: "#000000",
                      boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)",
                    }}
                  >
                    {isSubmitting ? "SUBMITTING..." : "PLEAD & EARN VOID"}
                  </button>
                </>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Coins
                      className="w-20 h-20 mx-auto text-cyan-400"
                      style={{ filter: "drop-shadow(0 0 20px #22D3EE)" }}
                    />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mt-6">VOID EARNED!</h3>
                  <p className="text-5xl font-black y2k-chrome-text mt-4">+{earnedAmount} VOID</p>
                  <p className="text-gray-400 text-sm mt-2">Your plead has been recorded</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
