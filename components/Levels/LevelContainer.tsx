"use client"
import { fit24ReferralContractAddress, vestingChainId } from "@/libs/chains"
import { referralAbi } from "@/libs/referralAbi"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { FaLock, FaUnlock } from "react-icons/fa"
import { useAccount, useReadContracts } from "wagmi"
import { BsFillUnlockFill } from "react-icons/bs"
import { BsUnlockFill } from "react-icons/bs"
import { IoLockClosed } from "react-icons/io5"
import {
  getDirectMembersData,
  getTotalMembers,
  getUserLevel,
} from "@/services/stakingService"
import { useWallet } from "@/hooks/useWallet"
import { smallAddress } from "@/libs/utils"
import { CgSpinner } from "react-icons/cg"
import { BiRightArrow } from "react-icons/bi"
import { ArrowRight } from "lucide-react"

export default function LevelContainer() {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const { isLoggedIn } = useWallet()
  const { address } = useAccount()
  const [data, setData] = useState<any>([])
  const [totalMembers, setTotalMembers] = useState<any>({
    totalCount: 0,
    totalTeamStakedAmount: 0,
    stakersWithMoreThanZeroTokens: [],
    stakerCount: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [levelData, setLevelData] = useState<any>({
    totalCount: 0,
    zeroStakedCount: 0,
    stakedCount: 0,
    stakedData: [],
    totalStakedAmount: 0,
  })
  const [level, setLevel] = useState(0)
  const levels = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ]

  const levelsData = [
    {
      level: 1,
      percentage: 16,
    },
    {
      level: 2,
      percentage: 4,
    },
    {
      level: 3,
      percentage: 2,
    },
    {
      level: 4,
      percentage: 2,
    },
    {
      level: 5,
      percentage: 2,
    },
    {
      level: 6,
      percentage: 2,
    },
    {
      level: 7,
      percentage: 4,
    },
    {
      level: 8,
      percentage: 2,
    },
    {
      level: 9,
      percentage: 2,
    },
    {
      level: 10,
      percentage: 2,
    },
    {
      level: 11,
      percentage: 2,
    },
    {
      level: 12,
      percentage: 2,
    },
    {
      level: 13,
      percentage: 4,
    },
    {
      level: 14,
      percentage: 2,
    },
    {
      level: 15,
      percentage: 2,
    },
    {
      level: 16,
      percentage: 2,
    },
    {
      level: 17,
      percentage: 2,
    },
    {
      level: 18,
      percentage: 2,
    },
    {
      level: 19,
      percentage: 4,
    },
    {
      level: 20,
      percentage: 2,
    },
    {
      level: 21,
      percentage: 2,
    },
    {
      level: 22,
      percentage: 2,
    },
    {
      level: 23,
      percentage: 2,
    },
    {
      level: 24,
      percentage: 2,
    },
  ]

  const [loading, setLoading] = useState(false)
  const [memberLoading, setMemberLoading] = useState(false)

  // const { data: refreesData, isLoading: refeesLoading } = useReadContracts({
  //   allowFailure: true,
  //   contracts: [
  //     {
  //       abi: referralAbi,
  //       address: fit24ReferralContractAddress,
  //       functionName: "getAllRefrees",
  //       chainId: vestingChainId,
  //       args: [address],
  //     },
  //   ],
  // })

  // useEffect(() => {
  //   if (!isLoggedIn) return
  //   console.log(refreesData)
  //   if (!refreesData || !refreesData[0] || !refreesData[0].result) return
  //   console.log(refreesData[0].result)
  // }, [address, isLoggedIn])

  const getLevel = async () => {
    try {
      const res = await getUserLevel()
      setLevel(res.levelCount)
      // setSelectedLevel(res.levelCount)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    // if (!refreesData || !refreesData[0] || !refreesData[0].result) return
    // setData(refreesData[0].result)
    getLevel()
  }, [address, isLoggedIn])

  const getTotalMembersCount = async () => {
    setMemberLoading(true)
    try {
      const res = await getTotalMembers()
      console.log("total members", res)
      setTotalMembers(res)
      setMemberLoading(false)
    } catch (error) {
      console.log(error)
      setMemberLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalMembersCount()
  }, [address, isLoggedIn])

  useEffect(() => {
    if (!address) return
    setTimeout(() => {
      if (!isLoggedIn) return
      getLevel()
      getTotalMembersCount()
      getDirectMembersCount()
    }, 2000)
  }, [address])

  const getDirectMembersCount = async () => {
    try {
      setLoading(true)
      const res = await getDirectMembersData(selectedLevel)
      setLevelData(res)
      setLoading(false)
      console.log(res)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("continue")
    if (!isLoggedIn) return
    getDirectMembersCount()
  }, [address, isLoggedIn, level, selectedLevel])

  // Filter the staked data based on the search query
  const filteredStakedData = levelData.stakedData.filter((item: any) =>
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full flex flex-col h-screen gap-6 2md:py-8 py-4 2md:px-10 px-3">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-medium">Total Members</div>
        <div className="text-2xl font-medium">
          {memberLoading ? (
            <CgSpinner size={20} className="animate-spin" />
          ) : (
            totalMembers.stakerCount
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto text-sm">
        Scroll Right <ArrowRight size={20} />
      </div>
      <div className="flex gap-4 w-full overflow-x-auto pb-2">
        {levelsData.map((item, index) => {
          return (
            <button
              onClick={() => {
                setSelectedLevel(index + 1)
              }}
              // disabled={level < index + 1}
              key={index}
              className={`p-1 flex flex-col items-center w-full min-w-[120px]  ${
                selectedLevel === index + 1
                  ? "bg-themeGreen bg-opacity-30"
                  : "bg-white bg-opacity-5"
              }  rounded-lg`}
            >
              <div className="text-xs w-full flex items-center justify-between">
                <div className="p-1 bg-themeGreen bg-opacity-10 rounded-md">
                  {item.percentage}%
                </div>

                {level > index ? (
                  <BsUnlockFill size={20} />
                ) : (
                  <IoLockClosed size={20} />
                )}
              </div>
              <div className="w-8">
                <Image
                  src="/level/medal.svg"
                  alt="level"
                  width={40}
                  height={40}
                  className="w-full"
                />
              </div>
              <div className="text-sm">Level {item.level}</div>
            </button>
          )
        })}
      </div>
      <div className="w-full flex flex-col md:flex-row flex-1 items-center justify-between gap-6">
        <div className="md:max-w-[45%] w-full max-w-[500px] h-full max-h-[500px] md:order-none order-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-black bg-opacity-20 border border-themeGreen p-2 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-col gap-2 w-full">
            <div className="w-full px-6 flex justify-between text-gray-400">
              <div>Address</div>
              <div>Stake Amount</div>
            </div>
            <div className="w-full max-h-[500px] overflow-y-scroll flex flex-col gap-2">
              {filteredStakedData.map((item: any, index: any) => {
                return (
                  <div
                    className="bg-gray-600 bg-opacity-30 flex justify-between px-4 py-2"
                    key={index}
                  >
                    <div>{smallAddress(item.address)}</div>
                    <div>{item.tokens} Fit24</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="md:max-w-[50%] w-full max-w-[400px] flex flex-col gap-4 items-center ">
          {loading ? (
            <div className=" text-themeGreen font-medium">
              <CgSpinner size={50} className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-lg">Level {selectedLevel}</div>
              <div className="w-full flex gap-6">
                <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
                  <div className="text-gray-400">Total Members</div>
                  <div className="text-lg">{levelData.stakedCount}</div>
                </div>
                <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
                  <div className="text-gray-400">Team Staked</div>
                  <div className="text-lg">{levelData.totalStakedAmount}</div>
                </div>
              </div>
              {/* <div className="w-full flex gap-6">
                <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
                  <div className="text-gray-400 text-sm">Inactive Members</div>
                  <div>{levelData.zeroStakedCount}</div>
                </div>
                <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
                  <div className="text-gray-400 text-sm">Team Staked</div>
                  <div>{levelData.totalStakedAmount}</div>
                </div>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
