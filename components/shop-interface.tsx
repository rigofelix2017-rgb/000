"use client"

import { motion } from "framer-motion"

const SKUS = [
  { id: 1, name: "Cyber Sword", price: 50, icon: "⚔️", rarity: "Legendary" },
  { id: 2, name: "Neon Wings", price: 100, icon: "🦋", rarity: "Epic" },
  { id: 3, name: "Hologram Pet", price: 25, icon: "🐕", rarity: "Rare" },
  { id: 4, name: "Pixel Hat", price: 15, icon: "🎩", rarity: "Common" },
  { id: 5, name: "Glitch Emote", price: 30, icon: "✨", rarity: "Rare" },
  { id: 6, name: "Quantum Bike", price: 200, icon: "🏍️", rarity: "Legendary" },
]

export function ShopInterface({ onClose }: any) {
  return (
    <div className="bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 rounded-2xl p-8 max-w-6xl mx-auto border-4 border-pink-400 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-black text-pink-400">🛒 SKU MARKETPLACE</h2>
        <button onClick={onClose} className="text-white text-2xl">
          ✕
        </button>
      </div>

      <p className="text-gray-300 mb-6">Buy once, use everywhere in the VOID ecosystem</p>

      <div className="grid grid-cols-3 gap-4">
        {SKUS.map((sku, index) => (
          <motion.div
            key={sku.id}
            className="bg-black/50 rounded-xl p-6 border-2 border-pink-500/30 hover:border-pink-500 transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{sku.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{sku.name}</h3>
              <p
                className={`text-xs mb-3 ${
                  sku.rarity === "Legendary"
                    ? "text-yellow-400"
                    : sku.rarity === "Epic"
                      ? "text-purple-400"
                      : sku.rarity === "Rare"
                        ? "text-blue-400"
                        : "text-gray-400"
                }`}
              >
                {sku.rarity}
              </p>
              <div className="bg-green-500/20 border border-green-500 rounded-lg py-2 px-4 mb-4">
                <p className="text-green-400 font-bold">{sku.price} VOID</p>
              </div>
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-bold hover:opacity-90 transition">
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-black/30 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-400">
          Fee Distribution: 45% to Creator • 30% to xVOID Stakers • 15% PSX • 10% CREATE
        </p>
      </div>
    </div>
  )
}
