"use client"

import type { ReactNode } from "react"
import { useSafeAreaInsets, useNetworkStatus, useViewportInfo } from "@/lib/mobile-optimization-hooks"
import { WifiOff } from "lucide-react"

interface MobileOptimizedWrapperProps {
  children: ReactNode
  className?: string
  showOfflineIndicator?: boolean
  disableSafeArea?: boolean
  sides?: ("top" | "right" | "bottom" | "left")[]
}

export function MobileOptimizedWrapper({
  children,
  className = "",
  showOfflineIndicator = true,
  disableSafeArea = false,
  sides = ["top", "bottom"],
}: MobileOptimizedWrapperProps) {
  const insets = useSafeAreaInsets()
  const isOnline = useNetworkStatus()
  const viewport = useViewportInfo()

  // Apply safe area padding
  const safeAreaStyles = disableSafeArea
    ? {}
    : {
        paddingTop: sides.includes("top") ? `${Math.max(insets.top, 8)}px` : undefined,
        paddingRight: sides.includes("right") ? `${Math.max(insets.right, 8)}px` : undefined,
        paddingBottom: sides.includes("bottom") ? `${Math.max(insets.bottom, 8)}px` : undefined,
        paddingLeft: sides.includes("left") ? `${Math.max(insets.left, 8)}px` : undefined,
      }

  return (
    <div className={`mobile-optimized-wrapper ${className}`} style={safeAreaStyles}>
      {/* Offline Indicator */}
      {showOfflineIndicator && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-500/90 text-white py-2 px-4 flex items-center justify-center gap-2 backdrop-blur-sm">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-semibold">No Internet Connection</span>
        </div>
      )}

      {children}

      {/* Dev Mode Indicator (development only) */}
      {process.env.NODE_ENV === "development" && viewport.isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-black/80 text-cyan-400 text-[10px] font-mono p-1 flex items-center justify-center gap-2 pointer-events-none">
          <span>
            {viewport.width}x{viewport.height}
          </span>
          <span>•</span>
          <span>{viewport.orientation}</span>
          <span>•</span>
          <span>
            Safe: T{insets.top} B{insets.bottom}
          </span>
        </div>
      )}
    </div>
  )
}
