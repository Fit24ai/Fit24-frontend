"use client"
import { LoginDialog } from "@/components/shared/LoginDialog"
import { useParams } from "@/context/useParams"

import { redirect } from "next/navigation"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home({
  searchParams,
}: {
  searchParams: { stakeRef: string | undefined }
}) {
  const router = useRouter()
  const { isConnected } = useAccount()

  const [open, setOpen] = useState<boolean>(false)
  useEffect(() => {
    console.log(!isConnected)
    setOpen(!isConnected)
  }, [isConnected])

  useEffect(() => {
    if (!isConnected) return
    console.log("searchParamsiiii", searchParams.stakeRef)
    if (searchParams.stakeRef) {
      console.log("params", searchParams.stakeRef)
      // setParams(searchParams.stakeRef)
      // redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
      redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
    }
    redirect("/dashboard")
  }, [isConnected])

  return (
    <>
      {open && (
        <div className="w-[100vw] h-[100vh] bg-black fixed top-0 z-50"></div>
      )}
      <LoginDialog open={!isConnected} setOpen={setOpen} />
    </>
  )
  // const { setParams } = useParams()
  // if (searchParams.stakeRef) {
  //   console.log("params", searchParams.stakeRef)
  //   setParams(searchParams.stakeRef)
  //   // redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
  //   if (!isConnected) {
  //     redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
  //   }
  // }
  // redirect("/dashboard")
}
