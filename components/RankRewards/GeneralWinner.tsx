"use client"

import { useEffect, useState } from "react"
import OngoingRewardsCard from "./OngoingRewardsCard"
import Image from "next/image"
import {
  getClaimedApprovedRewards,
  getClaimedPendingRewards,
  getUnclaimedRewards,
} from "@/services/rewards"
import { PendingRewardsCard } from "./PendingRewardsCard"
import { ClaimedRewardsCard } from "./ClaimedRewardCard"

export default function GeneralWinner() {
  interface IReward {
    _id: string
    title: string
    status: "ACTIVE" | "INACTIVE"
    description: string
    qualifierAmount: number
    startDate: Date
    endDate: Date
    imageUrl: string
    userClaimedStatus: {
      userId: string
      claimStatus: "PENDING" | "APPROVED"
    }[]
    createdAt: Date
    updatedAt: Date
  }
  const [unclaimedRewards, setUnclaimedRewards] = useState<
    null | IReward[] | []
  >()
  const [claimedPendingRewards, setClaimedPendingRewards] = useState<
    null | IReward[] | []
  >()
  const [claimedApprovedRewards, setClaimedApprovedRewards] = useState<
    null | IReward[] | []
  >()
  const [tab, setTab] = useState("ongoing")
  const [totalRewards, setTotalRewards] = useState<number | null>(null)
  const [claimedRewards, setClaimedRewards] = useState<number | null>(null)
  const [pendingRewards, setPendingRewards] = useState<number | null>(null)
  const [claimedPercentage, setClaimedPercentage] = useState<number | null>(
    null
  )

  const getAllUnclaimedRewards = async () => {
    try {
      const res = await getUnclaimedRewards()
      console.log({ unclaimedRewards: res })
      setUnclaimedRewards(res)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllClaimedPendingRewards = async () => {
    try {
      const res = await getClaimedPendingRewards()
      console.log({ claimedPendingRewards: res })
      setClaimedPendingRewards(res)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllClaimedApprovedRewards = async () => {
    try {
      const res = await getClaimedApprovedRewards()
      console.log({ claimedApprovedRewards: res })
      setClaimedApprovedRewards(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllUnclaimedRewards()
    getAllClaimedPendingRewards()
    getAllClaimedApprovedRewards()
  }, [])

  useEffect(() => {
    if (unclaimedRewards && claimedPendingRewards && claimedApprovedRewards) {
      setTotalRewards(
        unclaimedRewards.length +
          claimedPendingRewards.length +
          claimedApprovedRewards.length
      )

      setClaimedRewards(
        claimedPendingRewards.length + claimedApprovedRewards.length
      )

      console.log({
        claimedRewards:
          claimedPendingRewards.length + claimedApprovedRewards.length,
      })
    }
  }, [unclaimedRewards, claimedPendingRewards, claimedApprovedRewards])

  useEffect(() => {
    if (totalRewards === null || claimedRewards === null) return
    setClaimedPercentage((claimedRewards / totalRewards) * 100)
    setPendingRewards(totalRewards - claimedRewards)
    console.log({ claimedPercentage: (claimedRewards / totalRewards) * 100 })
    console.log({ totalRewards })
  }, [claimedRewards, totalRewards])

  return (
    <div className="w-full md:py-6 pb-4   flex flex-col md:gap-6 gap-4 md:max-h-[78vh] max-h-[80vh] h-full md:overflow-auto">
      <div className="flex flex-col md:gap-6 gap-3 w-full  md:px-20 px-6 md:py-10 py-4 bg-[#282828] bg-opacity-70 ">
        <div className="md:text-2xl text-xl font-medium text-[#BCBEBD]">
          My Qualifications
        </div>
        <div className="flex flex-col gap-2">
          {/* <div className="w-full bg-gray-700 h-4 rounded-full relative">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: "42%" }}
            ></div>
          </div> */}

          {/* {claimedPercentage && totalRewards && (
            <div className="flex md:gap-2 gap-1">
              <div
                className=" md:h-4 h-2 rounded-full barGradient relative"
                style={{ width: claimedPercentage + "%" }}
              >
                <div className="absolute md:w-[35px] w-[25px] md:top-5 top-3 md:-right-4 -right-3 flex justify-center">
                  <Image
                    src="/rankrewards/Union.png"
                    alt="Union"
                    width={100}
                    height={100}
                    className="w-full"
                  />
                  <div className="z-10 md:text-sm text-[10px] absolute md:mt-3 mt-2">
                    {claimedPercentage?.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className=" md:h-4 h-2 flex-1 flex md:gap-2 gap-1">
                {Array.from({ length: totalRewards }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-500 h-full flex-1 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          )} */}

          {claimedPercentage !== null && pendingRewards !== null && (
            <div className="flex md:gap-2 gap-1">
              <div
                className="md:h-4 h-2 rounded-full barGradient relative"
                style={{ width: claimedPercentage + "%" }}
              >
                <div className="absolute md:w-[35px] w-[25px] md:top-5 top-3 md:-right-4 -right-3 flex justify-center">
                  <Image
                    src="/rankrewards/Union.png"
                    alt="Union"
                    width={100}
                    height={100}
                    className="w-full"
                  />
                  <div className="z-10 md:text-sm text-[10px] absolute md:mt-3 mt-2">
                    {claimedPercentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="md:h-4 h-2 flex-1 flex md:gap-2 gap-1">
                {Array.from({ length: pendingRewards }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-500 h-full flex-1 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between md:text-base text-xs">
            <p className=" text-white">0</p>
            <p className=" text-white">100</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:px-20 px-4 md:gap-6 gap-4">
        <div className="flex flex-col items-center md:gap-4 gap-2 ">
          <div className="md:text-2xl text-xl font-semibold">
            General Rewards
          </div>
          <div className="text-gray-400 md:text-base text-xs text-center">
            Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc
            adipiscing mattis lorem nisi sed. Et eget pellentesque ridicul.
          </div>
        </div>
        <div></div>
        <div className="flex flex-col gap-4">
          <div className="flex bg-gray-800 rounded-t-lg w-[500px]">
            <button
              onClick={() => setTab("ongoing")}
              className={`${
                tab === "ongoing" && "bg-green-500"
              } rounded-t-lg flex-1 px-6 py-2`}
            >
              On Going
            </button>
            <button
              onClick={() => setTab("pending")}
              className={`${
                tab === "pending" && "bg-green-500"
              } rounded-t-lg flex-1 px-6 py-2`}
            >
              Pending
            </button>
            <button
              onClick={() => setTab("claimed")}
              className={`${
                tab === "claimed" && "bg-green-500"
              } rounded-t-lg flex-1 px-6 py-2`}
            >
              Completed
            </button>
          </div>
          {tab === "ongoing" && (
            <>
              <div className="flex flex-col gap-3 max-h-[41vh] overflow-auto md:hidden">
                {unclaimedRewards &&
                  unclaimedRewards.map((reward, index) => (
                    <OngoingRewardsCard key={index} {...reward} />
                  ))}
              </div>
              <div className="md:flex flex-col gap-6 hidden">
                {unclaimedRewards &&
                  unclaimedRewards.map((reward, index) => (
                    <OngoingRewardsCard key={index} {...reward} />
                  ))}
              </div>
            </>
          )}
          {tab === "pending" && (
            <>
              <div className="flex flex-col gap-3 max-h-[41vh] overflow-auto md:hidden">
                {claimedPendingRewards &&
                  claimedPendingRewards.map((reward, index) => (
                    <PendingRewardsCard key={index} {...reward} />
                  ))}
              </div>
              <div className="md:flex flex-col gap-6 hidden">
                {claimedPendingRewards &&
                  claimedPendingRewards.map((reward, index) => (
                    <PendingRewardsCard key={index} {...reward} />
                  ))}
              </div>
            </>
          )}

          {tab === "claimed" && (
            <>
              <div className="flex flex-col gap-3 max-h-[41vh] overflow-auto md:hidden">
                {claimedApprovedRewards &&
                  claimedApprovedRewards.map((reward, index) => (
                    <ClaimedRewardsCard key={index} {...reward} />
                  ))}
              </div>
              <div className="md:flex flex-col gap-6 hidden">
                {claimedApprovedRewards &&
                  claimedApprovedRewards.map((reward, index) => (
                    <ClaimedRewardsCard key={index} {...reward} />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
