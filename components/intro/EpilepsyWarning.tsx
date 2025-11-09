"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useViewport } from "@/hooks/use-viewport"

interface EpilepsyWarningProps {
  onAccept: () => void
}

export function EpilepsyWarning({ onAccept }: EpilepsyWarningProps) {
  const viewport = useViewport()

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black ${viewport.isMobile ? "p-4" : "p-8"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`max-w-2xl ${viewport.isMobile ? "p-4" : "p-8"} bg-red-950/90 border-4 border-red-500 rounded-2xl backdrop-blur-xl overflow-y-auto max-h-[90vh]`}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 20 }}
      >
        <div className={`flex ${viewport.isMobile ? "flex-col items-start" : "items-center"} gap-4 mb-6`}>
          <AlertTriangle className={`${viewport.isMobile ? "w-10 h-10" : "w-16 h-16"} text-red-500 animate-pulse`} />
          <h1 className={`${viewport.isMobile ? "text-2xl" : "text-4xl"} font-black text-red-500 tracking-wider`}>
            PHOTOSENSITIVITY WARNING
          </h1>
        </div>

        <div className={`space-y-4 text-gray-200 ${viewport.isMobile ? "text-sm" : "text-lg"} leading-relaxed`}>
          <p>
            <strong className="text-red-400">WARNING:</strong> This experience contains flashing lights, rapid visual
            changes, and intense effects that may trigger seizures in people with photosensitive epilepsy.
          </p>

          <p className="text-base">
            A very small percentage of people may experience seizures when exposed to certain lights, patterns, or
            images, even with no history of epilepsy.
          </p>

          <div className="bg-black/50 p-4 rounded-xl border border-red-500/50 mt-6">
            <p className="text-sm text-gray-300">
              <strong className="text-red-400">If you experience any of the following symptoms:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-400 space-y-1">
              <li>Dizziness, altered vision, eye or face twitching</li>
              <li>Involuntary movements or convulsions</li>
              <li>Loss of awareness or disorientation</li>
            </ul>
            <p className="text-sm text-red-400 mt-3 font-bold">IMMEDIATELY STOP and consult a doctor.</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAccept}
          className={`w-full ${viewport.isMobile ? "mt-4 px-4 py-3 text-base" : "mt-8 px-8 py-4 text-xl"} bg-gradient-to-r from-red-600 to-red-800 rounded-xl text-white font-bold border-2 border-red-500`}
          style={{
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
          }}
        >
          I UNDERSTAND THE RISKS - PROCEED
        </motion.button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By proceeding, you acknowledge that you have read and understood this warning.
        </p>
      </motion.div>
    </motion.div>
  )
}
