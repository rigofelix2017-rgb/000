"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { EpilepsyWarning } from "./EpilepsyWarning"
import { ConsciousnessPuzzle } from "./ConsciousnessPuzzle"
import { BaseWalletModal } from "./BaseWalletModal"

interface IntroSequenceProps {
  onComplete: () => void
}

type IntroStage = "epilepsy" | "puzzle" | "wallet" | "complete"

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState<IntroStage>("epilepsy")
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  useEffect(() => {
    const introSeen = localStorage.getItem("void_intro_seen")
    if (introSeen === "true") {
      setHasSeenIntro(true)
      onComplete()
    }
    // Removed the else branch that was skipping the intro
  }, [onComplete])

  const handleEpilepsyAccept = () => {
    setStage("puzzle")
  }

  const handlePuzzleComplete = () => {
    setStage("wallet") // Go directly to wallet after puzzle (splash removed from flow)
  }

  const handleWalletComplete = () => {
    setStage("complete")
    localStorage.setItem("void_intro_seen", "true")
    onComplete()
  }

  const handleWalletSkip = () => {
    setStage("complete")
    localStorage.setItem("void_intro_seen", "true")
    onComplete()
  }

  if (hasSeenIntro) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "epilepsy" && <EpilepsyWarning key="epilepsy" onAccept={handleEpilepsyAccept} />}
      {stage === "puzzle" && <ConsciousnessPuzzle key="puzzle" onComplete={handlePuzzleComplete} />}
      {stage === "wallet" && (
        <BaseWalletModal key="wallet" onComplete={handleWalletComplete} onSkip={handleWalletSkip} />
      )}
    </AnimatePresence>
  )
}
