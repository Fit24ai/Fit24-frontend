"use client"
import React from "react"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import Image from "next/image"

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function ChartBox() {
  const doughnutData = {
    labels: ["Active", "Non-Active"],
    datasets: [
      {
        data: [117285, 7178],
        backgroundColor: ["#33cc33", "#1E90FF"],
        hoverBackgroundColor: ["#33cc33", "#1E90FF"],
        borderWidth: 0,
      },
    ],
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw.toLocaleString()}`
          },
        },
      },
    },
  }

  const barData = {
    labels: ["L1", "L2", "L3", "L4", "L5"],
    datasets: [
      {
        label: "Active",
        data: [31000, 29000, 32000, 27000, 30000],
        backgroundColor: "#33cc33",
        borderRadius: 4,
      },
      {
        label: "Non-Active",
        data: [5000, 4000, 6000, 2000, 4000],
        backgroundColor: "#1E90FF",
        borderRadius: 4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 27000,
        max: 32000,
        ticks: {
          stepSize: 1000,
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
            return `${context.dataset.label}: ${context.raw.toLocaleString()}`
          },
        },
      },
    },
  }

  const data = {
    labels: ["10:00", "12:00", "14:00", "16:00", "18:00"],
    datasets: [
      {
        label: "Fit24",
        data: [28, 30, 32, 29, 31],
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
    maintainAspectRatio: false, // Ensures the chart takes up the entire available space
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 27,
        max: 32,
        ticks: {
          stepSize: 1,
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
            label += `$${context.raw}k`
            return label
          },
        },
      },
    },
  }

  return (
    <div className="w-full flex 2md:flex-row flex-col items-center 2md:items-start gap-6 2md:gap-0 justify-between">
      <div className="2md:max-w-[57%] max-w-[650px] w-full flex flex-col gap-6 items-center">
        <div className="h-60 w-full  bg-black flex justify-center items-center py-4 !px-6 bg-opacity-35 rounded-xl">
          <div className="flex flex-col gap-2 max-w-[650px] text-white w-full h-full">
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
                <span className=" font-semibold">$2,113.80</span>
                <div className="text-xs text-green-500">+2.76%</div>
              </div>
            </div>
            <div className="w-full flex-1">
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-10 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Rewards</div>
            <div className="text-2xl">
              {" "}
              12,08
              <span className=" text-themeGreen"> Fit24</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Today Rewards</div>
            <div className="text-2xl">
              01,08
              <span className=" text-themeGreen"> Fit24</span>
            </div>
          </div>
        </div> */}
        <div className="bg-white bg-opacity-10 max-w-80 w-full p-4 flex flex-col items-center gap-2  rounded-lg">
          <div className="text-gray-400 text-sm">Today Rewards</div>
          <div className="text-2xl">
            12,08
            <span className=" text-themeGreen"> Fit24</span>
          </div>
        </div>
        <button className="max-w-52 w-full bg-themeGreen text-white h-10 rounded-lg">
          Claim Reward
        </button>
      </div>
      <div className="2md:max-w-[40%] w-full max-w-96 flex flex-col gap-4">
        <div className=" h-[350px] w-full hidden 2md:flex p-4 flex-col gap-6 bg-black bg-opacity-35 rounded-xl">
          <div className="h-[50%]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="h-[50%]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Direct Members</div>
            <div className="text-2xl">
              <span className=" text-themeGreen">12</span>,712
            </div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Stake</div>
            <div className="text-2xl">
              <span className=" text-themeGreen">70</span>,821
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Direct Members</div>
            <div className="text-2xl">
              <span className=" text-themeGreen">12</span>,712
            </div>
          </div>
          <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">Total Stake</div>
            <div className="text-2xl">
              <span className=" text-themeGreen">70</span>,821
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
