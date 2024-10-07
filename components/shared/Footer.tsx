import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function Footer() {
  return (
    <div className="bg-[#020f24] text-white py-10 md:px-36 px-10 flex md:flex-row flex-col md:items-center xl:gap-80 gap-20">
      <div className="flex flex-col gap-6 md:w-[40%]">
        <div className="flex h-[30px]  xl:h-[40px]">
          <Link href="/" className="items-center text-xl font-bold ">
            <Image
              src="/fitLogo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="h-full w-full"
            />
          </Link>
        </div>
        <div className="text-gray-400 text-lg">
          The FIT24 Token is a physical activity-based, mintable token built on
          the BlockFit network, designed to motivate you to stay active and
          healthy. It transforms every step, rep, and workout into a rewarding
          experience, blending fitness with financial growth. With FIT24, you
          will achieve a healthier lifestyle and gain financial empowerment,
          driving personal and global well-being.
        </div>
        <input
          type="email"
          className="w-full bg-transparent  border border-gray-600 p-2 rounded-lg"
          placeholder="Enter your email"
        />
        <button className="w-fit bg-themeGreen rounded-lg px-6 py-2">
          Submit
        </button>
      </div>
      <div className="flex flex-col gap-6 md:w-[350px] ">
        <div className="text-3xl text-themeGreen">
          FIT24 staking News and information
        </div>
        <div className="text-gray-400 text-xl">
          Get the latest updates and all the key details on FIT24 Staking
          through our official Telegram channel and Newsletter.
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-lg">Follow Us</div>
          <div className="flex gap-4 items-center">
            <Link
              href="https://www.instagram.com/fit24global/"
              className="w-14"
            >
              <Image
                src="/social/instagram.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </Link>
            <Link href="https://x.com/Fit24global" className="w-14">
              <Image
                src="/social/twitter.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </Link>
            <Link href="https://t.me/fit24global" className="w-14">
              <Image
                src="/social/telegram.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCTrjJNX8N9pQRFYl9G00ZWQ"
              className="w-14"
            >
              <Image
                src="/social/youtube.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
