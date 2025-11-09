"use client"

import { useState, useEffect } from "react"

export function useKeyboardHeight(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    // Detect virtual keyboard on mobile
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight
        const diff = windowHeight - viewportHeight

        // If difference is significant, keyboard is likely open
        if (diff > 150) {
          setKeyboardHeight(diff)
        } else {
          setKeyboardHeight(0)
        }
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      window.visualViewport.addEventListener("scroll", handleResize)
      handleResize()
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize)
        window.visualViewport.removeEventListener("scroll", handleResize)
      }
    }
  }, [])

  return keyboardHeight
}
