"use client"
import { fit24ContractAddress, vestingChainId } from "@/libs/chains"
import { stakingAbi } from "@/libs/stakingAbi"
import { getNumber } from "@/libs/utils"
import { useEffect } from "react"
import { useAccount, useReadContracts } from "wagmi"

export default function TotalRewardClaimed(stakeId: number) {
  const { address } = useAccount()

  const { data: readStakeRewardClaimed, isLoading: stakeRewardClaimedLoading } =
    useReadContracts({
      allowFailure: true,
      contracts: [
        {
          abi: stakingAbi,
          address: fit24ContractAddress,
          functionName: "stakeRewardClaimed",
          chainId: vestingChainId,
          args: [stakeId],
        },
      ],
    })

  return (
    readStakeRewardClaimed &&
    getNumber(readStakeRewardClaimed[0].result! as bigint, 18).toFixed(3)
  )
}
