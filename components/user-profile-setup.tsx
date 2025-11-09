"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, User, Briefcase, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface UserProfileSetupProps {
  onComplete: (profile: {
    username: string
    avatarUrl: string
    bio: string
    portfolio: string
  }) => void
}

export function UserProfileSetup({ onComplete }: UserProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")
  const [portfolio, setPortfolio] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (username.trim()) {
      onComplete({
        username: username.trim(),
        avatarUrl: avatarUrl || "👤",
        bio: bio.trim(),
        portfolio: portfolio.trim(),
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="scanlines absolute inset-0 opacity-10" />
        <div className="chromatic-aberration absolute inset-0 opacity-20" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Y2K Chrome Panel */}
        <div className="y2k-chrome-panel rounded-2xl p-4 sm:p-8 border-2 border-white/20">
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-5xl font-black y2k-chrome-text mb-2 tracking-wider leading-tight">
              WELCOME TO VOID
            </h1>
            <p className="text-gray-300 font-mono text-xs sm:text-sm">Initialize your presence in the metaverse</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    USERNAME
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username..."
                    className="bg-black/50 border-2 border-white/20 text-white font-mono focus:border-cyan-400 transition-colors"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-400 mt-1 font-mono">Max 20 characters</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    PROFILE PICTURE
                  </label>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      )}
                    </div>

                    <label className="flex-1">
                      <div className="bg-black/50 border-2 border-dashed border-white/20 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-cyan-400 transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-300 font-mono">Upload Image</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!username.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl transition-all text-sm sm:text-base"
                >
                  CONTINUE →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2">BIO (Optional)</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-black/50 border-2 border-white/20 text-white font-mono focus:border-cyan-400 transition-colors min-h-20 sm:min-h-24 text-sm"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-400 mt-1 font-mono">{bio.length}/200 characters</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    PORTFOLIO LINK (Optional)
                  </label>
                  <Input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://your-portfolio.com"
                    className="bg-black/50 border-2 border-white/20 text-white font-mono focus:border-cyan-400 transition-colors text-sm"
                  />
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-2 border-white/20 text-white hover:bg-white/10 text-sm sm:text-base"
                  >
                    ← BACK
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base"
                  >
                    ENTER VOID →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-4 sm:mt-6">
            <div className={`h-1 w-10 sm:w-12 rounded ${step >= 1 ? "bg-cyan-400" : "bg-gray-700"}`} />
            <div className={`h-1 w-10 sm:w-12 rounded ${step >= 2 ? "bg-cyan-400" : "bg-gray-700"}`} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
