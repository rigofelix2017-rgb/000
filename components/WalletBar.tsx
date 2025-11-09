"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"

export function WalletBar() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const shortAddress = address && `${address.slice(0, 6)}...${address.slice(address.length - 4)}`

  return (
    <div className="bg-black/90 backdrop-blur-xl border-2 border-cyan-400/50 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-cyan-400 text-xs font-mono tracking-wider">BASE NETWORK</p>
          <p className="text-white font-bold text-sm mt-1">{isConnected ? shortAddress : "Not Connected"}</p>
        </div>
        <div className="flex gap-2">
          {!isConnected &&
            connectors.map((connector) => (
              <button
                key={connector.id}
                disabled={!connector.ready || isPending}
                onClick={() => connect({ connector })}
                className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-400 rounded-lg hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold disabled:opacity-40"
              >
                {connector.name}
              </button>
            ))}
          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="px-3 py-1.5 bg-red-500/20 border border-red-400 rounded-lg hover:bg-red-500/30 text-red-300 text-xs font-bold"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
