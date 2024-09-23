"use client"
import React, { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import Image from "next/image"
import { getUserRefIncome, getUserTokens } from "@/services/token"
import { useWallet } from "@/hooks/useWallet"
import {
  useAccount,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { stakingAbi } from "@/libs/stakingAbi"
import {
  AddressString,
  fit24ContractAddress,
  fit24ReferralContractAddress,
  getChain,
  getChainEnum,
  vestingChainId,
} from "@/libs/chains"
import { getNumber, smallAddress } from "@/libs/utils"
import { createTransaction } from "@/services/transaction"
import { CgSpinner } from "react-icons/cg"
import {
  createClaimReward,
  getAllStakesByUser,
  getMyUpline,
  getTotalMembers,
  getTotalNetworkMembers,
  getTotalNetworkStaked,
  getTotalNetworkWithdrawal,
  getUserLevel,
} from "@/services/stakingService"
import { IoMdPerson } from "react-icons/io"
import { referralAbi } from "@/libs/referralAbi"
import { useReloadContext } from "@/context/Reload"
import { BsSafeFill } from "react-icons/bs"
import { FaHandHoldingUsd } from "react-icons/fa"
import { Address } from "viem"
// import { useReloadContext } from "@/context/Reload"

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function ChartBox({ token }: { token: number }) {
  const doughnutData = {
    labels: ["Active", "Non-Active"],
    datasets: [
      {
        data: [117285, 7178],
        backgroundColor: ["#33cc33", "#1E90FF"],
        hoverBackgroundColor: ["#33cc33", "#1E90FF"],
        borderWidth: 0,
      },
    ],
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw.toLocaleString()}`
          },
        },
      },
    },
  }

  const barData = {
    labels: ["L1", "L2", "L3", "L4", "L5"],
    datasets: [
      {
        label: "Active",
        data: [31000, 29000, 32000, 27000, 30000],
        backgroundColor: "#33cc33",
        borderRadius: 4,
      },
      {
        label: "Non-Active",
        data: [5000, 4000, 6000, 2000, 4000],
        backgroundColor: "#1E90FF",
        borderRadius: 4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 27000,
        max: 32000,
        ticks: {
          stepSize: 1000,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`
          },
        },
      },
    },
  }

  const data = {
    labels: ["10:00", "12:00", "14:00", "16:00", "18:00"],
    datasets: [
      {
        label: "Fit24",
        data: [28, 30, 32, 29, 31],
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        pointBackgroundColor: "#4a90e2",
        pointBorderColor: "#4a90e2",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false, // Ensures the chart takes up the entire available space
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 27,
        max: 32,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            label += `$${context.raw}k`
            return label
          },
        },
      },
    },
  }

  const { isLoggedIn } = useWallet()
  const { chain, address, isConnected } = useAccount()

  // const [token, setToken] = useState(0)
  const [refIncome, serRefIncome] = useState(0)
  // const getTokens = async () => {
  //   return await getUserTokens()
  // }
  // useEffect(() => {
  //   getTokens()
  //     .then((data) => {
  //       setToken(data.tokens)
  //     })
  //     .catch((err) => {
  //       setToken(0)
  //     })
  //   getUserRefIncome()
  //     .then((data) => {
  //       serRefIncome(data.referralIncome)
  //     })
  //     .catch((err) => {
  //       serRefIncome(0)
  //     })
  // }, [isLoggedIn])

  // const { reload, setReload } = useReloadContext();

  const [totalNetworkMembers, setTotalNetworkMembers] = useState(0)
  const [totalNetworkStaked, setTotalNetworkStaked] = useState(0)
  const [totalNetworkWithdrawal, setTotalNetworkWithdrawal] = useState(0)

  const getTotalNetworkMembersCount = async () => {
    const res = await getTotalNetworkMembers()
    // console.log(res)
    setTotalNetworkMembers(res.totalStakedMembers)
  }
  const getTotalNetworkMembersStaked = async () => {
    const res = await getTotalNetworkStaked()
    // console.log(res)
    setTotalNetworkStaked(res)
  }
  const getTotalNetworkMembersWithdrawal = async () => {
    const res = await getTotalNetworkWithdrawal()
    // console.log(res)
    setTotalNetworkWithdrawal(res)
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalNetworkMembersStaked()
    getTotalNetworkMembersCount()
    getTotalNetworkMembersWithdrawal()
  }, [address, isLoggedIn])

  const { error, switchChain, chains } = useSwitchChain()
  const [isClaimLoading, setClaimLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const [rewardHash, setRewardHash] = useState<AddressString | undefined>(
    undefined
  )
  const [dialogInfo, setDialogInfo] = useState<{
    type: "SUCCESS" | "FAIL"
    message: string
    title: string
  }>({ type: "SUCCESS", message: "", title: "" })
  const [dialog, setDialog] = useState(false)
  const [claimStakeCondition, setClaimStakeCondition] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<number | undefined>()
  // const { reload, setReload } = useReloadContext();
  const { data: lastClaimedTimestamp, isLoading: lastClaimedTimestampLoading } =
    useReadContracts({
      allowFailure: true,
      contracts: [
        {
          abi: stakingAbi,
          address: fit24ContractAddress,
          functionName: "lastClaimedTimestamp",
          chainId: vestingChainId,
        },
      ],
    })

  const [lastTimestamp, setTimestamp] = useState<number | undefined>()
  // const {
  //   data: userDailyRewardClaimed,
  //   isLoading: userDailyRewardClaimedLoading,
  // } = useReadContracts({
  //   allowFailure: true,
  //   contracts: [
  //     {
  //       abi: stakingAbi,
  //       address: fit24ContractAddress,
  //       functionName: "userDailyRewardClaimed",
  //       chainId: vestingChainId,
  //     },
  //   ],
  // })

  useEffect(() => {
    if (!lastClaimedTimestamp) return
    setTimestamp(Number(lastClaimedTimestamp[0].result!))
  }, [address, lastClaimedTimestamp, lastClaimedTimestampLoading])
  const getAllUserStakes = async () => {
    try {
      setClaimLoading(true)
      if (!address || !lastClaimedTimestamp || !userDailyRewardClaimed) return

      const res: any = await getAllStakesByUser(address)
      console.log("userDailyRewardClaimed", userDailyRewardClaimed[0].result)
      // console.log("stakes", res)
      // console.log("stakes times", res.stakes[res.stakes.length - 1].startTime)
      // console.log("timestamp", Number(lastClaimedTimestamp[0].result!))
      // console.log(
      //   "new time",
      //   Math.floor(Date.now() / 1000) - res.stakes[0].startTime
      // )
      // if (res.stakes[0].startTime > Number(lastClaimedTimestamp[0].result!)) {
      //   console.log(true)

      //   setClaimStakeCondition(true)
      // } else {
      //   console.log(false)
      //   setClaimStakeCondition(false)
      // }
      // setClaimLoading(false)

      // if(Number(lastClaimedTimestamp[0].result!)){

      // }
      if (
        Math.floor(Date.now() / 1000) -
          res.stakes[res.stakes.length - 1].startTime >
          24 * 60 * 60 &&
        userDailyRewardClaimed[0].result! === false
      ) {
        // console.log(false)
        setClaimStakeCondition(false)
      } else {
        // console.log(true)
        setClaimStakeCondition(true)
      }
      setClaimLoading(false)
    } catch (error) {
      // console.log(error)
      setClaimLoading(false)
    }
  }

  useEffect(() => {
    getAllUserStakes()
  }, [address, lastClaimedTimestamp, lastClaimedTimestampLoading])

  // const getAllUserStakes = async () => {
  //   try {
  //     setLoading(true);
  //     setClaimLoading(true)
  //     if (!address || !lastClaimedTimestamp) return;
  //     const res: any = await getAllStakesByUser(address);
  //     setStakes(res.stakes);
  //     if((res.stakes[res.stakes.length - 1].startTime)> Number(lastClaimedTimestamp[0].result!) ){
  //       setClaimStakeCondition(true)
  //     }else{
  //       setClaimStakeCondition(false)
  //     }
  //     setLoading(false);
  //     setClaimLoading(false)
  //   } catch (error) {
  //     console.log(error)
  //     setLoading(false)
  //     setClaimLoading(false)
  //   }
  // };

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

  const claimReward = async () => {
    if (chain?.id !== vestingChainId)
      return switchChain({
        chainId: vestingChainId,
      })
    try {
      setClaimLoading(true)
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "claimAllReward",
        chainId: getChain(chain).id,
      })
      await createTransaction(tx, getChainEnum(getChain(chain).id))
      // console.log(tx)
      setRewardHash(tx)
    } catch (error) {
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error in claiming reward",
      })
      setDialog(true)
      setClaimLoading(false)
      console.error(error)
    }
  }

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

  const {
    data: userDailyRewardClaimed,
    isLoading: userDailyRewardClaimedLoading,
  } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "userDailyRewardClaimed",
        chainId: vestingChainId,
        args: [address, (Number(lastTimestamp) + 86400).toString()],
      },
    ],
  })

  useEffect(() => {
    getAllUserStakes()
  }, [
    address,
    lastClaimedTimestamp,
    lastClaimedTimestampLoading,
    userDailyRewardClaimed,
    userDailyRewardClaimedLoading,
  ])

  useEffect(() => {
    if (!readPendingAmount) return
    setPendingAmount(getNumber(readPendingAmount[0].result! as bigint, 18))
    // console.log(
    //   "pending amount",
    //   getNumber(readPendingAmount[0].result! as bigint, 18)
    // )
  }, [readPendingAmount])

  const { data: rewardReceipt, error: rewardError } =
    useWaitForTransactionReceipt({
      hash: rewardHash,
      chainId: getChain(chain).id,
    })

  useEffect(() => {
    if (!rewardHash) return
    if (rewardError) {
      setClaimLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error in claiming reward",
      })
      setDialog(true)
      return
    }
    createClaimReward(rewardHash)
    setClaimLoading(false)
    setDialogInfo({
      type: "SUCCESS",
      message: `Reward Claimed Successfully`,
      title: "Success",
    })
    setDialog(true)
    refetchPendingAmount()
    // setTimeout(() => {
    //   setReload((prev) => !prev);
    // }, 800);
  }, [rewardReceipt, rewardError])

  // console.log(pendingAmount, "fjfjfj")
  const [memberLoading, setMemberLoading] = useState(false)
  const [directMemberLoading, setDirectMemberLoading] = useState(false)

  const [totalMembers, setTotalMembers] = useState<any>({
    totalCount: 0,
    totalTeamStakedAmount: 0,
    stakersWithMoreThanZeroTokens: [],
    stakerCount: 0,
  })
  const [directMembers, setDirectMembers] = useState<any>([])
  const getTotalMembersCount = async () => {
    setMemberLoading(true)
    try {
      const res = await getTotalMembers()
      // console.log(res)
      setTotalMembers(res)
      setMemberLoading(false)
    } catch (error) {
      // console.log(error)
      setMemberLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalMembersCount()
  }, [address, isLoggedIn])

  const getLevel = async () => {
    setDirectMemberLoading(true)
    try {
      const res = await getUserLevel()
      // console.log("direct members", res)
      setDirectMembers(res.memberData)
      setDirectMemberLoading(false)
    } catch (error) {
      // console.log(error)
      setDirectMemberLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getLevel()
  }, [address, isLoggedIn])

  // const [upline, setUpline] = useState<string | undefined>()

  // const getupline = async () => {
  //   try {
  //     const res = await getMyUpline()
  //     console.log("upline", res)
  //     if (typeof res === "string") setUpline(res)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   if (!isLoggedIn) return
  //   getupline()
  // }, [address, isLoggedIn])

  // console.log(refreesData[0].result)

  // const [networkMembers, setNetworkMembers] = useState<any>([])

  // const { data: allMemberData, isLoading: allMemberLoading } = useReadContracts(
  //   {
  //     allowFailure: true,
  //     contracts: [
  //       {
  //         abi: stakingAbi,
  //         address: fit24ContractAddress,
  //         functionName: "getAllUsers",
  //         chainId: vestingChainId,
  //         args: [address],
  //       },
  //     ],
  //   }
  // )

  // useEffect(() => {
  //   if (!isLoggedIn) return
  //   console.log(allMemberData)
  //   if (!allMemberData || !allMemberData[0] || !allMemberData[0].result) return
  //   console.log("network", allMemberData[0].result)
  //   setNetworkMembers(allMemberData[0].result)
  // }, [address, isLoggedIn])

  // const { data: totalStakedTokensData, isLoading: totalStakedTokensLoading } =
  //   useReadContracts({
  //     allowFailure: true,
  //     contracts: [
  //       {
  //         abi: stakingAbi,
  //         address: fit24ContractAddress,
  //         functionName: "totalStakedTokens",
  //         chainId: vestingChainId,
  //         args: [address],
  //       },
  //     ],
  //   })

  // useEffect(() => {
  //   if (!isLoggedIn) return
  //   console.log(totalStakedTokensData)
  //   if (
  //     !totalStakedTokensData ||
  //     !totalStakedTokensData[0] ||
  //     !totalStakedTokensData[0].result
  //   )
  //     return
  //   console.log("network staked", totalStakedTokensData[0].result)
  //   setNetworkMembers(totalStakedTokensData[0].result)
  // }, [address, isLoggedIn])

  return (
    <div className="w-full flex 2md:flex-row flex-col items-center 2md:items-start gap-6 2md:gap-0 justify-between">
      <div className="2md:max-w-[57%] max-w-[650px] w-full flex flex-col gap-6 items-center">
        {/* <div className="flex flex-col items-center gap-2 ">
          <div className="text-xl font-medium">Total Staked</div>
          <div className="text-2xl font-medium">
            {Number(token).toFixed(2)} Fit24
          </div>
        </div> */}
        <div className="flex flex-col gap-2 w-full  2md:order-none order-1">
          <div>Network Statistics</div>
          <div className="flex gap-4 w-full  items-center overflow-x-auto hide-scrollbar">
            <div className="flex flex-col items-center flex-1 min-w-36 rounded-lg gap-2  network-image-1  p-3 ">
              <IoMdPerson size={24} />
              <div className="text-xl">{totalNetworkMembers}</div>
              <div className="text-gray-300 text-xs">All Members</div>
            </div>
            <div className="flex flex-col items-center flex-1 rounded-lg  network-image-2 gap-2  p-3 min-w-36">
              <BsSafeFill size={24} />
              <div className="text-xl">{totalNetworkStaked}</div>
              <div className="text-gray-300 text-xs">Total Stake</div>
            </div>
            <div className="flex flex-col items-center flex-1 rounded-lg  network-image-3 gap-2  p-3 min-w-36">
              <FaHandHoldingUsd size={24} />
              <div className="text-xl">{totalNetworkWithdrawal}</div>
              <div className="text-gray-300 text-xs">Total Withdrawals</div>
            </div>
          </div>
        </div>
        <div className="h-60 w-full  bg-black flex justify-center items-center py-4 !px-6 bg-opacity-35 rounded-xl">
          <div className="flex flex-col gap-2 max-w-[650px] text-white w-full h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={"/coin/fitcoin.svg"}
                  alt="coin"
                  width={25}
                  height={25}
                />
                <span className="text-base font-semibold">Fit24</span>
              </div>
              <div className="text-right">
                <span className=" font-semibold">$2,113.80</span>
                <div className="text-xs text-green-500">+2.76%</div>
              </div>
            </div>
            <div className="w-full flex-1">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-10 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Rewards</div>
            <div className="text-2xl">
              {" "}
              12,08
              <span className=" text-themeGreen"> Fit24</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Today Rewards</div>
            <div className="text-2xl">
              01,08
              <span className=" text-themeGreen"> Fit24</span>
            </div>
          </div>
        </div> */}
        {/* <div className="flex md:flex-row flex-col gap-4"> */}
        {/* {upline && (
          <div>
            <span className="font-semibold text-gray-400">My Upline - </span>
            {smallAddress(upline)}
          </div>
        )} */}
        <div className="bg-white network-image-3 bg-opacity-10 max-w-80 w-full p-4 px-10 flex flex-col items-center gap-2  rounded-lg">
          <FaHandHoldingUsd size={24} />
          <div className="text-gray-400 text-sm">Todays Rewards</div>
          <div className="text-2xl flex items-center gap-2">
            {/* 12,08 */}
            {pendingAmount && pendingAmount.toFixed(4)}
            {/* {readTotalStakeAmount &&
              getNumber(readTotalStakeAmount[0].result! as bigint, 18).toFixed(
                4
              )} */}
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
          {/* </div> */}
          {/* <div className="flex flex-col gap-4  w-full">
            <div className="network-image-4 flex flex-1 justify-between p-3 w-full rounded-lg gap-12 items-center">
              <span className="w-16">
                <Image
                  src={"/fitLogo.svg"}
                  width={3000}
                  height={30000}
                  alt="logo"
                  className="h-full w-full"
                />
              </span>
              <div className="text-gray-400 text-sm text-nowrap">
                0.024 USDT
              </div>
            </div>
            <div className="network-image-4 flex flex-1 justify-between p-3 w-full rounded-lg gap-12 items-center">
              <span className="w-16">
                <Image
                  src={"/fitLogo.svg"}
                  width={3000}
                  height={30000}
                  alt="logo"
                  className="h-full w-full"
                />
              </span>
              <div className="text-gray-400 text-sm text-nowrap">
                0.024 USDT
              </div>
            </div>
          </div> */}
        </div>
        <div className="relative max-w-80 w-full">
          {/* {claimStakeCondition ? (
            pendingAmount ? (
              pendingAmount > 0 && (
                <div className="text-center">
                  Availble to claim after 24 Hours
                </div>
              )
            ) : (
              <></>
            )
          ) : (
            <button
              onClick={claimReward}
              onMouseOver={() => {
                if (claimStakeCondition) {
                  setShowPopup(true)
                } else if (!!!pendingAmount) {
                  setShowPopup(true)
                } else {
                  return
                }
              }}
              onMouseLeave={() => setShowPopup(false)}
              disabled={!pendingAmount || claimStakeCondition}
              className="max-w-80 w-full disabled:opacity-50 disabled:cursor-not-allowed mb-10 bg-themeGreen text-white h-10 rounded-lg"
            >
              {isClaimLoading ? (
                <div className="flex justify-center items-center">
                  <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
                </div>
              ) : (
                "Claim Reward"
              )}
            </button>
          )} */}
          {claimStakeCondition ? (
            <div className="text-center">Availble to claim after 24 Hours</div>
          ) : (
            <button
              onClick={claimReward}
              onMouseOver={() => {
                if (claimStakeCondition) {
                  setShowPopup(true)
                } else if (!!!pendingAmount) {
                  setShowPopup(true)
                } else {
                  return
                }
              }}
              onMouseLeave={() => setShowPopup(false)}
              disabled={!pendingAmount || claimStakeCondition}
              className="max-w-80 w-full disabled:opacity-50 disabled:cursor-not-allowed mb-10 bg-themeGreen text-white h-10 rounded-lg"
            >
              {isClaimLoading ? (
                <div className="flex justify-center items-center">
                  <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
                </div>
              ) : (
                "Claim Reward"
              )}
            </button>
          )}

          {showPopup && (
            <div className="absolute bg-white border text-black rounded-full border-gray-200 shadow-md top-14 w-fit left-[50%] p-2 z-10 text-semibold text-base text-nowrap">
              {pendingAmount === 0
                ? "Already Claimed"
                : claimStakeCondition
                ? "Claim after 24 hours"
                : "Already Claimed"}
            </div>
          )}
        </div>
      </div>
      <div className="2md:max-w-[40%] w-full max-w-96 flex flex-col gap-4">
        <div className=" h-[350px] w-full hidden 2md:flex p-4 flex-col gap-6 bg-black bg-opacity-35 rounded-xl">
          <div className="h-[50%]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="h-[50%]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Direct Members</div>
            <div className="text-2xl">
              {directMemberLoading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                directMembers.length
              )}
            </div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Team</div>
            <div className="text-2xl">
              {memberLoading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                totalMembers.stakerCount
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">My Stake</div>
            <div className="text-2xl">{token}</div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Team Stake</div>
            <div className="text-2xl">
              {memberLoading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                totalMembers.totalTeamStakedAmount
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
