"use client"
import {
  AddressString,
  fit24ContractAddress,
  fit24TokenAddress,
  getChain,
  getChainEnum,
  getPaymentContractAddress,
  getUsdtTokenAddress,
  vestingChainId,
} from "@/libs/chains"
import { stakingAbi } from "@/libs/stakingAbi"
import { tokenAbi } from "@/libs/tokenAbi"
import {
  blockInvalidChar,
  countDecimals,
  disablePaste,
  formatArray,
  getNumber,
} from "@/libs/utils"
import { getAPR } from "@/services/randomiser"
import {
  createTransaction,
  getMessageHash,
  getSignerSignature,
} from "@/services/transaction"
import { Dialog, Transition } from "@headlessui/react"
import { ChangeEvent, Fragment, useContext, useEffect, useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { IoClose } from "react-icons/io5"
import { TiTick } from "react-icons/ti"
import { parseEther, parseUnits } from "viem"
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useSignMessage,
  useSignTypedData,
} from "wagmi"
import {
  createStake,
  createStakingTransaction,
  getMyUpline,
  getPaymentSuccess,
  verifyStakingRecord,
} from "@/services/stakingService"
import { useReloadContext } from "@/context/Reload"
import Image from "next/image"
import { StatusDialog } from "../shared/StatusDialog"
import { paymentAbi } from "@/libs/paymentAbi"
import { useWallet } from "@/hooks/useWallet"
import { createWalletClient, custom } from "viem"
import { bscTestnet } from "viem/chains"
import Viem from "viem"
import { solidityPackedKeccak256 } from "ethers"
import { signMessage } from "@wagmi/core"
import { v4 } from "uuid"
import { config } from "@/libs/wagmi"
import TransferDialog from "../shared/TransferDialog"
import { paymentReceived } from "@/services/webhook"
// import { useSignMessage } from "wagmi"
// import { ethers } from 'ethers';

// import StatusDialog from "../shared/StatusDialog"

