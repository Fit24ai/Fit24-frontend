"use client"

import { useState } from "react"
import Rules from "./Rules"
import GeneralWinner from "./GeneralWinner"

export default function GeneralPage() {
  const [tab, setTab] = useState("rules")
  return (
    <div className="text-white w-full h-full 2md:py-8 py-4 2md:px-10 px-3 gap-6">
      <div className="flex flex-col w-full">
        <div className="flex  rounded-t-lg w-[300px]">
          <button
            onClick={() => setTab("rules")}
            className={`${
              tab === "rules" ? "bg-green-500 scale shadow-lg" : "bg-gray-800"
            } rounded-t-lg flex-1 px-6 py-2 transform transition-transform duration-300`}
          >
            Rules
          </button>
          <button
            onClick={() => setTab("winner")}
            className={`${
              tab === "winner" ? "bg-green-500 scale shadow-lg" : "bg-gray-800"
            } rounded-t-lg flex-1 px-6 py-2 transform transition-transform duration-300`}
          >
            Winner
          </button>
        </div>
        <div className="w-full bg-[#FFFFFF] bg-opacity-20 rounded-b-lg">
          {tab === "rules" ? <Rules /> : <GeneralWinner />}
        </div>
      </div>
    </div>
  )
}
