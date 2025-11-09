"use client"

import { useState } from "react"
import { XpPanel } from "./xp-panel"
import type { PlayerXp, DailyTask } from "@/lib/xp/types"
import { useViewport } from "@/hooks/use-viewport"

interface XpDrawerProps {
  xp: PlayerXp
  tasks: DailyTask[]
}

export function XpDrawer({ xp, tasks }: XpDrawerProps) {
  const [open, setOpen] = useState(false)
  const { isMobile } = useViewport()

  return (
    <div className="fixed right-0 bottom-32 z-20 flex items-center">
      {/* Panel slides in/out from right */}
      <div
        className={`absolute right-16 bottom-0 transition-transform duration-300 ease-out pointer-events-auto ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <XpPanel xp={xp} tasks={tasks} isOpen={open} onClose={() => setOpen(false)} isMobile={isMobile} />
      </div>

      {/* Vertical tab - always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative pointer-events-auto rounded-l-3xl y2k-chrome-panel flex flex-col items-center justify-center gap-2 uppercase tracking-[0.18em] text-sky-100 hover:w-16 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] ${
          isMobile ? "h-24 w-12" : "h-32 w-14"
        }`}
      >
        <span className={`font-black y2k-chrome-text ${isMobile ? "text-sm" : "text-[16px]"}`}>XP</span>
        <span className="w-7 h-0.5 bg-gradient-to-r from-emerald-400 to-sky-400" />
        <span className={`font-mono font-bold ${isMobile ? "text-xs" : "text-[14px]"}`}>Lv {xp.level}</span>
        <span className={`mt-1 ${isMobile ? "text-sm" : "text-[16px]"}`}>{open ? "▶" : "◀"}</span>
      </button>
    </div>
  )
}
