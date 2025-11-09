"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCoinbaseWallet } from "./coinbase-wallet-provider"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnected: (address: string, method: "privy" | "coinbase") => void
}

export function WalletConnectionModal({ isOpen, onClose, onConnected }: WalletConnectionModalProps) {
  const { connect, isConnecting } = useCoinbaseWallet()
  const [selectedMethod, setSelectedMethod] = useState<"privy" | "coinbase" | null>(null)

  const handleCoinbaseConnect = async () => {
    setSelectedMethod("coinbase")
    await connect()

    // Check if connected
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        onConnected(accounts[0], "coinbase")
        onClose()
      }
    }
    setSelectedMethod(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-cyan-500/30"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: "0 0 50px rgba(6, 255, 165, 0.3)",
            }}
          >
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              Connect Wallet
            </h2>
            <p className="text-gray-400 text-sm mb-6">Choose your preferred wallet connection method</p>

            <div className="space-y-3">
              {/* Coinbase Wallet */}
              <motion.button
                onClick={handleCoinbaseConnect}
                disabled={isConnecting || selectedMethod === "coinbase"}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-blue-400/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🟦</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-bold text-lg">Coinbase Wallet</h3>
                    <p className="text-blue-200 text-xs">Secure & self-custodial</p>
                  </div>
                  {selectedMethod === "coinbase" && (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </motion.button>

              {/* Privy (Existing) */}
              <motion.button
                onClick={() => {
                  setSelectedMethod("privy")
                  // Trigger existing Privy connection flow
                  onConnected("", "privy")
                  onClose()
                }}
                disabled={isConnecting || selectedMethod === "privy"}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-purple-400/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-bold text-lg">Privy</h3>
                    <p className="text-purple-200 text-xs">Email & social login</p>
                  </div>
                  {selectedMethod === "privy" && (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </motion.button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By connecting, you agree to the VOID Terms of Service
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
