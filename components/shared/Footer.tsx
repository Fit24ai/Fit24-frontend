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
        <div className="text-gray-400 text-xl">
          Fit24 web3 and Al-based fitness app allows global users to track their
          fitness progress n earn rewards for achieving milestones through a
          Fit24 token
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
          News and information about the Pre-Sale
        </div>
        <div className="text-gray-400 text-xl">
          Get all the details about the FIT24 Pre-Sale in our official Telegram
          channel and newsletter
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-lg">Follow Us</div>
          <div className="flex gap-4 items-center">
            <div className="w-16">
              <Image
                src="/social/instagram.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </div>
            <div className="w-16">
              <Image
                src="/social/twitter.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </div>
            <div className="w-16">
              <Image
                src="/social/telegram.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
