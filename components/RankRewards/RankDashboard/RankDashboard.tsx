"use client"
import { getAllRanksAndUserEligibilities } from "@/services/rewards"
import { useState, useEffect } from "react"
import RankCard2 from "./RankCard2"
import { CgSpinner } from "react-icons/cg"
import { BreakdwonPopup } from "@/components/shared/BreakdownPopup"

interface Rank {
  rank: {
    title: string
    qualifierAmount: number
    rewardAmount: number
    salary?: string
    description?: string
  }
  progressPercentage: number
  isEligibleForClaim: boolean
  claimStatus: string | null
}

interface RankData {
  ranks: Rank[]
  currentRank: { title: string; index: number }
}

export default function RankDashboard() {
  const [rankData, setRankData] = useState<any>(null)

  const [showPopup, setShowPopup] = useState(false)
  const [breakdown, setBreakdown] = useState<any>()

  useEffect(() => {
    async function fetchRanks() {
      const response = await getAllRanksAndUserEligibilities()
      console.log({ response })
      setRankData(response)
      setBreakdown(response.breakdown)
    }
    fetchRanks()
  }, [])

  return (
    <div className="h-full md:max-h-[90vh] max-h-[87vh] overflow-auto hide-scrollbar text-white md:p-6 p-3">
      <BreakdwonPopup
        open={showPopup}
        setOpen={setShowPopup}
        breakdown={breakdown}
      />
      {rankData ? (
        <>
          {/* {showPopup && breakdown && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-lg font-bold mb-4">Breakdown Details</h2>

                <div>
                  <p>
                    <strong>Qualifier Type:</strong> {breakdown.qualifierType}
                  </p>

                  <p className="mt-2">
                    <strong>Max Business Leg:</strong>{" "}
                    {breakdown.MaxBusinessLeg.referee} - $
                    {breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}{" "}
                    (Allocated 40%: $
                    {breakdown.MaxBusinessLeg.allocated40.toLocaleString()})
                  </p>

                  <p className="mt-2">
                    <strong>Second Max Business Leg:</strong>{" "}
                    {breakdown.SecondMaxBusinessLeg.referee} - $
                    {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}{" "}
                    (Allocated 30%: $
                    {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
                    )
                  </p>

                  <p className="mt-2">
                    <strong>Rest of Members:</strong> ${" "}
                    {breakdown.restOfMembers.totalUsdAmount.toLocaleString()}{" "}
                    (Allocated 30%: $
                    {breakdown.restOfMembers.allocated30_2.toLocaleString()})
                  </p>

                  <h3 className="mt-4 font-bold">Referee Business:</h3>
                  <ul className="list-disc list-inside">
                    {breakdown.refereeBusiness.map((ref: any, index: any) => (
                      <li key={index}>
                        {ref.referee}: ${ref.USDAmount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )} */}
          <div className="mb-6 text-gray-400 md:flex justify-between items-center md:text-base text-sm">
            <div>
              Your Rank :{" "}
              <span className="md:text-xl text-base text-white">
                {rankData.currentRank.title}
              </span>
            </div>
            <div className="md:flex flex-col items-end gap-1">
              <div>
                Your Total Business Volume :{" "}
                <span className="md:text-xl text-base text-white">
                  $
                  {Number(
                    rankData.currentRank.totalUsdBusiness
                  ).toLocaleString()}
                </span>
              </div>
              {/* <div>
                Your Total Qualified Volume :{" "}
                <span className="md:text-xl text-base text-white">
                  $
                  {Number(
                    rankData.currentRank.qualifierBusinessUsd
                  ).toLocaleString()}
                </span>
              </div> */}
              <div>
                Your Total Qualified Volume:{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowPopup(true)
                  }}
                  className="md:text-xl text-base text-blue-400 underline cursor-pointer"
                >
                  $
                  {Number(
                    rankData.currentRank.qualifierBusinessUsd
                  ).toLocaleString()}
                </a>
              </div>
            </div>
          </div>

          {/* <div className="grid md:grid-cols-2 gap-6">
            {rankData.ranks.map((item: any, index: 1) => (
              <RankCard2 item={item} key={index} />
            ))}
          </div> */}
          <div className="grid md:grid-cols-2 md:gap-6 gap-4">
            {rankData.ranks.map((item: any, index: number) => (
              <div
                key={index}
                className={`h-auto  ${
                  rankData.ranks.length % 2 !== 0 &&
                  index === rankData.ranks.length - 1
                    ? "md:col-span-2 flex justify-center"
                    : ""
                } `}
              >
                <div
                  className={`h-full ${
                    rankData.ranks.length % 2 !== 0 &&
                    index === rankData.ranks.length - 1
                      ? "md:min-w-[50%] md:w-auto w-full"
                      : ""
                  }`}
                >
                  <RankCard2 item={item} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-full w-full flex justify-center items-center text-green-400">
          <CgSpinner className="h-16 w-16 animate-spin duration-300" />
        </div>
      )}
    </div>
  )
}
