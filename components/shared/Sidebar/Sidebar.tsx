"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { IoPieChartOutline } from "react-icons/io5"
import { HiSwitchVertical } from "react-icons/hi"
import { IoIosPeople } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"
import { FaIdCard } from "react-icons/fa"
import { IoDocumentText } from "react-icons/io5"
import { AiFillGift } from "react-icons/ai"
import { usePathname } from "next/navigation"
import { IoPerson } from "react-icons/io5"
import { useAccount } from "wagmi"
import { smallAddress } from "@/libs/utils"
import { LuCopy } from "react-icons/lu"
import { ChainSelect } from "../Navbar/ChainSelect"
import { useWallet } from "@/hooks/useWallet"
import copy from "copy-to-clipboard"
import { TiTick } from "react-icons/ti"
import { FaCheck } from "react-icons/fa6"
import { getAllStakeTokens, getMyUpline } from "@/services/stakingService"

export default function Sidebar() {
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

  const [isAlertVisible, setIsAlertVisible] = useState(false)

  const handleButtonClick = () => {
    setIsAlertVisible(true)
    copy(`${window.location.origin}/dashboard?stakeRef=${address}`)
    setTimeout(() => {
      setIsAlertVisible(false)
    }, 3000)
  }
  const [token, setToken] = useState(0)
  const { isLoggedIn } = useWallet()

  const pathname = usePathname()
  console.log(pathname)
  const { address } = useAccount()
  const { logout } = useWallet()
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
    <div className="hidden h-full max-w-64 w-full px-4 xl:flex flex-col gap-2 pt-10 border-r border-gray-700 text-white">
      <div className="w-full bg-[#020c2b] flex flex-col gap-2 rounded-lg py-2 px-4">
        <div className="w-full flex items-center justify-between">
          <div className="w-full flex items-center gap-2">
            <div className=" w-fit text-white rounded-full">
              <IoPerson className="w-6 h-6" />
            </div>
            {address && <div className="text-sm">{smallAddress(address)}</div>}
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
        <div className="mx-auto">
          <span className="font-semibold text-sm text-gray-400">
            Sponsor Id -{" "}
          </span>
          {smallAddress(upline)}
        </div>
      )}
      <div className="flex flex-col gap-6 px-5 mt-6">
        {items.map((item, index) => (
          <Link
            href={item.path}
            key={index}
            className={`${
              pathname === item.path ? "text-white" : "text-gray-400"
            }  font-semibold text-lg flex gap-3 items-center`}
          >
            <div
              className={`text-2xl ${
                pathname === item.path && "text-themeGreen"
              }`}
            >
              {item.icon}
            </div>
            {item.name}
          </Link>
        ))}
      </div>
      {/* <div className="w-full mt-40 px-4">
        <button
          onClick={() => logout()}
          className="w-full bg-themeGreen px-3 py-1 rounded-lg"
        >
          Log Out
        </button>
      </div> */}
    </div>
  )
}
