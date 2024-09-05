import { Copy } from "lucide-react"

// import { Button } from "@/components/ui/button"
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
import Image from "next/image"
import { useWallet } from "@/hooks/useWallet"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

export function LoginDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { openWallet } = useWallet()
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md p-0 flex justify-center items-center bg-transparent  text-white border-none rounded-lg focus:outline-none px-2">
        <div className="relative rounded-lg bg-gradient-to-br  from-[#056237] to-[#030f39] bg-opacity-10  w-full ">
          <div className=" flex flex-col gap-4 items-center py-10">
            <div className="text-center">
              Please Connect <span className="text-themeGreen">MetaMask</span>{" "}
              <br /> wallet to Continue
            </div>
            <button
              onClick={() => openWallet()}
              className="bg-themeGreen px-8 py-1 rounded-lg focus:outline-none"
            >
              Connect
            </button>
          </div>
          <div className="absolute w-32 left-1/2 transform -translate-x-1/2 -top-[60px]">
            <Image
              src={"/metamask.png"}
              alt="coin"
              width={3000}
              height={3000}
              className="w-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
