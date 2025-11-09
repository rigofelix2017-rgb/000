"use client"

import { useEffect, useRef, useState } from "react"
import { useSafeArea } from "@/hooks/use-safe-area"
import { useKeyboardHeight } from "@/hooks/use-keyboard-height"
import { useOrientation } from "@/hooks/use-orientation"

interface MobileTouchControlsProps {
  onMove: (vector: { x: number; z: number }) => void
  onSprint: (sprinting: boolean) => void
  visible: boolean
}

export function MobileTouchControls({ onMove, onSprint, visible }: MobileTouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const [touchId, setTouchId] = useState<number | null>(null)
  const [isSprinting, setIsSprinting] = useState(false)
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 })

  const currentDirectionRef = useRef({ x: 0, y: 0 })
  const requestRef = useRef<number | null>(null)

  const safeArea = useSafeArea()
  const keyboardHeight = useKeyboardHeight()
  const orientation = useOrientation()
  const isLandscape = orientation === "landscape"

  useEffect(() => {
    if (!visible) return

    if (touchId !== null) {
      // Start animation loop when joystick is active
      const updateFrame = () => {
        const direction = currentDirectionRef.current

        // Send normalized vector to parent
        onMove({
          x: direction.x,
          z: direction.y, // Note: joystick Y maps to world Z
        })

        requestRef.current = requestAnimationFrame(updateFrame)
      }

      requestRef.current = requestAnimationFrame(updateFrame)

      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    } else {
      // Joystick released - send zero vector
      onMove({ x: 0, z: 0 })

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }
  }, [visible, touchId, onMove])

  useEffect(() => {
    if (!visible) return

    const handleTouchStart = (e: TouchEvent) => {
      if (!joystickRef.current) return

      const touch = Array.from(e.touches).find((t) => {
        const rect = joystickRef.current!.getBoundingClientRect()
        return t.clientX >= rect.left && t.clientX <= rect.right && t.clientY >= rect.top && t.clientY <= rect.bottom
      })

      if (touch) {
        e.preventDefault()
        setTouchId(touch.identifier)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchId === null || !joystickRef.current) return

      const touch = Array.from(e.touches).find((t) => t.identifier === touchId)
      if (!touch) return

      e.preventDefault()

      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = touch.clientX - centerX
      const dy = touch.clientY - centerY

      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = rect.width / 2

      const DEAD_ZONE = maxDistance * 0.15
      if (distance < DEAD_ZONE) {
        setStickPosition({ x: 0, y: 0 })
        currentDirectionRef.current = { x: 0, y: 0 }
        return
      }

      const clampedDistance = Math.min(distance, maxDistance)
      const adjustedDistance = clampedDistance - DEAD_ZONE
      const adjustedMaxDistance = maxDistance - DEAD_ZONE
      const ratio = Math.min(adjustedDistance / adjustedMaxDistance, 1.0)

      // Apply smooth curve for better control
      const smoothRatio = ratio * ratio * (3 - 2 * ratio)

      const clampedX = distance > 0 ? (dx / distance) * clampedDistance : 0
      const clampedY = distance > 0 ? (dy / distance) * clampedDistance : 0
      setStickPosition({ x: clampedX, y: clampedY })

      const normalizedX = dx / maxDistance
      const normalizedY = dy / maxDistance

      currentDirectionRef.current = {
        x: normalizedX * smoothRatio,
        y: normalizedY * smoothRatio,
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchId === null) return

      const touch = Array.from(e.changedTouches).find((t) => t.identifier === touchId)
      if (touch) {
        e.preventDefault()
        setTouchId(null)
        setStickPosition({ x: 0, y: 0 })
        currentDirectionRef.current = { x: 0, y: 0 }
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd, { passive: false })
    document.addEventListener("touchcancel", handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [visible, touchId])

  const handleSprintToggle = () => {
    const newState = !isSprinting
    setIsSprinting(newState)
    onSprint(newState)
  }

  if (!visible) return null

  const bottomOffset = Math.max(safeArea.bottom, 32) + keyboardHeight
  const leftOffset = Math.max(safeArea.left, 32)
  const rightOffset = Math.max(safeArea.right, 32)

  const joystickSize = isLandscape ? "w-24 h-24" : "w-32 h-32"
  const stickSize = isLandscape ? "w-12 h-12" : "w-16 h-16"
  const buttonSize = isLandscape ? "w-16 h-16" : "w-20 h-20"
  const actionButtonSize = isLandscape ? "w-12 h-12" : "w-16 h-16"

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* Virtual Joystick with enhanced visual feedback */}
      <div
        ref={joystickRef}
        className={`pointer-events-auto absolute ${joystickSize} bg-black/40 rounded-full border-2 border-cyan-500/50 backdrop-blur-sm flex items-center justify-center`}
        style={{
          bottom: `${bottomOffset}px`,
          left: `${leftOffset}px`,
          boxShadow: "0 0 20px rgba(6, 255, 165, 0.3)",
        }}
      >
        {/* Joystick base indicators */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-2 rounded-full border border-cyan-500/10" />

        {/* Joystick stick */}
        <div
          ref={stickRef}
          className={`${stickSize} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-cyan-300 transition-transform`}
          style={{
            transform: `translate(${stickPosition.x}px, ${stickPosition.y}px)`,
            boxShadow: "0 0 15px rgba(6, 255, 165, 0.6)",
          }}
        />
      </div>

      {/* Sprint Button with enhanced feedback */}
      <button
        onClick={handleSprintToggle}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.95)"
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = isSprinting ? "scale(1.1)" : "scale(1)"
        }}
        className={`pointer-events-auto absolute ${buttonSize} rounded-full border-2 transition-all backdrop-blur-sm ${
          isSprinting
            ? "bg-orange-500/70 border-orange-400 scale-110"
            : "bg-black/40 border-cyan-500/50 hover:bg-cyan-500/20"
        }`}
        style={{
          bottom: `${bottomOffset}px`,
          right: `${rightOffset}px`,
          boxShadow: isSprinting ? "0 0 30px rgba(251, 146, 60, 0.6)" : "0 0 20px rgba(6, 255, 165, 0.3)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span className="text-white text-2xl drop-shadow-lg">⚡</span>
      </button>

      {/* Action Buttons with proper touch feedback */}
      <button
        onClick={() => {
          const event = new KeyboardEvent("keydown", { key: "e" })
          window.dispatchEvent(event)
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.95)"
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
        className={`pointer-events-auto absolute ${actionButtonSize} bg-black/40 rounded-full border-2 border-emerald-500/50 backdrop-blur-sm flex items-center justify-center hover:bg-emerald-500/20 transition-all`}
        style={{
          bottom: `${bottomOffset + (isLandscape ? 80 : 100)}px`,
          right: `${rightOffset}px`,
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span className="text-white text-lg font-bold drop-shadow-lg">E</span>
      </button>

      {/* Map Button */}
      <button
        onClick={() => {
          const event = new KeyboardEvent("keydown", { key: "n" })
          window.dispatchEvent(event)
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.95)"
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
        className={`pointer-events-auto absolute ${actionButtonSize} bg-black/40 rounded-full border-2 border-purple-500/50 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500/20 transition-all`}
        style={{
          bottom: `${bottomOffset + (isLandscape ? 80 : 100)}px`,
          right: `${rightOffset + (isLandscape ? 72 : 88)}px`,
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span className="text-white text-lg drop-shadow-lg">🗺️</span>
      </button>

      {/* Chat Button */}
      <button
        onClick={() => {
          const event = new KeyboardEvent("keydown", { key: "c" })
          window.dispatchEvent(event)
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = "scale(0.95)"
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
        className={`pointer-events-auto absolute ${actionButtonSize} bg-black/40 rounded-full border-2 border-pink-500/50 backdrop-blur-sm flex items-center justify-center hover:bg-pink-500/20 transition-all`}
        style={{
          bottom: `${bottomOffset}px`,
          right: `${rightOffset + (isLandscape ? 72 : 88)}px`,
          boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span className="text-white text-lg drop-shadow-lg">💬</span>
      </button>

      {/* Keyboard indicator */}
      {keyboardHeight > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-t border-cyan-500/30 flex items-center justify-center pointer-events-none"
          style={{ height: `${keyboardHeight}px` }}
        >
          <p className="text-cyan-400 text-sm font-mono">⌨️ Keyboard Active</p>
        </div>
      )}
    </div>
  )
}
