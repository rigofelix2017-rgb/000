"use client"

import { Badge } from "@/components/ui/badge"

interface MultiplayerStatusProps {
  status: "disconnected" | "connecting" | "connected"
  playerCount: number
}

export function MultiplayerStatus({ status, playerCount }: MultiplayerStatusProps) {
  if (status === "disconnected") return null

  const statusColors = {
    connecting: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    connected: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    disconnected: "bg-red-500/20 text-red-400 border-red-500/50",
  }

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3">
        <Badge className={statusColors[status]}>
          {status === "connecting" && "Connecting..."}
          {status === "connected" && "Online"}
          {status === "disconnected" && "Offline"}
        </Badge>
        {status === "connected" && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">
              {playerCount} player{playerCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
