"use client"
import { useParams } from "@/context/useParams"

import { redirect } from "next/navigation"

export default function Home({
  searchParams,
}: {
  searchParams: { stakeRef: string | undefined }
}) {
  const { setParams } = useParams()
  if (searchParams.stakeRef) {
    console.log("params",searchParams.stakeRef )
    setParams(searchParams.stakeRef)
    // redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
    redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
  }
  redirect("/dashboard")
}
