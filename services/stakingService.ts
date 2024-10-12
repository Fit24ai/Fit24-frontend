import { AddressString, ChainEnum } from "@/libs/chains"
import { TransactionStatusEnum } from "@/libs/transaction"
import { getAuthToken } from "@/libs/utils"
import axios from "axios"
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface IStakeDetails {
  _id: string
  amount: number
  apr: number
  poolType: number
  stakeId: number
  startTime: number
  walletAddress: string
  stakeDuration: number
  txHash: string
  isReferred: boolean
  transactionStatus: TransactionStatusEnum
}

export interface IClaimHistory {
  _id: string
  stakeId: string
  amount: number
  timestamp: number
  txHash: string
  poolType: number
  isReferred: boolean
}

export const getAllStakeTokens = async () => {
  const res = await http.get(`/staking/get-user-staked-tokens`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const createStake = async (
  txHash: string,
  poolType: number | undefined
) => {
  const res = await http.post(
    `/staking/create/${txHash}`,
    { poolType },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )
  return res.data
}

export async function getTransactions(tx: AddressString) {
  return (
    await http.get("/staking-transaction", {
      params: {
        tx,
      },
    })
  ).data
}

export const verifyStakingRecord = async (txHash: string) => {
  const res = await http.post(
    `/staking/verify/${txHash}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )
  return res.data
}

export const getAllStakesByUser = async (walletAddress: AddressString) => {
  const res = await http.get(
    `/staking/get-all-stakes-by-user/${walletAddress}`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )
  return res.data
}

export async function createStakingTransaction(
  transactionHash: AddressString,
  chain: ChainEnum
) {
  return (
    await http.post(
      "/staking-transaction/create",
      {
        transactionHash,
        chain,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    )
  ).data
}

export const createClaimReward = async (txHash: string) => {
  const res = await http.post(
    `/staking/create-claimed-reward-for-stake/${txHash}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )

  return res.data
}

export const getAllClaimedReward = async () => {
  const res = await http.get(`/staking/get-all-claimed-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  console.log(res.data[0])
  return res.data
}

export const getReferralStream = async (level?: number) => {
  const url = level
    ? `/staking/get-referral-stream/${level}`
    : `/staking/get-referral-stream`

  const res = await http.get(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  console.log(res.data[0])
  return res.data
}

export const getTotalMembers = async () => {
  const res = await http.get(`/staking/get-total-members`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  return res.data
}
export const getAllLevelRewardsClaimed = async () => {
  const res = await http.get(`/staking/get-all-level-claimed-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  return res.data
}
export const getAllStakeRewardsClaimed = async () => {
  const res = await http.get(`/staking/get-all-stake-claimed-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  return res.data
}

export const getTotalNetworkMembers = async () => {
  const res = await http.get(`/staking/get-total-network-members`)
  return res.data
}

export const getTotalNetworkStaked = async () => {
  const res = await http.get(`/staking/get-total-network-staked`)
  return res.data
}
export const getTotalNetworkWithdrawal = async () => {
  const res = await http.get(`/staking/get-total-network-withdrawal`)
  return res.data
}

export const getUserLevel = async () => {
  const res = await http.get(`/staking/get-user-level`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  return res.data
}

export const getDirectMembersData = async (level: number) => {
  const res = await http.post(
    `/staking/get-direct-members-data`,
    { level },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )
  return res.data
}
export const getMyUpline = async () => {
  const res = await http.get(`/staking/get-upline`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
  return res.data
}

export const registerReferral = async (
  userAddress: string,
  refAddress: string
) => {
  const res = await http.post(
    `/staking/register-referral`,
    { userAddress, refAddress },
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  )
  return res.data
}

export const getPaymentSuccess = async (txHash: string, chain: ChainEnum) => {
  const res = await http.post(`/staking/verify-payment-transaction/${txHash}`, {
    chain,
  })
  return res.data
}
export const getReferralIncome = async (address: AddressString) => {
  const res = await http.get(`/staking/get-referral-income/${address}`)
  return res.data
}
