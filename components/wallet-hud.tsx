"use client"

import { useVOIDToken } from "@/lib/hooks/use-void-token"
import { useFoundersNFT } from "@/lib/hooks/use-founders-nft"
import { useMetaverseLand } from "@/lib/hooks/use-metaverse-land"
import { useAccount } from "wagmi"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export function WalletHUD() {
  const { address } = useAccount()
  const { balance: voidBalance } = useVOIDToken()
  const { balance: nftBalance } = useFoundersNFT()
  const { ownedParcels } = useMetaverseLand()

  if (!address) return null

  return (
    <div className="fixed top-4 right-4 z-40 space-y-2">
      <motion.div
        className="relative overflow-hidden rounded-xl px-4 py-3"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(70, 70, 80, 0.25),
              rgba(55, 55, 65, 0.22),
              rgba(80, 80, 90, 0.28)
            )
          `,
          backdropFilter: "blur(36px) saturate(200%) contrast(1.18)",
          border: "2px solid rgba(34, 211, 238, 0.5)",
          boxShadow: `
            0 0 40px rgba(34, 211, 238, 0.4),
            0 10px 40px rgba(0, 0, 0, 0.4),
            inset 0 0 50px rgba(34, 211, 238, 0.1),
            inset 0 4px 0 rgba(255, 255, 255, 0.5),
            inset 0 -4px 10px rgba(0, 0, 0, 0.3)
          `,
        }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 90% 110% at 30% 45%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)`,
            animation: "organicGlow 16s ease-in-out infinite",
          }}
        />
        <div className="flex items-center gap-2 relative z-10">
          <span
            className="text-sm font-mono font-bold"
            style={{
              color: "#22D3EE",
              textShadow: "0 0 12px rgba(34, 211, 238, 0.8)",
            }}
          >
            VOID:
          </span>
          <span
            className="font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #FFFFFF, #E0E0E0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
            }}
          >
            {Number.parseFloat(voidBalance).toFixed(0)}
          </span>
        </div>
      </motion.div>

      {nftBalance > 0 && (
        <motion.div
          className="relative overflow-hidden rounded-xl px-4 py-3"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(70, 70, 80, 0.25),
                rgba(55, 55, 65, 0.22),
                rgba(80, 80, 90, 0.28)
              )
            `,
            backdropFilter: "blur(36px) saturate(200%) contrast(1.18)",
            border: "2px solid rgba(16, 185, 129, 0.5)",
            boxShadow: `
              0 0 40px rgba(16, 185, 129, 0.4),
              0 10px 40px rgba(0, 0, 0, 0.4),
              inset 0 0 50px rgba(16, 185, 129, 0.1),
              inset 0 4px 0 rgba(255, 255, 255, 0.5),
              inset 0 -4px 10px rgba(0, 0, 0, 0.3)
            `,
          }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 90% 110% at 30% 45%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)`,
              animation: "organicGlow 16s ease-in-out infinite",
            }}
          />
          <div className="flex items-center gap-2 relative z-10">
            <span
              className="text-sm font-mono font-bold"
              style={{
                color: "#10B981",
                textShadow: "0 0 12px rgba(16, 185, 129, 0.8)",
              }}
            >
              Founders:
            </span>
            <span
              className="font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #FFFFFF, #E0E0E0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
              }}
            >
              {nftBalance}
            </span>
            {nftBalance >= 3 && (
              <Badge
                className="font-mono text-xs"
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  border: "1px solid rgba(16, 185, 129, 0.5)",
                  textShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
                }}
              >
                Test Eligible
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {ownedParcels && ownedParcels.length > 0 && (
        <motion.div
          className="relative overflow-hidden rounded-xl px-4 py-3"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(70, 70, 80, 0.25),
                rgba(55, 55, 65, 0.22),
                rgba(80, 80, 90, 0.28)
              )
            `,
            backdropFilter: "blur(36px) saturate(200%) contrast(1.18)",
            border: "2px solid rgba(168, 85, 247, 0.5)",
            boxShadow: `
              0 0 40px rgba(168, 85, 247, 0.4),
              0 10px 40px rgba(0, 0, 0, 0.4),
              inset 0 0 50px rgba(168, 85, 247, 0.1),
              inset 0 4px 0 rgba(255, 255, 255, 0.5),
              inset 0 -4px 10px rgba(0, 0, 0, 0.3)
            `,
          }}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 90% 110% at 30% 45%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`,
              animation: "organicGlow 16s ease-in-out infinite",
            }}
          />
          <div className="flex items-center gap-2 relative z-10">
            <span
              className="text-sm font-mono font-bold"
              style={{
                color: "#A855F7",
                textShadow: "0 0 12px rgba(168, 85, 247, 0.8)",
              }}
            >
              Land:
            </span>
            <span
              className="font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #FFFFFF, #E0E0E0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
              }}
            >
              {ownedParcels.length}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
