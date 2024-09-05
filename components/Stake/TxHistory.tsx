"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { BiInfoCircle, BiLoaderCircle } from "react-icons/bi"
// import Tooltip from "../shared/Tooltip";
import { getAllTransaction } from "@/services/transaction"
import { formatUnits } from "viem"
import { getDecimal, getScanURL } from "@/libs/chains"
import { smallAddress } from "@/libs/utils"
import { format } from "date-fns"
import { useWallet } from "@/hooks/useWallet"
import { CgSpinner } from "react-icons/cg"

export default function TxHistory({ refetchTX, setRefetchTX }: any) {
  const { address, isConnected }: any = useAccount()
  const { isLoggedIn } = useWallet()
  const [data, setData] = useState<any[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const getTransaction = async () => {
    try {
      setLoading(true)
      const res = await getAllTransaction()
      setData(res)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!refetchTX) return
    getTransaction()
    setRefetchTX(false)
  }, [refetchTX])

  useEffect(() => {
    if (!address && !isConnected) {
      setData([])
      return
    }
    isLoggedIn && getTransaction()
    // address && getTransaction();
  }, [address, isLoggedIn, isConnected])
  return (
    <div className="flex flex-col  gap-4 py-[20px]">
      <div>Transaction History</div>
      <div className="flex flex-col  overflow-x-auto  rounded-xl">
        <div className="grid grid-cols-6 w-full p-4  gap-x-4  text-sm  min-w-[920px] bg-green-300 bg-opacity-20 border-b border-themeGreen">
          <div>Date</div>
          <div className="text-center">Distribution Hash</div>
          <div className="text-center ">Tx Hash</div>
          <div className="text-center">Chain</div>
          <div className="text-center">Amount</div>
          <div className="text-center">Token Quantity</div>
        </div>
        <div className="md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[920px] w-full">
          {!isLoading ? (
            data.map((item, idx) => (
              <div key={idx} className="grid grid-cols-6 w-full  px-4 py-3 gap-x-4 text-base  bg-gray-400 bg-opacity-20 border-b border-themeGreen">
                <>
                  <div>
                    {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm:ss")}
                  </div>
                  <a
                    className="text-center"
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${process.env.NEXT_PUBLIC_ICO_SCAN_URL}/tx/${item.distributionHash}`}
                  >
                    {item.distributionHash
                      ? smallAddress(item.distributionHash)
                      : "-"}
                  </a>
                  <a
                    className="text-center"
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${getScanURL(item.chain)}/tx/${
                      item.transactionHash
                    }`}
                  >
                    {smallAddress(item.transactionHash)}
                  </a>
                  <div className="text-center">{item.chain}</div>
                  <div className="text-center">
                    {formatUnits(
                      item.amountBigNumber as bigint,
                      getDecimal(item.tokenAddress) as number
                    )}{" "}
                    USDT
                  </div>
                  <div className="text-center">
                    {Number(
                      formatUnits(item.tokenAmount as bigint, 18)
                    ).toFixed(2)}
                  </div>
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
