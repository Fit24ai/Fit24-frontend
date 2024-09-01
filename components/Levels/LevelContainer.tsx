"use client"
import Image from "next/image"
import React from "react"
import { FaLock } from "react-icons/fa"

export default function LevelContainer() {
  const levels = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]
  return (
    <div className="w-full flex flex-col h-screen gap-6 2md:py-8 py-4 2md:px-10 px-3">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-medium">Total Members</div>
        <div className="text-2xl font-medium">124,463</div>
      </div>
      <div className="flex gap-4 w-full overflow-x-auto hide-scrollbar">
        {levels.map((item, index) => {
          return (
            <div key={index} className="p-1 flex flex-col items-center w-full min-w-[120px]  bg-white bg-opacity-5 rounded-lg">
              <div className="text-xs w-full flex items-center justify-between">
                <div className="p-1 bg-themeGreen bg-opacity-10 rounded-md">
                  12%
                </div>
                <FaLock />
              </div>
              <div className="w-8">
                <Image
                  src="/level/medal.svg"
                  alt="level"
                  width={40}
                  height={40}
                  className="w-full"
                />
              </div>
              <div className="text-sm">Level 1</div>
            </div>
          )
        })}
      </div>
      <div className="w-full flex flex-col md:flex-row flex-1 items-center justify-between gap-6">
        <div className="w-[45%] h-full max-h-[500px] bg-black md:order-none order-1"></div>
        <div className="md:max-w-[50%] w-full max-w-[400px] flex flex-col gap-4 items-center ">
          <div>Level 2</div>
          <div className="w-full flex gap-6">
            <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
              <div className="text-gray-400 text-sm">Total Members</div>
              <div>128</div>
            </div>
            <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
              <div className="text-gray-400 text-sm">Active Members</div>
              <div>98</div>
            </div>
          </div>
          <div className="w-full flex gap-6">
            <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
              <div className="text-gray-400 text-sm">Inactive Members</div>
              <div>30</div>
            </div>
            <div className="flex-1 bg-black bg-opacity-30 p-4 flex flex-col items-center gap-2 rounded-lg">
              <div className="text-gray-400 text-sm">Team Staked</div>
              <div>7826</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
