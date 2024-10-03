"use client"

import { AddressString, ChainEnum } from "@/libs/chains"
import {
  DistributionStatusEnum,
  TransactionStatusEnum,
} from "@/libs/transaction"
import { getTransactions } from "@/services/stakingTransaction"
import { useEffect, useState } from "react"
import { BsExclamationDiamond } from "react-icons/bs"
import { CgSpinner } from "react-icons/cg"
import { IoCheckmarkCircleOutline } from "react-icons/io5"

export default function TransactionPollingService({
  hash,
  action,
}: {
  hash: AddressString | undefined
  action: () => void
}) {
  const [status, setStatus] = useState<TransactionStatusEnum>(
    TransactionStatusEnum.PENDING
  )
  const [data, setData] = useState<
    | {
        transactionStatus: TransactionStatusEnum
        distributionStatus: DistributionStatusEnum
        transactionHash: AddressString
        distributionHash: AddressString
        chain: ChainEnum
      }
    | undefined
  >()
  const [distributionStatus, setDistributionStatus] =
    useState<DistributionStatusEnum>(DistributionStatusEnum.PENDING)

  const getTransaction = async () => {
    if (!hash) return
    if (distributionStatus === DistributionStatusEnum.DISTRIBUTED) return
    const res = await getTransactions(hash)
    console.log({ res })
    if (res.transactionStatus !== status) {
      setStatus(res.transactionStatus)
    }
    if (res.distributionStatus !== distributionStatus) {
      setDistributionStatus(res.distributionStatus)
    }
    setData(res)
  }

  useEffect(() => {
    getTransaction()
    const intervalId = setInterval(getTransaction, 2000)
    return () => clearInterval(intervalId)
  }, [])

  if (
    distributionStatus === DistributionStatusEnum.PENDING ||
    distributionStatus === DistributionStatusEnum.PROCESSING
  )
    return (
      <div className="flex flex-col items-center justify-center text-center gap-8">
        <div className="text-3xl font-bold">Payment Successful</div>
        <div>
          <CgSpinner className="text-6xl animate-spin" />
        </div>
        <div className="font-medium">
          <div>Waiting for the Tokens to Deposit</div>
          <div className="text-xs">
            *It may take up to 2 minutes to complete
          </div>
        </div>
      </div>
    )
  if (distributionStatus === DistributionStatusEnum.FAILED)
    return (
      <div className="flex flex-col items-center justify-center text-center gap-8">
        <div className="text-3xl font-bold">Deposit Failed</div>
        <BsExclamationDiamond className="text-6xl text-red-500" />
        <div className="font-medium">
          Failed to deposit the tokens please contact support
        </div>
      </div>
    )
  if (distributionStatus === DistributionStatusEnum.DISTRIBUTED)
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div className="text-3xl font-bold">Deposit Successful</div>
        <IoCheckmarkCircleOutline className="text-6xl text-themeGreen" />
        <div className="font-medium">Waiting for the Tokens to Deposit</div>
        <div className="flex items-center justify-between gap-4">
          <a
            href={`${process.env.NEXT_PUBLIC_ICO_SCAN_URL}/tx/${data?.distributionHash}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center h-12 !sm:px-16 px-4 py-2 mx-auto text-lg text-black font-semibold border-2 bg-white border-themeGreen rounded-full shadow shadow-white/30 bg-opacity-50"
          >
            View Transaction
          </a>
          <button
            onClick={action}
            className="flex items-center justify-center h-12 !px-16 mx-auto text-lg font-semibold bg-themeGreen rounded-full shadow shadow-white/30 bg-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    )
}
