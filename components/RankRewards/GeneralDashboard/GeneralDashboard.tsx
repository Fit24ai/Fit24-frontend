"use client"
import { getAllRanksAndUserEligibilities, getAllRewardsAndUserEligibilities } from "@/services/rewards"
import { useState, useEffect } from "react"
import { CgSpinner } from "react-icons/cg"
import RankCard2 from "../RankDashboard/RankCard2"
import RewardCard2 from "./RewardCard2"

interface Rank {
  rank: {
    title: string
    qualifierAmount: number
    rewardAmount: number
    salary?: string
    description?: string
  }
  progressPercentage: number
  isEligibleForClaim: boolean
  claimStatus: string | null
}

interface RankData {
  ranks: Rank[]
  currentRank: { title: string; index: number }
}

export default function GeneralDashboard() {
  const [rankData, setRankData] = useState<any>(null)

  useEffect(() => {
    async function fetchRanks() {
      const response = await getAllRewardsAndUserEligibilities()
      console.log({ response })
      setRankData(response)
    }
    fetchRanks()
  }, [])

  return (
    <div className="h-full md:max-h-[90vh] max-h-[87vh] overflow-auto hide-scrollbar text-white md:p-6 p-3">
      {rankData ? (
        <>
          <div className="grid md:grid-cols-2 md:gap-6 gap-4">
            {rankData.rewards.map((item: any, index: number) => (
              <div
                key={index}
                className={`h-auto  ${
                  rankData.rewards.length % 2 !== 0 &&
                  index === rankData.rewards.length - 1
                    ? "md:col-span-2 flex justify-center"
                    : ""
                } `}
              >
                <div
                  className={`h-full ${
                    rankData.rewards.length % 2 !== 0 &&
                    index === rankData.rewards.length - 1
                      ? "md:min-w-[50%] md:w-auto w-full"
                      : ""
                  }`}
                >
                  <RewardCard2 item={item} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-full w-full flex justify-center items-center text-green-400">
          <CgSpinner className="h-16 w-16 animate-spin duration-300" />
        </div>
      )}
    </div>
  )
}
