"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useWallet } from "@/hooks/useWallet"
// import { useSearchParams } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useReadContracts, useWriteContract } from "wagmi"
import { referralAbi } from "@/libs/referralAbi"
import {
  AddressString,
  fit24ReferralContractAddress,
  vestingChainId,
} from "@/libs/chains"
import { isValidAddress } from "@/libs/utils"
import { createTransaction } from "@/services/transaction"
import { BiLoader, BiLoaderCircle } from "react-icons/bi"
import { FaRegCircleCheck } from "react-icons/fa6"
import { VscError } from "react-icons/vsc"
import { CgSpinner } from "react-icons/cg"
import { useParams } from "@/context/useParams"

export function AlertDialog({ stakeRef }: { stakeRef: string | undefined }) {
  const { params, setParams } = useParams()
  const { setIsEmailPopup, isEmailPopup } = useWallet()
  const {
    openWallet,
    isLoggedIn,
    disconnectWallet,
    setIsRegisterPopup,
    isAlert,
    setIsAlert,
  } = useWallet()
  const { address } = useAccount()
  const [openBox, setOpenBox] = useState(false)
  // const search = useSearchParams()
  const [refId, setRefId] = useState("")
  const router = useRouter()
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  // const [stakeRef, setStakeRef] = useState<string | undefined>()

  const { writeContractAsync } = useWriteContract()

  const { data: readRegister, isLoading: registerLoading } = useReadContracts({
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
  // useEffect(() => {
  //   if (params) {
  //     setStakeRef(params)
  //   }
  // }, [params])

  useEffect(() => {
    console.log(readRegister)
    if (!address) return
    if (registerLoading) return
    console.log(readRegister)

    if (readRegister) {
      if (
        address === "0x74b7844bf7cf9064606BA4DC896C1e2d25d5a53A" ||
        address === "0x50Ca1fde29D62292a112A72671E14a5d4f05580f"
      ) {
        return
      } else if (
        readRegister[0].result === "0x0000000000000000000000000000000000000000"
      ) {
        if (!stakeRef) {
          setIsRegisterPopup(true)
          setIsEmailPopup(false)
          setIsAlert(true)
        }
      }
    }
  }, [address, registerLoading, isLoggedIn])

  // useEffect(() => {
  //   if (isEmailPopup === true) {
  //     if (openBox === true) setOpenBox(false)
  //   }
  // }, [isEmailPopup])
  return (
    <Dialog open={isAlert}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-red-600 bg-gradient-to-br  from-[#056237] to-[#030f39]">
        <div className=" w-full flex flex-col gap-4 items-center rounded-lg">
          <div className="text-xl font-bold mb-4 text-center">
            User needs register link to participate
          </div>
          <div>
            <button
              onClick={() => {
                // setIsEmailPopup(false)
                disconnectWallet()
                setIsAlert(false)
              }}
              className="flex items-center justify-center h-12   w-full  mx-auto text-lg font-semibold bg-themeGreen rounded-full shadow shadow-white/30 bg-opacity-50 mt-6 col-start-1 px-6"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
