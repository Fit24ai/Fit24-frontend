"use client"

import { IClaimHistory, getAllClaimedReward } from "@/services/stakingService"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BiLoaderCircle } from "react-icons/bi"
import { CgSpinner } from "react-icons/cg"
import { FiExternalLink } from "react-icons/fi"
import { useAccount } from "wagmi"

export default function ClaimHistory() {
  const { address } = useAccount()
  const [claimHistory, setClaimHistory] = useState([])
  const [isLoading, setLoading] = useState(true)

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

  const claimedRewards = async () => {
    try {
      setLoading(true)
      const res = await getAllClaimedReward()
      console.log(res)
      setClaimHistory(res)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    claimedRewards()
  }, [address])
  return (
    <div className="flex flex-col  gap-4 py-[20px]">
      <div>Claim History</div>
      <div className="flex flex-col  overflow-x-auto  rounded-xl">
        <div className="grid grid-cols-4 w-full p-4  gap-x-4  text-sm  min-w-[920px] bg-green-300 bg-opacity-20 border-b border-themeGreen">
          <div className="ml-10">TX ID & TYPE</div>
          <div className="text-center">CLAIMED TOKENS</div>
          <div className="text-center ">TIMESTAMP</div>
          <div className="text-center "> TRANSACTION HASH</div>
        </div>
        <div className="md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[920px] w-full">
          {!isLoading ? (
            claimHistory.map((item: IClaimHistory, index) => (
              <div key={index} className="grid grid-cols-4 w-full  px-4 py-3 gap-x-4 text-base  bg-gray-400 bg-opacity-20 border-b border-themeGreen">
                <>
                  <div className="ml-10">
                    {item.stakeId} -{" "}
                    {!item.isReferred
                      ? item.poolType && item.poolType <= 9
                        ? "VESTED STAKE"
                        : item.poolType <= 12
                        ? "AUTO STAKE"
                        : "COMPOUNDED"
                      : "REFFERAL REWARD"}
                  </div>

                  <a className="flex items-center justify-center">
                    {item.amount.toFixed(3)}
                  </a>
                  <div className="flex items-center justify-center ml-4">
                    {formattedDate(item.timestamp)}
                  </div>
                  <div className="flex items-center justify-center text-blue-700">
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={`${process.env.NEXT_PUBLIC_SCAN_URL}/tx/${item.txHash}`}
                    >
                      {`${item.txHash.slice(0, 10)}...`}
                    </a>
                  </div>

                  {/* <div className="flex items-center justify-center "></div> */}

                  {/* <div className=" flex items-center justify-center flex-col-2 gap-4">
                          <StakeRewardClaimed stakeId={item.stakeId} />
                          <Link href={`${process.env.NEXT_PUBLIC_SCAN_URL}/tx/${item.txHash}`}>
                          <FiExternalLink  />
                          </Link>
                        </div> */}
                  {/* <div className="flex items-center justify-center px-4 w-full">
                          <button className="bg-themeOrange w-full  border border-themeOrange bg-opacity-50 rounded-full text-lg font-semibold  py-[3px]">
                            Withdraw
                          </button>
                        </div> */}
                </>
              </div>
            ))
          ) : (
            <div className="col-span-8 flex items-center justify-center">
              <CgSpinner className="h-[50px] w-[50px] animate-spin text-themeGreen" />
            </div>
          )}
        </div>
        {/* <div className="grid grid-cols-7 w-full  gap-4 text-base md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[920px]">
                {!isLoading ? (
                  stakes.map((item: IStakeDetails, index) => (
                    <>
                      <div>
                        {item.stakeId} -{" "}
                        {!item.isReferred
                          ? item.poolType && item.poolType <= 9
                            ? "VESTED STAKE"
                            : item.poolType <= 12
                            ? "AUTO STAKE"
                            : "COMPOUNDED"
                          : "REFFERAL Reward"}
                      </div>
                      <div className="flex items-center justify-center ">
                        {formattedDate(item.startTime)}
                      </div>
                      <a className="flex items-center justify-center">
                        {item.amount.toFixed(2)}
                      </a>
                      <a className="flex items-center justify-center">
                        {formattedStakeDuration(
                          item.startTime,
                          item.stakeDuration
                        )}
                      </a>
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
                          href={`${process.env.NEXT_PUBLIC_SCAN_URL}/tx/${item.txHash}`}
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="col-span-8 flex items-center justify-center">
                    <BiLoaderCircle className="h-[50px] w-[50px] animate-spin text-themeOrange" />
                  </div>
                )}
              </div> */}
      </div>
    </div>
  )
}
