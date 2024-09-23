"use client"
import { fit24ContractAddress, vestingChainId } from "@/libs/chains"
import { stakingAbi } from "@/libs/stakingAbi"
import { getNumber } from "@/libs/utils"
import { useEffect } from "react"
import { useAccount, useReadContracts } from "wagmi"

const StakeRewardClaimed = ({
  stakeId,
  onRewardClaimed,
}: {
  stakeId: number
  onRewardClaimed?: any
}) => {
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

  useEffect(() => {
    if (!onRewardClaimed) return
    if (!readStakeRewardClaimed) return
    onRewardClaimed(getNumber(readStakeRewardClaimed[0].result! as bigint, 18))
  }, [readStakeRewardClaimed])

  return (
    <>
      {readStakeRewardClaimed &&
        getNumber(readStakeRewardClaimed[0].result! as bigint, 18).toFixed(3)}
    </>
  )
}

export default StakeRewardClaimed
