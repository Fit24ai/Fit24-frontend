"use client"
import DashboardContainer from "@/components/Dashboard/DashboardContainer"
import { AlertDialog } from "@/components/shared/AlertDialog"
import { EmailDialog } from "@/components/shared/EmailDialog"
import PageWrapper from "@/components/shared/PageWrapper"
import { ReferralDialog } from "@/components/shared/ReferralDialog"
import { useWallet } from "@/hooks/useWallet"
import React from "react"

export default function page({
  searchParams,
}: {
  searchParams: { stakeRef: string | undefined }
}) {
  const { openWallet, disconnectWallet, isEmailPopup, setIsEmailPopup } = useWallet()
  return (
    <PageWrapper>
      <AlertDialog stakeRef={undefined} />
      <ReferralDialog stakeRef={searchParams.stakeRef} />
      <EmailDialog open={isEmailPopup} setIsEmailPopup={setIsEmailPopup} />
      <DashboardContainer />
    </PageWrapper>
  )
}
