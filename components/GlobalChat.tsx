"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, ChevronDown, ChevronUp, Globe, Users } from "lucide-react"
import { GroupChatManager } from "./group-chat-manager"
import { sendGlobalMessage, subscribeToGlobalChat } from "@/lib/supabase/chat-client"
import { useViewport } from "@/hooks/use-viewport"
import { useHaptic } from "@/lib/mobile-optimization-hooks"
import { HapticPattern } from "@/lib/mobile-optimization"

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: number
  wallet?: string
}

interface GlobalChatProps {
  isCompact?: boolean
  currentApp?: string
  currentZone?: string
}

export function GlobalChat({ isCompact = false, currentApp, currentZone }: GlobalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const viewport = useViewport()
  const haptic = useHaptic()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom()
    }
  }, [messages, isExpanded])

  useEffect(() => {
    const subscription = subscribeToGlobalChat((message) => {
      const newMessage: ChatMessage = {
        id: message.id,
        username: message.sender_username,
        message: message.message,
        timestamp: new Date(message.created_at).getTime(),
        wallet: message.sender_wallet,
      }

      setMessages((prev) => [...prev.slice(-50), newMessage])
    })

    return () => {
      subscription.then((sub) => sub?.unsubscribe())
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    haptic(HapticPattern.LIGHT)

    await sendGlobalMessage(
      "0x1234...5678", // Replace with actual wallet address
      "PLAYER_001",
      inputValue.trim(),
    )

    setInputValue("")
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={isCompact ? "w-80" : "w-full max-w-sm"}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className={`w-full flex items-center justify-between ${viewport.isMobile ? "px-3 py-3" : "px-4 py-3"} y2k-chrome-panel rounded-lg transition-all shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <Globe className={`${viewport.isMobile ? "w-6 h-6" : "w-5 h-5"} text-white/80`} />
            <div className="text-left">
              <div className={`font-bold y2k-chrome-text ${viewport.isMobile ? "text-base" : "text-sm"}`}>
                GLOBAL CHAT
              </div>
              <div className={`${viewport.isMobile ? "text-xs" : "text-xs"} text-gray-300/70`}>
                {messages.length} messages
              </div>
            </div>
          </div>
          <ChevronUp className={`${viewport.isMobile ? "w-6 h-6" : "w-5 h-5"} text-white/70`} />
        </button>
      ) : (
        <div className="y2k-chrome-panel rounded-lg shadow-2xl overflow-hidden">
          <div
            className={`bg-gradient-to-r from-white/10 to-transparent ${viewport.isMobile ? "px-3 py-3" : "px-4 py-3"} flex items-center justify-between border-b border-white/20`}
          >
            <div className="flex items-center gap-3">
              <Globe className={`${viewport.isMobile ? "w-6 h-6" : "w-5 h-5"} text-white/80`} />
              <div>
                <div className={`font-bold y2k-chrome-text ${viewport.isMobile ? "text-base" : "text-sm"}`}>
                  GLOBAL CHAT
                </div>
                <div
                  className={`flex items-center gap-1.5 ${viewport.isMobile ? "text-xs" : "text-xs"} text-gray-300/70`}
                >
                  <MessageSquare className={`${viewport.isMobile ? "w-4 h-4" : "w-3 h-3"}`} />
                  <span>{messages.length} messages</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGroups(!showGroups)}
                className={`${viewport.isMobile ? "p-2" : "p-1.5"} hover:bg-white/10 rounded transition-colors ${showGroups ? "bg-white/10" : ""}`}
              >
                <Users className={`${viewport.isMobile ? "w-6 h-6" : "w-5 h-5"} text-white/80`} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className={`${viewport.isMobile ? "p-2" : "p-1.5"} hover:bg-white/10 rounded transition-colors`}
              >
                <ChevronDown className={`${viewport.isMobile ? "w-6 h-6" : "w-5 h-5"} text-white/70`} />
              </button>
            </div>
          </div>

          {showGroups ? (
            <div
              className={`${viewport.isMobile ? "h-80" : "h-96"} overflow-y-auto ${viewport.isMobile ? "p-2" : "p-3"} bg-slate-950/50`}
            >
              <GroupChatManager currentApp={currentApp} currentZone={currentZone} />
            </div>
          ) : (
            <>
              <div
                className={`${viewport.isMobile ? "h-56" : "h-64"} overflow-y-auto ${viewport.isMobile ? "p-2" : "p-3"} space-y-2 bg-slate-950/50`}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-slate-800/50 rounded ${viewport.isMobile ? "px-2 py-2" : "px-3 py-2"} border border-slate-700/50`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`${viewport.isMobile ? "w-7 h-7 text-xs" : "w-6 h-6 text-xs"} rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold flex-shrink-0`}
                      >
                        {msg.username.substring(0, 2)}
                      </div>
                      <span className={`text-cyan-400 font-bold ${viewport.isMobile ? "text-sm" : "text-xs"}`}>
                        {msg.username}
                      </span>
                      {msg.wallet && (
                        <span className={`text-slate-500 ${viewport.isMobile ? "text-xs" : "text-xs"} font-mono`}>
                          {msg.wallet.slice(0, 6)}...
                        </span>
                      )}
                      <span className={`text-slate-600 ${viewport.isMobile ? "text-xs" : "text-xs"} ml-auto`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className={`text-slate-300 ${viewport.isMobile ? "text-sm pl-9" : "text-sm pl-8"}`}>
                      {msg.message}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className={`${viewport.isMobile ? "p-2" : "p-3"} bg-black/30 border-t border-white/20`}
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message all players..."
                    className={`flex-1 bg-black/60 border border-white/30 rounded ${viewport.isMobile ? "px-3 py-3 text-base" : "px-3 py-2 text-sm"} text-white placeholder:text-gray-400 focus:outline-none focus:border-white/60`}
                    maxLength={200}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`${viewport.isMobile ? "px-4 py-3" : "px-4 py-2"} bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white rounded transition-colors`}
                  >
                    <Send className={`${viewport.isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                  </button>
                </div>
                <div
                  className={`flex items-center justify-between ${viewport.isMobile ? "text-xs" : "text-xs"} text-gray-400`}
                >
                  <span>Visible to all players</span>
                  <span>{inputValue.length}/200</span>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
