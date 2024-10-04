import { cookieStorage, createStorage, http } from "@wagmi/core"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, binanceSmartChain } from "@reown/appkit/networks"
import { blockFit } from "./chains"
import { CaipNetwork } from "@reown/appkit"

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error("Project ID is not defined")
}

export const networks = [mainnet, binanceSmartChain, blockFit as CaipNetwork]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig
