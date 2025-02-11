"use client"
import React, { useState } from "react"
import RewardCard from "./RewardCard"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import "swiper/css"
import { Navigation, Pagination } from "swiper/modules"
import Image from "next/image"
import RewardSwiperCard from "./RewardSwiperCard"
import { MdKeyboardArrowRight } from "react-icons/md"
import { MdKeyboardArrowLeft } from "react-icons/md"
import Link from "next/link"

SwiperCore.use([Navigation])

export default function RewardsTypes() {
  const rewardTypes = [
    {
      title: "Rank Calculator",
      bgImage: "/rankrewards/rankBg2.png",
      image: "/rankrewards/rank.png",
      color: "#FFAD00",
      path: "/rank-rewards/rank",
    },
    {
      title: "General Rewards",
      bgImage: "/rankrewards/generalbg.png",
      image: "/rankrewards/general.png",
      color: "#FFC200",
      path: "/rank-rewards/general",
    },
    {
      title: "Mystery Box",
      bgImage: "/rankrewards/mysteryBg.png",
      image: "/rankrewards/mystery.png",
      color: "#00FF55",
      path: "/rank-rewards/mystery",
    },
  ]

  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null)
  return (
    <div className="w-full">
      <div className="hidden md:flex gap-[3%] justify-between">
        {rewardTypes.map((card, index) => (
          <div key={index} className="flex w-full relative">
            <RewardCard {...card} />
          </div>
        ))}
      </div>

      {/* <div className="md:hidden w-full flex justify-center">
        <div className="w-full h-[350px] relative">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={setSwiperInstance}
            navigation={{
              prevEl: swiperInstance?.navigation?.prevEl,
              nextEl: swiperInstance?.navigation?.nextEl,
            }}
            className="h-full w-[90vw] z-[100]"
          >
            {rewardTypes.map((card, index) => (
              <SwiperSlide key={index}>
                <div
                  key={index}
                  className="flex w-full h-full relative justify-center "
                >
                  <button className="absolute h-auto w-full max-w-[70%] z-10 rounded-3xl overflow-hidden">
                    <Image
                      src={card.bgImage}
                      alt="image"
                      width={300}
                      height={300}
                      className="h-full w-full"
                    />
                    <div className="z-20 h-full   w-full top-0 absolute flex flex-col">
                      <div
                        className={`h-[70%] flex justify-center ${
                          card.title === "Rank Rewards"
                            ? "items-end pb-[3%]"
                            : "items-center pt-5"
                        }  bg-[#ffffff] bg-opacity-10 `}
                      >
                        <div
                          className={`${
                            card.title === "Rank Rewards"
                              ? " w-[85%]"
                              : " w-[60%]"
                          }`}
                        >
                          <Image
                            src={card.image}
                            alt="image"
                            width={1000}
                            height={1000}
                            className="h-full w-full"
                          />
                        </div>
                      </div>

                      <div className="w-full absolute bottom-[29%]">
                        <div
                          style={{ background: card.color }}
                          className={`h-1.5 w-[30%] mx-auto rounded-full`}
                        ></div>
                      </div>
                      <div className="h-[30%] bg-[#0A212C] bg-opacity-80 flex justify-center items-center">
                        <div className="font-semibold text-xl">
                          {card.title}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="absolute top-[45%] left-0 z-50"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <MdKeyboardArrowLeft size={50} />
          </button>
          <button
            className="absolute top-[45%] right-0 z-50"
            onClick={() => swiperInstance?.slideNext()}
          >
            <MdKeyboardArrowRight size={50} />
          </button>

        </div>
      </div> */}
      <div className="md:hidden w-full flex justify-center">
        <div className="w-full relative">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={setSwiperInstance}
            navigation={{
              prevEl: swiperInstance?.navigation?.prevEl,
              nextEl: swiperInstance?.navigation?.nextEl,
            }}
            className="w-[90vw] z-[100]"
          >
            {rewardTypes.map((card, index) => (
              <SwiperSlide key={index}>
                <Link
                  href={card.path}
                  key={index}
                  className="flex w-full relative justify-center"
                >
                  <button className="relative w-full max-w-[80%] z-10 rounded-3xl overflow-hidden">
                    <Image
                      src={card.bgImage}
                      alt="image"
                      width={300}
                      height={300}
                      className="w-full"
                    />
                    <div className="z-20 h-full   w-full top-0 absolute flex flex-col">
                      <div
                        className={`h-[70%] flex justify-center ${
                          card.title === "Rank Rewards"
                            ? "items-end pb-[3%]"
                            : "items-center pt-5"
                        }  bg-[#ffffff] bg-opacity-10 `}
                      >
                        <div
                          className={`${
                            card.title === "Rank Rewards"
                              ? " w-[85%]"
                              : " w-[60%]"
                          }`}
                        >
                          <Image
                            src={card.image}
                            alt="image"
                            width={1000}
                            height={1000}
                            className="h-full w-full"
                          />
                        </div>
                      </div>

                      <div className="w-full absolute bottom-[29%]">
                        <div
                          style={{ background: card.color }}
                          className={`h-1.5 w-[30%] mx-auto rounded-full`}
                        ></div>
                      </div>
                      <div className="h-[30%] bg-[#0A212C] bg-opacity-80 flex justify-center items-center">
                        <div className="font-semibold text-xl">
                          {card.title}
                        </div>
                      </div>
                    </div>
                  </button>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className="absolute top-1/2 transform -translate-y-1/2 left-[-15px] z-50"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <MdKeyboardArrowLeft size={50} />
          </button>
          <button
            className="absolute top-1/2 transform -translate-y-1/2 right-[-15px] z-50"
            onClick={() => swiperInstance?.slideNext()}
          >
            <MdKeyboardArrowRight size={50} />
          </button>
        </div>
      </div>
    </div>
  )
}
