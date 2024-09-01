import React from "react"
import Tabs from "../Dashboard/Tabs"
import Statistics from "../Dashboard/Statistics"
import { ScrollArea } from "../ui/scroll-area"

export default function Rewards() {
  return (
    // <ScrollArea>
    <div className="flex flex-col pr-4 h-full gap-4 max-w-[400px] w-full  overflow-auto pb-10">
      <div className="text-lg">Your Rewards</div>
      <div className="flex flex-col gap-6 items-center rounded-xl">
        <div className="w-full flex items-center gap-4 ">
          <div className="flex  flex-1 flex-col p-2 rounded-lg bg-white bg-opacity-10 items-center">
            <div className="text-gray-400 text-sm">Stake Reward</div>
            <div className="text-xl">3,36</div>
          </div>
          <div className="flex  flex-1 flex-col p-2 rounded-lg bg-white bg-opacity-10 items-center">
            <div className="text-gray-400 text-sm">Level Reward</div>
            <div className="text-xl">3,36</div>
          </div>
        </div>
        <div className="flex w-full flex-col p-2 gap-1 rounded-lg bg-white bg-opacity-10 items-center">
          <div className="text-gray-400 text-sm">Total Rewards</div>
          <div className="text-xl">
            12,08 <span className="text-themeGreen">Fit24</span>
          </div>
        </div>
        <div className="w-full mx-auto">
          <div className="relative h-3 rounded-full overflow-hidden bg-gray-700">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
              style={{ width: "5%" }}
            ></div>
          </div>
          <div className="flex justify-between text-white text-sm  mt-2">
            <span>99.3% Withdraw</span>
            <span>0.7% Remaining</span>
          </div>
        </div>

        <button className="w-full max-w-[200px] mx-auto bg-themeGreen text-white h-10 rounded-lg">
          Rewards
        </button>
      </div>

      {/* <div>
        <Tabs tab={tab} />
      </div>

      {tab === undefined && <Statistics />}
      {tab === "STATS" && <Statistics />} */}
    </div>
    // </ScrollArea>
  )
}
