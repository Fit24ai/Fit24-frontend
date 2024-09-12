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
import { Dispatch, ReactNode } from "react"
import Image from "next/image"
import { IoClose } from "react-icons/io5"

export function StatusDialog({
  open,
  setOpen,
  type,
  message,
  title,
  action,
}: {
  open: boolean
  setOpen: Dispatch<boolean>
  type: "SUCCESS" | "FAIL"
  message: string | ReactNode
  title: string
  action?: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-red-600 bg-gradient-to-br  from-[#056237] to-[#030f39]">
        <div className=" w-full flex gap-4 items-center rounded-lg">
          {type === "SUCCESS" ? (
            <Image
              src={`/images/dialog/done.svg`}
              width={60}
              height={60}
              alt=""
              className="relative z-10 h-12 md:h-14"
            />
          ) : (
            <Image
              src={`/images/dialog/warn.svg`}
              width={60}
              height={60}
              alt=""
              className="relative z-10 h-12 md:h-14"
            />
          )}
          {type === "SUCCESS" ? (
            <div className="relative z-20 flex flex-col items-start justify-start text-left md:gap-2">
              <span className="font-semibold md:text-lg">
                {title ? title : "Purchase Successful"}
              </span>
              <div className="text-[#525961] font-medium md:text-base text-sm leading-tight">
                {message}
              </div>
            </div>
          ) : (
            <div className="relative z-20 flex flex-col items-start justify-start text-left md:gap-2">
              <span className="font-semibold md:text-lg">
                {title ? title : "Purchase Error"}
              </span>
              <div className="text-gray-400 font-medium md:text-base text-sm leading-tight">
                {message}
              </div>
            </div>
          )}
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
