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

export function BreakdwonPopup({ open, setOpen, breakdown }: any) {
  // useEffect(() => {
  //   if (isEmailPopup === true) {
  //     if (openBox === true) setOpenBox(false)
  //   }
  // }, [isEmailPopup])
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[80vh] max-w-[90vw] w-fit overflow-auto outline-none border-none text-white bg-gray-800 shadow-lg">
        {breakdown && (
          <div className="w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
            <h2 className="text-lg font-bold mb-4">Breakdown Details</h2>

            <div>
              <p>
                <strong>Qualifier Type:</strong> {breakdown.qualifierType}
              </p>

              {breakdown.qualifierType === "FORTYTHIRTY" && (
                <>
                  <div className="flex flex-col flex-nowrap mt-2">
                    <strong>Max Business Leg:</strong>
                    <div className="flex flex-nowrap">
                      Address - {breakdown.MaxBusinessLeg.referee}
                    </div>
                    <div>
                      Total Business - $
                      {breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
                    </div>
                    <div>
                      Allocated 30% - $
                      {breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col flex-nowrap mt-2">
                    <strong>Second Max Business Leg:</strong>
                    <div className="flex flex-nowrap">
                      Address - {breakdown.SecondMaxBusinessLeg.referee}
                    </div>
                    <div>
                      Total Business - $
                      {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
                    </div>
                    <div>
                      Allocated 30% - $
                      {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
                    </div>
                  </div>
                  <p className="mt-2">
                    <strong>Rest of Members:</strong> ${" "}
                    {breakdown.restOfMembers.totalUsdAmount.toLocaleString()}{" "}
                    (Allocated 30%: $
                    {breakdown.restOfMembers.allocated30_2.toLocaleString()})
                  </p>
                </>
              )}

              {/* <p className="mt-2">
                <strong>Second Max Business Leg:</strong>{" "}
                {breakdown.SecondMaxBusinessLeg.referee} - $
                {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}{" "}
                (Allocated 30%: $
                {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()})
              </p> */}

              <h3 className="mt-4 font-bold">Referee Business:</h3>
              <ul className="list-disc list-inside">
                {breakdown.refereeBusiness.map((ref: any, index: any) => (
                  <li key={index}>
                    {ref.referee}: ${ref.USDAmount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                setOpen(false)
              }}
              className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition"
            >
              Close
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
