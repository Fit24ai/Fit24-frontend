"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
// import { RiMenu4Line } from "react-icons/ri"
// import Image from "next/image"
// import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
// import { useSearchParams } from "next/navigation"
// import { RxCross2 } from "react-icons/rx"
// import { useRouter } from "next/navigation"
import ConnectWallet from "./ConnectWallet"
import { IoDocumentText, IoPerson, IoPieChartOutline } from "react-icons/io5"
import { HiSwitchVertical } from "react-icons/hi"
import { IoIosPeople, IoMdNotifications } from "react-icons/io"
// import { FaIdCard } from "react-icons/fa"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { IoMenu } from "react-icons/io5"
import { AiFillGift } from "react-icons/ai"
import { useAccount, useDisconnect } from "wagmi"
import { smallAddress } from "@/libs/utils"
import { ChainSelect } from "./ChainSelect"
import { LuCopy } from "react-icons/lu"
import copy from "copy-to-clipboard"
import { FaCheck } from "react-icons/fa"
import { useWallet } from "@/hooks/useWallet"
import { getAllStakeTokens, getMyUpline } from "@/services/stakingService"

export function NavbarDrawer() {
  // const searchParams = useSearchParams()
  // const tab = searchParams.get("tab") || "defaultTabValue"
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // const finalPath = `${pathname}?tab=${tab}`
  // const router = useRouter()

  const [isAlertVisible, setIsAlertVisible] = useState(false)

  const handleButtonClick = () => {
    setIsAlertVisible(true)
    copy(`${window.location.origin}/dashboard?stakeRef=${address}`)
    setTimeout(() => {
      setIsAlertVisible(false)
    }, 3000)
  }

  useEffect(() => {
    console.log(pathname)
    setOpen(false)
  }, [pathname])

  const items = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <IoPieChartOutline />,
    },
    {
      name: "Stake",
      path: "/stake",
      icon: <HiSwitchVertical />,
    },
    {
      name: "Rewards",
      path: "/rewards",
      icon: <AiFillGift />,
    },
    {
      name: "Levels",
      path: "/levels",
      icon: <IoIosPeople />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <IoMdNotifications />,
    },
    // {
    //   name: "Registration ID",
    //   path: "/registration",
    //   icon: <FaIdCard />,
    // },
    {
      name: "Resources",
      path: "/resources",
      icon: <IoDocumentText />,
    },
  ]

  const { disconnect } = useDisconnect()

  const { address } = useAccount()
  const { isLoggedIn } = useWallet()
  const [token, setToken] = useState(0)

  const getTokens = async () => {
    try {
      const data = await getAllStakeTokens()
      // console.log("tokens")
      // console.log(data)
      setToken(data.tokens)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(address)
    setTimeout(() => {
      getTokens()
    }, 2000)
  }, [address])
  useEffect(() => {
    if (isLoggedIn) getTokens()
  }, [isLoggedIn, address])

  const [upline, setUpline] = useState<string | undefined>()

  const getupline = async () => {
    try {
      const res = await getMyUpline()
      console.log("upline", res)
      if (typeof res === "string") setUpline(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getupline()
  }, [address, isLoggedIn])
  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) return
      getupline()
    }, 2000)
  }, [address])
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="h-8 w-8 text-themeGreen">
          <IoMenu className="h-full w-full stroke-1" />
        </button>
      </DrawerTrigger>
      <DrawerContent className=" ml-auto h-full w-[300px] bg-gradient-to-bl  to-[#053921] from-[#030f39] border-none">
        <div className="flex h-full flex-col overflow-y-auto px-4 py-4 pt-10 scrollbar-hide text-white gap-6">
          {/* <div className="flex items-center justify-between px-6">
            <Link href={"/"}>
              <Image
                src={"/Images/Navbar/logo.svg"}
                width={100}
                height={100}
                className="w-40 cursor-pointer"
                alt="logo"
              />
            </Link>
            <DrawerClose>
              <div className="h-8 w-8 font-extrabold text-theme-dark">
                <RxCross2 className="h-full w-full" />
              </div>
            </DrawerClose>
          </div> */}
          {/* <ConnectWallet /> */}
          <ConnectWallet drawer />
          <div className="w-full bg-[#020c2b] flex flex-col gap-2 rounded-lg py-2 px-4">
            <div className="w-full flex items-center justify-between">
              <div className="w-full flex items-center gap-2">
                <div className=" w-fit text-white rounded-full">
                  <IoPerson className="w-6 h-6" />
                </div>
                {address && (
                  <div className="text-sm">{smallAddress(address)}</div>
                )}
              </div>
              {/* <div className="bg-[#056237] px-3 py-1 rounded-xl text-sm">
            Blokfit
          </div> */}
              {/* <ChainSelect /> */}
            </div>
            {token > 0 && (
              <div className="w-full flex items-center gap-4 text-sm ">
                <div>My Referral ID</div>
                {/* <div> {address && smallAddress(address!)}</div> */}
                <button
                  onClick={handleButtonClick}
                  disabled={isAlertVisible}
                  className="text-gray-400 flex items-center justify-center"
                >
                  {isAlertVisible ? (
                    <FaCheck size={20} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <LuCopy /> <span className="text-themeGreen">Copy</span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {upline && (
            <div>
              <span className="font-semibold text-gray-400">My Upline - </span>
              {smallAddress(upline)}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-400">Main Pages</div>
            <div className="flex flex-col gap-4 bg-white bg-opacity-10 p-4 rounded-lg">
              {items.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className={`${
                    pathname === item.path ? "text-white" : "text-gray-400"
                  }  font-semibold text-sm flex justify-between items-center ${
                    index !== items.length - 1 &&
                    "border-b border-gray-500 pb-4"
                  }  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-xl ${
                        pathname === item.path && "text-themeGreen"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {item.name}
                  </div>
                  <div className="text-gray-400 text-xl">
                    <MdOutlineKeyboardArrowRight />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button
            className="bg-themeGreen py-1.5 rounded-lg"
            onClick={() => disconnect()}
          >
            Logout
          </button>
          {/* <Link
            className={`mt-2 px-6 py-4 text-lg tracking-wider font-bold ${
              pathname.startsWith("/case-study")
                ? "bg-theme-dark text-white"
                : ""
            }`}
            href={"/case-study"}
          >
            CASE STUDIES
          </Link>
          <Link
            className={`mt-2 px-6 py-4 text-lg tracking-wider font-bold text-theme-dark ${
              pathname.startsWith("/blog") ? "bg-theme-dark text-white" : ""
            }`}
            href={"/blog"}
          >
            BLOG
          </Link>
          <Link
            className={`mt-2 px-6 py-4 text-lg tracking-wider font-bold text-theme-dark ${
              pathname === "/portfolio" ? "bg-theme-dark text-white" : ""
            }`}
            href={"/portfolio"}
          >
            PORTFOLIO
          </Link>
          <Link
            className={`mt-2 px-6 py-4 text-lg tracking-wider font-bold text-theme-dark ${
              pathname === "/about-us" ? "bg-theme-dark text-white" : ""
            }`}
            href={"/"}
          >
            ABOUT US
          </Link> */}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
