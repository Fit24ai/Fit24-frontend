"use client"
import {
  AddressString,
  fit24ContractAddress,
  getChain,
  getChainEnum,
  getScanURL,
  vestingChainId,
} from "@/libs/chains"
import { stakingAbi } from "@/libs/stakingAbi"
import { getNumber, smallAddress } from "@/libs/utils"
import {
  IStakeDetails,
  createClaimReward,
  getAllStakesByUser,
} from "@/services/stakingService"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi"
import StakeRewardClaimed from "../shared/StakeRewardClaimed"
import { createTransaction } from "@/services/transaction"
import { useReloadContext } from "@/context/Reload"
import { FiExternalLink } from "react-icons/fi"
import Link from "next/link"
// import StatusDialog from "../shared/StatusDialog";
import { CgSpinner } from "react-icons/cg"
import { BiLoaderCircle } from "react-icons/bi"

export default function StakingBox({ refetchTX, setRefetchTX }: any) {
  const { reload, setReload } = useReloadContext()
  const { chain, address, isConnected } = useAccount()
  const { error, switchChain, chains } = useSwitchChain()
  const [dialog, setDialog] = useState(false)

  const [dialogInfo, setDialogInfo] = useState<{
    type: "SUCCESS" | "FAIL"
    message: string
    title: string
  }>({ type: "SUCCESS", message: "", title: "" })

  const { writeContractAsync } = useWriteContract()
  const [stakes, setStakes] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isClaimLoading, setClaimLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<number | undefined>()
  const [claimStakeCondition, setClaimStakeCondition] = useState(false)
  const [rewardHash, setRewardHash] = useState<AddressString | undefined>(
    undefined
  )

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
      setLoading(true)
      setClaimLoading(true)
      if (!address || !lastClaimedTimestamp) return
      const res: any = await getAllStakesByUser(address)

      setStakes(res.stakes)
      console.log("stakes", res.stakes)
      if (
        res.stakes[res.stakes.length - 1].startTime >
        Number(lastClaimedTimestamp[0].result!)
      ) {
        setClaimStakeCondition(true)
      } else {
        setClaimStakeCondition(false)
      }
      setLoading(false)
      setClaimLoading(false)
      setRefetchTX(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setClaimLoading(false)
      setRefetchTX(false)
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
      console.log(tx)
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

  const { data: rewardReceipt, error: rewardError } =
    useWaitForTransactionReceipt({
      hash: rewardHash,
      chainId: getChain(chain).id,
    })

  const formattedDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")

    return `${day}-${month}-${year}-(${hours}:${minutes}:${seconds})`
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

  const calculateTodaysReward = (amount: number, apr: number) => {
    return ((amount * apr) / (100 * 365)).toFixed(3)
  }

  const formattedStakeDuration = (startTime: number, duration: number) => {
    const startDate: Date = new Date(startTime * 1000)

    const endTime: number = startTime + duration
    const endDate: Date = new Date(endTime * 1000)

    const currentDate: Date = new Date()

    const timeDifference: number = endDate.getTime() - currentDate.getTime()

    const millisecondsInADay: number = 1000 * 60 * 60 * 24

    const daysLeft: number = Math.floor(timeDifference / millisecondsInADay)

    return daysLeft
  }

  const formattedStakeTenure = (duration: number) => {
    const millisecondsInADay: number = 1000 * 60 * 60 * 24
    // Convert the duration from seconds to days
    const days: number = Math.floor((duration * 1000) / millisecondsInADay)

    return days
  }

  useEffect(() => {
    getAllUserStakes()
  }, [
    address,
    reload,
    lastClaimedTimestamp,
    lastClaimedTimestampLoading,
    refetchTX,
  ])

  useEffect(() => {
    if (!readPendingAmount) return
    setPendingAmount(getNumber(readPendingAmount[0].result! as bigint, 18))
  }, [readPendingAmount])

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
    setTimeout(() => {
      setReload((prev) => !prev)
    }, 800)
  }, [rewardReceipt, rewardError])

  return (
    <div className="flex flex-col gap-4 py-[20px]">
      <div>Your Stake & Rewards</div>
      <div className="flex flex-col  overflow-x-auto  rounded-xl">
        <div className="grid grid-cols-11 w-full p-4  gap-x-6  text-sm  min-w-[1200px] bg-green-300 bg-opacity-20 border-b border-themeGreen">
          <div className="text-center">S No.</div>
          <div className="text-center">Tx ID & Type</div>
          <div className="text-center">Tx Hash</div>
          <div className="text-center">Timestamp</div>
          <div className="text-center">Staking Pool</div>
          <div className="text-center ">Staked Tokens</div>
          <div className="text-center">Staked Tenure(Days)</div>
          <div className="text-center">Remaining Tenure(Days)</div>
          <div className="text-center">APY</div>
          <div className="text-center">Todays Reward</div>
          <div className="text-center">Total Claimed Rewards</div>
        </div>
        <div className="md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[1200px] w-full">
          {!isLoading ? (
            stakes.map((item: IStakeDetails, index) => {
              return (
                <>
                  {!item.isReferred && (
                    <div
                      key={index}
                      className="grid grid-cols-11 w-full  px-4 py-3 gap-x-6 text-base  bg-gray-400 bg-opacity-20 border-b border-themeGreen"
                    >
                      <>
                        <div className="text-sm text-center">{index + 1}</div>
                        <div className="text-sm">
                          {item.stakeId} -{" "}
                          {!item.isReferred
                            ? item.poolType && item.poolType <= 9
                              ? "VESTED STAKE"
                              : item.poolType <= 12
                              ? "AUTO STAKE"
                              : "COMPOUNDED"
                            : "REFFERAL Reward"}
                        </div>
                        <a
                          className="text-center text-blue-400"
                          target="_blank"
                          rel="noreferrer noopener"
                          href={`${process.env.NEXT_PUBLIC_BINANCE_TESTNET_SCAN_URL}/tx/${item.txHash}`}
                        >
                          {smallAddress(item.txHash)}
                        </a>
                        <div className="flex flex-col items-center text-sm gap-1 justify-center">
                          <span>
                            {formattedDateTime(item.startTime).formattedDate}
                          </span>
                          <span>
                            ({formattedDateTime(item.startTime).formattedTime})
                          </span>
                          {/* {formattedDate(item.startTime)} */}
                        </div>

                        <div className="flex items-center justify-center ">
                          {item.poolType === 10
                            ? "A"
                            : item.poolType === 11
                            ? "B"
                            : "C"}
                        </div>
                        <a className="flex items-center justify-center">
                          {item.amount.toFixed(2)}
                        </a>
                        <a className="flex items-center justify-center">
                          {formattedStakeTenure(item.stakeDuration)}
                        </a>
                        <div className="flex items-center justify-center ">
                          {formattedStakeDuration(
                            item.startTime,
                            item.stakeDuration
                          )}
                        </div>

                        <div className="flex items-center justify-center ml-3">
                          {item.apr}
                        </div>
                        <div className="flex items-center justify-center ml-3">
                          {calculateTodaysReward(item.amount, item.apr)}
                        </div>
                        <div className=" flex items-center justify-center flex-col-2 gap-4">
                          <StakeRewardClaimed stakeId={item.stakeId} />
                          <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href={`${process.env.NEXT_PUBLIC_BINANCE_TESTNET_SCAN_URL}/tx/${item.txHash}`}
                          >
                            <FiExternalLink />
                          </a>
                        </div>
                      </>
                    </div>
                  )}
                </>
              )
            })
          ) : (
            <div className="col-span-8 flex items-center justify-center">
              <CgSpinner className="h-[50px] w-[50px] animate-spin text-themeGreen" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
