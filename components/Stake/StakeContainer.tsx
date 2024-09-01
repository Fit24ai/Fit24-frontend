import React from "react"
import Staking from "./Staking"
import Rewards from "./Rewards"
import Tabs from "../Dashboard/Tabs"
import StakingBox from "./StakingBox"
import TxHistory from "./TxHistory"

export default function StakeContainer({ tab }: { tab: string | undefined }) {
  return (
    <div className="text-white w-full h-full  2md:py-8 py-4 2md:px-10 px-3">
      <div className="flex flex-col gap-6 items-center ">
        <div className="flex flex-col items-center gap-2 ">
          <div className="text-xl font-medium">Total Staked</div>
          <div className="text-2xl font-medium">2,760.23 Fit24</div>
        </div>
        <Staking />
        <div>
          <Tabs tab={tab} />
        </div>
      </div>
      {tab === undefined && <StakingBox />}
      {tab === "STAKING" && <StakingBox />}
      {tab === "HISTORY" && <TxHistory />}
    </div>
  )
}
