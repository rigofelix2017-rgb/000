"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Upload, User, Briefcase, ImageIcon, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface UserProfile {
  username: string
  avatarUrl: string
  bio: string
  portfolio: string
}

interface UserProfileEditProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
  onClose: () => void
}

export function UserProfileEdit({ profile, onSave, onClose }: UserProfileEditProps) {
  const [username, setUsername] = useState(profile.username)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)
  const [bio, setBio] = useState(profile.bio)
  const [portfolio, setPortfolio] = useState(profile.portfolio)
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl)

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

  const handleSave = () => {
    onSave({
      username: username.trim() || profile.username,
      avatarUrl: avatarUrl || profile.avatarUrl,
      bio: bio.trim(),
      portfolio: portfolio.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        className="relative w-full max-w-2xl mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="y2k-chrome-panel rounded-2xl p-8 border-2 border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black y2k-chrome-text">EDIT PROFILE</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-black/50 border-2 border-white/20 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                USERNAME
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/50 border-2 border-white/20 text-white font-mono"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                PROFILE PICTURE
              </label>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">{profile.avatarUrl}</div>
                  )}
                </div>

                <label className="flex-1">
                  <div className="bg-black/50 border-2 border-dashed border-white/20 rounded-xl p-4 cursor-pointer hover:border-cyan-400 transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-300 font-mono">Change Picture</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">BIO</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-black/50 border-2 border-white/20 text-white font-mono min-h-24"
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-1 font-mono">{bio.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                PORTFOLIO LINK
              </label>
              <Input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://your-portfolio.com"
                className="bg-black/50 border-2 border-white/20 text-white font-mono"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2 border-white/20 text-white bg-transparent"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
