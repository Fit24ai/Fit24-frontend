"use client"
import { claimReward } from "@/services/rewards"
import { Button } from "@headlessui/react"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { CgSpinner } from "react-icons/cg"

interface IReward {
  _id: string // Mongoose ObjectId
  title: string
  status: "ACTIVE" | "INACTIVE" // Status can be extended if needed
  description: string
  imageUrl: string
  qualifierAmount: number
  userClaimedStatus: {
    userId: string // Mongoose ObjectId for the user
    claimStatus: "PENDING" | "APPROVED" // Claim status for the user
  }[]
  createdAt: Date
  updatedAt: Date
}

const OngoingRewardsCard = ({
  _id,
  title,
  imageUrl,
  status,
  description,
  qualifierAmount,
  userClaimedStatus,
  createdAt,
  updatedAt,
}: IReward) => {
  const [shadowColor, setShadowColor] = useState<string>("rgba(0, 0, 0, 0.2)")
  const imageRef = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  // Function to extract the dominant color using Canvas
  const getDominantColor = (img: HTMLImageElement): string => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return "rgba(0, 0, 0, 0.2)" // Default color if context creation fails

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)

    // Get the pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const pixels = imageData.data

    let r = 0,
      g = 0,
      b = 0
    const pixelCount = pixels.length / 4

    // Sum up the RGB values of each pixel
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i] // Red
      g += pixels[i + 1] // Green
      b += pixels[i + 2] // Blue
    }

    // Calculate the average RGB values
    r = Math.floor(r / pixelCount)
    g = Math.floor(g / pixelCount)
    b = Math.floor(b / pixelCount)

    return `rgba(${r}, ${g}, ${b}, 0.5)` // Return the dominant color as rgba
  }

  useEffect(() => {
    if (imageRef.current) {
      const image = imageRef.current
      image.onload = () => {
        try {
          const dominantColor = getDominantColor(image)
          setShadowColor(dominantColor)
        } catch (error) {
          console.error("Error extracting color:", error)
        }
      }
    }
  }, [])

  const handleClaim = async () => {
    setLoading(true)
    try {
      const res = await claimReward(_id)
      console.log(res)
      setSuccess(true)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div
      className="flex md:gap-10 gap-3 items-center md:px-10 px-4 md:py-4 py-2 rounded-lg overflow-hidden bg-[#323838] flex-shrink-0"
      // style={{
      //   backgroundColor: "#333",
      //   boxShadow: `0px 8px 16px ${shadowColor}`,
      // }}
    >
      <div
        className="md:w-[200px] w-[70px] flex-shrink-0"
        style={{
          backgroundColor: shadowColor,
          // boxShadow: `0px 16px 16px ${shadowColor}`,
          boxShadow: `0px 10px 20px 100px ${shadowColor}`,
        }}
      >
        <Image
          ref={imageRef}
          src={imageUrl}
          width={100}
          height={100}
          alt="Bonus"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 items-end">
        <div className="w-full flex flex-col md:gap-2 gap-1">
          <div className="text-white md:text-2xl text-md font-semibold">
            {title}
          </div>
          <div className="text-gray-300 md:text-base text-[10px]">
            {description}
          </div>
        </div>
        <button
          disabled={loading || success}
          onClick={handleClaim}
          className="w-[150px] disabled:opacity-50 disabled:cursor-not-allowed bg-themeGreen text-white h-10 rounded-lg"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
            </div>
          ) : success ? (
            "Claimed"
          ) : (
            "Claim Now"
          )}
        </button>
      </div>
    </div>
  )
}

export default OngoingRewardsCard
