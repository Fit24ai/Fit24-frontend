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
      http: ["https://rpc.blockfitscan.io"],
      // webSocket: ['wss://rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://blockfitscan.io/" },
  },
})

// * PROD
export const ethereumPaymentAddress: AddressString =
  "0x8B7547c84D435e96812b54B7d2AaEA48D4c49EDB"
export const binancePaymentAddress: AddressString =
  "0x72e56adb351Bc1DA1A37B2C5bB6cA40fBB373322"

// ! NOT USED
export const vestingAddress: AddressString =
  "0x9Ae55AEFb2Aa047627EF42B67aD49730517DAb52"

export const fit24TokenAddress: AddressString =
  "0xe30ce7C1daF26c9748B19B6b16D7B41d6254089B"
export const fit24ContractAddress: AddressString =
  "0x6a9f5Dae49b4414DFd32Cfd2aEea6f809E9CDE81"

export const fit24ReferralContractAddress: AddressString =
  "0x9Ebb1aeA67d601b6292B19Bafa94f2424ee5a662"
// * DEV
// export const ethereumPaymentAddress: AddressString =
//   "0xA47010B505f8C5696eC6C95a7Bfe9E28C977EC6E"
// export const binancePaymentAddress: AddressString =
//   "0x1d8bB89dE3e0C3b8B7cb2C0B1c93021f6d94AE4b"
// export const vestingAddress: AddressString =
//   "0x9Ae55AEFb2Aa047627EF42B67aD49730517DAb52"

// export const fit24TokenAddress: AddressString =
//   "0xd04A199ed9Ae3D1099Ed9c010464F52a7FB5de73"
// export const fit24ContractAddress: AddressString =
//   "0xE7f3E0243a3b3b478350d93CA4Fe965DF61Eb58B"

// export const fit24ReferralContractAddress: AddressString =
//   "0x3075Fd2a09e5a4a182924aA7442fC5E293ca1371"

// * PROD
export const binanceUsdtTokenAddress: AddressString =
  "0x55d398326f99059fF775485246999027B3197955"
export const ethereumUsdtTokenAddress: AddressString =
  "0xdAC17F958D2ee523a2206206994597C13D831ec7"

// * DEV
// export const binanceUsdtTokenAddress: AddressString =
//   "0x776D9c4Cab12287414093832C3AA3ED214E44719"
// export const ethereumUsdtTokenAddress: AddressString =
//   "0x776D9c4Cab12287414093832C3AA3ED214E44719"

// * PROD
// export const ethereumPaymentAddress: AddressString =
//   "0x8B7547c84D435e96812b54B7d2AaEA48D4c49EDB"
// export const binancePaymentAddress: AddressString =
//   "0x72e56adb351Bc1DA1A37B2C5bB6cA40fBB373322"
// export const vestingAddress: AddressString =
//   "0xFb97CAC3B41078bc026CB05BD9f15F8204aa7bc2"

// * DEV
// export const vestingChainId = bsc.id

// export const ETHEREUM = holesky
// export const BINANCE = bscTestnet

// * PROD
export const vestingChainId = blockfit.id

export const ETHEREUM = mainnet
export const BINANCE = bsc

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
export function getUsdtTokenAddress(chainId: number) {
  switch (chainId) {
    case ETHEREUM.id:
      return ethereumUsdtTokenAddress
    case BINANCE.id:
      return binanceUsdtTokenAddress
    // case blockfit.id:
    //   return undefined
    default:
      return ethereumUsdtTokenAddress
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
      return ChainEnum.ETHEREUM
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
