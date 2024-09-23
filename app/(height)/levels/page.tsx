"use client"
import LevelContainer from "@/components/Levels/LevelContainer"
import { AlertDialog } from "@/components/shared/AlertDialog"
import { EmailDialog } from "@/components/shared/EmailDialog"
import PageWrapper from "@/components/shared/PageWrapper"
import { useWallet } from "@/hooks/useWallet"
import React from "react"

export default function LevelsPage() {
  const { openWallet, disconnectWallet, isEmailPopup, setIsEmailPopup } =
  useWallet()
  return (
    <PageWrapper>
      <AlertDialog stakeRef={undefined} />
      <EmailDialog open={isEmailPopup} setIsEmailPopup={setIsEmailPopup} />
      <LevelContainer />
    </PageWrapper>
  )
}
