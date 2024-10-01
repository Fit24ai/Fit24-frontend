import { defineChain, getAddress } from "viem"
import { Chain, bsc, bscTestnet, holesky, mainnet } from "viem/chains"

export enum ChainEnum {
  ETHEREUM = "ETHEREUM",
  BINANCE = "BINANCE",
  POLYGON = "POLYGON",
  BLOCKFIT = "BLOCKFIT",
}

export type AddressString = `0x${string}`

export const blockfit = defineChain({
  id: 2024,
  name: "BlockFit",
  nativeCurrency: {
    decimals: 18,
    name: "BlockFit",
    symbol: "BFIT",
  },
  rpcUrls: {
    default: {
      http: ["http://rpc.blockfitscan.io"],
      // webSocket: ['wss://rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://blockfitscan.io/" },
  },
})

// * DEV
export const ethereumPaymentAddress: AddressString =
  "0xA47010B505f8C5696eC6C95a7Bfe9E28C977EC6E"
export const binancePaymentAddress: AddressString =
  "0x15600Fc6bd21c54b3F8cBF6a04562C2021f0d3F2"
export const vestingAddress: AddressString =
  "0x9Ae55AEFb2Aa047627EF42B67aD49730517DAb52"

export const fit24TokenAddress: AddressString =
  "0xd04A199ed9Ae3D1099Ed9c010464F52a7FB5de73"
export const fit24ContractAddress: AddressString =
  "0x4fC613ef372466007b8f99b4C91D2b60737141DD"
// export const fit24ContractAddress: AddressString =
//   "0xe86FAe5693351bE8BD58Bde4C3660A715969532F"
// export const fit24ContractAddress: AddressString =
//   "0xb0810a10FD74DeDFca66e91d759b7357a61f9EfB"
// export const fit24ContractAddress: AddressString =
//   "0xe3CC06a247187F8A33C50E09fE06D1537c47Ec40"
// export const fit24ContractAddress: AddressString =
//   "0xeadbc8c7a9faac417a48bdf7a0a4eee4b7ffeaaa"

// export const fit24ReferralContractAddress: AddressString =
//   "0xeb0B6A10159d31912a01b5DA2E49b37De7FB916c"
export const fit24ReferralContractAddress: AddressString =
  "0x7214f89A295d3cc18D8Ad0752B773Eb92a46b7bd"

// * PROD
// export const ethereumPaymentAddress: AddressString =
//   "0xC8368489d0050b0F2947d5ece5CCA26e285d4C5F"
// export const binancePaymentAddress: AddressString =
//   "0x66d5f9804cA50da3Fa06E155bedaDa5f8F36bafD"
// export const vestingAddress: AddressString =
//   "0xFb97CAC3B41078bc026CB05BD9f15F8204aa7bc2"

// * DEV
export const vestingChainId = bscTestnet.id

export const ETHEREUM = holesky
export const BINANCE = bscTestnet

// * PROD
// export const vestingChainId = blockfit.id

// export const ETHEREUM = mainnet
// export const BINANCE = bsc

// * PROD
// export const tokens: {
//   symbol: string;
//   logo: string;
//   address: AddressString;
//   decimal: number;
//   chain: Chain;
//   enum: ChainEnum;
// }[] = [
//     {
//       symbol: "USDT",
//       logo: "/tokens/usdt.svg",
//       address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
//       decimal: 6,
//       chain: ETHEREUM,
//       enum: ChainEnum.ETHEREUM,
//     },
//     {
//       symbol: "USDC",
//       logo: "/tokens/usdc.svg",
//       address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//       decimal: 6,
//       chain: ETHEREUM,
//       enum: ChainEnum.ETHEREUM,
//     },
//     {
//       symbol: "USDT",
//       logo: "/tokens/usdt.svg",
//       address: "0x55d398326f99059fF775485246999027B3197955",
//       decimal: 18,
//       chain: BINANCE,
//       enum: ChainEnum.BINANCE,
//     },
//     {
//       symbol: "USDC",
//       logo: "/tokens/usdc.svg",
//       address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
//       decimal: 18,
//       chain: BINANCE,
//       enum: ChainEnum.BINANCE,
//     },
//   ]

// * DEV
export const tokens: {
  symbol: string
  logo: string
  address: AddressString
  decimal: number
  chain: Chain
  enum: ChainEnum
}[] = [
  {
    symbol: "USDT",
    logo: "/tokens/usdt.svg",
    address: "0x1d75713e9E1CB9e2F6827Cda8F9FdEcD4649a4D4",
    decimal: 18,
    chain: ETHEREUM,
    enum: ChainEnum.ETHEREUM,
  },
  {
    symbol: "USDC",
    logo: "/tokens/usdC.svg",
    address: "0xFE72640B24ee6a35Eed91977944aC632C77b4480",
    decimal: 18,
    chain: ETHEREUM,
    enum: ChainEnum.ETHEREUM,
  },
  {
    symbol: "USDTb",
    logo: "/tokens/usdt.svg",
    address: "0x847FDB7e448cAE219789075e3cd0749bf0d7D64a",
    decimal: 18,
    chain: BINANCE,
    enum: ChainEnum.BINANCE,
  },
  {
    symbol: "USDCb",
    logo: "/tokens/usdc.svg",
    address: "0x97c44ccbdE4b2bC39a1EBEfDA26bA5BAea66eFA1",
    decimal: 18,
    chain: BINANCE,
    enum: ChainEnum.BINANCE,
  },
]

export function getPaymentContractAddress(chainId: number) {
  switch (chainId) {
    case ETHEREUM.id:
      return ethereumPaymentAddress
    case BINANCE.id:
      return binancePaymentAddress
    case blockfit.id:
      return undefined
    default:
      throw new Error("Invalid chainId")
  }
}

export function getChainLogo(chainId: number) {
  switch (chainId) {
    case ETHEREUM.id:
      return "/tokens/eth.svg"
    case BINANCE.id:
      return "/tokens/bnb.svg"
    case blockfit.id:
      return "Fit24-icon.svg"
    default:
      throw "/tokens/eth.svg"
  }
}

export function getChain(chain: Chain | undefined) {
  if (!chain) return ETHEREUM

  return chain
}

export function getChainEnum(chainId: number) {
  switch (chainId) {
    case ETHEREUM.id:
      return ChainEnum.ETHEREUM
    case BINANCE.id:
      return ChainEnum.BINANCE
    case blockfit.id:
      return ChainEnum.BLOCKFIT
    default:
      return ChainEnum.ETHEREUM
  }
}
export function getScanURL(chain: ChainEnum) {
  switch (chain) {
    case ChainEnum.ETHEREUM:
      return (
        process.env.NEXT_PUBLIC_ETHEREUM_PRC_PROVIDER || "https://etherscan.io"
      )
    case ChainEnum.BINANCE:
      return (
        process.env.NEXT_PUBLIC_BINANCE_PRC_PROVIDER || "https://bscscan.com"
      )
    default:
      return "https://etherscan.io"
  }
}

export function getDecimal(address: string) {
  if (!address) return
  const token = tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
  return token ? token.decimal : 6
}

export const blockFit = {
  id: 2024,
  name: "BlockFit",
  nativeCurrency: { name: "BlockFit", symbol: "BFIT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.blockfitscan.io"] },
  },
  blockExplorers: {
    default: { name: "BlockFitScan", url: "https://blockfitscan.io" },
  },
}
