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

export const getQualifierBusiness = async () => {
  const res = await http.get(`/rewards/qualifier-business`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const getUnclaimedRewards = async () => {
  const res = await http.get(`/rewards/unclaimed-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const getClaimedApprovedRewards = async () => {
  const res = await http.get(`/rewards/claimed-approved-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const getClaimedPendingRewards = async () => {
  const res = await http.get(`/rewards/claimed-pending-rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const claimReward = async (rewardId: string) => {
  const res = await http.get(`/rewards/claim-reward/${rewardId}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const getAllRanksAndUserEligibilities = async () => {
  const res = await http.get(`/rank-rewards/ranks`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const getAllRewardsAndUserEligibilities = async () => {
  const res = await http.get(`/rewards/rewards`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}

export const claimRankReward = async (id: string) => {
  const res = await http.get(`/rank-rewards/claim-rank/${id}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return res.data
}



