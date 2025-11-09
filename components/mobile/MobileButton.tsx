"use client"

import type React from "react"

import type { ReactNode, ButtonHTMLAttributes } from "react"
import { useHaptic } from "@/lib/mobile-optimization-hooks"
import { HapticPattern, touchTargetClass, removeTapHighlight } from "@/lib/mobile-optimization"

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  hapticPattern?: HapticPattern
  size?: "small" | "medium" | "large"
  variant?: "primary" | "secondary" | "ghost"
}

export function MobileButton({
  children,
  hapticPattern = HapticPattern.LIGHT,
  size = "medium",
  variant = "primary",
  onClick,
  className = "",
  ...props
}: MobileButtonProps) {
  const haptic = useHaptic()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    haptic(hapticPattern)
    onClick?.(e)
  }

  const variantClasses = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-400",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border-gray-600",
    ghost: "bg-transparent hover:bg-white/10 text-cyan-400 border-cyan-500/50",
  }

  return (
    <button
      onClick={handleClick}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = "scale(0.95)"
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
      className={`
        ${touchTargetClass(size)}
        ${variantClasses[variant]}
        rounded-lg border-2 font-bold
        active:scale-95 transition-all duration-150
        flex items-center justify-center
        ${className}
      `}
      style={removeTapHighlight()}
      {...props}
    >
      {children}
    </button>
  )
}
