"use client"
import RewardsContainer from "@/components/Rewards/RewardsContainer"
import { AlertDialog } from "@/components/shared/AlertDialog"
import { EmailDialog } from "@/components/shared/EmailDialog"
import PageWrapper from "@/components/shared/PageWrapper"
import { useWallet } from "@/hooks/useWallet"
import React from "react"

export default function RewardsPage() {
  const { openWallet, disconnectWallet, isEmailPopup, setIsEmailPopup } =
  useWallet()
  return (
    <PageWrapper>
      <AlertDialog stakeRef={undefined} />
      <EmailDialog open={isEmailPopup} setIsEmailPopup={setIsEmailPopup} />
      <RewardsContainer />
    </PageWrapper>
  )
}
