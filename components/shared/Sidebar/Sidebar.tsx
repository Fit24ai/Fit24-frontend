"use client"
import Link from "next/link"
import React from "react"
import { IoPieChartOutline } from "react-icons/io5"
import { HiSwitchVertical } from "react-icons/hi"
import { IoIosPeople } from "react-icons/io"
import { IoMdNotifications } from "react-icons/io"
import { FaIdCard } from "react-icons/fa"
import { IoDocumentText } from "react-icons/io5"
import { AiFillGift } from "react-icons/ai";
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const items = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <IoPieChartOutline />,
    },
    {
      name: "Stake",
      path: "/stake",
      icon: <HiSwitchVertical />,
    },
    {
      name: "Rewards",
      path: "/rewards",
      icon: <AiFillGift />,
    },
    {
      name: "Levels",
      path: "/levels",
      icon: <IoIosPeople />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <IoMdNotifications />,
    },
    // {
    //   name: "Registration ID",
    //   path: "/registration",
    //   icon: <FaIdCard />,
    // },
    {
      name: "Resources",
      path: "/resources",
      icon: <IoDocumentText />,
    },
  ]

  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className="hidden h-full max-w-64 w-full px-10 xl:flex flex-col gap-6 pt-10 border-r border-gray-700">
      {items.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          className={`${
            pathname === item.path ? "text-white" : "text-gray-400"
          }  font-semibold text-base flex gap-3 items-center`}
        >
          <div
            className={`text-2xl ${
              pathname === item.path && "text-themeGreen"
            }`}
          >
            {item.icon}
          </div>
          {item.name}
        </Link>
      ))}
    </div>
  )
}
