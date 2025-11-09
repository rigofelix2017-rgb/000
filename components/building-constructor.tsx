"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Box, Hammer, Palette, Upload } from "lucide-react"
import { useViewport } from "@/hooks/use-viewport"

interface BuildingConstructorProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  onBuildingCreate: (building: any) => void
  voidBalance: number
}

const BUILDING_TEMPLATES = [
  { id: "studio", name: "Creator Studio", cost: 5000, icon: "🎨", category: "creative" },
  { id: "shop", name: "Digital Shop", cost: 3000, icon: "🏪", category: "commerce" },
  { id: "gallery", name: "NFT Gallery", cost: 4000, icon: "🖼️", category: "creative" },
  { id: "club", name: "Social Club", cost: 8000, icon: "🎉", category: "social" },
  { id: "hub", name: "Community Hub", cost: 6000, icon: "🏛️", category: "social" },
  { id: "arcade", name: "Game Arcade", cost: 7000, icon: "🎮", category: "entertainment" },
]

export function BuildingConstructor({
  isOpen,
  onClose,
  propertyId,
  onBuildingCreate,
  voidBalance,
}: BuildingConstructorProps) {
  const viewport = useViewport()
  const [step, setStep] = useState<"template" | "customize" | "confirm">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [buildingName, setBuildingName] = useState("")
  const [buildingColor, setBuildingColor] = useState("#06ffa5")
  const isMobile = viewport.isMobile

  const handleCreate = () => {
    if (voidBalance >= selectedTemplate.cost) {
      onBuildingCreate({
        ...selectedTemplate,
        name: buildingName,
        color: buildingColor,
        propertyId,
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : 0 }}
        >
          <motion.div
            className={`w-full ${isMobile ? "max-w-md" : "max-w-4xl"} max-h-[85vh] rounded-2xl overflow-y-auto y2k-chrome-panel p-6`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Hammer className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className={`${isMobile ? "text-2xl" : "text-3xl"} font-black y2k-chrome-text`}>
                    BUILD YOUR SPACE
                  </h2>
                  <p className="text-sm text-gray-400">Create custom structures</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`${isMobile ? "w-12 h-12" : "w-10 h-10"} flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors`}
              >
                <X className={`${isMobile ? "w-7 h-7" : "w-6 h-6"} text-red-400`} />
              </button>
            </div>

            {step === "template" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Box className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`} />
                  <span className={`${isMobile ? "text-base" : "text-sm"} font-bold`}>STEP 1: Choose Template</span>
                </div>
                <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-3"} gap-4`}>
                  {BUILDING_TEMPLATES.map((template) => (
                    <motion.button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template)
                        setBuildingName(template.name)
                        setStep("customize")
                      }}
                      className={`${isMobile ? "p-4" : "p-6"} rounded-xl border-2 transition-all ${
                        voidBalance >= template.cost
                          ? "border-cyan-400/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,255,165,0.3)]"
                          : "border-gray-600 opacity-50 cursor-not-allowed"
                      } bg-black/40`}
                      whileHover={voidBalance >= template.cost ? { scale: 1.05 } : {}}
                      whileTap={voidBalance >= template.cost ? { scale: 0.95 } : {}}
                      disabled={voidBalance < template.cost}
                    >
                      <div className={`${isMobile ? "text-4xl mb-2" : "text-6xl mb-3"}`}>{template.icon}</div>
                      <p className={`font-bold ${isMobile ? "text-sm" : "text-lg"} text-white mb-2`}>{template.name}</p>
                      <p className={`text-cyan-400 font-mono ${isMobile ? "text-xs" : "text-sm"}`}>
                        {template.cost.toLocaleString()} VOID
                      </p>
                      <p className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 mt-2 capitalize`}>
                        {template.category}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === "customize" && selectedTemplate && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Palette className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`} />
                  <span className={`${isMobile ? "text-base" : "text-sm"} font-bold`}>STEP 2: Customize</span>
                </div>

                <div>
                  <label className={`block ${isMobile ? "text-sm" : "text-sm"} text-gray-400 mb-2`}>
                    Building Name
                  </label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className={`w-full ${isMobile ? "px-4 py-4 text-base" : "px-4 py-3"} rounded-lg bg-black/60 border border-cyan-400/50 text-white font-mono focus:border-cyan-400 focus:outline-none`}
                    placeholder="Enter building name..."
                  />
                </div>

                <div>
                  <label className={`block ${isMobile ? "text-sm" : "text-sm"} text-gray-400 mb-2`}>
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    {["#06ffa5", "#00d9ff", "#8b5cf6", "#ff006e", "#ffd700"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBuildingColor(color)}
                        className={`${isMobile ? "w-14 h-14" : "w-16 h-16"} rounded-lg border-2 transition-all ${
                          buildingColor === color ? "border-white scale-110" : "border-gray-600"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("template")}
                    className={`flex-1 ${isMobile ? "py-4 text-base" : "py-3"} rounded-lg bg-gray-600/50 hover:bg-gray-600/70 text-white font-bold transition-colors`}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className={`flex-1 ${isMobile ? "py-4 text-base" : "py-3"} rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors`}
                    disabled={!buildingName.trim()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === "confirm" && selectedTemplate && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-4">
                  <Upload className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`} />
                  <span className={`${isMobile ? "text-base" : "text-sm"} font-bold`}>STEP 3: Confirm</span>
                </div>

                <div className={`y2k-chrome-panel ${isMobile ? "p-4" : "p-6"} rounded-xl`}>
                  <div className="text-center mb-6">
                    <div className={`${isMobile ? "text-5xl mb-3" : "text-7xl mb-4"}`}>{selectedTemplate.icon}</div>
                    <h3 className={`${isMobile ? "text-xl" : "text-2xl"} font-black y2k-chrome-text mb-2`}>
                      {buildingName}
                    </h3>
                    <p className={`${isMobile ? "text-sm" : "text-base"} text-gray-400`}>
                      {selectedTemplate.name} Template
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-white/20 pt-4">
                    <div className="flex justify-between">
                      <span className={`${isMobile ? "text-sm" : "text-base"} text-gray-400`}>Cost:</span>
                      <span className={`${isMobile ? "text-sm" : "text-base"} font-bold text-cyan-400`}>
                        {selectedTemplate.cost.toLocaleString()} VOID
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isMobile ? "text-sm" : "text-base"} text-gray-400`}>Your Balance:</span>
                      <span className={`${isMobile ? "text-sm" : "text-base"} font-bold text-white`}>
                        {voidBalance.toLocaleString()} VOID
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-3">
                      <span className={`${isMobile ? "text-sm" : "text-base"} text-gray-400`}>After Purchase:</span>
                      <span className={`${isMobile ? "text-sm" : "text-base"} font-bold text-purple-400`}>
                        {(voidBalance - selectedTemplate.cost).toLocaleString()} VOID
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("customize")}
                    className={`flex-1 ${isMobile ? "py-4 text-base" : "py-3"} rounded-lg bg-gray-600/50 hover:bg-gray-600/70 text-white font-bold transition-colors`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreate}
                    className={`flex-1 ${isMobile ? "py-4 text-base" : "py-3"} rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(6,255,165,0.5)]`}
                    disabled={voidBalance < selectedTemplate.cost}
                  >
                    {voidBalance >= selectedTemplate.cost ? "BUILD NOW" : "Insufficient VOID"}
                  </button>
                </div>
              </div>
            )}

            <div className={`mt-6 ${isMobile ? "p-3" : "p-4"} rounded-lg bg-purple-500/10 border border-purple-500/30`}>
              <p className={`${isMobile ? "text-xs" : "text-sm"} text-purple-300`}>
                <strong>💡 Pro Tip:</strong> Buildings can be customized further after creation!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
