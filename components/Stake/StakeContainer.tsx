"use client"
import React, { useEffect, useState } from "react"
import Staking from "./Staking"
import Rewards from "./Rewards"
import Tabs from "../Dashboard/Tabs"
import StakingBox from "./StakingBox"
import TxHistory from "./TxHistory"
import { useWallet } from "@/hooks/useWallet"
import { getUserRefIncome, getUserTokens } from "@/services/token"
import { ReloadProvider } from "@/context/Reload"
import ClaimHistory from "./ClaimHistory"
import Image from "next/image"
import { getAllStakeTokens } from "@/services/stakingService"

export default function StakeContainer({ tab }: { tab: string | undefined }) {
  const [refetchTX, setRefetchTX] = useState(false)
  const { isLoggedIn } = useWallet()
  const [token, setToken] = useState(0)
  const [refIncome, serRefIncome] = useState(0)
  const getTokens = async () => {
    return await getAllStakeTokens()
  }
  useEffect(() => {
    getTokens()
      .then((data) => {
        setToken(data.tokens)
      })
      .catch((err) => {
        setToken(0)
      })
    getUserRefIncome()
      .then((data) => {
        serRefIncome(data.referralIncome)
      })
      .catch((err) => {
        serRefIncome(0)
      })
  }, [isLoggedIn])
  return (
    <ReloadProvider>
      <div className="text-white w-full h-full  2md:py-8 py-4 2md:px-10 px-3">
        <div className="flex flex-col gap-6 items-center ">
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
          <Staking refetchTX={refetchTX} setRefetchTX={setRefetchTX} />
          <div>
            <Tabs tab={tab} />
          </div>
        </div>
        {tab === undefined && <StakingBox />}
        {tab === "STAKING" && <StakingBox />}
        {/* {tab === "HISTORY" && <TxHistory refetchTX={refetchTX} setRefetchTX={setRefetchTX} />} */}
        {tab === "HISTORY" && <ClaimHistory />}
      </div>
    </ReloadProvider>
  )
}
