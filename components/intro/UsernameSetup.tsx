"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UsernameSetupProps {
  onComplete: (data: { username: string; avatarUrl: string }) => void
}

export function UsernameSetup({ onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("👤")
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleContinue = () => {
    if (username.trim().length >= 3) {
      onComplete({ username: username.trim(), avatarUrl })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
      <motion.div
        className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,255,165,0.3)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-black text-center bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2 leading-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          WELCOME
        </motion.h1>
        <motion.h2
          className="text-3xl md:text-5xl font-black text-center bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3 leading-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          TO VOID
        </motion.h2>

        <motion.p
          className="text-gray-400 text-center mb-6 md:mb-8 text-sm md:text-base"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Initialize your presence in the metaverse
        </motion.p>

        <motion.div
          className="space-y-5 md:space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Username Input */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 text-sm md:text-base">
              <User className="w-4 h-4 md:w-5 md:h-5" />
              USERNAME
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              placeholder="Enter your username..."
              className="w-full bg-black/50 border-cyan-500/50 text-white placeholder:text-gray-500 focus:border-cyan-400 h-12 md:h-auto text-base"
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">Max 20 characters</p>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm md:text-base">
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              PROFILE PICTURE
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border-2 border-cyan-500/40 overflow-hidden">
                {avatarUrl.startsWith("data:") || avatarUrl.startsWith("http") ? (
                  <img src={avatarUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-4xl">{avatarUrl}</span>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-cyan-500/40 rounded-xl p-4 md:p-6 hover:border-cyan-400 transition-colors bg-black/30 text-center">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-cyan-400" />
                  <p className="text-xs md:text-sm text-gray-400">Upload Image</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={username.trim().length < 3 || isUploading}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-4 md:py-6 rounded-xl text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed h-14 md:h-auto"
          >
            CONTINUE →
          </Button>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <div className="w-3 h-3 rounded-full bg-gray-700"></div>
        </div>
      </motion.div>
    </div>
  )
}
