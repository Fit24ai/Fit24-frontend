"use client"
import { Copy } from "lucide-react"

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
import { LuCopy } from "react-icons/lu"
import { useAccount } from "wagmi"
import { useState } from "react"
import { AddressString } from "@/libs/chains"

export function CopyReferralPopup() {
  const { address } = useAccount()
  const desktopLink = `${window.location.origin}/dashboard?stakeRef=${address}`
  const getMobileLink = (address: AddressString) => {
    const route = window.location.origin

    const slicedRoute = route.replace(/^https?:\/\//, "")

    const mobileLink = `https://metamask.app.link/${slicedRoute}/dashboard?stakeRef=${address}`

    return mobileLink
  }

  const referralMessage = `Referral for FIT24 Staking:\nFor mobile device - ${getMobileLink(
    address!
  )}\nFor desktop - ${desktopLink}`

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralMessage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset the copied status after 2 seconds
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <LuCopy /> <span className="text-themeGreen">Copy</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#056237] to-[#030f39] border-none text-white">
        <DialogTitle>Share Referral link</DialogTitle>
        <div className="mb-4 w-full overflow-hidden disabled">
          <div>For mobile device - </div>
          <div className="truncate text-themeGreen">
            {getMobileLink(address!)}
          </div>
          <div>For desktop - </div>
          <div className="truncate text-themeGreen">{desktopLink}</div>
        </div>
        <DialogFooter className="flex !flex-row ml-auto">
          <button
            onClick={handleCopy}
            className="bg-themeGreen text-white px-4 py-2 rounded"
          >
            {copied ? "Copied!" : "Copy Message"}
          </button>
          <DialogClose asChild>
            <button className="ml-4 bg-white px-4 py-2 rounded text-black">
              Cancel
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
