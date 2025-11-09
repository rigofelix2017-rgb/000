"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Send, Shield } from "lucide-react"

interface DirectMessageProps {
  friend: {
    id: string
    wallet: string
    username: string
  }
  onClose: () => void
}

interface Message {
  id: string
  sender: "me" | "them"
  content: string
  timestamp: string
  onChain?: boolean
}

export function DirectMessage({ friend, onClose }: DirectMessageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "them",
      content: "Hey! Want to explore the DeFi District together?",
      timestamp: "2m ago",
      onChain: false,
    },
    {
      id: "2",
      sender: "me",
      content: "I'll be there in a minute",
      timestamp: "1m ago",
      onChain: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOnChain, setIsOnChain] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      content: inputValue,
      timestamp: "Just now",
      onChain: isOnChain,
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    // TODO: Implement actual on-chain message sending
    if (isOnChain) {
      console.log("[v0] Sending on-chain message to:", friend.wallet)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border-b-2 border-emerald-500/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xl font-bold">
              {friend.username[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-400 font-mono [text-shadow:_0_0_20px_rgb(16_185_129_/_50%)]">
                {friend.username}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{friend.wallet}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all text-slate-400 hover:text-emerald-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === "me" ? "bg-gradient-to-br from-emerald-600 to-cyan-600" : "bg-slate-700/80"
                } rounded-2xl px-4 py-3 ${message.onChain ? "border-2 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]" : ""}`}
              >
                {message.onChain && (
                  <div className="flex items-center gap-1 mb-1">
                    <Shield className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-bold font-mono">ON-CHAIN MESSAGE</span>
                  </div>
                )}
                <p className="text-white text-sm">{message.content}</p>
                <p className="text-xs text-slate-300/70 mt-1 font-mono">{message.timestamp}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-emerald-500/50 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsOnChain(!isOnChain)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                isOnChain
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
            >
              <Shield className="w-3 h-3" />
              {isOnChain ? "ON-CHAIN MODE" : "OFF-CHAIN"}
            </button>
            {isOnChain && (
              <p className="text-xs text-yellow-400/70 font-mono">Permanent, encrypted blockchain message</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isOnChain ? "Send encrypted on-chain message..." : "Type a message..."}
              className="flex-1 bg-slate-700/50 border border-emerald-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-mono"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
