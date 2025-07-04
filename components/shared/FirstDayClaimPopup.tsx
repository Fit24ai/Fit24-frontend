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
import { Dispatch, ReactNode } from "react"
import Image from "next/image"
import { IoClose } from "react-icons/io5"

export function FirstDayClaimPopup({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<boolean>
}) {
  const today = new Date()
  const isBeforeFourth = today.getDate() < 5

  // Set claim date to 4th of current month if before 4th, otherwise 4th of next month
  const claimDate = new Date(
    today.getFullYear(),
    today.getMonth() + (isBeforeFourth ? 0 : 1),
    5
  )

  const nextMonthName = claimDate.toLocaleString("default", {
    month: "long",
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-red-600 bg-gradient-to-br  from-[#056237] to-[#030f39]">
        <div className=" w-full flex gap-4 items-center rounded-lg">
          <Image
            src={`/images/dialog/warn.svg`}
            width={60}
            height={60}
            alt=""
            className="relative z-10 h-12 md:h-14"
          />
          <div className="relative z-20 flex flex-col items-start justify-start text-left md:gap-2">
            <span className="font-semibold md:text-lg">
              Claim Available on 4th {nextMonthName}
            </span>
            <div className="text-gray-400 font-medium md:text-base text-sm leading-tight">
              Your rewards accumulate daily. You can claim your monthly reward
              on 5th {nextMonthName}. Thank you!
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="px-6 ml-auto w-fit py-1 rounded-lg bg-themeGreen"
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  )
}
