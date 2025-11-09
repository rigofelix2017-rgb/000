"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useViewport } from "@/hooks/use-viewport"

interface Fragment {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  gathered: boolean
  size: number
  hue: number
}

interface ConsciousnessPuzzleProps {
  onComplete: () => void
}

export function ConsciousnessPuzzle({ onComplete }: ConsciousnessPuzzleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState<"orb" | "exploded" | "gathering" | "reforming" | "complete">("orb")
  const [fragments, setFragments] = useState<Fragment[]>([])
  const [gatheredCount, setGatheredCount] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [shake, setShake] = useState(0)
  const animationFrameRef = useRef<number>()
  const orbPulseRef = useRef(0)
  const viewport = useViewport()

  const FRAGMENT_COUNT = 150
  const GATHER_RADIUS = viewport.isMobile ? 100 : 150
  const THRESHOLD = 60 // 40% of 150

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        setMousePos({ x: e.clientX, y: e.clientY })
      } else {
        const touch = e.touches[0]
        if (touch) {
          setMousePos({ x: touch.clientX, y: touch.clientY })
        }
      }
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("touchmove", handleMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("touchmove", handleMove)
    }
  }, [])

  useEffect(() => {
    if (stage === "orb") {
      const timer = setTimeout(() => {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2

        const newFragments: Fragment[] = Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
          const angle = (Math.PI * 2 * i) / FRAGMENT_COUNT + Math.random() * 0.2
          const speed = 3 + Math.random() * 4
          return {
            id: i,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gathered: false,
            size: 8 + Math.random() * 4,
            hue: 170 + Math.random() * 60, // Cyan to purple range
          }
        })

        setFragments(newFragments)
        setStage("exploded")
        setShake(20)
        setTimeout(() => setShake(0), 300)

        // Auto-advance to gathering stage
        setTimeout(() => setStage("gathering"), 2000)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [stage])

  useEffect(() => {
    if (stage !== "exploded" && stage !== "gathering" && stage !== "reforming") return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "lighter"

      fragments.forEach((frag) => {
        if (frag.gathered) return

        // Update physics
        frag.x += frag.vx
        frag.y += frag.vy
        frag.vx *= 0.98 // Friction
        frag.vy *= 0.98

        // Bounce off walls
        if (frag.x < 0 || frag.x > canvas.width) frag.vx *= -0.8
        if (frag.y < 0 || frag.y > canvas.height) frag.vy *= -0.8

        // Draw aura glow
        const gradient = ctx.createRadialGradient(frag.x, frag.y, 0, frag.x, frag.y, frag.size * 3)
        gradient.addColorStop(0, `hsla(${frag.hue}, 100%, 70%, 0.8)`)
        gradient.addColorStop(0.5, `hsla(${frag.hue}, 100%, 50%, 0.4)`)
        gradient.addColorStop(1, `hsla(${frag.hue}, 100%, 30%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(frag.x, frag.y, frag.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw core
        ctx.fillStyle = `hsl(${frag.hue}, 100%, 80%)`
        ctx.beginPath()
        ctx.arc(frag.x, frag.y, frag.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"

      if (stage === "gathering") {
        ctx.strokeStyle = "rgba(6, 255, 165, 0.3)"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(mousePos.x, mousePos.y, GATHER_RADIUS, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stage, fragments, mousePos])

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (stage !== "gathering") return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    let clickX: number, clickY: number

    if ("touches" in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) return
      clickX = touch.clientX - rect.left
      clickY = touch.clientY - rect.top
    } else {
      // Mouse event
      clickX = e.clientX - rect.left
      clickY = e.clientY - rect.top
    }

    let gathered = 0
    const updatedFragments = fragments.map((frag) => {
      if (frag.gathered) return frag

      const dx = frag.x - clickX
      const dy = frag.y - clickY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < GATHER_RADIUS) {
        gathered++
        return { ...frag, gathered: true }
      }
      return frag
    })

    if (gathered > 0) {
      setFragments(updatedFragments)
      setGatheredCount((prev) => prev + gathered)
    }
  }

  useEffect(() => {
    if (gatheredCount >= THRESHOLD && stage === "gathering") {
      setStage("reforming")
      setShake(30)

      // Lightning effect
      setTimeout(() => setShake(0), 400)

      // Complete after reformation animation
      setTimeout(() => {
        setStage("complete")
        setTimeout(onComplete, 1500)
      }, 3000)
    }
  }, [gatheredCount, stage, onComplete])

  const progress = Math.min((gatheredCount / THRESHOLD) * 100, 100)

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        transform:
          shake > 0
            ? `translate(${Math.random() * shake - shake / 2}px, ${Math.random() * shake - shake / 2}px)`
            : "none",
      }}
    >
      {/* Canvas for particle rendering */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasInteraction}
        onTouchEnd={handleCanvasInteraction}
        className="absolute inset-0"
        style={{
          cursor: stage === "gathering" ? "crosshair" : "default",
          touchAction: "none",
        }}
      />

      {/* Orb stage */}
      <AnimatePresence>
        {stage === "orb" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div
              className="w-64 h-64 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(6, 255, 165, 1) 0%, rgba(0, 217, 255, 0.8) 40%, transparent 70%)",
                boxShadow: "0 0 100px rgba(6, 255, 165, 0.8), 0 0 200px rgba(0, 217, 255, 0.5)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 md:p-8">
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1
            className={`${viewport.isMobile ? "text-3xl" : "text-6xl"} font-black text-white mb-2 md:mb-4`}
            style={{
              textShadow: "0 0 30px rgba(6, 255, 165, 1), 0 0 60px rgba(0, 217, 255, 0.8)",
              fontFamily: "monospace",
            }}
          >
            CONSCIOUSNESS GATHERING
          </h1>
          <p className={`text-cyan-300 ${viewport.isMobile ? "text-sm" : "text-xl"} font-mono`}>
            {stage === "orb" && "Awakening..."}
            {stage === "exploded" && "Fragments dispersing..."}
            {stage === "gathering" &&
              (viewport.isMobile ? "Tap to gather fragments" : "Click to gather nearby consciousness fragments")}
            {stage === "reforming" && "Coalescing..."}
            {stage === "complete" && "CONSCIOUSNESS ACHIEVED"}
          </p>
        </motion.div>

        {stage === "gathering" && (
          <motion.div
            className={`w-full ${viewport.isMobile ? "max-w-sm" : "max-w-2xl"}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div
              className={`bg-black/50 backdrop-blur-xl rounded-2xl ${viewport.isMobile ? "p-4" : "p-6"} border-2 border-cyan-500/30`}
            >
              <div className="flex justify-between mb-3">
                <span className={`text-cyan-400 font-mono ${viewport.isMobile ? "text-xs" : "text-sm"}`}>Progress</span>
                <span className={`text-white font-mono font-bold ${viewport.isMobile ? "text-xs" : "text-sm"}`}>
                  {gatheredCount} / {THRESHOLD}
                </span>
              </div>
              <div
                className={`${viewport.isMobile ? "h-4" : "h-6"} bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/50`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  style={{
                    boxShadow: "0 0 20px rgba(6, 255, 165, 0.8)",
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-3 text-center font-mono">
                Gather {THRESHOLD - gatheredCount} more fragments
              </p>
            </div>
          </motion.div>
        )}

        {stage === "reforming" && (
          <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse">
              REFORMING...
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightning effects during reformation */}
      {stage === "reforming" && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent"
              style={{
                left: `${10 + i * 12}%`,
                height: "100%",
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0, 1, 0],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                repeat: 3,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}
