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
      ].map((addr) => addr.toLowerCase())
    )

    const userAddr = address.toLowerCase()

    if (allowedAddresses.has(userAddr)) {
      return claimReward()
    }

    setSyncOpen(true)
  }

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
            onClick={syncPopup}
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
                Available to claim after 24 Hours
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
