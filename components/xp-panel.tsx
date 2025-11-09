"use client"

import { useMemo } from "react"
import type { PlayerXp, DailyTask } from "@/lib/xp/types"
import { xpForLevel } from "@/lib/xp/levels"
import { X } from "lucide-react"

interface XpPanelProps {
  xp: PlayerXp
  tasks: DailyTask[]
  onTaskClick?: (task: DailyTask) => void
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export function XpPanel({ xp, tasks, onTaskClick, isOpen, onClose, isMobile }: XpPanelProps) {
  const nextLevelXp = xpForLevel(xp.level + 1)
  const currentLevelFloor = xpForLevel(xp.level)
  const intoLevel = xp.totalXp - currentLevelFloor
  const levelSpan = Math.max(1, nextLevelXp - currentLevelFloor)
  const levelProgress = Math.min(1, intoLevel / levelSpan)

  const explorerPercent = useMemo(
    () => (xp.totalXp > 0 ? Math.min(1, xp.explorerXp / xp.totalXp) : 0),
    [xp.explorerXp, xp.totalXp],
  )
  const builderPercent = useMemo(
    () => (xp.totalXp > 0 ? Math.min(1, xp.builderXp / xp.totalXp) : 0),
    [xp.builderXp, xp.totalXp],
  )
  const operatorPercent = useMemo(
    () => (xp.totalXp > 0 ? Math.min(1, xp.operatorXp / xp.totalXp) : 0),
    [xp.operatorXp, xp.totalXp],
  )

  return (
    <div
      className={`pointer-events-auto text-sky-50 ${isMobile ? "w-72 max-h-[70vh]" : "w-96 max-h-[90vh]"} overflow-y-auto`}
    >
      <div className="y2k-chrome-panel rounded-xl px-4 pt-4 pb-3 flex flex-col gap-3 shadow-2xl relative">
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/20 border border-red-400/40 hover:bg-red-500/30 hover:border-red-400/70 transition-all z-10"
            aria-label="Close XP panel"
          >
            <X className="w-5 h-5 text-red-300" />
          </button>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span
              className={`uppercase tracking-[0.18em] text-sky-300/80 font-mono ${isMobile ? "text-[10px]" : "text-[13px]"}`}
            >
              Agency Level
            </span>
            <span className={`font-bold leading-tight y2k-chrome-text ${isMobile ? "text-xl" : "text-3xl"}`}>
              Lv {xp.level}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-sky-300/80 font-mono font-semibold ${isMobile ? "text-[11px]" : "text-[14px]"}`}>
              {xp.totalXp.toLocaleString()} XP
            </span>
            <div
              className={`mt-1 rounded-full bg-slate-900/70 overflow-hidden border border-sky-500/30 ${isMobile ? "h-1.5 w-20" : "h-2.5 w-36"}`}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                style={{ width: `${levelProgress * 100}%` }}
              />
            </div>
            <span className={`block mt-0.5 text-sky-400/70 font-mono ${isMobile ? "text-[9px]" : "text-[11px]"}`}>
              {Math.max(0, nextLevelXp - xp.totalXp).toLocaleString()} XP to Lv {xp.level + 1}
            </span>
          </div>
        </div>

        {/* TRACK BREAKDOWN */}
        <div className="grid grid-cols-3 gap-2">
          <TrackChip
            label="Explorer"
            percent={explorerPercent}
            colorClass="from-sky-400 to-cyan-300"
            isMobile={isMobile}
          />
          <TrackChip
            label="Builder"
            percent={builderPercent}
            colorClass="from-amber-400 to-orange-300"
            isMobile={isMobile}
          />
          <TrackChip
            label="Operator"
            percent={operatorPercent}
            colorClass="from-fuchsia-400 to-violet-300"
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* DAILY TASKS */}
      <div className="mt-2 y2k-chrome-panel rounded-xl px-4 pt-4 pb-3 flex flex-col gap-2 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <span
            className={`uppercase tracking-[0.18em] text-sky-200 font-mono font-bold ${isMobile ? "text-[10px]" : "text-[13px]"}`}
          >
            Daily Tasks
          </span>
          <span className={`text-sky-400/80 font-mono ${isMobile ? "text-[9px]" : "text-[12px]"}`}>Resets in 24h</span>
        </div>

        <div
          className={`space-y-2 pr-1 scrollbar-thin scrollbar-thumb-sky-500/50 scrollbar-track-slate-900/50 ${isMobile ? "max-h-32 overflow-y-auto" : "max-h-48 overflow-y-auto"}`}
        >
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onClick={onTaskClick} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TrackChip({
  label,
  percent,
  colorClass,
  isMobile,
}: { label: string; percent: number; colorClass: string; isMobile?: boolean }) {
  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-sm border border-sky-500/30 rounded-lg flex flex-col gap-1 ${isMobile ? "px-2 py-1.5" : "px-3 py-2.5"}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`uppercase tracking-[0.16em] text-sky-300/90 font-mono ${isMobile ? "text-[9px]" : "text-[11px]"}`}
        >
          {label}
        </span>
        <span className={`text-sky-100/90 font-mono font-bold ${isMobile ? "text-[9px]" : "text-[11px]"}`}>
          {Math.round(percent * 100)}%
        </span>
      </div>
      <div
        className={`rounded-full bg-slate-900/70 overflow-hidden border border-sky-500/20 ${isMobile ? "h-1.5" : "h-2.5"}`}
      >
        <div className={`h-full bg-gradient-to-r ${colorClass}`} style={{ width: `${percent * 100}%` }} />
      </div>
    </div>
  )
}

function TaskRow({
  task,
  onClick,
  isMobile,
}: { task: DailyTask; onClick?: (task: DailyTask) => void; isMobile?: boolean }) {
  const ratio = task.target > 0 ? Math.min(1, task.progress / task.target) : 0

  return (
    <div
      className={
        `bg-slate-900/40 backdrop-blur-sm rounded-xl flex flex-col border transition-all ` +
        (task.completed
          ? "border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
          : "border-sky-500/25 hover:border-sky-400/40 cursor-pointer") +
        (isMobile ? " px-3 py-2 gap-1.5" : " px-4 py-3 gap-2")
      }
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={
              "flex items-center justify-center rounded-full font-bold " +
              (task.completed
                ? "bg-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                : "bg-slate-900/80 text-sky-300 border border-sky-500/40") +
              (isMobile ? " h-4 w-4 text-[9px]" : " h-6 w-6 text-[11px]")
            }
          >
            {task.completed ? "✓" : task.label[0]}
          </span>
          <div className="flex flex-col">
            <span className={`text-sky-50 font-semibold ${isMobile ? "text-[11px]" : "text-[13px]"}`}>
              {task.label}
            </span>
            <span className={`text-sky-300/80 ${isMobile ? "text-[9px]" : "text-[11px]"}`}>{task.description}</span>
          </div>
        </div>
        <span
          className={`text-emerald-300/90 whitespace-nowrap font-mono font-bold ${isMobile ? "text-[10px]" : "text-[13px]"}`}
        >
          +{task.xpReward}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`flex-1 rounded-full bg-slate-900/80 overflow-hidden border border-sky-500/20 ${isMobile ? "h-1.5" : "h-2.5"}`}
        >
          <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${ratio * 100}%` }} />
        </div>
        <span
          className={`text-sky-300/80 text-right font-mono font-semibold ${isMobile ? "w-10 text-[9px]" : "w-14 text-[11px]"}`}
        >
          {Math.min(task.progress, task.target)}/{task.target}
        </span>
      </div>
    </div>
  )
}
