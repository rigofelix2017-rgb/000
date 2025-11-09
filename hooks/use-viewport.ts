"use client"

import { useState, useEffect } from "react"

export type ViewportSize = "mobile-portrait" | "mobile-landscape" | "tablet" | "desktop"

interface ViewportInfo {
  size: ViewportSize
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>({
    size: "desktop",
    width: 1920,
    height: 1080,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height

      let size: ViewportSize
      let isMobile = false
      let isTablet = false
      let isDesktop = false

      if (width < 480) {
        // Mobile portrait
        size = "mobile-portrait"
        isMobile = true
      } else if (width < 768 && isLandscape) {
        // Mobile landscape
        size = "mobile-landscape"
        isMobile = true
      } else if (width < 1024) {
        // Tablet
        size = "tablet"
        isTablet = true
      } else {
        // Desktop
        size = "desktop"
        isDesktop = true
      }

      setViewport({ size, width, height, isMobile, isTablet, isDesktop })
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)
    window.addEventListener("orientationchange", updateViewport)

    return () => {
      window.removeEventListener("resize", updateViewport)
      window.removeEventListener("orientationchange", updateViewport)
    }
  }, [])

  return viewport
}
