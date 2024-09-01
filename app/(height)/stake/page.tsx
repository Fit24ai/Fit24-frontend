import PageWrapper from "@/components/shared/PageWrapper"
import Rewards from "@/components/Stake/Rewards"
import StakeContainer from "@/components/Stake/StakeContainer"
import Staking from "@/components/Stake/Staking"
import React from "react"

export default function page({
  searchParams,
}: {
  searchParams: { tab: string | undefined }
}) {
  console.log("searchParams", searchParams.tab)
  return (
    // <div className="text-white w-full h-full py-6  flex flex-col gap-6 items-center px-8">
    //   <div className="flex flex-col items-center gap-2 ">
    //     <div className="text-xl font-medium">Total Staked</div>
    //     <div className="text-2xl font-medium">2,760.23 Fit24</div>
    //   </div>
    //   <div className="w-full h-full flex gap-8 overflow-auto  justify-evenly">
    //     <Staking />
    //     <Rewards tab={searchParams.tab} />
    //   </div>
    // </div>
    <PageWrapper>
      <StakeContainer tab={searchParams.tab} />
    </PageWrapper>
  )
}
