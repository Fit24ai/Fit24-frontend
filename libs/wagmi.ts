import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"

import { cookieStorage, createStorage, custom, http } from "wagmi"
import { bsc, bscTestnet, holesky, mainnet } from "wagmi/chains"
import { blockfit } from "./chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

// Create wagmiConfig
// const chains = [mainnet, bsc] as const
// const chains = [holesky, bscTestnet, blockfit] as const
const chains = [mainnet, bsc, blockfit] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
  storage: createStorage({
    storage: {
      ...cookieStorage,
      getItem: (key: string) => {
        const item = cookieStorage.getItem(key) // Ensure key is of type string
        return item ? JSON.parse(item) : null // Parse if item exists
      },
      setItem: (key: string, value: any) => {
        // Ensure key is of type string
        cookieStorage.setItem(key, JSON.stringify(value)) // Stringify value before storing
      },
      removeItem: (key: string) => {
        cookieStorage.removeItem(key) // Ensure key is string
      },
    },
  }),
})
