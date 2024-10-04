"use client"

import React, { useEffect, useState } from "react"
import { IoMdPerson } from "react-icons/io"
import ChartBox from "./ChartBox"
import { useWallet } from "@/hooks/useWallet"
import { getUserRefIncome, getUserTokens } from "@/services/token"
import Image from "next/image"
import { getAllStakeTokens } from "@/services/stakingService"
import { useAccount } from "wagmi"

export default function DashboardContainer() {
  const { address } = useAccount()
  const { isLoggedIn } = useWallet()
  const [token, setToken] = useState(0)
  const getTokens = async () => {
    return await getAllStakeTokens()
  }
  useEffect(() => {
    if (!isLoggedIn) return
    getTokens()
      .then((data) => {
        setToken(data.tokens)
      })
      .catch((err) => {
        setToken(0)
      })
  }, [isLoggedIn])

  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) return
      getTokens()
        .then((data) => {
          setToken(data.tokens)
        })
        .catch((err) => {
          setToken(0)
        })
    }, 2000)
  }, [address])
  return (
    <div className="w-full flex flex-col 2md:gap-6 gap-4 2md:py-8 py-4 2md:px-10 px-3 text-white pb-10">
      <div className="flex flex-col items-center gap-2 ">
        <div className="text-xl font-medium">Total Staked</div>
        <div className="text-2xl font-medium flex gap-2 items-center">
          {Number(token).toFixed(2)}{" "}
          <span className="w-20">
            <Image
              src={"/fitLogo.svg"}
              width={3000}
              height={30000}
              alt="logo"
              className="h-full w-full"
            />
          </span>
        </div>
      </div>
      {/* <div className="flex flex-col gap-2 w-full  2md:order-none order-1">
        <div>Network Statistics</div>
        <div className="flex gap-4  items-center overflow-x-auto hide-scrollbar">
          <div className="flex gap-4">
            <div className="flex flex-col items-center rounded-lg border border-themeGreen bg-white bg-opacity-5 w-32 p-2 ">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">All Members</div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-themeGreen bg-white bg-opacity-5 w-32 p-2 ">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">Total Stake</div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-themeGreen bg-white bg-opacity-5 w-32 p-2 ">
              <IoMdPerson size={24} />
              <div>12712</div>
              <div className="text-gray-400 text-xs">Total Withdrawals</div>
            </div>
          </div>
        </div>
      </div> */}
      <ChartBox token={token} />
    </div>
  )
}
