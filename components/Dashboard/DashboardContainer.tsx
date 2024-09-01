"use client"
import React from "react"
import { IoMdPerson } from "react-icons/io"
import ChartBox from "./ChartBox"

export default function DashboardContainer() {
  const items = [
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
    {
      numbers: 12712,
    },
  ]
  return (
    <div className="w-full flex flex-col 2md:gap-6 gap-4 2md:py-8 py-4 2md:px-10 px-3 text-white pb-10">
      <div className="2md:hidden flex flex-col items-center 2md:gap-2 gap-1">
        <div className="2md:text-xl font-medium">Total Staked</div>
        <div className="text-2xl font-medium">124,463</div>
      </div>
      <div className="flex flex-col gap-2 w-full  2md:order-none order-1">
        <div>Network Statistics</div>
        <div className="flex gap-4  items-center overflow-x-auto hide-scrollbar">
          <div className="flex gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border border-themeGreen bg-white bg-opacity-5 w-32 p-2 "
              >
                <IoMdPerson size={24} />
                <div>{item.numbers.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">All Members</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChartBox />
    </div>
  )
}
