import Image from "next/image"
import React from "react"
interface IProps {
  title: string
  bgImage: string
  image: string
  color: string
}

export default function RewardSwiperCard({ title, bgImage, image, color }: IProps) {
  return (
    // <div className="flex h-[330px] w-full relative justify-center">
    <button className="absolute h-auto w-full max-w-[70%] z-10 rounded-3xl overflow-hidden">
      <Image
        src={bgImage}
        alt="image"
        width={300}
        height={300}
        className="h-full w-full"
      />
      <div className="z-20 h-full   w-full top-0 absolute flex flex-col">
        <div
          className={`h-[70%] flex justify-center ${
            title === "Rank Rewards" ? "items-end pb-[3%]" : "items-center pt-5"
          }  bg-[#ffffff] bg-opacity-10 `}
        >
          <div
            className={`${title === "Rank Rewards" ? " w-[85%]" : " w-[60%]"}`}
          >
            <Image
              src={image}
              alt="image"
              width={1000}
              height={1000}
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="w-full absolute bottom-[29%]">
          <div
            style={{ background: color }}
            className={`h-1.5 w-[30%] mx-auto rounded-full`}
          ></div>
        </div>
        <div className="h-[30%] bg-[#0A212C] bg-opacity-80 flex justify-center items-center">
          <div className="font-semibold text-xl">{title}</div>
        </div>
      </div>
    </button>
    // </div>
  )
}
