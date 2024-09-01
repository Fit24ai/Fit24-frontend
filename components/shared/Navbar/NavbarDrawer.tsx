"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { RiMenu4Line } from "react-icons/ri"
import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { RxCross2 } from "react-icons/rx"
import { useRouter } from "next/navigation"
import ConnectWallet from "./ConnectWallet"
import { IoDocumentText, IoPieChartOutline } from "react-icons/io5"
import { HiSwitchVertical } from "react-icons/hi"
import { IoIosPeople, IoMdNotifications } from "react-icons/io"
import { FaIdCard } from "react-icons/fa"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { IoMenu } from "react-icons/io5"
import { AiFillGift } from "react-icons/ai"

export function NavbarDrawer() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "defaultTabValue"
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const finalPath = `${pathname}?tab=${tab}`
  const router = useRouter()

  useEffect(() => {
    console.log(pathname)
    setOpen(false)
  }, [pathname, tab])

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
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="h-8 w-8 text-themeGreen">
          <IoMenu className="h-full w-full stroke-1" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="z-[150] ml-auto h-full w-[300px] bg-[#041e3b] border-none">
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
          <ConnectWallet />

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
