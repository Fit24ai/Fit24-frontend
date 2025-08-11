"use client"
import React, { useEffect, useState } from "react"
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
import { getUserRefIncome, getUserTokens } from "@/services/token"
import { useWallet } from "@/hooks/useWallet"
import {
  useAccount,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { stakingAbi } from "@/libs/stakingAbi"
import {
  AddressString,
  ChainEnum,
  fit24ContractAddress,
  fit24ReferralContractAddress,
  getChain,
  getChainEnum,
  vestingChainId,
} from "@/libs/chains"
import { getNumber, smallAddress } from "@/libs/utils"
import { createTransaction } from "@/services/transaction"
import { CgSpinner } from "react-icons/cg"
import {
  createClaimReward,
  getAllStakesByUser,
  getMyUpline,
  getPaymentSuccess,
  getReferralIncome,
  getTotalMembers,
  getTotalNetworkMembers,
  getTotalNetworkStaked,
  getTotalNetworkWithdrawal,
  getUserLevel,
} from "@/services/stakingService"
import { IoMdPerson } from "react-icons/io"
import { referralAbi } from "@/libs/referralAbi"
import { useReloadContext } from "@/context/Reload"
import { BsSafeFill } from "react-icons/bs"
import { FaHandHoldingUsd } from "react-icons/fa"
import { Address } from "viem"
import { StatusDialog } from "../shared/StatusDialog"
import LineChart from "./LineChart"
import { SyncPopup } from "../shared/syncPopup"
import { FirstDayClaimPopup } from "../shared/FirstDayClaimPopup"
// import { useReloadContext } from "@/context/Reload"

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

export default function ChartBox({ token }: { token: number }) {
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

  const { isLoggedIn } = useWallet()
  const { chain, address, isConnected } = useAccount()

  const [totalNetworkMembers, setTotalNetworkMembers] = useState<number>(0)
  const [totalNetworkStaked, setTotalNetworkStaked] = useState<number>(0)
  const [totalNetworkWithdrawal, setTotalNetworkWithdrawal] =
    useState<number>(0)

  const getTotalNetworkMembersCount = async () => {
    try {
      const res = await getTotalNetworkMembers()
      // console.log(res)
      setTotalNetworkMembers(res.totalStakedMembers)
    } catch (error) {
      console.log(error)
    }
  }
  const getTotalNetworkMembersStaked = async () => {
    try {
      const res = await getTotalNetworkStaked()
      // console.log(res)
      setTotalNetworkStaked(res)
    } catch (error) {
      console.log(error)
    }
  }
  const getTotalNetworkMembersWithdrawal = async () => {
    try {
      const res = await getTotalNetworkWithdrawal()
      // console.log(res)
      setTotalNetworkWithdrawal(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalNetworkMembersStaked()
    getTotalNetworkMembersCount()
    getTotalNetworkMembersWithdrawal()
  }, [address, isLoggedIn])

  const { error, switchChain, chains } = useSwitchChain()
  const [isClaimLoading, setClaimLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const [rewardHash, setRewardHash] = useState<AddressString | undefined>(
    undefined
  )
  const [dialogInfo, setDialogInfo] = useState<{
    type: "SUCCESS" | "FAIL"
    message: string
    title: string
  }>({ type: "SUCCESS", message: "", title: "" })
  const [dialog, setDialog] = useState(false)
  const [claimStakeCondition, setClaimStakeCondition] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<number | undefined>()
  // const { reload, setReload } = useReloadContext();
  // const { data: lastClaimedTimestamp, isLoading: lastClaimedTimestampLoading } =
  //   useReadContracts({
  //     allowFailure: true,
  //     contracts: [
  //       {
  //         abi: stakingAbi,
  //         address: fit24ContractAddress,
  //         functionName: "lastClaimedTimestamp",
  //         chainId: vestingChainId,
  //       },
  //     ],
  //   })

  // const [lastTimestamp, setTimestamp] = useState<number | undefined>()

  // useEffect(() => {
  //   if (!lastClaimedTimestamp) return
  //   setTimestamp(Number(lastClaimedTimestamp[0].result!))
  //   refetchUserDailyRewardClaimed()
  // }, [address, lastClaimedTimestamp, lastClaimedTimestampLoading])

  const claimReward = async () => {
    if (chain?.id !== vestingChainId)
      return switchChain({
        chainId: vestingChainId,
      })
    try {
      setClaimLoading(true)
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "claimAllReward",
        chainId: getChain(chain).id,
      })
      // await createTransaction(tx, getChainEnum(getChain(chain).id))
      const res = await getPaymentSuccess(tx, ChainEnum.BLOCKFIT)
      console.log(res)
      if (res.success === true) {
        await createClaimReward(tx)
        setClaimLoading(false)
        setClaimStakeCondition(true)
        setPendingAmount(0)
        setDialogInfo({
          type: "SUCCESS",
          message: `Reward Claimed Successfully`,
          title: "Success",
        })
        setDialog(true)
      } else {
        setDialogInfo({
          type: "FAIL",
          message: "Something went wrong",
          title: "Error in claiming reward",
        })
        setDialog(true)
        setClaimLoading(false)
      }
      // console.log(tx)
      setRewardHash(tx)
    } catch (error) {
      setDialogInfo({
        type: "FAIL",
        message: "Something went wrong",
        title: "Error in claiming reward",
      })
      setDialog(true)
      setClaimLoading(false)
      console.error(error)
    }
  }

  const {
    data: readPendingAmount,
    isLoading: pendingLoading,
    refetch: refetchPendingAmount,
  } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        abi: stakingAbi,
        address: fit24ContractAddress,
        functionName: "getUserTotalPendingReward",
        chainId: vestingChainId,
        args: [address],
      },
    ],
  })

  // const {
  //   data: userDailyRewardClaimed,
  //   isLoading: userDailyRewardClaimedLoading,
  //   refetch: refetchUserDailyRewardClaimed,
  // } = useReadContracts({
  //   allowFailure: true,
  //   contracts: [
  //     {
  //       abi: stakingAbi,
  //       address: fit24ContractAddress,
  //       functionName: "userDailyRewardClaimed",
  //       chainId: vestingChainId,
  //       // args: [address, (Number(lastTimestamp) + 3600).toString()],
  //       args: [address, (Number(lastTimestamp) + 86400).toString()],
  //     },
  //   ],
  // })

  const getAllUserStakes = async () => {
    try {
      setClaimLoading(true)
      console.log("address", address)
      // console.log("lastClaimedTimestamp", lastClaimedTimestamp)
      // console.log("userDailyRewardClaimed", userDailyRewardClaimed)
      console.log("readPendingAmount", readPendingAmount)
      if (
        !address ||
        // !lastClaimedTimestamp ||
        // !userDailyRewardClaimed ||
        !readPendingAmount
      )
        return
      const res: any = await getAllStakesByUser(address)
      // console.log("userDailyRewardClaimed", userDailyRewardClaimed[0].result)

      console.log("Pending Reward", readPendingAmount[0].result)
      if (getNumber(readPendingAmount[0].result! as bigint, 18) > 0) {
        setPendingAmount(getNumber(readPendingAmount[0].result! as bigint, 18))
        setClaimStakeCondition(false)
      } else {
        setClaimStakeCondition(true)
        setPendingAmount(0)
      }
      // if (res.stakes.length === 0) {
      //   setClaimStakeCondition(true)
      //   setPendingAmount(0)
      //   console.log(true)
      // } else if (res.stakes.length >= 1) {
      //   // if (
      //   //   Math.floor(Date.now() / 1000) -
      //   //     res.stakes[res.stakes.length - 1].startTime >
      //   //     1 * 60 * 60 &&
      //   //   userDailyRewardClaimed[0].result! === false
      //   // ) {
      //   if (
      //     Math.floor(Date.now() / 1000) -
      //       res.stakes[res.stakes.length - 1].startTime >
      //       24 * 60 * 60 &&
      //     userDailyRewardClaimed[0].result! === false
      //   ) {
      //     console.log(false)
      //     setPendingAmount(
      //       getNumber(readPendingAmount[0].result! as bigint, 18)
      //     )
      //     setClaimStakeCondition(false)
      //   } else {
      //     setClaimStakeCondition(true)
      //     console.log(true)
      //     setPendingAmount(0)
      //   }
      // } else if (
      //   Math.floor(Date.now() / 1000) -
      //     res.stakes[res.stakes.length - 1].startTime >
      //     24 * 60 * 60 &&
      //   userDailyRewardClaimed[0].result! === false
      // ) {
      //   // console.log(false)
      //   setPendingAmount(getNumber(readPendingAmount[0].result! as bigint, 18))
      //   setClaimStakeCondition(false)
      // } else {
      //   // console.log(true)
      //   setClaimStakeCondition(true)
      // }

      setClaimLoading(false)
    } catch (error) {
      // console.log(error)
      setClaimLoading(false)
    }
  }

  useEffect(() => {
    if (
      !address ||
      !isLoggedIn ||
      // !lastClaimedTimestamp ||
      // !userDailyRewardClaimed ||
      !readPendingAmount
    )
      return
    getAllUserStakes()
  }, [
    isLoggedIn,
    address,
    // lastClaimedTimestamp,
    // lastClaimedTimestampLoading,
    // userDailyRewardClaimed,
    // userDailyRewardClaimedLoading,
    readPendingAmount,
    pendingLoading,
    // refetchUserDailyRewardClaimed,
  ])

  const { data: rewardReceipt, error: rewardError } =
    useWaitForTransactionReceipt({
      hash: rewardHash,
      chainId: getChain(chain).id,
    })

  // useEffect(() => {
  //   if (!rewardHash) return
  //   if (rewardError) {
  //     setClaimLoading(false)
  //     setDialogInfo({
  //       type: "FAIL",
  //       message: "Something went wrong",
  //       title: "Error in claiming reward",
  //     })
  //     setDialog(true)
  //     return
  //   }
  //   createClaimReward(rewardHash)
  //   setClaimLoading(false)
  //   setClaimStakeCondition(true)
  //   setDialogInfo({
  //     type: "SUCCESS",
  //     message: `Reward Claimed Successfully`,
  //     title: "Success",
  //   })
  //   setDialog(true)
  //   refetchPendingAmount()
  // }, [rewardReceipt, rewardError])

  const [memberLoading, setMemberLoading] = useState(false)
  const [directMemberLoading, setDirectMemberLoading] = useState(false)

  const [totalMembers, setTotalMembers] = useState<any>({
    totalCount: 0,
    totalTeamStakedAmount: 0,
    stakersWithMoreThanZeroTokens: [],
    stakerCount: 0,
  })
  const [directMembers, setDirectMembers] = useState<any>([])
  const getTotalMembersCount = async () => {
    setMemberLoading(true)
    try {
      const res = await getTotalMembers()
      setTotalMembers(res)
      setMemberLoading(false)
    } catch (error) {
      setMemberLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getTotalMembersCount()
  }, [address, isLoggedIn])

  const [totalRefIncome, setTotalRefIncome] = useState(0)

  const totalReferralIncome = async () => {
    try {
      const res = await getReferralIncome(address!)
      console.log("totalRefIncome", res)
      setTotalRefIncome(res.totalReferralIncome)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    totalReferralIncome()
  }, [address, isLoggedIn])

  const getLevel = async () => {
    setDirectMemberLoading(true)
    try {
      const res = await getUserLevel()
      setDirectMembers(res.memberData)
      setDirectMemberLoading(false)
    } catch (error) {
      setDirectMemberLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return
    getLevel()
  }, [address, isLoggedIn])
  const [syncOpen, setSyncOpen] = useState(false)
  const [firstDayOpen, setFirstDayOpen] = useState(false)

  const syncPopup = async () => {
    if (!address) {
      setSyncOpen(true)
      return
    }

    const allowedAddresses = new Set(
      [
        "0x5B7aeD8100C7A8D49816c0009B951aB5c776D1F7",
        "0xEC71742612d06f70389d457a147046234aA2f084",
        "0x9602f8F2Fe127041Be19841527d251f04dDf8331",
        "0x1AD57dB426Dd5D014024B8D5E00b6b6DC1Ff0aD7",
        "0xA984a25Bd80352ee64317c37A5A4C4A852C9d973",
        "0x50f283a485bC3ebd32ea3F59e81D10c75820401a",
        "0xe2621B3877168307AADd39a66756454B61A50CDB",
        "0x601577C524f960Aa80a4Eb854Fc35625f23d2615",
        "0x849F7aaB2D17A2AC4fcC36485C1533BB10B86360",
        "0xc47A060416128eAB47A4E24544E412811D3bD030",
        "0x7e906fa553743D7CA4dBe2f32DAfC85fFf910ee3",
        "0xE742527c5291B5deA2cF99cde607ccA7643D8e21",
        "0xc9871444AFfc5BA3a99063bA8a293806EF08d44d",
        "0xBE285811d96D29C6DAe0f43B3dcb1a03DA868d68",
        "0x568D5A6efA567cafD9d92FF69B14CF1A9c6db4e2",
        "0xb076443380dc414F8ceEB659d1d8f48118055413",
        "0x6c8f74Eb4722F58f29e399b65aeD680c655A9407",
        "0xa6fe7467bEA5a2aE722C69138a9208cBFa7A532d",
        "0x2d3A735aE2D3507C372b1AA556FacDd3Fd2188f4",
        "0xe735Ce4AaCB3933156d77e718e9cc19E37e2ed85",
        "0xEea03C1ADc6b39CDBCF84486b03D603AD1dE11D9",
        "0xC51429EE33afF19F9122b1D0C8C32DE0B6a3eAE9",
        "0xED6bBcadc262cD47Ce596571b6227d1584D07d36",
        "0xB6eC167ec2B20f6f4F1847cCf9B284C46eaBA20c",
        "0x9919C87FC2ebeDe235F75B74Ba3a87026D20f04B",
        "0x49136e58f3A09fFbbA3964D0Fd5aa0CD0948b7e6",
        "0x62D104d363b4A8c315c04a23D18DD6D38bFbA4bB",
        "0x8d5E15e45634f6da0991B93c476d1E6d43681da2",
        "0xA72bCC316693292bCB2B02dbf80Cde994Ada7de1",
        "0xDD816d0Bc07622362e66c68eB6606F9e1678B7Ed",
        "0x0E5Cf973c5B79f66b2781D0be026105859e508aa",
        "0x2325f68215D2CF9bb1a954E2A1FfAAE26eEd45e6",
        "0xd38be413Ee59b724c9Faa01F5fC41E3C30A58f4f",
        "0xd400887e53001c373567CA1cb9e5741e0E721175",
        "0xefA99e3eb45C99F7ef8F89ab444360451cDbfdD3",
        "0x625FB44D8F0E53577B844C0E2a05ceb29678742A",
        "0x26DE5422E1445Bc1DF156B8b8c29B8D1d76CA008",
        "0x83F52Ca0C7a51B1D1bC020674Bca6e02a086F2F8",
        "0x77d9f70c4D96C9909639683Bf34eF438354A3BEe",
        "0xB014FF8940916B302FF43Ea5d40120CBb7f780cb",
        "0xAE0d6B6B0A7a1F233A3DB2d5ce6764D76dd353Cd",
        "0xD1024323957dBDA4Ff35685Cc3BDbf5b52Fd43d0",
        "0xb165AbdE34830bdfeE9945a53AE3cE16095d2699",
        "0x4771d1677f6203BF1b9f288D58b61e132e1d4F01",
        "0xf6B982794eC3392cdFFFF2724715C950410DB020",
        "0xE0aa8005f74537748B00c5dA407dda63a5bF65C5",
        "0x0dE8669f8aD377c1dB0fA9cEeD7e4fc775a25fA4",
        "0xDF8866BAdeDB34CabD13F886eBA7744bB51d0565",
        "0xd7854F031a6fe3393BA436b59A79adE329f60dbC",
        "0x98BB7302E4E943E74Ea06ac1E251eFba2c89eDE1",
        "0xb35cE373Ce8c082a2897dfBb738552A77dDCD41F",
        "0x448fe9cEe3E2749b02150a6F41837c65d3E9fF0e",
        "0x7bbB5fA073F0b41Dfc04E1d9F5844F20abefbDe5",
        "0xC15f529F9043a1F15be85Fa4b01b6C0B09C70a2A",
        "0xe1eC7079c587879b0824cCf44EB90269Bb22e1e8",
        "0xDACc53e8403D0A02cF71632053ab3F1358e41f98",
        "0x036165D57aFF108766713235EB357e76e287Db6d",
        "0xeFA6436628c80287E95D2000FE65Ce60d61994C1",
        "0x0991e149E5aCf087A536feB909d6fd2fE1B48520",
        "0x435E0eB9C90e3BC7C7D8C8fD5069CAB8966fD341",
        "0x3Ee2c893A3ffE3227D1eB391F131447eCBF08913",
        "0xa722e2B7c19b0a150A6E2A6D82aB5638e6122A3F",
        "0x8E24974218eEb276cC135F27F1d01DAa79A377d6",
        "0x87FE024e33C57939133A9ac242362E31eA21C7B3",
        "0x4C1901120aA027cEF92b273c521D7491c276541d",
        "0x59Bc755198373dE8a1d01c2D28ae42D3F8419FDE",
        "0x64C8145a241F6D19d08F7c22452dAeB9F517ef16",
        "0x42a373893CA94d1c08b68540D03282cE58d233ed",
        "0x8B27C93e5Cc4caC8f6eeEd4a5113474C09391118",
        "0xbA07359Ef5e0da19187953f6FEbBCf45f51B6cC7",
        "0xE46837609A58CFfB5Cf6aAADb7c70B77577aBc4C",
        "0x4978612Cd7543a36546187eAa296E596f9a2359a",
        "0xf4C6fE3b100F90BB8C8a808BBa5992d02d93494C",
        "0x4817A9569B8DEC9757843C36abD2dc6BE55542b7",
        "0xf9E52B3Ecd433d39F08B584D6b9Eeb7F53059Ed7",
        "0xe273AB0C6c4750fFF522DF149fBe21592a601E98",
        "0x7D055B3d6C8f45F925f6856f15C571726713bf4F",
        "0x8bE318cc8d0682033B5644214709a3E041707718",
        "0x5959055f0174EdB54a944781732d0305aC5d75D6",
        "0xa0Bdfd21e164d56D304cB699cE77f838F78722bf",
        "0x514BC1B257386545099f1EC1Ce46c1C6F32041C3",
        "0x8a0580Ee8761578452E25C58b5150e014Fac86aB",
        "0x68bB3C41dc292E9a703Dc4cd1F1d132cb2BBEdaA",
        "0xc57E40C33dB5b68e4835FF2656F606e7c37B0ab3",
        "0x52eca6b593388727f139419B20FBFA079Ac846C7",
        "0xAC11E84f31c824A109740ecaBcE50D97F1f95499",
        "0x0b89C07B96802974e8fAE5FBcF84e4529dc01D29",
        "0xA5ebeC63E32E8E14B4f8613B3312dBAD860eE669",
        "0x7672C2DF3e752d3775B32DE3F6bB08459090Aac0",
        "0xc016B2B988C6B9264d4131b60cAa1B4f030618Af",
        "0x77952C486584F85499d0b916a8455c81C807D43F",
        "0x41B4f9E29832389e166a368D114401317c91594A",
        "0x7BC7bcE13eC80e29b008553242Ae0177687af1b9",
        "0x7E9ce7642D023E0797D7948488eD49C22976bDB8",
        "0x9B21b9958609aF5A2a013C661f773398100814EE",
        "0x8EeF5FA3c38Ad6cbbDE5FDFe86D403C877852b5d",
        "0xEBA02929Ad50734E9115997135c737525605BfAb",
        "0xcBfF64f5040583264C709090E5bff7a5F5cAda12",
        "0x3019B26B4947f0E8bf427b0657b294423cE83ecF",
        "0x5552252c9aA66397432795CAFe0a7A46A80337D2",
        "0xA0b48d98f73a69497ED1f2524fb95862aB39C7Fa",
        "0xa4F5284f8e8a5aE22626DCE680e1a2635E6B307C",
        "0xdA2EbbE1cECB0b06467fB73FD6188Cd0279b24Ba",
        "0xE0CA6b6B2F169AF1C201E249487aefDc812d1AC6",
        "0x5dD7382a50D7b82b010dd6e6c5b398B8BD7E6652",
        "0xF4e2509020F740C74a69aCC087057f16FEfB9b3d",
        "0x307B4CeA18fcbdfE99621Cf52381A39Fd46B816E",
        "0xc3f3D3a214BdC87EbAa46FaBDe6274DA7153fC39",
        "0x83119cA96F82Cf30813a793224c91b6c4546D03c",
        "0x7eEF2e821443aFBFC72e6a0eF19852432Bac8bcA",
        "0xbCD9dE47515C5eb3935b08C2bF08fAC738aa76eb",
        "0xc60d3B8BFbDdEC5d7D3c1FCA3dc72A2be1f1842c",
        "0xa8A83FdA85F3875A70159D812664fF94C472aBE3",
        "0x3F9C96eb02715cBA695333ee8BD85146f15D4913",
        "0x4C4d348202fAB04b5f256dE45f5211238971aA7A",
        "0x59553aCf5581A7C1a67927DB535B1F55F4D8A252",
        "0x59D1340f0aCC97bE4D1082aE29D69aFa8940B288",
        "0xe44D8C5d31EE0321B65e99246d6BC1B081BbA18C",
        "0xF079275AD0De6eCaEB522Be35BE6551c988cf2c1",
        "0x1E1c893b3ee3e30BE9DB11337e95bFb1FBF68Ade",
        "0x04EE5fE39d347b02e234cb79299DF44118f3c9eB",
        "0xf18574436ec17FF567FC249697BFc49A2A23DEE2",
        "0xF8D4d398885761fa96c7711b784debC4458CC65d",
        "0x2d3c7b2B36d31382f41bF6D1A07a333A9BB4cC9d",
        "0x7c522c6F63c4A7541a09cf18fD89F5F967b3E873",
        "0x86FB2Fe80e0D3d42Da458704DAa9BA5B4F905F16",
        "0x6e5DF6c8C14d1460c3Db90242818a77CC2309B01",
        "0x77A4d73E855029e5020b5777bB01bAD5144c9828",
        "0xA34b9d29467e0359b60034E54D3b883e8ADCBe1B",
        "0x210B26576Fa418a28b6581011e3F4978094bb97B",
        "0x46d39FCb701eF4a370918fC61deB2efd93B25481",
        "0x21e0b3EBf2a3cefa93B2e763E53eBB7F6CB51073",
        "0x624bEEAA044F6afC92A5249F6b4606245d369cF8",
        "0xC92789D7987503F3dAcFDB0a3aFE3511f23C8336",
        "0x99ED61E680363A5D868E16f816f718720A57f9fa",
        "0xa1d493ddF8544cb5FeA5404217C09851879331ea",
        "0x56bB5E487477caeFf24770Af688a5d513354E185",
        "0x9D2d6a2754558Ac09859CFc4bdeB7A14fBE96D6E",
        "0xe0efe784520d2610353866e3b28c76023c1C32ad",
        "0xfC809211B73FCD3922af0Dc40EeE5D9b60eB5c62",
        "0xCe2629F75330b0bd592e1d4d0748C9a773087799",
        "0x718f514b38Acd238a6049307BCB3d133c48D9dE4",
        "0xc1903cDF90C24CbeC4fA1E13Fddca095a01596B0",
        "0x266ab9014A7B8c3d64acfb73D934147169D60b08",
        "0xcaf64e6D2b97398EFF7C61e2d3ebd59d8113D7D4",
        "0x138c8105c5dbf0927F3c9029DA22D6B506B2D49B",
        "0x93cd392DB4f4DBdB794Cabede57C74D8916ebF26",
        "0x17Cef2419036616558552aC48fdBE8aD2f085513",
        "0xD632aFB40C7545760c787E196d78F94553b20338",
        "0xAA3F024D2535762a52E3E2F4E441F362c7902EF6",
        "0x33bB6f6Cb3A68bc7967a45607bA8F69DcA4eee25",
        "0x50892d51965C4ed05D2d56186d512b4f7728C8d3",
        "0x04a2D41616d7908e8dC7Ba22C2AD8e129c07D10A",
        "0x14FEea7ADA1ae64E35f9cC53D543345c42139fa1",
        "0xA09F276C30F0908043c0977c7d08869e53Bc5D28",
        "0xB1cC24fBed7DDa6d91e430f3db0c4e845F013390",
        "0xb2E88AB562B2924CCf32a2B6Fc4c4792B475ad87",
        "0xcCEDDbDBc36689E370331c011865EBf98677072F",
        "0x881427175EaCcf443f25C97381A13291b4e5B22f",
        "0xd97F6d989d9E2f526FA261B0633a03D9ED3d9Bab",
        "0x52b6061DA1A0042c9eDeBE596D25d9a2bbDa503B",
        "0xC5b8431468bF3F5650cFbb279DEc68aA2bf0Bd5c",
        "0xd8043fb80Af8eC299c51a4608a06958c5b59FFaB",
        "0xd449b9d240B00202F42cC2636E1b0004a37fAD13",
        "0x3f1aCcf4A2b8632037f29B00A002a9b28e845BEF",
        "0x3B03975D567baa790A8c23F53eEb5928a302a92d",
        "0xbD9d4A9235C7EC6EA9641a9dD88a30ae2603222c",
        "0x21eb9f226C90C7fc0F22051F6AC1bFdE52bad50D",
        "0x50900194D44d322975a74dc87477667a792B0467",
        "0x89E46a06A465a6E3631D93E507aF66825566AdA2",
        "0x713A3b5a136e1F32D44EcCF221294bD5e7109e71",
        "0x0B0DfAdE4e3f517D41215C7381Fa50D89a1Da178",
        "0xdE73A3952A6cFa57a7eb881c899fF93206e3a5fc",
        "0x9201c4c0A74ccAa63155afC6Ad33c9650280c75f",
        "0x9506c55958c35a88708CF211A65bf4A9C02f3a57",
        "0x93739dac23bFad81335e68f9317B858219868530",
        "0x180044A00b45A41451C0a7D6D9469518e02DAFDc",
        "0x112FEe828b9e8c64fbF9Ec48264376b984d778eB",
        "0xe59FDc5985417d254A2A152ec021130045aCA514",
        "0x53bC7cEC2EEc02f1CC467a7c2B9B5FC5D659acff",
        "0xf63dc2F2734972089f939F9Bff1106Bb04960854",
        "0x69A582f0ae356f5aBa7c5dEe9d2bA5E6bFB58F52",
        "0x8725A3dbbc7b1bc74947B34922eB1b82F0aAb2C7",
        "0xcba3562774e554366a6919710a5371ED392fE5D9",
        "0x42b0b9C1B355cc08313b791B494776E9091f4628",
        "0x6a26058a14cC35E590E8b04525f90e4722938cB0",
        "0xDFF7Bbb43e1f8F32119aF83424F53460C8cE3C66",
        "0x37c3d01F87B8953a662714a7CBcE06d1527543F0",
        "0x962d0704ef0BDdcaceFBD9e4A9D6f7E819eDC53c",
        "0x7b596A99Ae8dBDc8B49f6aA297E278135c940Caf",
        "0xE8C3311736f29d3995dd4EC2Fd714a93F5379c4f",
        "0x664A6af0C117FCbDA06d5B5459ee3E85E503dD77",
        "0xd6efb09134637F3aa908dF418E3fD7b1C5653c3A",
        "0x180CC6271bB9447f514bD139B4cEe162c1B31dc0",
        "0x613d39fa255F4d5Da28939134a4159bdBd2d0a85",
        "0x5cFa94dc85281E65B018D7A3C34eCbD9EdCb9F16",
        "0x21E5a2215c780Ca6742D4F8fe57fd502B44d0D6d",
        "0x87FFC7eF241aE9ca4218fa44c7c5aFa90A6A558F",
        "0xeF3a597E8BC9A26492ff49aCE8822BCAeAde3Aed",
        "0x1db428E9c0fD04EdC219C6f9211D84C1e5a48b4a",
        "0x47136053F5f36D1abDf40A3A4ac399fa33446236",
        "0x52096F5Cd11b3b108CDc85B1D7ecb4CD7e82F7d1",
        "0x1DfC6a057a5C5822F0dE07B1f09f5585d698c536",
        "0xdD69138cB434dd090C50C866fD6a81494e384bEa",
        "0x17105b1F245f1CCFf256F9A46732b806E1Bb54E2",
        "0x253D73342314090dD3eC8bF0315C2Ab0c7c25c72",
        "0x2e3DDb11f53Bd25bfe852c2D311F3F0A293f821f",
        "0x803D38f9fEe2202DbEc53033CbF64051B5Fd4B05",
        "0xee18f424C219dDc45979F0162e56f2BF30EBa2e8",
        "0xE1D146b9f9773975c30d7bE920E07Dee15f2A3da",
        "0x23dDD22fb5537fE935824716A2205A223aE86DbB",
        "0xAdD0BC3837a077CDC2E8689354bA1366f4dCe582",
        "0x759a936af2A09C632E809611208c57B77ee715Ed",
        "0x33f0b03898e7C46d71D3FA5C138e32e016c806c4",
        "0x26E4900daae230A42Aa6f10E91dD2219abB306BA",
        "0x8E8bd549dF6D6550Bf8edF76e483506342C737C2",
        "0xE90cca7E3085C7233eE8aEf4c3229814862c618A",
        "0x5328Ef613bC925DdeBe99D25c143e759E4721ccD",
        "0xf51C5d12A10DCa9c8fcD57810F3aaC2b9D45e8d5",
        "0x9AE112e9039CdD1733A0253362a3424F920C3971",
        "0x5d2734d4Bf76e3216b5aab449006b3a4bB41044d",
        "0x028D7a0549ea9751c62EA1E0756d2059fd7B2B82",
        "0x0b499e5D26246FACc185C82C009300b11eb13e32",
        "0x23dDD22fb5537fE935824716A2205A223aE86DbB",
        "0xAdD0BC3837a077CDC2E8689354bA1366f4dCe582",
        "0x759a936af2A09C632E809611208c57B77ee715Ed",
        "0x33f0b03898e7C46d71D3FA5C138e32e016c806c4",
        "0x26E4900daae230A42Aa6f10E91dD2219abB306BA",
        "0x8E8bd549dF6D6550Bf8edF76e483506342C737C2",
        "0xE90cca7E3085C7233eE8aEf4c3229814862c618A",
        "0x5328Ef613bC925DdeBe99D25c143e759E4721ccD",
        "0xf51C5d12A10DCa9c8fcD57810F3aaC2b9D45e8d5",
        "0x9AE112e9039CdD1733A0253362a3424F920C3971",
        "0x5d2734d4Bf76e3216b5aab449006b3a4bB41044d",
        "0x028D7a0549ea9751c62EA1E0756d2059fd7B2B82",
        "0x0b499e5D26246FACc185C82C009300b11eb13e32",
        "0x759a936af2A09C632E809611208c57B77ee715Ed",
        "0x33f0b03898e7C46d71D3FA5C138e32e016c806c4",
        "0x26E4900daae230A42Aa6f10E91dD2219abB306BA",
        "0x8E8bd549dF6D6550Bf8edF76e483506342C737C2",
        "0xE90cca7E3085C7233eE8aEf4c3229814862c618A",
        "0x5328Ef613bC925DdeBe99D25c143e759E4721ccD",
        "0xf51C5d12A10DCa9c8fcD57810F3aaC2b9D45e8d5",
        "0xfB0e7adf0C1942960999E44AbFEe2Bf57B0EDcaF",
        "0xA34b9d29467e0359b60034E54D3b883e8ADCBe1B",
        "0x9C7b11AAe96B033d0c253c17dBf9729B0D5eb62B",
        "0x87AC0B39414ED550BDb86a549B61741ff4c3Dd55",
        "0x992B6876d718f4190EF749e9833C49c2793528F2",
        "0x63a34EE5dec93CA0aed2bFB2c6782642020979e7",
        "0xa03265D6403B89543B6E983fc3498968E7537a80",
        "0x64C27F7C70F9ac49410eB646B0e8B12E0372640a",
        "0xbe86BDa12F0f4A796fDD3c80f8E2435411e7Dde1",
        "0xbC257A8A660BDCC617f858F766254bc6e987731b",
        "0xBE061cFd325718CeDCAAd8967Db9B177B23dbd19",
        "0xA743aAC0a0Ab864a0e77aD7B99815B094cA50Ce0",
        "0xC91E327942A63a91eb87729c405a3fC2b34A7cEa",
        "0x653Be4Dfff6EF5Fc87771985e7bc7563889f174E",
        "0xb8DB98493890B4f8a35a9AF7C6A9C683A3F9b5fb",
        "0x295dC8d9Ebde3D49Ba6f10Cc901b05D0E9f4E5ca",
        "0xB199c687A102E332e148c73bD5524b0ef7F42996",
        "0xbbBFDbe95CCF1383A1c0C91e377340326873f77e",
        "0xe4D7EaA7562e94614e803a62873B20194780B6c0",
        "0x1240Ce04811111fBce22C42B6a4A14e7D9363B75",
        "0x4F02a656a623D9E354101981f94624AeBd0bFb08",
        "0x35d0fD47A24c888CcCE561124a1d1784362ddaaF",
        "0x2414FF8a24BCBeC65e0c871024d7cE69407E8A1B",
        "0xd877186A3088026Af163c6617DCAe13F1f824214",
        "0x1b18B797066e27944E22154af7B3EBB69244965b",
        "0xb2DD022175972C1bfBEC55E8941BBd455409EEA9",
        "0x56E1F5B26974b46391CEea0bb8F34D81A3EAC3cA",
        "0x059371a965BA38b9902655d3a7F049f79255904B",
        "0xc2fAa91C4fD8a934D58aC7df4D7C527faD844B24",
        "0x263C1f36c081c1BFb1a9A27036a05F3E1492A297",
        "0xa32A879708A716514C25dD813fB5892e4F226203",
        "0x1858028D2f329A9AfE9586036B3A3094bDdb6552",
        "0x22a1DAd39F97a277862Df1712b623777bD1c68c1",
        "0x624bEEAA044F6afC92A5249F6b4606245d369cF8",
        "0xC92789D7987503F3dAcFDB0a3aFE3511f23C8336",
        "0x99ED61E680363A5D868E16f816f718720A57f9fa",
        "0xa1d493ddF8544cb5FeA5404217C09851879331ea",
        "0x56bB5E487477caeFf24770Af688a5d513354E185",
        "0x9D2d6a2754558Ac09859CFc4bdeB7A14fBE96D6E",
        "0xe0efe784520d2610353866e3b28c76023c1C32ad",
        "0xfC809211B73FCD3922af0Dc40EeE5D9b60eB5c62",
        "0xCe2629F75330b0bd592e1d4d0748C9a773087799",
        "0x718f514b38Acd238a6049307BCB3d133c48D9dE4",
        "0xc1903cDF90C24CbeC4fA1E13Fddca095a01596B0",
        "0x266ab9014A7B8c3d64acfb73D934147169D60b08",
        "0xcaf64e6D2b97398EFF7C61e2d3ebd59d8113D7D4",
        "0xa1F7d2958488C4D19e24D3001d07064b7E9F75AE",
        "0xD2104E1b3a3c2966C0c461e12047C7e55D8665f0",
        "0x35F3c73f994832620Df7C5d2974F89803eC4cE66",
        "0x37ED97173102660Be8E2fa7cBF419D9335C2862f",
        "0x3dD64863c787B60992a9577538D34a5Dc1aE0102",
        "0xd576c3e1Cf97a635DfF73e8c27939ff1c31D2Da3",
        "0x69ca5304ceD2239D8400E67553B1d4250f5815D5",
        "0x52431623CEd18aDB90876B22FD8d1AB5C4d91c94",
        "0xd40c1214e33c3fA2fdCb73B9d6fD43CB1154A308",
        "0xEBe39d8bf196223f2B411fF366d7301E2e77Eb5f",
        "0xC2F29E84304D656f63C39AbeDcEeF2bBDF0d2b02",
        "0xef996320Bb145E9383f00096cA55B03c0c9B133c",
        "0x824b95089789c7C28D998E5D291b1A09CF4cA851",
        "0x08648142A7bA99c975605201a75454415b38492e",
        "0x357F0bF8d7deDEA3D99bCDEfc0527821aE62Fb21",
        "0xE808420EdfC7d7Ebd612DA3a31856b3e7008e495",
        "0xA60cC9c42297d476DabEC0ce3580243D3358415f",
        "0x5FeBAC7d0f2086ef30E40B7874935E751c598c41",
        "0x86bd581280a656c4a11237E48996a148Ca72D0B4",
        "0x36Fdd4C270F6F3a9B21BB47cb86c2c8b17bdf9af",
        "0x8893B94cFbA3eA982f09cB4482fc9D25F414e691",
        "0x86a3b8B67BF8Da4baE347762e63B3D1Ba2a34f51",
        "0x9DE4533994478d1Cb6E3F62cE6b02e275e800187",
        "0x91f38CF41550C14400CF7BB0b0fC2D7e6bC331bA",
        "0x028D7a0549ea9751c62EA1E0756d2059fd7B2B82",
        "0x9AE112e9039CdD1733A0253362a3424F920C3971",
        "0xb008754a56b8C655358A009ED180672a5bD06458",
        "0x87668Df194F50BEa46F021A09EE2B361eEBA3617",
        "0x19B8627Eab7f85123C2473E0514160f7AFfE1aFA",
        "0xD233EA1412607A035bCAc0523aA331ba4dE03b3C",
        "0x2e4E185ACf25FC3a649c3FEE47bD8f2b488df4c5",
        "0x6df8FAA582B48737ccC57Ad6344dC3dAd5C5bf5d",
        "0x56b190AE6116e3f922Dd03B72439F7B1014d990e",
        "0xa585FB01874f42961Fec3f5cb271B7a206F0eDd3",
        "0x7A7fdFc006bB58Ef4D0ecC0C3442EC8E14C272F7",
        "0x30a4d17e718BBe17cEBbbC0D9D5d3fBA14CD67ce",
        "0x028D7a0549ea9751c62EA1E0756d2059fd7B2B82",
        "0xecc8589584895055eFB477b95Fc84fC927DBE8B1",
        "0xe39Ee7c6a7597b9a91724b55630e3C4CCD05bEAd",
        "0x37585A4FD561760418c6B61c4C475a614d2D8971",
        "0x653Be4Dfff6EF5Fc87771985e7bc7563889f174E",
        "0xd877186A3088026Af163c6617DCAe13F1f824214",
        "0x35d0fD47A24c888CcCE561124a1d1784362ddaaF",
        "0xb440F947Cdc12a2DbfC7eaB8F28B93d8B6e1F7df",
        "0x0176433c9a2f3d303Bf3448B12F91b367A007AA0",
        "0xceF157f4903792588353470309A67b8c046B8318",
        "0xC15b3f15e851C01E83af030e8cD63494Aa13bdB1",
        "0x39AAD435855daDe12Cc6dED514b2a2C3A5260eC6",
        "0x2fd419E4E41bef1aB222f1c266D598918852f1e0",
        "0x1302fcD543465B040F88DbB98A0A61879C1b8c22",
        "0x8c6bC20fB8eC3238894a8b818a73CA8667E37022",
        "0x5Cdc6BFbEdd637C72d45FFeeeCEAe79ac31475ED",
        "0xc741A7B64432C3D08D925ADce77835bd8F3234F6",
        "0x9ce5A301f45953EAB8e642Ad8B4aD77C3f38a714",
        "0x8dD7a5d7E7244c00B42C638117EC3751631141c7",
        "0x657b994302Cb54d2A0Cc4DF0140c0F7aAadD7770",
        "0x46Af2f7a3036C6E0e43366f3960c91B9bb77B820",
        "0x3d4602330Ea4aBf578154b9E711B778d8bb8e97B",
        "0x28214faa57d16FC70AC99F67B9811f882C703Ee8",
        "0x4D8aB1B5A9f504ff7A52Bd3127c7444D9Fd35826",
        "0xd5E8e55562621edEa4048b2Dc8295B2D1666368b",
        "0x8E9dA6A6F0E14122950c8c9A7a972140fB28e3F3",
        "0x7A7fdFc006bB58Ef4D0ecC0C3442EC8E14C272F7",
        "0xa43414A67755508546B0bC777B69A0BF7d1c6AFF",
        "0x30a4d17e718BBe17cEBbbC0D9D5d3fBA14CD67ce",
        "0xae9C73e58B9e1013c78736dD13E2E9FE051b8Dc8",
        "0xaA213aFEeA14CdA09aA1a2E6d52921e5BEdf3c2F",
        "0x397Ce4f1F6326afd0C50FCb554485E7e7814A08E",
        "0xB6bAAd8db1530582ecB56e88B61b09A360267a6d",
        "0x1050B312497415b67fAD4fC9753C2fec1A33c4B6",
        "0x21d68247aB677505b2b27003a0453221C50625E8",
        "0x55338C65e99Fc6A8be4F0bD940F5B4493ab4C2BB",
        "0xbD8113d0D6651D622f966650149a50425E633865",
        "0x354E186018bEd8516Bf39F0e77c6DF7872bA1B2B",
        "0xb385E1D780bb98C19b78B7EC7E7F2488F04331eB",
        "0xee64bb156aeeff8028cebc012b61fda5b023ecf1",
        "0xeD8c5a71901Faf3959a1944470b0cD3F5278a460",
        "0xbDDB3B87d781C56c9258fb09dB40a67274b6e510",
        "0x32FB6E74FFEd327A2eB203024BB758e2Ab71EA17",
        "0x2cE0Abf1021F36Ab658c4eEE3eBdE680Cd15795D",
        "0xc7b9d3237dee4767f6a0aec8ade55bce85e26a08",
        "0x7c7c4604b556c7c2c4c0e3e4de6f788b5da50b14",
        "0x05b80402ac0885776630aaa47c455da3c6804954",
        "0x2fa95a49ff985866170f22255b9c8159d3678d2a",
        "0x00d57f378db6f15d82cea2dd749037c46c1190fc",
        "0x31429bfa1c9ecd7d3c95cb8624afb25ac60cd335",
        "0xb3f9df5661d1eb62c126e755d2f803d15ba8f28c",
        "0xf56cbf248422ee0a9d6bf670feacab0e689519e9",
        "0x4c72192bc5f9905a48cbf0dcfda37d29d37807ab",
        "0x928ee225f4ef24cb8ae01545788fbe2329173ee7",
        "0xeb2f74148cf0738989fc6888340895d3fb562273",
        "0xb88be30980b33f49c054de481cf4c86e506f1fb4",
        "0xed8c5a71901faf3959a1944470b0cd3f5278a460",
        "0x319ab30c5fb5296345d4ea4dcc9c302a68195775",
        "0xee64bb156aeeff8028cebc012b61fda5b023ecf1",
        "0xD582a6ACD82D64158121Ca9e5911CD17266a22C4",
        "0x447bab07D23436Cfc07ca99018b2Ad2aee859c38",
        "0xA9bFA028Ea9893deDA796fC7b9C7B5d51BA77fDA",
        "0xdA5d6208bb585b267e5f45Af3D2ABE9D58c24AdD",
        "0xAC588293b043BCbD847108C82F153D356c19F6fE",
        "0x04FBd97C25957bcEa38eCC94Ac167408BEEeA1f1",
        "0xd434805b31aF9ceA9e911c284ceAbEa2c0BD3C73",
        "0x9a00444831B713ED0dCc8ae29d5A876b0e9C7088",
        "0xe1c4c64d29FEEE1FEF32E3f4f3C527DBFc3c124c",
        "0x9254a582616d22EB352DB541E554EEa69e63De17",
        "0xFE6a5591acdD4E0714f9D925011D748B2CB0a4Db",
        "0xc7b9d3237DEe4767F6A0AEC8ADe55Bce85E26A08",
        "0xCD94FE7038004abe4c2931A0b1406740582D0541",
        "0x885047370b0d749F85676DFa76e6297D08E2d7e7",
        "0xcE88d463008bEd890D6257e35eBbcFF04fFf03F6",
        "0x74C1188a10033073Ce488022cf4C7A6afB22f72E",
        "0x33E343E175062Bf32ddF46B19bCfb4A474c3e245",
        "0x1dEe1554FB271cb832A1DD501683Ef3eB734D32e",
        "0x9EEC064565450a17aa67B6ed11ca296d13C7d20C",
        "0x315d1F3967f0F183931E7999EA937c0416F94F7A",
        "0x36F6F123dD2b8a0f183ce0A78eAA015C8e964390",
        "0x8eAf09DDfD5146BC8fDd360148f4bd764647ac8e",
        "0xeD8c5a71901Faf3959a1944470b0cD3F5278a460",
        "0x319Ab30c5Fb5296345d4eA4dcC9C302A68195775",
        "0xee64bb156aeeff8028cebc012b61fda5b023ecf1",
        "0xB88Be30980B33f49c054DE481Cf4c86e506f1Fb4",
        "0x17D048c2E98dfbC11A75114dADA092F7344161a1",
        "0x1924e7165C730eCe173C2f0053ad05dcf46E6990",
        "0x54f55871CcE9421797e39108721BA813036D129E",
        "0x21B2BeABd07C61919A5cEBC250d69221c221387b",
        "0xF973c76CE2eA7b9a66066bF5515C8E9CFa414454",
        "0x2d74c0296922605358cbb2a1f1b3e8974f30f822",
        "0x4B2392AbBDD1cBBC5D47632dFbc25dA474B432Ba",
        "0xfb42Dc37FA8d2BB0bC7FbFE74433759e93193994",
        "0xc58F72DaC3F0F6241705E6C628dAd9632bC2fc46",
        "0xA7f547ce818f35B990b232df05e3D5fb2dC729C6",
        "0x21f4cD402865E5c80eDcE2715879A8aD3dC1BAD7",
        "0x41d8035b14be5218dbb988ec97ab3b4adf2a5bef",
        "0x5Cdc6BFbEdd637C72d45FFeeeCEAe79ac31475ED",
        "0x73C75FE955A7E58E789F95f6029e8b1e6c0B42cB",
        "0x8c6bC20fB8eC3238894a8b818a73CA8667E37022",
        "0xC77651e4a338C5D9648A41Dc02FfcDB1D19E0bFE",
        "0x4D3C96A81022ee7DAA3F0AB6dae59b21cC952BD2",
        "0x2c24C2bF6e70DA6b6067D7bec93E16829CFA0A98",
        "0x80eaE496a4DCD5c4bb32f27DBdcd235C129Db4e9",
        "0x7BC53E1331a8D743EBd519E28ffb7Cf24dE15D03",
        "0x43A40f684B0b652F269CA82f9C4eAEA572d5db06",
        "0x99ca81E79F0bf31632386c1cCE08facAd48727D9",
        "0x76DB6982E0eE2BBd4598ea9aAA9b69D969206C8a",
        "0x6e9e37c330bB25a5C2869aEb4fc6757b1f39b3dd",
        "0x338B0853873d1Eb46049351e730502baB8946eC5",
        "0x8b0B43C2fc86DE6CCf1a110759Fca31D2E63B918",
        "0x0F79fF74E929eE02F9a99a2f04a82Fdb1C6dB64C",
        "0x43A40f684B0b652F269CA82f9C4eAEA572d5db06",
      ].map((addr) => addr.toLowerCase())
    )

    const allowedAddresses2 = new Set(
      [
        "0x0176433c9a2f3d303Bf3448B12F91b367A007AA0",
        "0xae9C73e58B9e1013c78736dD13E2E9FE051b8Dc8",
        "0x8c6bC20fB8eC3238894a8b818a73CA8667E37022",
        "0x9ce5A301f45953EAB8e642Ad8B4aD77C3f38a714",
        "0x46Af2f7a3036C6E0e43366f3960c91B9bb77B820",
        "0x657b994302Cb54d2A0Cc4DF0140c0F7aAadD7770",
        "0xD70EdeD47E90a1cB7011905051aCadED6bd0CA9B",
        "0x53560340Cd3BBA4795A4C7C37B7d6071B97B09f2",
        "0x8dD7a5d7E7244c00B42C638117EC3751631141c7",
        "0x3d4602330Ea4aBf578154b9E711B778d8bb8e97B",
        "0xa43414A67755508546B0bC777B69A0BF7d1c6AFF",
        "0x28214faa57d16FC70AC99F67B9811f882C703Ee8",
        "0x7A7fdFc006bB58Ef4D0ecC0C3442EC8E14C272F7",
        "0x8E9dA6A6F0E14122950c8c9A7a972140fB28e3F3",
        "0x4D8aB1B5A9f504ff7A52Bd3127c7444D9Fd35826",
        "0x30a4d17e718BBe17cEBbbC0D9D5d3fBA14CD67ce",
        "0xd5E8e55562621edEa4048b2Dc8295B2D1666368b",
        "0xb008754a56b8C655358A009ED180672a5bD06458",
        "0x91f38CF41550C14400CF7BB0b0fC2D7e6bC331bA",
        "0xaA213aFEeA14CdA09aA1a2E6d52921e5BEdf3c2F",
        "0x397Ce4f1F6326afd0C50FCb554485E7e7814A08E",
        "0xB6bAAd8db1530582ecB56e88B61b09A360267a6d",
        "0x1050B312497415b67fAD4fC9753C2fec1A33c4B6",
        "0x21d68247aB677505b2b27003a0453221C50625E8",
        "0x55338C65e99Fc6A8be4F0bD940F5B4493ab4C2BB",
        "0xbD8113d0D6651D622f966650149a50425E633865",
        "0x354E186018bEd8516Bf39F0e77c6DF7872bA1B2B",
        "0xb385E1D780bb98C19b78B7EC7E7F2488F04331eB",
        "0xB42374014800f3FEa534EC345FB7322E12BEF7B9",
        "0xee64bb156aeeff8028cebc012b61fda5b023ecf1",
        "0xeD8c5a71901Faf3959a1944470b0cD3F5278a460",
        "0xbDDB3B87d781C56c9258fb09dB40a67274b6e510",
        "0x32FB6E74FFEd327A2eB203024BB758e2Ab71EA17",
        "0x2cE0Abf1021F36Ab658c4eEE3eBdE680Cd15795D",
        "0xE34F4b4708e0Bc1Ca9993dfb702fF2643072eC8B",
        "0xc741A7B64432C3D08D925ADce77835bd8F3234F6",
        "0xc7b9d3237dee4767f6a0aec8ade55bce85e26a08", // SG
        "0x7c7c4604b556c7c2c4c0e3e4de6f788b5da50b14", // PJ
        "0x05b80402ac0885776630aaa47c455da3c6804954", // SG02(2000)
        "0x2fa95a49ff985866170f22255b9c8159d3678d2a", // SG03(6000)
        "0x00d57f378db6f15d82cea2dd749037c46c1190fc", // Pradeep Jain
        "0x31429bfa1c9ecd7d3c95cb8624afb25ac60cd335", // Saurabh Jain
        "0xB3F9Df5661D1EB62c126E755d2f803D15BA8F28C", // Saurabh Moudgil - Address 1
        "0xf56CbF248422Ee0A9d6bF670feacAB0e689519e9", // Saurabh Moudgil - Address 2
        "0x4c72192Bc5f9905a48cbf0dCfda37D29d37807ab", // Kulbhushan Kaushik
        "0x928ee225f4ef24cb8ae01545788fbe2329173ee7",
        "0xb440F947Cdc12a2DbfC7eaB8F28B93d8B6e1F7df",
      ].map((addr) => addr.toLowerCase())
    )

    const userAddr = address.toLowerCase()

    const today = new Date()

    if (allowedAddresses2.has(userAddr)) {
      return claimReward()
    }

    if (allowedAddresses.has(userAddr)) {
      if (today.getDate() === 10) {
        // return claimReward()
        return setSyncOpen(true)
      } else {
        setSyncOpen(true)
        // setFirstDayOpen(true)
        return
      }
    }

    // if (allowedAddresses.has(userAddr)) {
    //   return claimReward()
    // }

    setSyncOpen(true)
  }

  const today = new Date()
  const isBeforeFourth = today.getDate() < 5

  // Set claim date to 4th of current month if before 4th, otherwise 4th of next month
  const claimDate = new Date(
    today.getFullYear(),
    today.getMonth() + (isBeforeFourth ? 0 : 1),
    5
  )

  const nextMonthName = claimDate.toLocaleString("default", {
    month: "long",
  })

  return (
    <>
      <StatusDialog
        open={dialog}
        setOpen={setDialog}
        type={dialogInfo.type}
        message={dialogInfo.message}
        title={dialogInfo.title}
      />
      <SyncPopup open={syncOpen} setOpen={setSyncOpen} />
      <FirstDayClaimPopup open={firstDayOpen} setOpen={setFirstDayOpen} />
      <div className="w-full flex 2md:flex-row flex-col items-center 2md:items-start gap-6 2md:gap-0 justify-between">
        <div className="2md:max-w-[57%] max-w-[650px] w-full flex flex-col gap-6 items-center">
          {/* <div className="flex flex-col items-center gap-2 ">
          <div className="text-xl font-medium">Total Staked</div>
          <div className="text-2xl font-medium">
            {Number(token).toFixed(2)} Fit24
          </div>
        </div> */}
          <div className="flex flex-col gap-2 w-full  2md:order-none order-1">
            <div>Network Statistics</div>
            <div className="flex gap-4 w-full  items-center overflow-x-auto hide-scrollbar">
              {/* <div className="flex flex-col items-center flex-1 min-w-36 rounded-lg gap-2  network-image-1  p-3 ">
                <IoMdPerson size={24} />
                <div className="text-xl">
                  {totalNetworkMembers ? totalNetworkMembers : 0}
                </div>
                <div className="text-gray-300 text-xs">All Members</div>
              </div> */}
              <div className="flex flex-col items-center flex-1 rounded-lg  network-image-2 gap-2  p-3 min-w-36">
                <BsSafeFill size={24} />
                <div className="text-xl">
                  {Number(totalNetworkStaked.toFixed(2))}
                </div>
                <div className="text-gray-300 text-xs">Total Stake</div>
              </div>
              <div className="flex flex-col items-center flex-1 rounded-lg  network-image-3 gap-2  p-3 min-w-36">
                <FaHandHoldingUsd size={24} />
                <div className="text-xl">
                  {Number(totalNetworkWithdrawal).toFixed(2)}
                </div>
                <div className="text-gray-300 text-xs">Total Withdrawals</div>
              </div>
            </div>
          </div>
          {/* <div className="h-60 w-full  bg-black flex justify-center items-center py-4 !px-6 bg-opacity-35 rounded-xl">
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
          </div> */}
          <LineChart />

          <div className="bg-white network-image-3 bg-opacity-10 max-w-80 w-full p-4 px-10 flex flex-col items-center gap-2  rounded-lg">
            <FaHandHoldingUsd size={24} />
            <div className="text-gray-400 text-sm">Todays Rewards</div>
            <div className="text-2xl flex items-center gap-2">
              {/* 12,08 */}
              {pendingAmount && pendingAmount.toFixed(4)}
              {/* {readTotalStakeAmount &&
              getNumber(readTotalStakeAmount[0].result! as bigint, 18).toFixed(
                4
              )} */}
              <span className="w-20">
                <Image
                  src={"/fitLogo.svg"}
                  width={3000}
                  height={30000}
                  alt="logo"
                  className="h-full w-full"
                />
              </span>
            </div>
          </div>
          {/* <button
            // onClick={claimReward}
            onClick={() => {
              const today = new Date()
              console.log("today", today.getDate())
              if (today.getDate() === 1) {
                return claimReward()
              } else {
                setFirstDayOpen(true)
                return
              }
            }}
            className="max-w-80 w-full disabled:opacity-50 disabled:cursor-not-allowed mb-10 bg-themeGreen text-white h-10 rounded-lg"
          >
            {isClaimLoading ? (
              <div className="flex justify-center items-center">
                <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
              </div>
            ) : (
              "Claim Reward"
            )}
          </button> */}

          <div className="relative max-w-80 w-full">
            {claimStakeCondition ? (
              <div className="text-center">
                {/* Available to claim after 24 Hours */}
                Available to claim on 10th July
              </div>
            ) : (
              <button
                // onClick={claimReward}
                onClick={syncPopup}
                onMouseOver={() => {
                  if (claimStakeCondition) {
                    setShowPopup(true)
                  } else if (!!!pendingAmount) {
                    setShowPopup(true)
                  } else {
                    return
                  }
                }}
                onMouseLeave={() => setShowPopup(false)}
                disabled={!pendingAmount || claimStakeCondition}
                className="max-w-80 w-full disabled:opacity-50 disabled:cursor-not-allowed mb-10 bg-themeGreen text-white h-10 rounded-lg"
              >
                {isClaimLoading ? (
                  <div className="flex justify-center items-center">
                    <CgSpinner className="text-2xl animate-spin !text-black flex items-center justify-end" />
                  </div>
                ) : (
                  "Claim Reward"
                )}
              </button>
            )}

            {showPopup && (
              <div className="absolute bg-white border text-black rounded-full border-gray-200 shadow-md top-14 w-fit left-[50%] p-2 z-10 text-semibold text-base text-nowrap">
                {pendingAmount === 0
                  ? "Already Claimed"
                  : claimStakeCondition
                  ? "Claim after 24 hours"
                  : "Already Claimed"}
              </div>
            )}
          </div>
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
          <div className="bg-black bg-opacity-35 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
            <div className="text-gray-400 text-sm">
              Total Instant USDT Cashback - 5%
            </div>
            <div className="text-2xl">{totalRefIncome}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
              <div className="text-gray-400 text-sm">Direct Members</div>
              <div className="text-2xl">
                {directMemberLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  directMembers.length
                )}
              </div>
            </div>
            <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
              <div className="text-gray-400 text-sm">Total Team</div>
              <div className="text-2xl">
                {memberLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  totalMembers.stakerCount
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
              <div className="text-gray-400 text-sm">My Stake</div>
              <div className="text-2xl">{token}</div>
            </div>
            <div className="bg-black bg-opacity-35 w-28 p-4 flex flex-col items-center gap-1 flex-1 rounded-lg">
              <div className="text-gray-400 text-sm">Team Stake</div>
              <div className="text-2xl">
                {memberLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  totalMembers.totalTeamStakedAmount
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
