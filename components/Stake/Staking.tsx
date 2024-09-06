"use client"
import {
  AddressString,
  fit24ContractAddress,
  fit24TokenAddress,
  getChain,
  getChainEnum,
  getPaymentContractAddress,
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
import { createTransaction } from "@/services/transaction"
import { Dialog, Transition } from "@headlessui/react"
import { ChangeEvent, Fragment, useContext, useEffect, useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { IoClose } from "react-icons/io5"
import { TiTick } from "react-icons/ti"
import { parseEther } from "viem"
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi"
import { createStake, verifyStakingRecord } from "@/services/stakingService"
import { useReloadContext } from "@/context/Reload"
import Image from "next/image"
import { StatusDialog } from "../shared/StatusDialog"
// import StatusDialog from "../shared/StatusDialog"

export default function Staking({ refetchTX, setRefetchTX, getTokens }: any) {
  const { setReload } = useReloadContext()
  const { chain, address, isConnected } = useAccount()
  const { error, switchChain, chains } = useSwitchChain()
  const [select, setSelect] = useState("")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<number | undefined>(undefined)
  const [dialog, setDialog] = useState(false)
  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [stakeHash, setStakeHash] = useState<AddressString | undefined>(
    undefined
  )
  const [approvalHash, setApprovalHash] = useState<AddressString | undefined>(
    undefined
  )
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
        address: fit24TokenAddress,
        functionName: "balanceOf",
        chainId: vestingChainId,
        args: formatArray([address]),
      },
      {
        abi: tokenAbi,
        address: fit24TokenAddress,
        functionName: "allowance",
        chainId: vestingChainId,
        args: formatArray([address, fit24ContractAddress]),
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
        chainId: vestingChainId,
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
    if (!amount) return false
    if (!readResponse) return false
    if (readResponse[0].error) return false
    console.log(readResponse[0].result! as bigint, 18)
    if (getNumber(readResponse[0].result! as bigint, 18) < amount) return false
    console.log("amount", amount)
    return true
  }

  const isAllowance = () => {
    if (!amount) return false
    if (!readResponse) return false
    if (readResponse[1].error) return false
    if (getNumber(readResponse[1].result! as bigint, 18) < amount) return false

    return true
  }

  const approveAllowance = async () => {
    setLoading(true)
    try {
      const tx = await writeContractAsync({
        abi: tokenAbi,
        address: fit24TokenAddress,
        functionName: "approve",
        chainId: vestingChainId,
        args: [fit24ContractAddress, parseEther("100000000")],
      })
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (select === "A" && Number(e.target.value) < 2500) {
      setFormError("minimum stake amount is 2,500")
    } else if (select === "B" && Number(e.target.value) < 5000) {
      setFormError("minimum stake amount is 5,000")
    } else if (select === "C" && Number(e.target.value) < 10000) {
      setFormError("minimum stake amount is 10,000")
    } else {
      setFormError(undefined)
    }
    if (countDecimals(Number(e.target.value)) > 4) return
    if (Number(e.target.value) > 1000000) return

    setAmount(e.target.value ? Number(e.target.value) : undefined)
  }

  const handleFirstInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

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
  }

  const handleSecondInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    if (value > 1000000) return

    const calculatedFirstInputValue =
      value / Number(process.env.NEXT_PUBLIC_TOKEN_PRICE)

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

  const handleContinue = async () => {
    if (chain?.id !== vestingChainId)
      return switchChain({
        chainId: vestingChainId,
      })
    console.log("approve")
    console.log(isValid(), isAllowance())
    if (!isValid()) return
    if (!isAllowance()) {
      return approveAllowance()
    }
    console.log("approve12")
    try {
      setLoading(true)
      const { apr } = await getAPR(select)
      console.log(
        parseEther(String(amount)),
        poolToContractPoolConverter(select),
        apr * 10,
        address,
        getChain(chain).id,
        "consolell"
      )
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "StakeTokens",
        chainId: getChain(chain).id,
        args: [
          parseEther(String(amount)),
          poolToContractPoolConverter(select),
          apr * 10,
          address,
        ],
      })
      await createTransaction(tx, getChainEnum(getChain(chain).id))
      await createStake(tx, poolToContractPoolConverter(select))
      setStakeHash(tx)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error Buying Token",
      })
      setDialog(true)
    }
  }

  useEffect(() => {
    if (!stakeHash) return
    console.log(stakeReceipt)
    console.log(stakeError)

    if (stakeError) {
      // setLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error Buying Token",
      })
      setDialog(true)
      return
    }
    if (!stakeReceipt) return

    setDialogInfo({
      type: "SUCCESS",
      message: `Token staked successfully`,
      title: "Success",
    })
    setDialog(true)
    setLoading(false)
    setSelect("")
    setAmount(0)
    setRefetchTX(true)
    getTokens()
    verifyStakingRecord(stakeHash)
    // setLoading(false)
    setTimeout(() => {
      setReload((prev) => !prev)
      console.log("hshshshshshhshshshs")
    }, 2000)
  }, [stakeReceipt, stakeError])

  useEffect(() => {
    if (!approvalHash) return
    if (!readResponse) return
    if (approvalError) {
      setLoading(false)
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error Approving Token",
      })
      setDialog(true)
      return
    }
    if (!approvalData) return
    if (getNumber(readResponse[1].result! as bigint, 18) === 0) {
      refetch()
      return
    }
    setTimeout(() => {
      handleContinue()
    }, 800)
  }, [approvalHash, approvalData, approvalError, refetch, readResponse])

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
      <div className="flex flex-col gap-4 flex-1">
        {/* <div className="text-lg">Staking</div> */}
        <div className="flex flex-col gap-4  items-center rounded-xl">
          <div>Select Staking Pool Contract</div>
          <div className="flex items-center md:gap-8 sm:gap-4 gap-2">
            <button
              onClick={() => setSelect("A")}
              className={`flex flex-col  ${
                select === "A"
                  ? "bg-blue-600 bg-opacity-30"
                  : "bg-white bg-opacity-10"
              }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
            >
              <div className="md:text-base text-sm">Pool A</div>
              <div
                className={`md:text-lg text-base text-gray-400 ${
                  select === "A" ? "text-green-400" : "text-gray-400"
                }`}
              >
                Moderate Yields
              </div>
              <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "A" && "text-green-400"}`}>
                      A
                    </span>
                    PY
                  </div>
                  <div className="text-gray-400">72-96%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "A" && "text-green-400"}`}>
                      P
                    </span>
                    eriod
                  </div>
                  <div className="text-gray-400">12 Months</div>
                </div>
                <div className="flex justify-between gap-3 md:gap-0 items-center">
                  <div className="whitespace-nowrap">
                    <span className={`${select === "A" && "text-green-400"}`}>
                      Min
                    </span>
                    . Quantity
                  </div>
                  <div className="text-gray-400">2,500</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setSelect("B")}
              className={`flex flex-col  ${
                select === "B"
                  ? "bg-blue-600 bg-opacity-30"
                  : "bg-white bg-opacity-10"
              }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
            >
              <div className="md:text-base text-sm">Pool B</div>
              <div
                className={`md:text-lg text-base text-gray-400 ${
                  select === "B" ? "text-green-400" : "text-gray-400"
                }`}
              >
                Huge Yields
              </div>
              <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "B" && "text-green-400"}`}>
                      A
                    </span>
                    PY
                  </div>
                  <div className="text-gray-400">84-108%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "B" && "text-green-400"}`}>
                      P
                    </span>
                    eriod
                  </div>
                  <div className="text-gray-400">24 Months</div>
                </div>
                <div className="flex justify-between gap-3 md:gap-0 items-center">
                  <div className="whitespace-nowrap">
                    <span className={`${select === "B" && "text-green-400"}`}>
                      Min
                    </span>
                    . Quantity
                  </div>
                  <div className="text-gray-400">5,000</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setSelect("C")}
              className={`flex flex-col ${
                select === "C"
                  ? "bg-blue-600 bg-opacity-30"
                  : "bg-white bg-opacity-10"
              }  items-center rounded-md sm:p-6 3xs:p-3 p-2`}
            >
              <div className="md:text-base text-sm">Pool C</div>
              <div
                className={`md:text-lg text-base text-gray-400 ${
                  select === "C" ? "text-green-400" : "text-gray-400"
                }`}
              >
                Exceptional Yields
              </div>
              <div className="flex flex-col md:gap-4 gap-2 mt-5 md:text-sm text-xxs md:w-44">
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "C" && "text-green-400"}`}>
                      A
                    </span>
                    PY
                  </div>
                  <div className="text-gray-400">96-120%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`${select === "C" && "text-green-400"}`}>
                      P
                    </span>
                    eriod
                  </div>
                  <div className="text-gray-400">36 Months</div>
                </div>
                <div className="flex justify-between gap-2 md:gap-0 items-center">
                  <div className="whitespace-nowrap">
                    <span className={`${select === "C" && "text-green-400"}`}>
                      Min
                    </span>
                    . Quantity
                  </div>
                  <div className="text-gray-400">10,000</div>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-col items-center mt-4 gap-4">
            <div>Stake Amount</div>
            <div className="flex sm:gap-4 gap-2 items-center">
              <div className="w-14 sm:w-20">
                <Image
                  src={"/fitLogo.svg"}
                  alt="Ethereum"
                  width={3000}
                  height={3000}
                  className="w-full h-full"
                />
              </div>
              <input
                name="fit24"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={!select}
                value={amount}
                type="number"
                placeholder={
                  select === "A" ? "2500" : select === "B" ? "5000" : "10000"
                }
                onKeyDown={blockInvalidChar}
                onPaste={disablePaste}
                max={1000000}
                onChange={handleFirstInputChange}
              />
              <input
                name="usdt"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={!select}
                value={
                  amount
                    ? amount * Number(process.env.NEXT_PUBLIC_TOKEN_PRICE)
                    : 0
                }
                type="number"
                placeholder="0"
                max={1000000}
                onChange={handleSecondInputChange}
              />
              {/* <input
                name="fit24"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={select ? false : true}
                value={amount}
                type="number"
                placeholder={
                  select === "A" ? "2500" : select === "B" ? "5000" : "10000"
                }
                onKeyDown={blockInvalidChar}
                onPaste={disablePaste}
                max={1000000}
                onChange={handleChange}
              />
              <input
                name="usdt"
                className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-15 outline-themeGreen border-none focus:border-none rounded-sm text-sm sm:text-base"
                disabled={false}
                value={
                  amount
                    ? amount * Number(process.env.NEXT_PUBLIC_TOKEN_PRICE)
                    : 0
                }
                type="number"
                max={1000000}
              /> */}
              {/* <div className="3xs:w-[100px] w-[80px] sm:px-4 px-2 3xs:h-10 h-8 flex items-center justify-center bg-white bg-opacity-5  rounded-sm text-sm sm:text-base">
                {amount ? (
                  <span>
                    {amount * Number(process.env.NEXT_PUBLIC_TOKEN_PRICE)}
                  </span>
                ) : (
                  "0"
                )}
              </div> */}
              <div className="font-semibold w-16 sm:text-base text-sm">
                USDT
              </div>
            </div>
            <button
              onClick={handleContinue}
              disabled={formError ? true : false}
              className={`w-[200px] mt-5 mx-auto bg-themeGreen text-white h-10 rounded-lg flex justify-center items-center ${
                formError && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <CgSpinner className="text-2xl animate-spin text-white" />
              ) : (
                "Stake"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
