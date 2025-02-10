"use client"
import Image from "next/image"
import React from "react"
export interface RankCardProps {
  title: string
  background: string
  image: string
  description: string
  eligible: boolean
  percentage: number
}

export default function RankCard({
  title,
  background,
  image,
  description,
  eligible,
  percentage,
}: RankCardProps) {
  return (
    <div className={`md:w-[48%] mt-4 py-3 px-6 flex flex-col gap-1 relative`}>
      {!eligible && (
        <div
          className={`w-full h-full top-0 left-0 absolute bg-black bg-opacity-75 z-20
          rounded-xl`}
        ></div>
      )}
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={background}
          alt="image"
          width={500}
          height={500}
          className="w-full h-full"
        />
      </div>
      <div className="flex gap-2 items-center z-10">
        <div className="md:w-[170px] w-[120px]">
          <Image
            src={image}
            alt="image"
            width={500}
            height={500}
            className="w-full"
          />
        </div>
        <div className="flex flex-col md:gap-2">
          <div className="md:text-2xl text-lg font-semibold">{title}</div>
          <div className="text-gray-400 md:text-sm text-xs">{description}</div>
        </div>
      </div>
      <div className="flex gap-2 items-center z-10 text-sm">
        <div>0</div>
        <div className="w-full bg-gray-700 h-2 rounded-full relative">
          <div
            className="barGradient h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div>100</div>
      </div>
    </div>
  )
}
