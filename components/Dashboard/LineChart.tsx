"use client"

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { FaLongArrowAltUp } from "react-icons/fa"
import { FaLongArrowAltDown } from "react-icons/fa"

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function LineChart() {
  const [priceData, setPriceData] = useState<number[]>([])
  const [latestPrice, setLatestPrice] = useState<number | null>(null)
  const [priceChangePercentage, setPriceChangePercentage] = useState<
    number | null
  >(null)

  // Fetch data from Coinstore API
  const fetchPriceData = async () => {
    try {
      const response = await fetch(
        "https://api.coinstore.com/api/v1/ticker/price"
      )
      const result = await response.json()

      // Access the 'data' array from the response
      const fit24Data = result.data.find(
        (item: any) => item.symbol === "FIT24USDT"
      )
      console.log(fit24Data)

      if (fit24Data) {
        const price = parseFloat(fit24Data.price)
        const INITIAL_PRICE = 0.04

        setPriceData((prevPrices) => {
          const newPrices = [...prevPrices, price].slice(-5)

          if (price && INITIAL_PRICE) {
            const changePercentage =
              ((price - INITIAL_PRICE) / INITIAL_PRICE) * 100
            setPriceChangePercentage(changePercentage)
          }

          return newPrices
        })

        // setPriceData((prevPrices) => {
        //   const newPrices = [...prevPrices, price].slice(-5)
        //   if (newPrices.length > 1) {
        //     const lastPrice = newPrices[newPrices.length - 2]
        //     const changePercentage = ((price - lastPrice) / lastPrice) * 100
        //     setPriceChangePercentage(changePercentage)
        //   }
        //   return newPrices
        // })

        setLatestPrice(price)
      } else {
        console.log("FIT24USDT not found")
      }
    } catch (error) {
      console.error("Error fetching price data:", error)
    }
  }

  useEffect(() => {
    // Fetch initial data and set interval for polling every 10 seconds
    fetchPriceData()
    const interval = setInterval(fetchPriceData, 10000)

    return () => clearInterval(interval)
  }, [])

  const data = {
    labels: priceData.map((_, index) => `${index * 10 + 10}:00`), // Dynamic time labels
    datasets: [
      {
        label: "Fit24",
        data: priceData,
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74, 144, 226, 0.2)",
        pointBackgroundColor: "#4a90e2",
        pointBorderColor: "#4a90e2",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          stepSize: 0.01,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            label += `$${context.raw.toFixed(4)}`
            return label
          },
        },
      },
    },
  }

  return (
    <div className="h-60 w-full bg-black flex justify-center items-center py-4 px-6 bg-opacity-35 rounded-xl">
      <div className="flex flex-col gap-2 max-w-[650px] text-white w-full h-full">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={"/coin/fitcoin.svg"}
              alt="coin"
              width={25}
              height={25}
            />
            <span className="text-base font-semibold">Fit24</span>
          </div>
          <div className="text-right">
            <span className="font-semibold">
              {latestPrice ? `$${latestPrice.toFixed(6)}` : "Loading..."}
            </span>
            <div className="flex items-center">
              <div
                className={`text-xs ${
                  priceChangePercentage && priceChangePercentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                } flex items-center`}
              >
                {priceChangePercentage !== null
                  ? `${priceChangePercentage.toFixed(2)}%`
                  : ""}
              </div>
              <div className="flex items-center text-xs">
                {priceChangePercentage && priceChangePercentage > 0 ? (
                  <FaLongArrowAltUp className="inline text-green-500 " />
                ) : (
                  <FaLongArrowAltDown className="inline text-red-500 " />
                )}
                <div>(from launch price)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full flex-1">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
