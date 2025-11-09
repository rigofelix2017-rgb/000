"use client"

export function PsxOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 mix-blend-soft-light">
      {/* Scanlines for PSX CRT effect */}
      <div className="absolute inset-0 opacity-45 bg-[repeating-linear-gradient(to_bottom,#000000_0px,#000000_1px,transparent_1px,transparent_3px)]" />

      {/* Vignette effect */}
      <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_40%,#000000_85%)]" />
    </div>
  )
}
