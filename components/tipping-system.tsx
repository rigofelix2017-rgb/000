"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Send } from "lucide-react"

interface TippingSystemProps {
  targetPlayer: {
    id: string
    name: string
    wallet: string
  }
  userBalance: number
  isOpen: boolean
  onClose: () => void
  onTip: (amount: number) => void
}

export function TippingSystem({ targetPlayer, userBalance, isOpen, onClose, onTip }: TippingSystemProps) {
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)

  const quickAmounts = [10, 50, 100, 500]

  const handleTip = async () => {
    const tipAmount = Number.parseFloat(amount)
    if (tipAmount > 0 && tipAmount <= userBalance) {
      setIsSending(true)
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onTip(tipAmount)
      setIsSending(false)
      setAmount("")
      onClose()
    }
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
            <h2 className="text-2xl font-bold y2k-chrome-text flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Tip Player
            </h2>
            <p className="text-sm text-gray-400 font-mono">Send VOID tokens on-chain</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-400 mb-1">Tipping to:</p>
          <p className="text-xl font-bold text-white">{targetPlayer.name}</p>
          <p className="text-xs text-gray-500 font-mono truncate">{targetPlayer.wallet}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Amount (VOID)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2">
              Your balance: <span className="text-cyan-400 font-bold">{userBalance.toLocaleString()} VOID</span>
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <motion.button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-3 bg-gray-800 hover:bg-cyan-600 rounded-lg text-sm font-bold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {quickAmount}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleTip}
            disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > userBalance || isSending}
            className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isSending
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Tip
              </>
            )}
          </motion.button>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong className="text-cyan-400">On-Chain Tip:</strong> This transaction will be recorded on the
              blockchain. Gas fees may apply.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
