"use client"

import { useState, useEffect } from "react"

export function CRTOverlay() {
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        // 5% chance every second
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 100 + Math.random() * 200)
      }
    }, 1000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.25),
              rgba(0, 0, 0, 0.25) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(10,10,20,0.6) 100%)",
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.6), inset 0 0 30px rgba(6, 255, 165, 0.1)",
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-[9997] opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: "grain 6s steps(10) infinite",
        }}
      />

      {glitchActive && (
        <div
          className="fixed inset-0 pointer-events-none z-[9996]"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 0, 110, 0.1) 25%, 
              rgba(6, 255, 165, 0.1) 50%, 
              rgba(0, 217, 255, 0.1) 75%, 
              transparent 100%)`,
            animation: "glitchSlide 0.15s linear",
            transform: `translateX(${Math.random() * 10 - 5}px)`,
          }}
        />
      )}

      {glitchActive && (
        <div
          className="fixed inset-0 pointer-events-none z-[9995]"
          style={{
            mixBlendMode: "screen",
            filter: "blur(1px)",
            opacity: 0.3,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(255, 0, 0, 0.3)",
              transform: `translateX(${Math.random() * 4 - 2}px)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 255, 0, 0.3)",
              transform: `translateX(${Math.random() * -4 + 2}px)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 255, 0.3)",
              transform: `translateY(${Math.random() * 2 - 1}px)`,
            }}
          />
        </div>
      )}

      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-[9994] opacity-20">
        <div
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle at top left, rgba(255, 255, 255, 0.5), transparent 70%)",
          }}
        />
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 pointer-events-none z-[9994] opacity-15">
        <div
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle at bottom right, rgba(6, 255, 165, 0.3), transparent 70%)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes grain {
          0%,
          100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-5%, -10%);
          }
          20% {
            transform: translate(-15%, 5%);
          }
          30% {
            transform: translate(7%, -25%);
          }
          40% {
            transform: translate(-5%, 25%);
          }
          50% {
            transform: translate(-15%, 10%);
          }
          60% {
            transform: translate(15%, 0%);
          }
          70% {
            transform: translate(0%, 15%);
          }
          80% {
            transform: translate(3%, 35%);
          }
          90% {
            transform: translate(-10%, 10%);
          }
        }

        @keyframes glitchSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  )
}
