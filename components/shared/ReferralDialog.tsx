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

export function ReferralDialog({ stakeRef }: { stakeRef: string | undefined }) {
  const { openWallet, isLoggedIn } = useWallet()
  const { address } = useAccount()
  const [openBox, setOpenBox] = useState(false)
  // const search = useSearchParams()
  const [refId, setRefId] = useState("")
  const router = useRouter()
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

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

  const handleRegisterReferral = async () => {
    setLoading(true)
    try {
      const tx = await writeContractAsync({
        abi: referralAbi,
        address: fit24ReferralContractAddress,
        functionName: "register",
        chainId: vestingChainId,
        args: [refId],
      })
      // await createTransaction(tx,vestingChainId)
      setLoading(false)
      setSuccess(true)
    } catch (error) {
      console.log(error)
      setError(true)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (registerLoading) return
    if (!isLoggedIn) return
    if (!stakeRef) return
    const refId = stakeRef
    // const refId = search.get("stakeRef")
    if (refId) {
      console.log(refId)
      if (refId === address) return router.push(`/dashboard`)
      if (isValidAddress(readRegister![0].result! as AddressString)) {
        setRegistered(true)
      }
      setRefId(refId)
      setOpenBox(true)
    }
  }, [isLoggedIn, registerLoading])
  return (
    <Dialog open={openBox}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-red-600 bg-gradient-to-br  from-[#056237] to-[#030f39]">
        <div className=" w-full flex flex-col gap-4 items-center rounded-lg">
          {error ? (
            <div>
              <div className="min-w-[200px] h-[100px] flex items-center justify-center text-red-500">
                <VscError className="h-[50px] w-[50px]" />
              </div>
              <div className="text-center text-2xl font-bold">
                Something went wrong
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push("/dashboard")
                    setOpenBox(false)
                  }}
                  className="flex items-center justify-center h-12   w-full  mx-auto text-lg font-semibold bg-[#F27052] rounded-full shadow shadow-white/30 bg-opacity-50 mt-6 col-start-1"
                >
                  Close
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="min-w-[200px] h-[100px] flex items-center justify-center text-themeOrange">
              <CgSpinner className="h-[50px] w-[50px] animate-spin" />
            </div>
          ) : success ? (
            <div>
              <div className="min-w-[200px] h-[100px] flex items-center justify-center text-green-500">
                <FaRegCircleCheck className="h-[50px] w-[50px]" />
              </div>
              <div className="text-center text-2xl font-bold">
                Registered Successfully
              </div>
              <div>
                <button
                  onClick={() => {
                    router.push("/dashboard")
                    setOpenBox(false)
                  }}
                  className="flex items-center justify-center h-12   w-full  mx-auto text-lg font-semibold bg-[#F27052] rounded-full shadow shadow-white/30 bg-opacity-50 mt-6 col-start-1"
                >
                  Close
                </button>
              </div>
            </div>
          ) : registered ? (
            <div>
              <div className="text-2xl font-bold mb-4 ">
                Referral already exist.
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenBox(false)
                    router.push("/dashboard")
                  }}
                  className="flex items-center justify-center h-12   w-full  mx-auto text-lg font-semibold bg-[#F27052] rounded-full shadow shadow-white/30 bg-opacity-50 mt-6 col-start-1"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold mb-4 ">
                Register your Referral
              </div>
              <div className="p-2 border rounded-lg">{refId}</div>
              <div>
                <button
                  onClick={handleRegisterReferral}
                  className="flex items-center justify-center h-12   w-full  mx-auto text-lg font-semibold bg-themeGreen rounded-full shadow shadow-white/30 bg-opacity-50 mt-6 col-start-1 px-6"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
