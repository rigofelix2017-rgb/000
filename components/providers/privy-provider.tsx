"use client"

import type React from "react"
import { Suspense, lazy } from "react"

const PrivyProvider = lazy(() => {
  // Check if Privy is configured before attempting to load
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!privyAppId || privyAppId === "") {
    console.log("[v0] Privy not configured, skipping provider")
    return Promise.resolve({
      default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    })
  }

  return import("@privy-io/react-auth")
    .then((mod) => ({ default: mod.PrivyProvider }))
    .catch((error) => {
      console.error("[v0] Failed to load Privy provider:", error)
      return {
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      }
    })
})

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  if (!privyAppId || privyAppId === "") {
    return <>{children}</>
  }

  let baseChain
  try {
    const viemChains = require("viem/chains")
    baseChain = viemChains.base
  } catch (error) {
    console.error("[v0] Failed to load viem chains:", error)
    return <>{children}</>
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <PrivyProvider
        appId={privyAppId}
        config={{
          loginMethods: ["email", "google", "twitter", "discord", "wallet"],
          appearance: {
            theme: "dark",
            accentColor: "#06FFA5",
            logo: "https://psx.agency/logo.png",
            walletList: ["coinbase_wallet", "metamask", "rainbow", "wallet_connect"],
          },
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
          defaultChain: baseChain,
          supportedChains: [baseChain],
          externalWallets: {
            coinbaseWallet: {
              connectionOptions: "all",
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </Suspense>
  )
}