export default function Staking({ refetchTX, setRefetchTX, getTokens }: any) {
  const { setReload } = useReloadContext()
  const { isLoggedIn } = useWallet()
  const { chain, address, isConnected } = useAccount()
  const { error, switchChain, chains } = useSwitchChain()
  const [select, setSelect] = useState("")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<number | undefined>(undefined)
  const [usdAmount, setUsdAmount] = useState<number | undefined>(undefined)
  const [dialog, setDialog] = useState(false)
  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [stakeHash, setStakeHash] = useState<AddressString | undefined>(
    undefined
  )
  const [approvalHash, setApprovalHash] = useState<AddressString | undefined>(
    undefined
  )
  const [paymentHash, setPaymentHash] = useState<AddressString | undefined>(
    undefined
  )
  const [depositOpen, setDepositOpen] = useState(false)
  const [dialogInfo, setDialogInfo] = useState<{
    type: "SUCCESS" | "FAIL"
    message: string
    title: string
  }>({ type: "SUCCESS", message: "", title: "" })
  const { writeContractAsync } = useWriteContract()
  // console.log(getPaymentContractAddress(getChain(chain).id),"address")
  const {
    data: readResponse,
    isLoading: readLoading,
    refetch,
  } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: tokenAbi,
        address: getUsdtTokenAddress(getChain(chain).id),
        functionName: "balanceOf",
        chainId: getChain(chain).id,
        args: formatArray([address]),
      },
      {
        abi: tokenAbi,
        address: getUsdtTokenAddress(getChain(chain).id),
        functionName: "allowance",
        chainId: getChain(chain).id,
        args: formatArray([
          address,
          getPaymentContractAddress(getChain(chain).id),
        ]),
      },
    ],
  })

  const { data: approvalData, error: approvalError } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
      chainId: getChain(chain).id,
    })

  const { data: readBalance, isLoading: balanceReading } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: tokenAbi,
        address: fit24TokenAddress,
        functionName: "balanceOf",
        chainId: getChain(chain).id,
        args: formatArray([address]),
      },
    ],
  })

  const { data: stakeReceipt, error: stakeError } =
    useWaitForTransactionReceipt({
      hash: stakeHash,
      chainId: getChain(chain).id,
    })

  const isValid = () => {
    if (!usdAmount) return false
    console.log(readResponse)
    if (!readResponse) return false
    if (readResponse[0].error) return false
    if (
      getNumber(
        readResponse[0].result! as bigint,
        getChain(chain).id === 1 ? 6 : 18
      ) < usdAmount
    ) {
      setDialogInfo({
        type: "FAIL",
        message: `Not Enough USD balance`,
        title: "FAIL",
      })
      setDialog(true)
      return false
    }
    return true
  }

  const isAllowance = () => {
    if (!usdAmount) return false
    if (!readResponse) return false
    if (readResponse[1].error) return false
    if (
      getNumber(
        readResponse[0].result! as bigint,
        getChain(chain).id === 1 ? 6 : 18
      ) < usdAmount
    ) {
      // setDialogInfo({
      //   type: "FAIL",
      //   message: `Not Enough FIT24 balance`,
      //   title: "FAIL",
      // })
      // setDialog(true)
      return false
    }

    return true
  }

  const approveAllowance = async () => {
    setLoading(true)
    try {
      const tx = await writeContractAsync({
        abi: tokenAbi,
        address: getUsdtTokenAddress(getChain(chain).id),
        functionName: "approve",
        chainId: getChain(chain).id,
        args: [
          getPaymentContractAddress(getChain(chain).id),
          parseEther("100000000"),
        ],
      })
      const res = await getPaymentSuccess(tx, getChainEnum(getChain(chain).id))
      if (res.success === true) {
        window.location.reload()
      } else {
        setLoading(false)
        setDialogInfo({
          type: "FAIL",
          message: "Something went wrong",
          title: "Error Approving Token",
        })
        setDialog(true)
      }
      setApprovalHash(tx)
      return
    } catch (error) {
      setLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error Approving Token",
      })
      setDialog(true)
    }
  }

  const handleFirstInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    console.log("fit24", value)

    if (select === "A" && value < 2500) {
      setFormError("Minimum stake amount is 2,500")
    } else if (select === "B" && value < 5000) {
      setFormError("Minimum stake amount is 5,000")
    } else if (select === "C" && value < 10000) {
      setFormError("Minimum stake amount is 10,000")
    } else {
      setFormError(undefined)
    }

    if (countDecimals(value) > 4) return
    if (value > 1000000) return

    setAmount(value ? value : undefined)
    setUsdAmount(value * 0.04)
  }

  const handleSecondInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    console.log("usdt", value)
    if (value > 1000000) return
    setUsdAmount(value ? value : undefined)

    const calculatedFirstInputValue = value / 0.04

    // Now update the first input value
    if (select === "A" && calculatedFirstInputValue < 2500) {
      setFormError("Minimum stake amount is 2,500")
    } else if (select === "B" && calculatedFirstInputValue < 5000) {
      setFormError("Minimum stake amount is 5,000")
    } else if (select === "C" && calculatedFirstInputValue < 10000) {
      setFormError("Minimum stake amount is 10,000")
    } else {
      setFormError(undefined)
    }
    setAmount(calculatedFirstInputValue)
  }

  const poolToContractPoolConverter = (pool: string) => {
    if (pool === "A") {
      return 10
    } else if (pool === "B") {
      return 11
    } else if (pool === "C") {
      return 12
    }
  }

  const { data: txReceipt, error: txError } = useWaitForTransactionReceipt({
    hash: paymentHash,
    chainId: getChain(chain).id,
  })

  const [upline, setUpline] = useState<string | undefined>()

  const buyToken = async () => {
    // if (chain?.id !== vestingChainId)
    //   return switchChain({
    //     chainId: vestingChainId,
    //   })
    if (chain?.id === vestingChainId)
      return switchChain({
        chainId: 56,
      })
    if (!isValid()) return
    if (!isAllowance()) {
      return approveAllowance()
    }
    let amount
    if (chain?.id === 1) amount = parseUnits(usdAmount!.toString(), 6)
    else amount = parseUnits(usdAmount!.toString(), 18)
    try {
      setLoading(true)
      const { apr } = await getAPR(select)
      const tx = await writeContractAsync({
        abi: paymentAbi,
        //@ts-ignore
        address: getPaymentContractAddress(getChain(chain).id),
        functionName: "payWithReferral",
        chainId: getChain(chain).id,
        args: [
          amount,
          getUsdtTokenAddress(getChain(chain).id),
          upline,
          apr * 10,
          poolToContractPoolConverter(select),
        ],
        value: BigInt(0),
      })
      console.log(tx)
      setPaymentHash(tx)
      await createStakingTransaction(tx, getChainEnum(getChain(chain).id))
      console.log("success create")
      const res = await getPaymentSuccess(tx, getChainEnum(getChain(chain).id))
      console.log("success payment")
      if (res.success === true) {
        setDepositOpen(true)
        await paymentReceived(
          {
            amount: amount.toString(),
            token: getUsdtTokenAddress(getChain(chain).id),
            user: address!,
            transaction_hash: tx!,
          },
          getChainEnum(getChain(chain).id)
        )
      } else {
        setLoading(false)
        setDialogInfo({
          type: "FAIL",
          message: "Something went wrong",
          title: "Error Buying Token",
        })
        setDialog(true)
      }
      // paymentReceived(
      //   {
      //     amount: parseEther(String(usdAmount!)).toString(),
      //     token: getUsdtTokenAddress(getChain(chain).id),
      //     user: address!,
      //     transaction_hash: paymentHash,
      //   },
      //   getChainEnum(getChain(chain).id)
      // )
      // setDepositOpen(true)
      setLoading(false)
      setPaymentHash(tx)
      // setAmount(0)
      // setUsdAmount(0)
      // setLoading(false)
    } catch (error) {
      setLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error Buying Token",
      })
      setDialog(true)
      console.log(error)
    }
  }

  // useEffect(() => {
  //   // if (!usdAmount) return
  //   if (!paymentHash) return
  //   if (txError) {
  //     setLoading(false)
  //     setDialogInfo({
  //       type: "FAIL",
  //       message: "Something went wrong",
  //       title: "Error Buying Token",
  //     })
  //     setDialog(true)
  //     return
  //   }
  //   if (!txReceipt) return
  //   paymentReceived(
  //     {
  //       amount: parseEther(String(usdAmount!)).toString(),
  //       token: getUsdtTokenAddress(getChain(chain).id),
  //       user: address!,
  //       transaction_hash: paymentHash,
  //     },
  //     getChainEnum(getChain(chain).id)
  //   )
  //   setLoading(false)
  //   setDepositOpen(true)
  //   // callWebhook()
  // }, [txReceipt, txError])

  const getupline = async () => {
    try {
      const res = await getMyUpline()
      console.log("upline", res)
      if (typeof res === "string") setUpline(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getupline()
  }, [address, isLoggedIn])

  // useEffect(() => {
  //   if (!approvalHash) return
  //   if (!readResponse) return
  //   if (approvalError) {
  //     setLoading(false)
  //     setDialogInfo({
  //       type: "FAIL",
  //       message: "Something went wrong",
  //       title: "Error Approving Token",
  //     })
  //     setDialog(true)
  //     return
  //   }
  //   if (!approvalData) return
  //   if (getNumber(readResponse[1].result! as bigint, 18) === 0) {
  //     refetch()
  //     return
  //   }
  //   setTimeout(() => {
  //     buyToken()
  //   }, 800)
  // }, [approvalHash, approvalData, approvalError, refetch, readResponse])

  useEffect(() => {
    if (select === "A" && Number(amount) < 2500) {
      setFormError("minimum stake amount is 2,500")
    } else if (select === "B" && Number(amount) < 5000) {
      setFormError("minimum stake amount is 5,000")
    } else if (select === "C" && Number(amount) < 10000) {
      setFormError("minimum stake amount is 10,000")
    } else {
      setFormError(undefined)
    }
  }, [select])

  return (
    <>
      <StatusDialog
        open={dialog}
        setOpen={setDialog}
        type={dialogInfo.type}
        message={dialogInfo.message}
        title={dialogInfo.title}
      />
      <TransferDialog
        open={depositOpen}
        setOpen={setDepositOpen}
        hash={paymentHash}
      />
      <div className="flex flex-col gap-4 flex-1">
        {/* <div className="text-lg">Staking</div> */}
        <div className="flex flex-col gap-4  items-center rounded-xl">
          <div>Select Staking Pool Contract</div>
          <div className="flex items-center md:gap-8 sm:gap-4 gap-2">
            <button
              onClick={() => setSelect("A")}
              className={`${
                select === "A"
                  ? "bg-blue-700"
                  : "bg-gradient-to-r from-themeGreen to-themeLightBlue"
              }  text-white p-0.5 rounded-xl relative transform hover:scale-105 transition-transform duration-300 md:w-64 sm:w-40 w-[120px] `}
            >
              <div
                className={`${
                  select === "A" ? "bg-blue-700" : "bg-[#04042e] inner-shadow"
                } md:p-6 p-2  rounded-xl`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`${
                      select === "A" ? "text-white" : "text-gray-400"
                    } md:text-base sm:text-sm text-xs`}
                  >
                    Pool A
                  </span>
                  <div
                    className={`${
                      select === "A" ? "border-white" : "border-green-400"
                    } w-4 h-4 bg-transparent border-2  rounded-full overflow-hidden p-0.5`}
                  >
                    {select === "A" && (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <h2 className="md:text-xl sm:text-base text-sm font-semibold flex">
                  Silver Plan
                </h2>
                <p
                  className={`${
                    select === "A" ? "text-white" : "text-gray-400"
                  } text-start w-full sm:text-base text-sm`}
                >
                  1 Year
                </p>
                <div className="flex flex-col items-center text-white">
                  <p
                    className={` ${
                      select === "A" ? "text-white" : "text-gray-400"
                    } sm:text-sm text-xxs sm:mt-4 mt-2 `}
                  >
                    Min. Quantity
                  </p>
                  <div className="md:text-5xl sm:text-2xl text-xl font-semibold flex items-center gap-1">
                    <span
                      className={`${
                        select === "A" ? "text-white" : ""
                      } text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                    >
                      100
                    </span>
                    <span className="sm:text-sm text-xxs">USDT</span>
                  </div>
                  <div className="sm:text-sm text-xxs flex items-center gap-1">
                    worth of
                    <span className="w-10">
                      <Image
                        src={"/fitLogo.svg"}
                        width={3000}
                        height={3000}
                        alt="logo"
                        className="h-full w-full"
                      />
                    </span>
                  </div>
                </div>
                <p
                  className={`sm:mt-6 mt-3 sm:text-sm text-xs text-gray-500 ${
                    select === "A" ? "text-white" : ""
                  }`}
                >
                  APY
                </p>
                <h4
                  className={`${
                    select === "A" ? "text-white" : ""
                  } md:text-3xl sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                >
                  72-96%
                </h4>
              </div>
            </button>
            <button
              onClick={() => setSelect("B")}
              className={`${
                select === "B"
                  ? "bg-yellow-500"
                  : "bg-gradient-to-r from-themeGreen to-themeLightBlue"
              }  text-white p-0.5 rounded-xl relative transform hover:scale-105 transition-transform duration-300  md:w-64 sm:w-40 w-[120px]`}
            >
              <div
                className={`${
                  select === "B" ? "bg-yellow-500" : "bg-[#04042e] inner-shadow"
                } md:p-6 p-2  rounded-xl`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`${
                      select === "B" ? "text-blue-900" : "text-gray-400"
                    } md:text-base sm:text-sm text-xs`}
                  >
                    Pool B
                  </span>
                  <div
                    className={`${
                      select === "B" ? "border-white" : "border-green-400"
                    } w-4 h-4 bg-transparent border-2  rounded-full overflow-hidden p-0.5`}
                  >
                    {select === "B" && (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <h2
                  className={`${
                    select === "B" ? "text-blue-900" : ""
                  } md:text-xl sm:text-base text-sm font-semibold flex`}
                >
                  Gold Plan
                </h2>
                <p
                  className={`${
                    select === "B" ? "text-blue-900" : "text-gray-400"
                  } text-start w-full sm:text-base text-sm`}
                >
                  2 Year
                </p>
                <div className="flex flex-col items-center text-white">
                  <p
                    className={` ${
                      select === "B" ? "text-blue-900" : "text-gray-400"
                    } sm:text-sm text-xxs sm:mt-4 mt-2 `}
                  >
                    Min. Quantity
                  </p>
                  <div className="md:text-5xl sm:text-2xl text-xl  font-semibold flex items-center gap-1">
                    <span
                      className={`${
                        select === "B" ? "text-blue-900" : ""
                      } text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                    >
                      200
                    </span>
                    <span className="sm:text-sm text-xxs">USDT</span>
                  </div>
                  <div
                    className={`${
                      select === "B" ? "text-blue-900" : ""
                    } sm:text-sm text-xxs flex items-center gap-1`}
                  >
                    worth of
                    <span className="w-10">
                      <Image
                        src={"/fitLogo.svg"}
                        width={3000}
                        height={3000}
                        alt="logo"
                        className="h-full w-full"
                      />
                    </span>
                  </div>
                </div>
                <p
                  className={`sm:mt-6 mt-3 sm:text-sm text-xs text-gray-500 ${
                    select === "B" ? "text-blue-900" : ""
                  }`}
                >
                  APY
                </p>
                <h4
                  className={`${
                    select === "B" ? "text-blue-900" : ""
                  } md:text-3xl sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                >
                  84-108%
                </h4>
              </div>
            </button>
            <button
              onClick={() => setSelect("C")}
              className={`${
                select === "C"
                  ? "bg-themeGreen"
                  : "bg-gradient-to-r from-themeGreen to-themeLightBlue"
              }  text-white p-0.5 rounded-xl relative transform hover:scale-105 transition-transform duration-300  md:w-64 sm:w-40 w-[120px]`}
            >
              <div
                className={`${
                  select === "C" ? "bg-themeGreen" : "bg-[#04042e] inner-shadow"
                } md:p-6 p-2  rounded-xl`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`${
                      select === "C" ? "text-white" : "text-gray-400"
                    } md:text-base sm:text-sm text-xs`}
                  >
                    Pool C
                  </span>
                  <div
                    className={`${
                      select === "C" ? "border-white" : "border-green-400"
                    } w-4 h-4 bg-transparent border-2  rounded-full overflow-hidden p-0.5`}
                  >
                    {select === "C" && (
                      <div className="w-full h-full bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <h2 className="md:text-xl sm:text-base text-sm font-semibold flex">
                  Platinum Plan
                </h2>
                <p
                  className={`${
                    select === "C" ? "text-white" : "text-gray-400"
                  } text-start w-full sm:text-base text-sm`}
                >
                  3 Year
                </p>
                <div className="flex flex-col items-center text-white">
                  <p
                    className={` ${
                      select === "C" ? "text-white" : "text-gray-400"
                    } sm:text-sm text-xxs sm:mt-4 mt-2 `}
                  >
                    Min. Quantity
                  </p>
                  <div className="md:text-5xl sm:text-2xl text-xl  font-semibold flex items-center gap-1">
                    <span
                      className={`${
                        select === "C" ? "text-white" : ""
                      } text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                    >
                      400
                    </span>
                    <span className="sm:text-sm text-xxs">USDT</span>
                  </div>
                  <div className="sm:text-sm text-xxs flex items-center gap-1">
                    worth of
                    <span className="w-10">
                      <Image
                        src={"/fitLogo.svg"}
                        width={3000}
                        height={3000}
                        alt="logo"
                        className="h-full w-full"
                      />
                    </span>
                  </div>
                </div>
                <p
                  className={`sm:mt-6 mt-3 sm:text-sm text-xs text-gray-500 ${
                    select === "C" ? "text-white" : ""
                  }`}
                >
                  APY
                </p>
                <h4
                  className={`${
                    select === "C" ? "text-white" : ""
                  } md:text-3xl sm:text-xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-themeGreen to-themeLightBlue`}
                >
                  96-120%
                </h4>
              </div>
            </button>
          </div>

          <div className="flex flex-col items-center mt-4 gap-4">
            <div>Stake Amount</div>
            <div className="flex sm:gap-4 gap-2 items-center">
              <div className="font-semibold w-12 sm:text-base text-sm">
                USDT
              </div>

              <input
                name="usdt"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={!select}
                value={amount ? usdAmount ?? "" : ""}
                // value={
                //   !amount
                //     ? "" // Use an empty string when there is no value
                //     : (amount * 0.04).toFixed(4)
                // }
                type="number"
                placeholder="0"
                max={1000000}
                onChange={handleSecondInputChange}
              />

              <input
                name="fit24"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={!select}
                value={usdAmount ? amount ?? "" : ""} // Ensure empty string if amount is undefined
                type="number"
                placeholder={
                  select === "A" ? "2500" : select === "B" ? "5000" : "10000"
                }
                onKeyDown={blockInvalidChar}
                onPaste={disablePaste}
                max={1000000}
                onChange={handleFirstInputChange}
              />

              <div className="w-14 sm:w-20">
                <Image
                  src={"/fitLogo.svg"}
                  alt="Ethereum"
                  width={3000}
                  height={3000}
                  className="w-full h-full"
                />
              </div>
            </div>

            {select && (
              <div className="text-gray-300">
                {select === "A"
                  ? "* Minimum quantity to stake: $100"
                  : select === "B"
                  ? "* Minimum quantity to stake: $200"
                  : "* Minimum quantity to stake: $400"}
              </div>
            )}

            <button
              onClick={buyToken}
              disabled={!!formError}
              className={`w-[200px] mt-5 mx-auto bg-themeGreen text-white h-10 rounded-lg flex justify-center items-center ${
                formError ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <CgSpinner className="text-2xl animate-spin text-white" />
              ) : (
                "Buy & Stake"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
