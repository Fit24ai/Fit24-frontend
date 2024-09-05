import { AddressString } from "@/libs/chains"
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

export const getReferralStream = async () => {
  const res = await http.get(`/staking/get-referral-stream`, {
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
