"use client"
import { getNumber, isValidAddress, smallAddress } from "@/libs/utils"
import {
  getAllClaimedReward,
  getAllLevelRewardsClaimed,
  getAllStakeRewardsClaimed,
  getAllStakeTokens,
  getMyUpline,
  getReferralStream,
} from "@/services/stakingService"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAccount, useReadContracts } from "wagmi"
import copy from "copy-to-clipboard"
import { BiLoaderCircle } from "react-icons/bi"
import { set } from "date-fns"
import { referralAbi } from "@/libs/referralAbi"
import {
  AddressString,
  fit24ContractAddress,
  fit24ReferralContractAddress,
  vestingChainId,
} from "@/libs/chains"
import { Address } from "viem"
import Rewards from "../Stake/Rewards"
import { CgSpinner } from "react-icons/cg"
import Image from "next/image"
import { useWallet } from "@/hooks/useWallet"
import { getUserRefIncome, getUserTokens } from "@/services/token"
import { DateRangePicker } from "react-date-range"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file
import { stakingAbi } from "@/libs/stakingAbi"
import { it } from "node:test"
import StakeRewardClaimed from "../shared/StakeRewardClaimed"
import TotalRewardClaimed from "../shared/TotalRewards"

export default function RewardsContainer() {
  const { isLoggedIn } = useWallet()
  const { address, isConnected } = useAccount()
  const [referralStream, setReferralStream] = useState([])
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [isCopyAddress, setCopyAddress] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [selectedFromLevel, setSelectedFromLevel] = useState(null)

  const { data: readReferrer, isLoading: referrerLoading } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: referralAbi,
        address: fit24ReferralContractAddress,
        functionName: "getReferrer",
        chainId: vestingChainId,
        args: [address],
      },
    ],
  })
  console.log(readReferrer, "hello")

  const formattedStakeDuration = (startTime: number, duration: number) => {
    const startDate: Date = new Date(startTime * 1000)

    const endTime: number = startTime + duration
    const endDate: Date = new Date(endTime * 1000)

    const currentDate: Date = new Date()

    const timeDifference: number = endDate.getTime() - currentDate.getTime()

    const millisecondsInADay: number = 1000 * 60 * 60 * 24

    const daysLeft: number = Math.ceil(timeDifference / millisecondsInADay)

    return daysLeft
  }

  const getDays = (duration: number) => {
    const millisecondsInADay: number = 1000 * 60 * 60 * 24

    // Calculate the total days from the given duration (in seconds)
    const days: number = Math.ceil(duration / (60 * 60 * 24))

    return days
  }

  const formattedDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  }

  const handleButtonClick = () => {
    setIsAlertVisible(true)
    copy(`${window.location.origin}?stakeRef=${address}`)
    setTimeout(() => {
      setIsAlertVisible(false)
    }, 3000)
  }

  const formattedDateTime = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`
    const formattedTime = `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`
    return { formattedDate, formattedTime }
  }

  const copyAddress = (address: string) => {
    setCopyAddress(true)
    copy(address)
    setTimeout(() => {
      setCopyAddress(false)
    }, 3000)
  }

  const [totalRewards, setTotalRewards] = useState(0)
  const [referralRewards, setReferralRewards] = useState<any>(0)
  const [stakeRewards, setStakeRewards] = useState<any>(0)

  const getReferrals = async () => {
    try {
      setLoading(true)
      let res = []
      if (selectedFromLevel) {
        res = await getReferralStream(selectedFromLevel)
      } else {
        res = await getReferralStream()
      }

      let totalReferralRewards = 0
      let totalStakeRewards = 0
      let totalAllRewards = 0
      console.log(res)

      res.forEach((item: any) => {
        if (item.referralDetails.isReferred) {
          if (item.referralDetails.totalClaimed)
            totalReferralRewards += item.referralDetails.totalClaimed
        } else {
          if (item.referralDetails.totalClaimed)
            totalStakeRewards += item.referralDetails.totalClaimed
          // totalStakeRewards += item.referralDetails.amount
        }
        if (item.referralDetails.totalClaimed)
          totalAllRewards += item.referralDetails.totalClaimed
        // totalAllRewards += item.referralDetails.amount
      })

      // setReferralRewards(totalReferralRewards)
      console.log("totalReferralRewards", totalReferralRewards)
      // setStakeRewards(totalStakeRewards)
      console.log("totalStakeRewards", totalStakeRewards)
      console.log("referralStream", res)
      setReferralStream(res)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isConnected) return
    if (!isLoggedIn) return
    getReferrals()
    // claimedRewards()
  }, [isLoggedIn, selectedFromLevel])

  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) return
      getReferrals()
    }, 2000)
    // claimedRewards()
  }, [address])

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!isLoggedIn) return
  //     getReferrals()
  //   }, 2000)
  // }, [address])

  const [token, setToken] = useState(0)
  const [refIncome, serRefIncome] = useState(0)
  const getTokens = async () => {
    return await getAllStakeTokens()
  }
  useEffect(() => {
    if (!isLoggedIn) return
    getTokens()
      .then((data) => {
        setToken(data.tokens)
      })
      .catch((err) => {
        setToken(0)
      })
    getUserRefIncome()
      .then((data) => {
        serRefIncome(data.referralIncome)
      })
      .catch((err) => {
        serRefIncome(0)
      })
  }, [isLoggedIn])

  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) return
      getTokens()
        .then((data) => {
          setToken(data.tokens)
        })
        .catch((err) => {
          setToken(0)
        })
      getUserRefIncome()
        .then((data) => {
          serRefIncome(data.referralIncome)
        })
        .catch((err) => {
          serRefIncome(0)
        })
    }, 2000)
  }, [address])

  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: null, // initially set to null or undefined
      endDate: null,
      key: "selection",
    },
  ])

  // const [filteredStream, setFilteredStream] = useState<any>([])

  // Filtering referralStream based on selected filters
  const filteredReferralStream = referralStream.filter((item: any) => {
    // const referralLevel = item.referralDetails.level
    const referralTimestamp: any = item.referralDetails.startTime * 1000

    // const levelMatches =
    //   selectedFromLevel === null || referralLevel === selectedFromLevel

    const startDate: any = dateRange[0].startDate
    const endDate: any = dateRange[0].endDate

    const dateMatches =
      !startDate ||
      !endDate ||
      (referralTimestamp >= startDate.getTime() &&
        referralTimestamp <= endDate.getTime())

    return dateMatches
  })

  // useEffect(() => {
  //   setReferralRewards(0)
  //   setFilteredStream(filteredReferralStream)
  // }, [dateRange, selectedFromLevel, referralStream])

  const levels = Array.from({ length: 24 }, (_, i) => i + 1)

  const [showDatePicker, setShowDatePicker] = useState(false)

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const formattedClaimed = (date: any) => {}

  const [upline, setUpline] = useState<string | undefined>()

  const getupline = async () => {
    try {
      const res = await getMyUpline()
      console.log("upline", res)
      if (typeof res === "string") setUpline(res)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   if (!isLoggedIn) return
  //   getupline()
  // }, [address, isLoggedIn])
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!isLoggedIn) return
  //     getupline()
  //   }, 2000)
  // }, [address])

  const { data: readTotalStakeAmount, isLoading: totalStakeLoading } =
    useReadContracts({
      allowFailure: true,
      contracts: [
        {
          abi: stakingAbi,
          address: fit24ContractAddress,
          functionName: "getUserTotalStakeReward",
          chainId: vestingChainId,
          args: [address],
        },
      ],
    })

  const {
    data: readPendingAmount,
    isLoading: pendingLoading,
    refetch: refetchPendingAmount,
  } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "getPendingAmountForDay",
        chainId: vestingChainId,
        args: [address],
      },
    ],
  })

  // const [historyAmount, setHistoryAmount] = useState(0)

  // const claimedRewards = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await getAllClaimedReward()
  //     // console.log(res)
  //     let amount = 0
  //     res.map((item: any) => {
  //       amount = amount + item.amount
  //     })
  //     setHistoryAmount(amount)
  //     setLoading(false)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   if (!readTotalStakeAmount || !readPendingAmount) return
  //   setStakeRewards(
  //     getNumber(readTotalStakeAmount[0].result! as bigint, 18) -
  //       getNumber(readPendingAmount[0].result! as bigint, 18)
  //   )
  //   console.log(
  //     "Stake Rewards",
  //     getNumber(readTotalStakeAmount[0].result! as bigint, 18)
  //   )
  //   // setTotalRewards(
  //   //   (prev) => prev + getNumber(readTotalStakeAmount[0].result! as bigint, 18)
  //   // )
  // }, [readTotalStakeAmount, readPendingAmount])

  // const handleRewardClaimed = (reward: any) => {
  //   setReferralRewards((prevRewards) => prevRewards + reward)
  // }

  const getAllLevelRewardsClaimedByUser = async () => {
    try {
      const res = await getAllLevelRewardsClaimed()
      console.log(res)
      setReferralRewards(res.rewards)
    } catch (error) {
      console.log(error)
    }
  }
  const getAllStakeRewardsClaimedByUser = async () => {
    try {
      const res = await getAllStakeRewardsClaimed()
      console.log(res)
      setStakeRewards(res.rewards)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isConnected) return
    if (!isLoggedIn) return
    getAllLevelRewardsClaimedByUser()
    getAllStakeRewardsClaimedByUser()
  }, [isConnected, address, isLoggedIn])

  return (
    <div className="text-white w-full h-full  2md:py-8 py-4 2md:px-10 px-3">
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-2 ">
          <div className="text-xl font-medium">Total Staked</div>
          <div className="text-2xl font-medium flex gap-2 items-center">
            {Number(token).toFixed(2)}{" "}
            <span className="w-20">
              <Image
                src={"/fitLogo.svg"}
                width={3000}
                height={30000}
                alt="logo"
                className="h-full w-full"
              />
            </span>
          </div>
        </div>
        <Rewards
          referralRewards={referralRewards}
          // stakeRewards={stakeRewards}
          stakeRewards={stakeRewards}
          totalRewards={stakeRewards + referralRewards}
          // stakeRewards={historyAmount}
          // totalRewards={totalRewards + historyAmount}
          // totalRewards={totalRewards + stakeRewards}
        />
        {upline && (
          <div>
            <span className="font-semibold text-gray-400">My Upline - </span>
            {smallAddress(upline)}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full gap-4 py-[20px]">
        <div className="flex w-full justify-between items-end">
          <div>Your Stake & Rewards</div>
          <div className="flex gap-4 items-center">
            {/* Date Range Picker with Dropdown */}
            <div>
              {/* <label className="text-white">Select Date Range:</label> */}
              <button
                onClick={toggleDatePicker}
                className="bg-white bg-opacity-20 p-2 rounded-lg text-sm"
              >
                {dateRange[0].startDate && dateRange[0].endDate
                  ? `From: ${dateRange[0].startDate.toLocaleDateString()} - To: ${dateRange[0].endDate.toLocaleDateString()}`
                  : "Select Date Range"}
              </button>

              {showDatePicker && (
                <div className="relative">
                  <div className="absolute z-50 mt-2 bg-white text-black right-0  border rounded-lg shadow-lg">
                    <DateRangePicker
                      ranges={dateRange}
                      onChange={(item: any) => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      className="mt-2"
                    />
                    <div className="flex justify-end p-2">
                      <button
                        onClick={toggleDatePicker}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <Listbox
                value={selectedFromLevel}
                onChange={setSelectedFromLevel}
              >
                <ListboxButton className="bg-white bg-opacity-20 p-2 relative rounded-lg  text-sm">
                  {selectedFromLevel !== null
                    ? `Level ${selectedFromLevel}`
                    : "Select From Level"}
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  className=" absolute mt-1 max-h-40 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption value={null}>All Levels</ListboxOption>
                  {levels.map((level) => (
                    <ListboxOption
                      key={level}
                      value={level}
                      className={({ active }) =>
                        `cursor-pointer select-none p-2 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          Level {level}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="flex flex-col  overflow-x-auto  rounded-xl">
          <div className="grid grid-cols-11 w-full p-4  gap-x-4  text-sm  min-w-[1000px] bg-green-300 bg-opacity-20">
            <div>Tx ID & TYPE</div>
            <div className="text-center">Referee</div>
            <div className="text-center ">Referee Stake</div>
            <div className="text-center">Level Referral</div>
            <div className="text-center">Level</div>
            <div className="text-center">APY</div>
            <div className="text-center">Time Stamp</div>
            <div className="text-center">Remaining Tenure(Days)</div>
            <div className="text-center">Today&apos;s Reward</div>
            <div className="text-center">Total Claimed</div>
            <div className="text-center">Tx Hash</div>
          </div>
          <div className="md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[1000px] w-full">
            {!isLoading ? (
              filteredReferralStream.map((item: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-11 w-full  px-4 py-3 gap-x-4 text-base  bg-gray-400 bg-opacity-20 border-t border-themeGreen"
                >
                  <>
                    <div className="text-sm">
                      {item.referralDetails.stakeId} -{" "}
                      {!item.referralDetails.isReferred
                        ? item.referralDetails.poolType &&
                          item.referralDetails.poolType <= 9
                          ? "VESTED STAKE"
                          : item.poolType <= 12
                          ? "AUTO STAKE"
                          : "COMPOUNDED"
                        : "LEVEL REWARD"}
                    </div>
                    <div
                      className="flex items-center justify-center cursor-pointer"
                      onClick={() => copyAddress(item.referreDetails.referre)}
                    >
                      {smallAddress(item.referreDetails.referre)}
                    </div>
                    <a className="flex items-center justify-center">
                      {item.referreDetails.amount.toFixed(2)}
                    </a>
                    <div className="flex items-center justify-center ">
                      {/* {item.referralDetails.amount} */}
                      {Number(
                        (item.referralDetails.amount *
                          item.referralDetails.apr) /
                          100
                      ).toFixed(3)}
                    </div>
                    <div className="flex items-center justify-center ">
                      {item.referralDetails.level}
                    </div>
                    <div className="flex items-center justify-center ml-2">
                      {item.referralDetails.apr}
                    </div>
                    <div className="flex items-center justify-center ml-2">
                      {/* {formattedDate(item.referralDetails.startTime)} */}
                      <div className="flex flex-col items-center text-sm gap-1 justify-center">
                        <span>
                          {
                            formattedDateTime(item.referralDetails.startTime)
                              .formattedDate
                          }
                        </span>
                        <span>
                          (
                          {
                            formattedDateTime(item.referralDetails.startTime)
                              .formattedTime
                          }
                          )
                        </span>
                        {/* {formattedDate(item.startTime)} */}
                      </div>
                    </div>

                    <div className="flex items-center justify-center ">
                      {" "}
                      {formattedStakeDuration(
                        item.referralDetails.startTime,
                        item.referralDetails.stakeDuration
                      )}
                      {/* {getDays(item.referralDetails.stakeDuration)} */}
                    </div>
                    <div className="flex items-center justify-center ">
                      {/* {Number(
                        (item.referralDetails.apr * 100) /
                          getDays(item.referralDetails.stakeDuration)
                      ).toFixed(3)} */}
                      {/* {Number(
                        getDays(item.referralDetails.stakeDuration) /
                          item.referralDetails.amount
                      ).toFixed(3)} */}
                      {Number(
                        (item.referralDetails.amount *
                          item.referralDetails.apr) /
                          36500
                      ).toFixed(3)}
                    </div>
                    <div className="flex items-center justify-center">
                      {/* {(s
                        Number(
                          (item.referralDetails.apr * 100) /
                            getDays(item.referralDetails.stakeDuration)
                        ) *
                        (getDays(item.referralDetails.stakeDuration) -
                          formattedStakeDuration(
                            item.referralDetails.startTime,
                            item.referralDetails.stakeDuration
                          ))
                      ).toFixed(3)} */}

                      {/* {item.referralDetails.totalClaimed
                        ? Number(item.referralDetails.totalClaimed).toFixed(3)
                        : 0.0} */}
                      <StakeRewardClaimed
                        stakeId={item.referralDetails.stakeId}
                        // onRewardClaimed={handleRewardClaimed}
                      />
                    </div>

                    <div className="flex items-center justify-center text-blue-700">
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${process.env.NEXT_PUBLIC_SCAN_URL}/tx/${item.referralDetails.txHash}`}
                      >
                        {`${item.referralDetails.txHash.slice(0, 7)}..`}
                      </a>
                    </div>
                  </>
                </div>
              ))
            ) : (
              <div className="col-span-8 flex items-center justify-center">
                <CgSpinner className="h-[50px] w-[50px] animate-spin text-themeGreen" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
