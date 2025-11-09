let wagmiConfig: any

try {
  const { http, createConfig } = require("wagmi")
  const { base } = require("wagmi/chains")
  const { injected, metaMask, coinbaseWallet, walletConnect } = require("wagmi/connectors")

  wagmiConfig = createConfig({
    chains: [base],
    connectors: [
      injected(),
      coinbaseWallet({
        appName: "PSX VOID Metaverse",
        preference: "smartWalletOnly",
      }),
      metaMask(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id",
        metadata: {
          name: "PSX VOID Metaverse",
          description: "On-chain creator economy and metaverse on Base",
          url: "https://psx.void.city",
          icons: ["https://psx.void.city/icon.png"],
        },
      }),
    ],
    transports: {
      [base.id]: http(),
    },
    ssr: true,
  })
} catch (error) {
  console.error("[v0] Failed to initialize wagmi config:", error)
  wagmiConfig = null
}

export { wagmiConfig }
