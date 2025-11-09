"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useAccount } from "wagmi"
import { Wallet, LogOut, ChevronDown, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export function WalletConnectButton() {
  const [showMenu, setShowMenu] = useState(false)
  const privyHook = usePrivy()
  const walletsHook = useWallets()
  const { address } = useAccount()

  const primaryWallet = walletsHook.wallets[0]
  const { ready, authenticated, login, logout, user } = privyHook

  useEffect(() => {
    if (!authenticated || !primaryWallet) return

    const walletAddress = primaryWallet.address
    const privyUserId = user?.id

    fetch("/api/link-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, privyUserId }),
    }).catch((err) => {
      console.error("[v0] Failed to link wallet:", err)
    })
  }, [authenticated, primaryWallet, user]) // Updated dependency list

  if (!ready) {
    return (
      <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg">
        <div className="w-24 h-5 bg-slate-700 animate-pulse rounded" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
      </button>
    )
  }

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : user?.wallet?.address
      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      : "Connected"

  const fullAddress = address || user?.wallet?.address

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 border-2 border-cyan-500/50 hover:border-cyan-500 rounded-lg transition-all shadow-lg"
      >
        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-cyan-400 font-bold font-mono text-sm">{displayAddress}</span>
        <ChevronDown className="w-4 h-4 text-cyan-400" />
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border-2 border-cyan-500/50 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Connected Wallet</div>
              <div className="text-sm text-white font-mono break-all">{fullAddress}</div>
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Base Network
              </div>
              {user?.email && (
                <div className="mt-2 text-xs text-slate-400">
                  Email: <span className="text-cyan-400">{user.email.address}</span>
                </div>
              )}
              {user?.google && (
                <div className="mt-2 text-xs text-slate-400">
                  Google: <span className="text-cyan-400">{user.google.email}</span>
                </div>
              )}
            </div>

            {primaryWallet && (
              <div className="p-3 border-b border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Wallet Type</div>
                <div className="text-sm text-cyan-400 font-bold capitalize">{primaryWallet.walletClientType}</div>
              </div>
            )}

            {fullAddress && (
              <a
                href={`https://basescan.org/address/${fullAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-4 py-3 text-cyan-400 hover:bg-cyan-500/10 transition-colors border-b border-slate-700"
                onClick={() => setShowMenu(false)}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="font-bold text-sm">View on BaseScan</span>
              </a>
            )}

            <button
              onClick={() => {
                logout()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-bold text-sm">Disconnect</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
