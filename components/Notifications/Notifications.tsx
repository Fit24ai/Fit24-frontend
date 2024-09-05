"use client"
import { getNotifications } from "@/services/notification"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { FaLock } from "react-icons/fa"

export default function NotificationContainer() {
  const levels = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]

  const [notifications, setNotifications] = useState<any>([])

  const getNotificationsOfUser = async () => {
    const res = await getNotifications()
    setNotifications(res)
  }

  useEffect(() => {
    getNotificationsOfUser()
  }, [])
  return (
    <div className="w-full flex flex-col h-screen gap-6 2md:py-8 py-4 2md:px-10 px-6">
      <div className="grid 2md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-6 w-full flex-wrap">
        {notifications.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="p-2 py-4 px-4 flex items-center w-full min-w-[120px] max-w-[400px] gap-2  bg-white bg-opacity-5 rounded-lg justify-between"
            >
              <div className="w-14">
                {item.type === "PURCHASE" ? (
                  <Image
                    src="/notifications/purchase.png"
                    alt="level"
                    width={2000}
                    height={2000}
                    className="w-full"
                  />
                ) : (
                  <Image
                    src="/notifications/image.svg"
                    alt="level"
                    width={40}
                    height={40}
                    className="w-full"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-base ">Congrats</div>
                <div className="text-sm  text-gray-400">{item.message}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-gray-400">14:03</div>
                {/* <div className="text-sm text-gray-400"></div> */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
