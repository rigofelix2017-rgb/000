"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useHaptic } from "@/lib/mobile-optimization-hooks"
import { HapticPattern } from "@/lib/mobile-optimization"

const SLOT_SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"]
const SUITS = ["♠", "♥", "♦", "♣"]
const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

type Card = { rank: string; suit: string }

export function CasinoGame({ type, onClose }: any) {
  const [bet, setBet] = useState(10)
  const [result, setResult] = useState<any>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [balance, setBalance] = useState(10500)

  // Poker state
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false])
  const [gamePhase, setGamePhase] = useState<"bet" | "draw" | "result">("bet")

  const haptic = useHaptic()

  const createDeck = (): Card[] => {
    const deck: Card[] = []
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ rank, suit })
      }
    }
    return deck.sort(() => Math.random() - 0.5)
  }

  const evaluateHand = (hand: Card[]): { name: string; multiplier: number } => {
    const ranks = hand.map((c) => RANKS.indexOf(c.rank))
    const suits = hand.map((c) => c.suit)

    const rankCounts = ranks.reduce(
      (acc, r) => {
        acc[r] = (acc[r] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const counts = Object.values(rankCounts).sort((a, b) => b - a)
    const isFlush = suits.every((s) => s === suits[0])
    const sorted = [...ranks].sort((a, b) => a - b)
    const isStraight = sorted.every((r, i) => i === 0 || r === sorted[i - 1] + 1)

    if (isFlush && isStraight) return { name: "Royal Flush", multiplier: 250 }
    if (counts[0] === 4) return { name: "Four of a Kind", multiplier: 25 }
    if (counts[0] === 3 && counts[1] === 2) return { name: "Full House", multiplier: 9 }
    if (isFlush) return { name: "Flush", multiplier: 6 }
    if (isStraight) return { name: "Straight", multiplier: 4 }
    if (counts[0] === 3) return { name: "Three of a Kind", multiplier: 3 }
    if (counts[0] === 2 && counts[1] === 2) return { name: "Two Pair", multiplier: 2 }
    if (counts[0] === 2) return { name: "Pair", multiplier: 1 }
    return { name: "High Card", multiplier: 0 }
  }

  const handlePokerDeal = () => {
    if (bet > balance) return

    haptic(HapticPattern.MEDIUM)

    setBalance(balance - bet)
    setIsSpinning(true)

    const deck = createDeck()
    setPlayerHand(deck.slice(0, 5))
    setDealerHand([])
    setHeld([false, false, false, false, false])
    setGamePhase("draw")
    setResult(null)

    setTimeout(() => setIsSpinning(false), 500)
  }

  const handlePokerDraw = () => {
    haptic(HapticPattern.MEDIUM)
    setIsSpinning(true)

    const deck = createDeck()
    let cardIndex = 0
    const newHand = playerHand.map((card, i) => {
      if (held[i]) return card
      return deck[cardIndex++]
    })

    setPlayerHand(newHand)

    setTimeout(() => {
      const evaluation = evaluateHand(newHand)
      const payout = bet * evaluation.multiplier

      setResult({
        hand: evaluation.name,
        payout,
        isWin: evaluation.multiplier > 0,
      })

      if (payout > 0) {
        haptic(HapticPattern.SUCCESS)
        setBalance(balance + bet + payout)
      } else {
        haptic(HapticPattern.ERROR)
      }

      setGamePhase("result")
      setIsSpinning(false)
    }, 1000)
  }

  const toggleHold = (index: number) => {
    if (gamePhase !== "draw") return
    haptic(HapticPattern.LIGHT)
    const newHeld = [...held]
    newHeld[index] = !newHeld[index]
    setHeld(newHeld)
  }

  const resetPoker = () => {
    setGamePhase("bet")
    setPlayerHand([])
    setResult(null)
    setHeld([false, false, false, false, false])
  }

  const handleSpin = async () => {
    if (bet > balance) return

    haptic(HapticPattern.MEDIUM)
    setIsSpinning(true)
    setResult(null)
    setBalance(balance - bet)

    // Simulate spin
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const outcome = Array(3)
      .fill(0)
      .map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)])

    const isWin = outcome.every((symbol) => symbol === outcome[0])
    const multiplier = isWin ? (outcome[0] === "💎" ? 10 : outcome[0] === "7️⃣" ? 20 : 5) : 0
    const payout = bet * multiplier

    setResult({ outcome, isWin, payout })
    if (isWin) {
      haptic(HapticPattern.SUCCESS)
      setBalance(balance + payout)
    } else {
      haptic(HapticPattern.ERROR)
    }
    setIsSpinning(false)
  }

  const handleDiceRoll = async () => {
    if (bet > balance) return

    haptic(HapticPattern.HEAVY)
    setIsSpinning(true)
    setResult(null)
    setBalance(balance - bet)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const roll = Math.floor(Math.random() * 100) + 1
    const target = 50
    const isWin = roll > target
    const payout = isWin ? bet * 1.98 : 0

    setResult({ roll, isWin, payout })
    if (isWin) {
      haptic(HapticPattern.SUCCESS)
      setBalance(balance + payout)
    } else {
      haptic(HapticPattern.ERROR)
    }
    setIsSpinning(false)
  }

  if (type === "poker") {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-8 max-w-4xl mx-auto border-4 border-purple-400">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black text-purple-300">🃏 VIDEO POKER</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-red-400 transition">
            ✕
          </button>
        </div>

        {/* Balance */}
        <div className="bg-black/50 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-400 text-sm">Balance</p>
          <p className="text-green-400 text-3xl font-bold">{balance} VOID</p>
        </div>

        {/* Pay Table */}
        <div className="bg-black/30 rounded-lg p-4 mb-4 grid grid-cols-2 gap-2 text-sm">
          <div className="text-yellow-400">Royal Flush: 250x</div>
          <div className="text-yellow-300">Four of a Kind: 25x</div>
          <div className="text-green-400">Full House: 9x</div>
          <div className="text-green-300">Flush: 6x</div>
          <div className="text-cyan-400">Straight: 4x</div>
          <div className="text-cyan-300">Three of a Kind: 3x</div>
          <div className="text-blue-400">Two Pair: 2x</div>
          <div className="text-blue-300">Pair: 1x</div>
        </div>

        {/* Cards */}
        <div className="bg-black/70 rounded-2xl p-8 mb-6">
          {playerHand.length > 0 ? (
            <div className="flex justify-center gap-4">
              {playerHand.map((card, i) => (
                <motion.button
                  key={i}
                  onClick={() => toggleHold(i)}
                  className="relative"
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isSpinning ? { rotateY: [0, 180, 360] } : {}}
                >
                  <div
                    className={`w-24 h-36 rounded-lg flex flex-col items-center justify-center text-4xl font-bold border-4 transition-all ${
                      held[i]
                        ? "bg-yellow-100 border-yellow-400 shadow-lg shadow-yellow-400/50"
                        : "bg-white border-gray-300"
                    } ${["♥", "♦"].includes(card.suit) ? "text-red-600" : "text-black"}`}
                  >
                    <span className="text-2xl">{card.rank}</span>
                    <span className="text-3xl">{card.suit}</span>
                  </div>
                  {held[i] && gamePhase === "draw" && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                      HELD
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-24 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center"
                >
                  <span className="text-gray-600 text-4xl">🃏</span>
                </div>
              ))}
            </div>
          )}

          {result && (
            <motion.div className="text-center mt-6" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {result.isWin ? (
                <>
                  <p className="text-yellow-400 text-3xl font-black mb-2">{result.hand}!</p>
                  <p className="text-green-400 text-2xl font-bold">WIN +{result.payout} VOID</p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 text-2xl font-bold">{result.hand}</p>
                  <p className="text-red-400 text-xl">No Win</p>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gamePhase === "bet" && (
            <>
              <div>
                <label className="text-white text-sm mb-2 block">Bet Amount</label>
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  className="w-full bg-black/50 text-white px-4 py-3 rounded-lg text-center text-xl font-bold"
                  min="1"
                  max={balance}
                />
              </div>
              <motion.button
                onClick={handlePokerDeal}
                disabled={isSpinning || bet > balance}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-lg font-black text-xl disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSpinning ? "🃏 DEALING..." : "🃏 DEAL"}
              </motion.button>
            </>
          )}

          {gamePhase === "draw" && (
            <motion.button
              onClick={handlePokerDraw}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-lg font-black text-xl disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSpinning ? "🔄 DRAWING..." : "🔄 DRAW"}
            </motion.button>
          )}

          {gamePhase === "result" && (
            <motion.button
              onClick={resetPoker}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-4 rounded-lg font-black text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎲 PLAY AGAIN
            </motion.button>
          )}
        </div>

        {gamePhase === "draw" && (
          <p className="text-gray-400 text-xs text-center mt-4">Click cards to hold them before drawing</p>
        )}
      </div>
    )
  }

  if (type === "slots") {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 rounded-2xl p-8 max-w-2xl mx-auto border-4 border-yellow-400">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black text-yellow-400">🎰 SLOT MACHINE</h2>
          <button onClick={onClose} className="text-white text-2xl">
            ✕
          </button>
        </div>

        {/* Balance */}
        <div className="bg-black/50 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-400 text-sm">Balance</p>
          <p className="text-green-400 text-3xl font-bold">{balance} VOID</p>
        </div>

        {/* Reels */}
        <div className="bg-black/70 rounded-2xl p-8 mb-6">
          <div className="flex justify-center gap-4">
            {(result?.outcome || ["❓", "❓", "❓"]).map((symbol: string, i: number) => (
              <motion.div
                key={i}
                className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-5xl"
                animate={
                  isSpinning
                    ? {
                        y: [0, -20, 0],
                        rotate: [0, 360, 720],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                  delay: i * 0.1,
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          {result && (
            <motion.div className="text-center mt-6" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {result.isWin ? (
                <>
                  <p className="text-yellow-400 text-3xl font-black mb-2">🎉 WIN! 🎉</p>
                  <p className="text-green-400 text-2xl font-bold">+{result.payout} VOID</p>
                </>
              ) : (
                <p className="text-red-400 text-2xl font-bold">Try Again!</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2 block">Bet Amount</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full bg-black/50 text-white px-4 py-3 rounded-lg text-center text-xl font-bold"
              min="1"
              max={balance}
            />
          </div>

          <motion.button
            onClick={handleSpin}
            disabled={isSpinning || bet > balance}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-lg font-black text-xl disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpinning ? "🎰 SPINNING..." : "🎰 SPIN"}
          </motion.button>
        </div>
      </div>
    )
  }

  if (type === "dice") {
    return (
      <div className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 rounded-2xl p-8 max-w-2xl mx-auto border-4 border-cyan-400">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black text-cyan-400">🎲 DICE ROLL</h2>
          <button onClick={onClose} className="text-white text-2xl">
            ✕
          </button>
        </div>

        {/* Balance */}
        <div className="bg-black/50 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-400 text-sm">Balance</p>
          <p className="text-green-400 text-3xl font-bold">{balance} VOID</p>
        </div>

        {/* Dice Display */}
        <div className="bg-black/70 rounded-2xl p-8 mb-6 text-center">
          <motion.div
            className="inline-block"
            animate={isSpinning ? { rotate: 360 } : {}}
            transition={{ duration: 0.5, repeat: isSpinning ? Number.POSITIVE_INFINITY : 0 }}
          >
            <div className="text-9xl">🎲</div>
          </motion.div>

          {result && (
            <motion.div className="mt-6" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <p className="text-white text-5xl font-black mb-4">{result.roll}</p>
              {result.isWin ? (
                <>
                  <p className="text-green-400 text-3xl font-black mb-2">🎉 WIN! 🎉</p>
                  <p className="text-green-400 text-2xl font-bold">+{result.payout} VOID</p>
                </>
              ) : (
                <p className="text-red-400 text-2xl font-bold">Try Again!</p>
              )}
            </motion.div>
          )}

          <p className="text-gray-400 text-sm mt-4">Roll over 50 to win 1.98x</p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2 block">Bet Amount</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full bg-black/50 text-white px-4 py-3 rounded-lg text-center text-xl font-bold"
              min="1"
              max={balance}
            />
          </div>

          <motion.button
            onClick={handleDiceRoll}
            disabled={isSpinning || bet > balance}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-4 rounded-lg font-black text-xl disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpinning ? "🎲 ROLLING..." : "🎲 ROLL DICE"}
          </motion.button>
        </div>
      </div>
    )
  }

  return null
}
