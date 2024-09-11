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
import { Dispatch, ReactNode, useEffect, useState } from "react"
import Image from "next/image"
import { IoClose } from "react-icons/io5"
import { useWallet } from "@/hooks/useWallet"
import PhoneInput, { Value } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { CgSpinner } from "react-icons/cg"

export function EmailDialog({
  open,
  setIsEmailPopup,
}: {
  open: boolean
  setIsEmailPopup: any
}) {
  const { login, error, setError, isRegisterPopup } = useWallet()
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState<Value | undefined>()

  const [data, setData] = useState<{
    email: string
    number: string | undefined
  }>({ email: "", number: undefined })

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const handleClick = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res: any = await login(data.email, phone)
      if (res) {
        if (res.email === false) {
          setLoading(false)
          return
        }
        setIsEmailPopup(false)
        setData({ email: "", number: undefined })
        setLoading(false)
        setError(null)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }

    // if (res) {
    //   if (res.email === false) {
    //     setLoading(false);
    //     return;
    //   }
    //   setIsEmailPopup(false);
    //   setData({ email: "", number: undefined });
    //   setLoading(false);
    //   setError(null);
    // } else {
    //   setLoading(false);
    // }
  }
  useEffect(() => {
    console.log("isRegisterPopup")
    console.log(isRegisterPopup)
    if (isRegisterPopup) {
      setIsEmailPopup(false)
    }
  }, [isRegisterPopup])
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md  outline-none border-none text-white bg-red-600 bg-gradient-to-br  from-[#056237] to-[#030f39]">
        <div className=" w-full flex flex-col gap-4 items-center rounded-lg">
          {error && (
            <p className="text-red-500 text-sm text-center w-full">{error}</p>
          )}
          <form
            onSubmit={handleClick}
            action=""
            className="flex flex-col  gap-4  sm:min-w-[400px] w-[300px]"
          >
            <div className="flex flex-col text-left gap-2">
              <label htmlFor="email" className="text-lg font-medium">
                Email
              </label>
              <input
                onChange={handleChange}
                value={data.email}
                required={true}
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full h-12 outline-2 outline text-black  outline-gray-400 rounded-xl px-4 text-lg"
              />
            </div>
            <div className="flex flex-col text-left gap-2 text-black">
              <label
                htmlFor="number"
                className="text-lg font-medium text-white"
              >
                Phone Number
              </label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                className="w-full h-12 outline-2 outline  bg-white outline-gray-400 rounded-xl px-4 text-lg"
              />
            </div>
            <button
              className="flex items-center justify-center h-12   w-full  mx-auto text-lg text-white font-semibold bg-themeGreen  rounded-full shadow shadow-white/30 hover:bg-opacity-80 mt-6 col-start-1"
              type="submit"
            >
              {loading ? (
                <CgSpinner className="text-xl animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
