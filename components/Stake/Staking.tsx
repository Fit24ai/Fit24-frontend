"use client"
import Image from "next/image"
import { useState } from "react"
import { FaEquals } from "react-icons/fa6"

export default function Staking() {
  const [pool, setPool] = useState(0)
  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* <div className="text-lg">Staking</div> */}
      <div className="flex flex-col gap-4  items-center rounded-xl">
        <div>Select one Pool</div>
        <div className="flex items-center md:gap-8 sm:gap-4 gap-2">
          <button
            onClick={() => setPool(1)}
            className={`flex flex-col  ${
              pool === 1
                ? "bg-blue-600 bg-opacity-30"
                : "bg-white bg-opacity-10"
            }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
          >
            <div className="md:text-base text-sm">Pool A</div>
            <div
              className={`md:text-lg text-base text-gray-400 ${
                pool === 1 ? "text-green-400" : "text-gray-400"
              }`}
            >
              Moderate
            </div>
            <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 1 && "text-green-400"}`}>A</span>
                  PY
                </div>
                <div className="text-gray-400">72-96%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 1 && "text-green-400"}`}>P</span>
                  eriod
                </div>
                <div className="text-gray-400">12 Months</div>
              </div>
              <div className="flex justify-between gap-3 md:gap-0 items-center">
                <div className="whitespace-nowrap">
                  <span className={`${pool === 1 && "text-green-400"}`}>
                    Min
                  </span>
                  . Quantity
                </div>
                <div className="text-gray-400">2,500</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => setPool(2)}
            className={`flex flex-col  ${
              pool === 2
                ? "bg-blue-600 bg-opacity-30"
                : "bg-white bg-opacity-10"
            }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
          >
            <div className="md:text-base text-sm">Pool B</div>
            <div
              className={`md:text-lg text-base text-gray-400 ${
                pool === 2 ? "text-green-400" : "text-gray-400"
              }`}
            >
              Huge Yields
            </div>
            <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 2 && "text-green-400"}`}>A</span>
                  PY
                </div>
                <div className="text-gray-400">84-108%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 2 && "text-green-400"}`}>P</span>
                  eriod
                </div>
                <div className="text-gray-400">24 Months</div>
              </div>
              <div className="flex justify-between gap-3 md:gap-0 items-center">
                <div className="whitespace-nowrap">
                  <span className={`${pool === 2 && "text-green-400"}`}>
                    Min
                  </span>
                  . Quantity
                </div>
                <div className="text-gray-400">5,000</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => setPool(3)}
            className={`flex flex-col  ${
              pool === 3
                ? "bg-blue-600 bg-opacity-30"
                : "bg-white bg-opacity-10"
            }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
          >
            <div className="md:text-base text-sm">Pool C</div>
            <div
              className={`md:text-lg text-base text-gray-400 ${
                pool === 3 ? "text-green-400" : "text-gray-400"
              }`}
            >
              Moderate
            </div>
            <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 3 && "text-green-400"}`}>A</span>
                  PY
                </div>
                <div className="text-gray-400">96-120%</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className={`${pool === 3 && "text-green-400"}`}>P</span>
                  eriod
                </div>
                <div className="text-gray-400">36 Months</div>
              </div>
              <div className="flex justify-between gap-2 md:gap-0 items-center">
                <div className="whitespace-nowrap">
                  <span className={`${pool === 3 && "text-green-400"}`}>
                    Min
                  </span>
                  . Quantity
                </div>
                <div className="text-gray-400">10,000</div>
              </div>
            </div>
          </button>
        </div>
        <div className="flex flex-col items-center mt-4 gap-4">
          <div>Investment Amount</div>
          <div className="flex sm:gap-4 gap-2 items-center">
            <div className="w-14 sm:w-20">
              <Image
                src={"/fitLogo.svg"}
                alt="Ethereum"
                width={3000}
                height={3000}
                className="w-full h-full"
              />
            </div>
            <input
              className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
              type="text"
            />
            <div className="text-themeGreen">
              <FaEquals />
            </div>
            <div className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-10  rounded-sm text-sm sm:text-base">
              1254
            </div>
            <div className="font-semibold w-16 sm:text-base text-sm">USDT</div>
          </div>
          <button className="w-[200px] mt-5 mx-auto bg-themeGreen text-white h-10 rounded-lg">
            Stake
          </button>
        </div>
      </div>
    </div>
  )
}
