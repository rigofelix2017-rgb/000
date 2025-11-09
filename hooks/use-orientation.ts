"use client"

import { useEffect, useState } from "react"

export type Orientation = "portrait" | "landscape"

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>("portrait")

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? "landscape" : "portrait")
    }

    // Check on mount
    checkOrientation()

    // Listen for orientation changes
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  return orientation
}
