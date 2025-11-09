"use client"

import { type InputHTMLAttributes, forwardRef } from "react"
import { removeTapHighlight } from "@/lib/mobile-optimization"

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-300 mb-1">{label}</label>}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-black/40 border-2 border-cyan-500/30
            rounded-lg
            text-white text-base
            placeholder:text-gray-500
            focus:outline-none focus:border-cyan-500/60
            transition-colors
            ${error ? "border-red-500/60" : ""}
            ${className}
          `}
          style={{
            fontSize: "16px", // Prevents iOS zoom on focus
            ...removeTapHighlight(),
          }}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    )
  },
)

MobileInput.displayName = "MobileInput"
