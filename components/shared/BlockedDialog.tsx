"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { useWallet } from "@/hooks/useWallet"
// import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useReadContracts, useWriteContract } from "wagmi"
import { referralAbi } from "@/libs/referralAbi"
import { fit24ReferralContractAddress, vestingChainId } from "@/libs/chains"
import { isValidAddress } from "@/libs/utils"
import { createTransaction } from "@/services/transaction"
import { BiLoader, BiLoaderCircle } from "react-icons/bi"
import { FaRegCircleCheck } from "react-icons/fa6"
import { VscError } from "react-icons/vsc"
import { CgSpinner } from "react-icons/cg"
import { useParams } from "@/context/useParams"

export function BlockedDialog({ open, setOpen }: any) {
  const { disconnectWallet } = useWallet()
  // useEffect(() => {
  //   if (isEmailPopup === true) {
  //     if (openBox === true) setOpenBox(false)
  //   }
  // }, [isEmailPopup])
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-gray-800 shadow-lg">
        <div className="w-full flex flex-col items-center gap-6 p-6 rounded-lg  ">
          <div className="text-xl font-bold text-center text-white">
            Unable to Connect! Please contact support team
          </div>
          <button
            onClick={() => {
              disconnectWallet()
              setOpen(false)
            }}
            className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
