"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SKUMarketplaceProps {
  isOpen: boolean
  onClose: () => void
  voidBalance: number
  onPurchase: (sku: any) => void
}

const FEE_STRUCTURE = {
  creator: 0.45, // 45% to creator
  stakers: 0.3, // 30% to xVOID stakers
  psxTreasury: 0.15, // 15% to PSX treasury
  createDAO: 0.1, // 10% to CREATE DAO
}

const DEMO_SKUS = [
  {
    id: 1,
    name: "Neon Sword",
    creator: "CyberSmith",
    price: 250,
    thumbnail: "/neon-sword.jpg",
    rarity: "legendary",
    category: "weapon",
  },
  {
    id: 2,
    name: "Holo Jacket",
    creator: "FashionCore",
    price: 180,
    thumbnail: "/holographic-jacket.jpg",
    rarity: "epic",
    category: "clothing",
  },
  {
    id: 3,
    name: "Cyber Pet",
    creator: "PetLabs",
    price: 420,
    thumbnail: "/cyber-pet-robot.jpg",
    rarity: "legendary",
    category: "companion",
  },
  {
    id: 4,
    name: "Graffiti Pack",
    creator: "UrbanArtist",
    price: 95,
    thumbnail: "/graffiti-pack.jpg",
    rarity: "common",
    category: "cosmetic",
  },
  {
    id: 5,
    name: "Boost Module",
    creator: "TechCorp",
    price: 320,
    thumbnail: "/tech-boost-module.jpg",
    rarity: "epic",
    category: "utility",
  },
  {
    id: 6,
    name: "VIP Pass",
    creator: "GlizzyWorld",
    price: 1000,
    thumbnail: "/vip-pass-golden.jpg",
    rarity: "legendary",
    category: "access",
  },
]

export function SKUMarketplace({ isOpen, onClose, voidBalance, onPurchase }: SKUMarketplaceProps) {
  const [selectedSKU, setSelectedSKU] = useState<any>(null)

  const calculateFeeBreakdown = (price: number) => {
    return {
      creator: price * FEE_STRUCTURE.creator,
      stakers: price * FEE_STRUCTURE.stakers,
      psxTreasury: price * FEE_STRUCTURE.psxTreasury,
      createDAO: price * FEE_STRUCTURE.createDAO,
    }
  }

  const handlePurchase = (sku: any) => {
    if (voidBalance >= sku.price) {
      onPurchase(sku)
      setSelectedSKU(null)
    }
  }

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
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="w-full max-w-6xl max-h-[90vh] overflow-auto"
          >
            <div
              className="bg-gradient-to-br from-black via-cyan-950/20 to-black border-4 border-cyan-400 rounded-3xl p-8"
              style={{
                boxShadow: "0 0 60px #22D3EE80, inset 0 0 60px #22D3EE20",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-5xl font-black chrome-text mb-2">SKU Marketplace</h2>
                  <p className="text-cyan-400 font-mono text-sm">Universal content across all VOID products</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-2xl"
                >
                  ✕
                </motion.button>
              </div>

              {/* Balance */}
              <div
                className="bg-black/80 backdrop-blur-xl border-2 border-cyan-400 rounded-2xl p-4 mb-6"
                style={{ boxShadow: "0 0 30px #22D3EE40" }}
              >
                <p className="text-cyan-400 font-mono text-xs mb-1">YOUR VOID BALANCE</p>
                <p className="text-4xl font-black text-white">{voidBalance.toLocaleString()}</p>
              </div>

              {/* SKU Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {DEMO_SKUS.map((sku) => (
                  <motion.div
                    key={sku.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    onClick={() => setSelectedSKU(sku)}
                    className="bg-black/80 backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 rounded-xl p-4 cursor-pointer transition-all"
                    style={{ boxShadow: "0 0 20px #22D3EE20" }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={sku.thumbnail || "/placeholder.svg"}
                        alt={sku.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{sku.name}</h3>
                    <p className="text-cyan-400 text-xs font-mono mb-2">by {sku.creator}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-black chrome-text">{sku.price} VOID</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          sku.rarity === "legendary"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : sku.rarity === "epic"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {sku.rarity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {selectedSKU && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-60 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedSKU(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black via-purple-950/30 to-black border-4 border-purple-500 rounded-3xl p-8 max-w-2xl w-full"
                style={{ boxShadow: "0 0 60px #8B5CF680" }}
              >
                <h3 className="text-4xl font-black chrome-text mb-4">{selectedSKU.name}</h3>
                <p className="text-purple-400 font-mono text-sm mb-6">by {selectedSKU.creator}</p>

                <div
                  className="bg-black/60 backdrop-blur-xl border-2 border-purple-400 rounded-xl p-6 mb-6"
                  style={{ boxShadow: "0 0 20px #A78BFA40" }}
                >
                  <p className="text-purple-400 font-bold text-sm mb-4">FEE DISTRIBUTION BREAKDOWN:</p>
                  {Object.entries(calculateFeeBreakdown(selectedSKU.price)).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm capitalize">
                        {key === "psxTreasury" ? "PSX Treasury" : key === "createDAO" ? "CREATE DAO" : key}:
                      </span>
                      <span className="text-white font-bold">
                        {value.toFixed(2)} VOID (
                        {key === "creator" ? "45%" : key === "stakers" ? "30%" : key === "psxTreasury" ? "15%" : "10%"})
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSKU(null)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePurchase(selectedSKU)}
                    disabled={voidBalance < selectedSKU.price}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-xl disabled:cursor-not-allowed"
                    style={{ boxShadow: "0 0 30px #8B5CF680" }}
                  >
                    Purchase for {selectedSKU.price} VOID
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
