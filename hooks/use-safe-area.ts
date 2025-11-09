"use client"

import { useState, useEffect } from "react"

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    const updateInsets = () => {
      // Get CSS environment variables for safe area insets (iOS notch, home indicator)
      const top = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("env(safe-area-inset-top)") || "0",
      )
      const right = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("env(safe-area-inset-right)") || "0",
      )
      const bottom = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("env(safe-area-inset-bottom)") || "0",
      )
      const left = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("env(safe-area-inset-left)") || "0",
      )

      setInsets({ top, right, bottom, left })
    }

    updateInsets()
    window.addEventListener("resize", updateInsets)
    window.addEventListener("orientationchange", updateInsets)

    return () => {
      window.removeEventListener("resize", updateInsets)
      window.removeEventListener("orientationchange", updateInsets)
    }
  }, [])

  return insets
}
