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
import { getNumber } from "@/libs/utils"
import { createTransaction } from "@/services/transaction"
import { CgSpinner } from "react-icons/cg"
import { getAllStakesByUser, getTotalMembers } from "@/services/stakingService"
import { IoMdPerson } from "react-icons/io"
import { referralAbi } from "@/libs/referralAbi"
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

  const { chain, address, isConnected } = useAccount()
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
  const getAllUserStakes = async () => {
    try {
      setClaimLoading(true)
      if (!address || !lastClaimedTimestamp) return
      const res: any = await getAllStakesByUser(address)
      if (
        res.stakes[res.stakes.length - 1].startTime >
        Number(lastClaimedTimestamp[0].result!)
      ) {
        setClaimStakeCondition(true)
      } else {
        setClaimStakeCondition(false)
      }
      setClaimLoading(false)
    } catch (error) {
      console.log(error)
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

  const [totalMembers, setTotalMembers] = useState<any>({
    totalCount: 0,
    totalTeamStakedAmount: 0,
  })
  const [directMembers, setDirectMembers] = useState<any>([])
  const getTotalMembersCount = async () => {
    try {
      const res = await getTotalMembers()
      console.log(res)
      setTotalMembers(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalMembersCount()
  }, [address, isLoggedIn])

  const { data: refreesData, isLoading: refeesLoading } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: referralAbi,
        address: fit24ReferralContractAddress,
        functionName: "getAllRefrees",
        chainId: vestingChainId,
        args: [address],
      },
    ],
  })

  useEffect(() => {
    if (!isLoggedIn) return
    if (!refreesData || !refreesData[0] || !refreesData[0].result) return
    setDirectMembers(refreesData[0].result)
    // console.log(refreesData[0].result)
  }, [address, isLoggedIn])

  // console.log(refreesData[0].result)

  const [networkMembers, setNetworkMembers] = useState<any>([])

  const { data: allMemberData, isLoading: allMemberLoading } = useReadContracts(
    {
      allowFailure: true,
      contracts: [
        {
          abi: stakingAbi,
          address: fit24ContractAddress,
          functionName: "getAllUsers",
          chainId: vestingChainId,
          args: [address],
        },
      ],
    }
  )

  useEffect(() => {
    if (!isLoggedIn) return
    console.log(allMemberData)
    if (!allMemberData || !allMemberData[0] || !allMemberData[0].result) return
    console.log("network", allMemberData[0].result)
    setNetworkMembers(allMemberData[0].result)
  }, [address, isLoggedIn])

  
  const { data: totalStakedTokensData, isLoading: totalStakedTokensLoading } =
    useReadContracts({
      allowFailure: true,
      contracts: [
        {
          abi: stakingAbi,
          address: fit24ContractAddress,
          functionName: "totalStakedTokens",
          chainId: vestingChainId,
          args: [address],
        },
      ],
    })

  useEffect(() => {
    if (!isLoggedIn) return
    console.log(totalStakedTokensData)
    if (
      !totalStakedTokensData ||
      !totalStakedTokensData[0] ||
      !totalStakedTokensData[0].result
    )
      return
    console.log("network staked", totalStakedTokensData[0].result)
    setNetworkMembers(totalStakedTokensData[0].result)
  }, [address, isLoggedIn])

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
            <div className="flex flex-col items-center flex-1 min-w-36 rounded-lg border border-themeGreen bg-white bg-opacity-5  p-2 ">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">All Members</div>
            </div>
            <div className="flex flex-col items-center flex-1 rounded-lg border border-themeGreen bg-white bg-opacity-5  p-2 min-w-36">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">Total Stake</div>
            </div>
            <div className="flex flex-col items-center flex-1 rounded-lg border border-themeGreen bg-white bg-opacity-5  p-2 min-w-36">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">Total Withdrawals</div>
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
        <div className="bg-white bg-opacity-10 max-w-80 w-full p-4 flex flex-col items-center gap-2  rounded-lg">
          <div className="text-gray-400 text-sm">Todays Rewards</div>
          <div className="text-2xl flex items-center gap-2">
            {/* 12,08 */}
            {readTotalStakeAmount &&
              getNumber(readTotalStakeAmount[0].result! as bigint, 18).toFixed(
                4
              )}
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
          className="max-w-80 w-full bg-themeGreen text-white h-10 rounded-lg"
        >
          {isClaimLoading ? (
            <div className="flex justify-center items-center">
              <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
            </div>
          ) : (
            "Claim Reward"
          )}
        </button>
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
            <div className="text-2xl">{directMembers.length}</div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Team</div>
            <div className="text-2xl">{totalMembers.totalCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">My Stake</div>
            <div className="text-2xl">{token}</div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Team Stake</div>
            <div className="text-2xl">{totalMembers.totalTeamStakedAmount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
