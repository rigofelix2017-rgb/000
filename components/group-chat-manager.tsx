"use client"

import { useState } from "react"
import { Users, Plus, Hash, MessageSquare } from "lucide-react"
import { Button } from "./ui/button"

interface GroupChat {
  id: string
  name: string
  type: "group" | "zone" | "app"
  icon: string
  memberCount: number
  lastMessage?: string
}

interface GroupChatManagerProps {
  currentApp?: string
  currentZone?: string
}

export function GroupChatManager({ currentApp, currentZone }: GroupChatManagerProps) {
  const [groupChats] = useState<GroupChat[]>([
    {
      id: "founders",
      name: "Founders Circle",
      type: "group",
      icon: "👑",
      memberCount: 12,
      lastMessage: "Meeting at PSX HQ in 10 mins",
    },
    {
      id: "property-owners",
      name: "Property Owners",
      type: "group",
      icon: "🏢",
      memberCount: 47,
      lastMessage: "New listings in DeFi District!",
    },
    {
      id: "gamers",
      name: "Casino Crew",
      type: "group",
      icon: "🎰",
      memberCount: 89,
      lastMessage: "Who's up for blackjack?",
    },
  ])

  const [appChats] = useState<GroupChat[]>([
    {
      id: "marketplace-chat",
      name: "Marketplace",
      type: "app",
      icon: "🛒",
      memberCount: 156,
      lastMessage: "Check out the new properties!",
    },
    {
      id: "casino-chat",
      name: "Casino",
      type: "app",
      icon: "🎲",
      memberCount: 203,
      lastMessage: "Big win on slots!",
    },
    {
      id: "dashboard-chat",
      name: "Dashboard",
      type: "app",
      icon: "📊",
      memberCount: 91,
      lastMessage: "Portfolio looking good!",
    },
  ])

  const [zoneChats] = useState<GroupChat[]>([
    {
      id: "psx-hq",
      name: "PSX HQ",
      type: "zone",
      icon: "🏢",
      memberCount: 34,
      lastMessage: "Welcome to headquarters!",
    },
    {
      id: "gaming-district",
      name: "Gaming District",
      type: "zone",
      icon: "🎮",
      memberCount: 67,
      lastMessage: "Tournament starting soon!",
    },
    {
      id: "defi-district",
      name: "DeFi District",
      type: "zone",
      icon: "💰",
      memberCount: 52,
      lastMessage: "New yield opportunities",
    },
  ])

  return (
    <div className="space-y-4">
      {/* Group Chats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-400">GROUP CHATS</h3>
          </div>
          <Button size="sm" variant="ghost" className="h-6 px-2">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-2">
          {groupChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg flex-shrink-0">
                {chat.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{chat.name}</span>
                  <span className="text-xs text-slate-500">{chat.memberCount} members</span>
                </div>
                {chat.lastMessage && <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zone Chats */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-purple-400">ZONE CHATS</h3>
        </div>
        <div className="space-y-2">
          {zoneChats.map((chat) => (
            <button
              key={chat.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                currentZone === chat.id
                  ? "bg-purple-900/30 border-purple-500/50"
                  : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg flex-shrink-0">
                {chat.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{chat.name}</span>
                  <span className="text-xs text-slate-500">{chat.memberCount} online</span>
                </div>
                {chat.lastMessage && <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App-Specific Chats */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-400">APP CHATS</h3>
        </div>
        <div className="space-y-2">
          {appChats.map((chat) => (
            <button
              key={chat.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                currentApp === chat.id
                  ? "bg-amber-900/30 border-amber-500/50"
                  : "bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-lg flex-shrink-0">
                {chat.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{chat.name}</span>
                  <span className="text-xs text-slate-500">{chat.memberCount} active</span>
                </div>
                {chat.lastMessage && <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
