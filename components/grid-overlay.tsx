"use client"

interface GridOverlayProps {
  size?: number
  divisions?: number
  color1?: string
  color2?: string
}

export function GridOverlay({ size = 200, divisions = 40, color1 = "#06FFA5", color2 = "#020617" }: GridOverlayProps) {
  return (
    <group>
      {/* Main grid at ground level */}
      <gridHelper args={[size, divisions, color1, color2]} position={[0, 0.01, 0]} />
    </group>
  )
}
