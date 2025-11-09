"use client"

import { useState } from "react"
import { GlobalLandInventory } from "@/components/land/global-inventory"

export default function LandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto p-4">
        <GlobalLandInventory />
      </div>
    </div>
  )
}
