import React from "react"

export default function StakingBox() {
  return (
    <div className="flex flex-col gap-4 py-[20px]">
      <div>Your Stake & Rewards</div>
      <div className="flex flex-col gap-8  overflow-x-auto  rounded-xl">
        <div className="grid grid-cols-7 w-full p-4  gap-x-4  text-sm  min-w-[920px] bg-green-300 bg-opacity-20 ">
          <div>Tx ID </div>
          <div className="text-center">Stake Start Date</div>
          <div className="text-center ">Staked Tokens</div>
          <div className="text-center">Staked Tenure(Days)</div>
          <div className="text-center">APY</div>
          <div className="text-center">Todays Reward</div>
          <div className="text-center">Total Claimed Rewards</div>
        </div>
        {/* <div className="grid grid-cols-7 w-full  gap-4 text-base md:max-h-[50vh] max-h-[80vh] overflow-y-scroll min-w-[920px]">
                {!isLoading ? (
                  stakes.map((item: IStakeDetails, index) => (
                    <>
                      <div>
                        {item.stakeId} -{" "}
                        {!item.isReferred
                          ? item.poolType && item.poolType <= 9
                            ? "VESTED STAKE"
                            : item.poolType <= 12
                            ? "AUTO STAKE"
                            : "COMPOUNDED"
                          : "REFFERAL Reward"}
                      </div>
                      <div className="flex items-center justify-center ">
                        {formattedDate(item.startTime)}
                      </div>
                      <a className="flex items-center justify-center">
                        {item.amount.toFixed(2)}
                      </a>
                      <a className="flex items-center justify-center">
                        {formattedStakeDuration(
                          item.startTime,
                          item.stakeDuration
                        )}
                      </a>
                      <div className="flex items-center justify-center ml-3">
                        {item.apr}
                      </div>
                      <div className="flex items-center justify-center ml-3">
                        {calculateTodaysReward(item.amount, item.apr)}
                      </div>
                      <div className=" flex items-center justify-center flex-col-2 gap-4">
                        <StakeRewardClaimed stakeId={item.stakeId} />
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          href={`${process.env.NEXT_PUBLIC_SCAN_URL}/tx/${item.txHash}`}
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="col-span-8 flex items-center justify-center">
                    <BiLoaderCircle className="h-[50px] w-[50px] animate-spin text-themeOrange" />
                  </div>
                )}
              </div> */}
      </div>
    </div>
  )
}
