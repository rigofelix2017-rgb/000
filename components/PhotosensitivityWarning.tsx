"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

interface PhotosensitivityWarningProps {
  onAccept: () => void
}

export function PhotosensitivityWarning({ onAccept }: PhotosensitivityWarningProps) {
  const [accepted, setAccepted] = useState(false)

  const handleAccept = () => {
    setAccepted(true)
    setTimeout(onAccept, 500)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Film grain */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')] animate-grain" />
      </div>

      <motion.div
        className="max-w-2xl mx-4 md:mx-8 p-6 md:p-8 border-2 border-[#ff0032] rounded-xl backdrop-blur-xl overflow-y-auto max-h-[90vh]"
        style={{
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 0, 10, 0.95) 100%)",
          boxShadow: "0 0 40px rgba(255, 0, 50, 0.3), inset 0 0 60px rgba(255, 0, 50, 0.1)",
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-[#ff0032]" />
          </motion.div>
          <h1 className="text-2xl md:text-4xl font-black text-[#ff0032] tracking-widest font-mono">
            PHOTOSENSITIVITY WARNING
          </h1>
        </div>

        {/* Warning content */}
        <div className="space-y-4 text-[#d6d8df] text-sm md:text-base leading-relaxed font-mono">
          <p>
            <strong className="text-[#ff0032]">⚠ WARNING:</strong> This experience contains:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4 text-[#00f0ff]">
            <li>Rapid flashing lights and color changes</li>
            <li>High-contrast visual effects (RGB splits, inversions)</li>
            <li>Intense particle animations and motion blur</li>
            <li>Pulsing emissive effects and bloom</li>
          </ul>

          <div className="bg-black/50 p-4 rounded-lg border border-[#7b00ff]/30 mt-4">
            <p className="text-xs md:text-sm text-[#d6d8df]/80">
              <strong className="text-[#ff0032]">DISCONTINUE USE if you experience:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 text-xs md:text-sm text-[#d6d8df]/60 space-y-1">
              <li>Dizziness, altered vision, or eye twitching</li>
              <li>Muscle twitching or involuntary movements</li>
              <li>Loss of awareness or disorientation</li>
            </ul>
          </div>

          <p className="text-xs md:text-sm text-[#d6d8df]/70 mt-4">
            A small percentage of people may experience seizures when exposed to certain visual patterns, even with no
            history of epilepsy. If you have a history of seizures or epilepsy, consult a physician before entering.
          </p>
        </div>

        {/* Accept button */}
        <motion.button
          onClick={handleAccept}
          className="w-full mt-8 px-6 py-4 bg-black border-2 border-[#00f0ff] text-[#00f0ff] font-black text-lg md:text-xl tracking-widest font-mono rounded-lg transition-all duration-300 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] uppercase"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {accepted ? "ENTERING THE VOID..." : "I UNDERSTAND • ENTER THE VOID"}
        </motion.button>

        <p className="text-center text-xs text-[#d6d8df]/40 mt-4 font-mono">
          Press ESC or close browser to exit
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
    </motion.div>
  )
}
