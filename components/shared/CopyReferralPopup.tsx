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

export function CopyReferralPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <LuCopy /> <span className="text-themeGreen">Copy</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#056237] to-[#030f39] border-none text-white">
        <DialogTitle>Share Referral link</DialogTitle>
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <button>Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
