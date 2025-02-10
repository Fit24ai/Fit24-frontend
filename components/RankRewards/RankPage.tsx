"use client"
import { useEffect, useState } from "react"
import RankCard from "./RankCard"
import { getQualifierBusiness } from "@/services/rewards"
import { CgSpinner } from "react-icons/cg"

type LevelBusinessData = {
  levelBusiness?: { [key: number]: number }
  levelCount?: number
  maxBusiness?: number
  maxLevel?: number
  message: string
  secondMaxLevel?: number
  success: boolean
  totalBusiness?: number
}

export default function RankPage() {
  const Ranks = [
    {
      title: "Freelancer",
      background: "/rankrewards/freelancerBg.png",
      image: "/rankrewards/freelancer.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: true,
      breakdown: 20000,
    },
    {
      title: "Associate",
      background: "/rankrewards/associateBg.png",
      image: "/rankrewards/associate.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: true,
      breakdown: 30000,
    },
    {
      title: "Certified Expert",
      background: "/rankrewards/certifiedBg.png",
      image: "/rankrewards/certified.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: false,
      breakdown: 40000,
    },
    {
      title: "Manager",
      background: "/rankrewards/managerBg.png",
      image: "/rankrewards/manager.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: false,
      breakdown: 50000,
    },
    {
      title: "Regional Promoter",
      background: "/rankrewards/promoterBg.png",
      image: "/rankrewards/promoter.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: false,
      breakdown: 60000,
    },
    {
      title: "National Promoter",
      background: "/rankrewards/nationalpromoterBg.png",
      image: "/rankrewards/nationalpromoter.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: false,
      breakdown: 70000,
    },
    {
      title: "Global Ambassador",
      background: "/rankrewards/ambassadorBg.png",
      image: "/rankrewards/ambassador.png",
      description:
        "Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc adipiscing mattis.",
      // eligible: false,
      breakdown: 80000,
    },
  ]

  const [data, setData] = useState<LevelBusinessData>()
  const [loading, setLoading] = useState(false)
  const [rank, setRank] = useState("")

  const getUserQualifierBusiness = async () => {
    try {
      let data
      setLoading(true)
      const res = await getQualifierBusiness()
      console.log({ res })
      if (res.success) {
        data = res
        setData(res)
      } else {
        data = {
          ...res,
          levelBusiness: {},
          levelCount: 0,
          maxBusiness: 0,
          maxLevel: 0,
          secondMaxLevel: 0,
          totalBusiness: 0,
        }
        setData({
          ...res,
          levelBusiness: {},
          levelCount: 0,
          maxBusiness: 0,
          maxLevel: 0,
          secondMaxLevel: 0,
          totalBusiness: 0,
        })
      }
      setRank(calculateRank(data.maxBusiness!))
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserQualifierBusiness()
  }, [])

  // useEffect(() => {
  //   if(!data) return
  //   calculateRank(data.maxBusiness!)
  // }, [data])

  // const calculateRank = (maxBusiness: number) => {
  //   if (maxBusiness === 0) return "UNRANKED"
  //   else if (maxBusiness >= Ranks[6].breakdown) return "Global Ambassador"
  //   else if (maxBusiness >= Ranks[5].breakdown) return "National Promoter"
  //   else if (maxBusiness >= Ranks[4].breakdown) return "Regional Promoter"
  //   else if (maxBusiness >= Ranks[3].breakdown) return "Manager"
  //   else if (maxBusiness >= Ranks[2].breakdown) return "Certified Expert"
  //   else if (maxBusiness >= Ranks[1].breakdown) return "Associate"
  //   else if (maxBusiness >= Ranks[0].breakdown) return "Freelancer"
  //   else return "UNRANKED"
  // }
  const calculateRank = (maxBusiness: number) => {
    if (maxBusiness === 0) return "Not Qualified"
    else if (maxBusiness >= Ranks[6].breakdown) return "Global Ambassador"
    else if (maxBusiness >= Ranks[5].breakdown) return "National Promoter"
    else if (maxBusiness >= Ranks[4].breakdown) return "Regional Promoter"
    else if (maxBusiness >= Ranks[3].breakdown) return "Manager"
    else if (maxBusiness >= Ranks[2].breakdown) return "Certified Expert"
    else if (maxBusiness >= Ranks[1].breakdown) return "Associate"
    else if (maxBusiness >= Ranks[0].breakdown) return "Freelancer"
    else return "Not Qualified"
  }

  const calculatePercentage = (
    maxBusiness: number,
    breakdown: number,
    index?: number
  ) => {
    if (maxBusiness === 0) return 0
    else if (maxBusiness >= breakdown) {
      return 100
    } else if (maxBusiness > Ranks[index! - 1].breakdown) {
      const a = breakdown - Ranks[index! - 1].breakdown
      const b = maxBusiness - Ranks[index! - 1].breakdown
      return Math.round((b / a) * 100)
    } else {
      return 0
    }
  }

  const calculateEligibility = (
    maxBusiness: number,
    breakdown: number,
    index?: number
  ) => {
    if (maxBusiness === 0) return false
    else if (maxBusiness >= breakdown) {
      return true
    } else if (maxBusiness >= Ranks[index! - 1].breakdown) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="text-white w-full h-full 2md:py-6 py-4 2md:px-14 px-3 gap-6">
      <div className="w-full bg-[#FFFFFF] bg-opacity-20 md:py-6 py-4 md:px-10 px-4 flex flex-col gap-4  overflow-auto rounded-3xl">
        <div className="flex gap-2 items-center">
          <div className="text-gray-400 md:text-base text-sm">Your Rank :</div>
          <div className="md:text-lg text-base">
            {loading ? <CgSpinner size={20} className="animate-spin duration-300" /> : rank}
          </div>
        </div>
        <div className="w-full flex flex-col md:gap-3 items-center md:px-6 px-2">
          <div className="md:text-2xl text-lg font-semibold">Rank Bonus</div>
          <div className="text-gray-400 text-center md:text-base text-xs">
            Lorem ipsum dolor sit amet consectetur. Leo ac ornare nunc
            adipiscing mattis lorem nisi sed. Et eget pellentesque ridicul.
            adipiscing mattis lorem nisi sed. Et eget pellentesque ridicul.
          </div>
        </div>
        <div className="flex gap-[2%] flex-wrap justify-center">
          {loading && (
            <div>
              <CgSpinner size={30} className="animate-spin duration-300" />
            </div>
          )}
          {data &&
            Ranks.map((rank, index) => (
              <RankCard
                key={index}
                {...rank}
                percentage={calculatePercentage(
                  data?.maxBusiness!,
                  rank.breakdown,
                  index
                )}
                eligible={calculateEligibility(
                  data?.maxBusiness!,
                  rank.breakdown,
                  index
                )}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
