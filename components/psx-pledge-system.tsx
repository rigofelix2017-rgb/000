"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PSXPledgeSystemProps {
  isOpen: boolean
  onClose: () => void
  psxBalance: number
  voidBalance: number
  onPledge: (amount: number) => void
}

const CONVERSION_RATE = 100 // 1 PSX = 100 VOID

export function PSXPledgeSystem({ isOpen, onClose, psxBalance, voidBalance, onPledge }: PSXPledgeSystemProps) {
  const [pledgeAmount, setPledgeAmount] = useState("")

  const handlePledge = () => {
    const amount = Number.parseFloat(pledgeAmount)
    if (amount > 0 && amount <= psxBalance) {
      onPledge(amount)
      setPledgeAmount("")
    }
  }

  const voidReceived = (Number.parseFloat(pledgeAmount) || 0) * CONVERSION_RATE

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="w-full max-w-2xl"
          >
            <div
              className="bg-gradient-to-br from-black via-purple-950/20 to-black border-4 border-purple-500 rounded-3xl p-8"
              style={{
                boxShadow: "0 0 60px #8B5CF680, inset 0 0 60px #8B5CF620",
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-5xl font-black chrome-text mb-2">PSX Pledging</h2>
                <p className="text-purple-400 font-mono text-sm">Convert PSX → VOID at 1:100 ratio (Irreversible)</p>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div
                  className="bg-black/60 backdrop-blur-xl border-2 border-purple-400 rounded-xl p-4"
                  style={{ boxShadow: "0 0 20px #A78BFA40" }}
                >
                  <p className="text-purple-400 text-xs font-mono mb-1">PSX BALANCE</p>
                  <p className="text-3xl font-black text-white">{psxBalance.toLocaleString()}</p>
                </div>
                <div
                  className="bg-black/60 backdrop-blur-xl border-2 border-cyan-400 rounded-xl p-4"
                  style={{ boxShadow: "0 0 20px #22D3EE40" }}
                >
                  <p className="text-cyan-400 text-xs font-mono mb-1">VOID BALANCE</p>
                  <p className="text-3xl font-black text-white">{voidBalance.toLocaleString()}</p>
                </div>
              </div>

              {/* Conversion Calculator */}
              <div
                className="bg-black/80 backdrop-blur-xl border-2 border-purple-500 rounded-2xl p-6 mb-6"
                style={{ boxShadow: "0 0 30px #8B5CF640" }}
              >
                <div className="mb-4">
                  <label className="text-purple-400 font-bold text-sm mb-2 block">PLEDGE AMOUNT (PSX)</label>
                  <input
                    type="number"
                    value={pledgeAmount}
                    onChange={(e) => setPledgeAmount(e.target.value)}
                    placeholder="0"
                    max={psxBalance}
                    className="w-full bg-black/60 border-2 border-purple-400 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:border-purple-300 focus:outline-none"
                    style={{ boxShadow: "inset 0 0 20px #8B5CF620" }}
                  />
                </div>

                <div className="flex items-center justify-center my-4">
                  <div className="text-4xl">⬇️</div>
                </div>

                <div
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 rounded-xl p-4"
                  style={{ boxShadow: "0 0 30px #22D3EE40" }}
                >
                  <p className="text-cyan-400 font-bold text-sm mb-2">YOU WILL RECEIVE</p>
                  <p className="text-5xl font-black chrome-text">{voidReceived.toLocaleString()}</p>
                  <p className="text-cyan-300 text-sm mt-1">VOID</p>
                </div>
              </div>

              {/* Warning */}
              <div
                className="bg-red-950/30 border-2 border-red-500 rounded-xl p-4 mb-6"
                style={{ boxShadow: "0 0 20px #EF444440" }}
              >
                <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                  ⚠️ WARNING: This action is IRREVERSIBLE
                </p>
                <p className="text-red-300 text-xs mt-1">
                  Once pledged, PSX cannot be recovered. The conversion is one-way only.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePledge}
                  disabled={
                    !pledgeAmount ||
                    Number.parseFloat(pledgeAmount) <= 0 ||
                    Number.parseFloat(pledgeAmount) > psxBalance
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl transition-all disabled:cursor-not-allowed"
                  style={{
                    boxShadow: "0 0 30px #8B5CF680",
                  }}
                >
                  Pledge PSX → VOID
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
