"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useViewport } from "@/hooks/use-viewport"
import { Wallet, ArrowRight } from "lucide-react"

interface BaseWalletModalProps {
  onComplete: () => void
}

export function BaseWalletModal({ onComplete }: BaseWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<"privy" | null>(null)
  const { login } = usePrivy()
  const viewport = useViewport()

  const handleWalletConnect = async () => {
    setSelectedMethod("privy")
    setIsConnecting(true)
    try {
      await login()
      setTimeout(onComplete, 1000)
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      setIsConnecting(false)
      setSelectedMethod(null)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(6, 255, 165, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 217, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255, 0, 110, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      <motion.div
        className={`relative z-10 w-full ${viewport.isMobile ? "max-w-sm mx-4" : "max-w-lg mx-8"}`}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div
          className={`bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl ${viewport.isMobile ? "p-6" : "p-8"} border-2 border-cyan-500/30`}
          style={{
            boxShadow: "0 0 50px rgba(6, 255, 165, 0.3)",
          }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Wallet className={`${viewport.isMobile ? "w-12 h-12" : "w-16 h-16"} text-cyan-400`} />
            </motion.div>
            <h2
              className={`${viewport.isMobile ? "text-2xl" : "text-3xl"} font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2`}
            >
              Connect to Base
            </h2>
            <p className={`text-gray-400 ${viewport.isMobile ? "text-xs" : "text-sm"}`}>
              Connect your wallet to access the VOID Metaverse on Base blockchain
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <motion.button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className={`w-full ${viewport.isMobile ? "p-3" : "p-4"} rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-2 border-blue-400/30`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`${viewport.isMobile ? "w-10 h-10" : "w-12 h-12"} bg-white rounded-xl flex items-center justify-center`}
                >
                  <span className={viewport.isMobile ? "text-xl" : "text-2xl"}>🔵</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-white font-bold ${viewport.isMobile ? "text-sm" : "text-lg"}`}>
                    Connect Wallet
                  </h3>
                  <p className={`text-blue-200 ${viewport.isMobile ? "text-[10px]" : "text-xs"}`}>
                    Coinbase, MetaMask & More
                  </p>
                </div>
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-white" />
                )}
              </div>
            </motion.button>
          </div>

          <button
            onClick={handleSkip}
            disabled={isConnecting}
            className={`w-full ${viewport.isMobile ? "py-2 text-sm" : "py-3 text-base"} text-gray-400 hover:text-white transition-colors disabled:opacity-50`}
          >
            Skip for now
          </button>

          <p className={`${viewport.isMobile ? "text-[10px]" : "text-xs"} text-gray-500 text-center mt-4`}>
            By connecting, you agree to the VOID Terms of Service
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
