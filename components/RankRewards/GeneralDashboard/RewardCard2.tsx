"use client"

import { claimRankReward, claimReward } from "@/services/rewards"
import { Button } from "@headlessui/react"
import Image from "next/image"
import { useState } from "react"
import { CgSpinner } from "react-icons/cg"

export default function RewardCard2({ item }: any) {
  const [data, setData] = useState(item)
  const [loading, setLoading] = useState(false)
  const claimGeneralReward = async (id: string) => {
    setLoading(true)
    try {
      const res = await claimReward(id)
      console.log({ res })
      if (res.success === true) {
        setData({
          ...data,
          claimStatus: "PENDING",
        })
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div
      className={`md:p-6 p-3 pb-3 rounded-2xl shadow-md flex flex-col gap-2 justify-between h-full ${
        data.progressPercentage === 100
          ? "rankCardBg bg-opacity-30"
          : "bg-white bg-opacity-10"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div className="2md:w-[110px] w-[80px]">
          <Image
            // src={"/ranks/Freelancer.png"}
            src={data.reward.imageUrl}
            alt="image"
            width={500}
            height={500}
            className="w-full h-full"
          />
        </div>

        <div className="2md:text-base text-sm">
          <div className="2md:text-2xl text-xl mb-2">{data.reward.title}</div>
          <div className="2md:text-xl text-lg mb-1">Eligibility : </div>
          {data.reward.selfQualifierAmount && (
            <div className="flex">
              <span className="text-gray-300 w-[80px]">Self</span>
              <span className="w-fit">
                {" "}
                - ${data.reward.selfQualifierAmount}
              </span>
            </div>
          )}
          <div className="flex">
            <span className="text-gray-300 w-[80px]">Team</span>
            <span className="w-fit"> - ${data.reward.qualifierAmount}</span>
          </div>
        </div>
      </div>

      <div className="md:h-[50px] h-[40px] flex items-center w-full">
        {data.progressPercentage < 100 ? (
          // <div className="flex gap-2 items-center z-10 text-sm w-full">
          //   <div>0</div>
          //   <div className="w-full bg-gray-700 md:h-3 h-2 rounded-full relative">
          //     <div
          //       className="barGradient h-full rounded-full relative"
          //       style={{ width: `${data.progressPercentage}%` }}
          //     >
          //       <div className="absolute md:w-[35px] w-[25px] md:top-5 top-3 md:-right-4 -right-3 flex justify-center">
          //         <Image
          //           src="/rankrewards/Union.png"
          //           alt="Union"
          //           width={100}
          //           height={100}
          //           className="w-full"
          //         />
          //         <div className="z-10 md:text-sm text-[10px] absolute md:mt-3 mt-2">
          //           {data.progressPercentage.toFixed(0)}%
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          //   <div>100</div>
          // </div>
          <div className="flex itms-center justify-between w-full">
            {data.reward.selfQualifierAmount && (
              <div className="flex gap-2 items-center">
                <div className="text-gray-300">Self Stakes - </div>
                <div>${data.selfStakesUsd}</div>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <div className="text-gray-300">Team Stakes - </div>
              <div>${data.qualifierBusinessUsd}</div>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => claimGeneralReward(data.reward._id)}
            disabled={data.claimStatus !== null || loading}
            className="bg-[#20BF55] text-gray-100 w-full h-full rounded-lg data-[hover]:bg-opacity-80 transition-all data-[disabled]:bg-black data-[disabled]:bg-opacity-40 data-[disabled]:border-[2px] border-[#20BF55]"
          >
            {loading ? (
              <CgSpinner
                size={20}
                className="animate-spin mx-auto duration-500"
              />
            ) : data.claimStatus === null ? (
              "Request for claim"
            ) : data.claimStatus === "PENDING" ? (
              "Claim under process"
            ) : (
              "Claimed"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
