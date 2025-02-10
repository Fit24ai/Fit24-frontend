import Image from "next/image"
import React from "react"
import RewardsTypes from "./RewardsTypes"

export default function RankRewardsPage() {
  return (
    <div className="text-white w-full h-full 2md:py-8 py-4 2md:px-10 px-3  flex flex-col gap-6 items-center">
      <div className="flex flex-col items-center gap-6 ">
        <div className="flex md:flex-row flex-col gap-[10%] justify-between  rounded-xl md:px-10 px-4 pb-10 md:pb-0 relative items-center">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={"/rankrewards/contentBg.png"}
              alt="image"
              width={3000}
              height={3000}
              className="h-full w-full hidden md:block"
            />
            <Image
              src={"/rankrewards/headingBgMobile.png"}
              alt="image"
              width={3000}
              height={3000}
              className="h-full w-full md:hidden block"
            />
          </div>
          <div className="md:w-[60%] flex flex-col gap-2  z-10  md:my-10 order-1">
            <div className="font-medium md:text-xl text-sm">Heading Title</div>
            <div className="text-gray-400 md:text-base text-xs">
              Lorem ipsum dolor sit amet consectetur. Id amet mauris lectus
              ullamcorper dapibus eget vulputate faucibus. Amet quis quis amet
              lorem metus tincidunt quam. Id feugiat diam sit nibh cursus
              suscipit cras faucibus. Amet dolor egestas condimentum id.
            </div>
          </div>
          <div className="md:h-[110%] w-[70%] md:w-auto  z-10 flex justify-end md:mt-[-4%] md:absolute md:right-10 md:bottom-0">
            <Image
              src="/rankrewards/rewards.png"
              alt="image"
              width={300}
              height={300}
              className="md:h-full md:w-auto w-full"
            />
          </div>
        </div>

        {/* <div className="flex flex-col md:flex-row gap-[10%] justify-between rounded-xl px-10 relative items-center">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={"/rankrewards/contentBg.png"}
              alt="image"
              width={3000}
              height={3000}
              className="h-full w-full"
            />
          </div>

          <div className="w-full md:w-[60%] flex flex-col gap-2 z-10 my-10 order-2 md:order-1">
            <div className="font-medium text-xl">Heading Title</div>
            <div className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur. Id amet mauris lectus
              ullamcorper dapibus eget vulputate faucibus. Amet quis quis amet
              lorem metus tincidunt quam. Id feugiat diam sit nibh cursus
              suscipit cras faucibus. Amet dolor egestas condimentum id.
            </div>
          </div>

          <div className="h-auto z-10 flex justify-center mt-4 md:mt-[-4%] absolute md:static order-1 md:order-2">
            <Image
              src="/rankrewards/rewards.png"
              alt="image"
              width={300}
              height={300}
              className="h-auto w-[60%] md:w-auto"
            />
          </div>
        </div> */}

        <div className="w-full">
          <RewardsTypes />
        </div>
      </div>
    </div>
  )
}
