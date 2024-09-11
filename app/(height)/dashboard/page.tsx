import DashboardContainer from "@/components/Dashboard/DashboardContainer"
import { AlertDialog } from "@/components/shared/AlertDialog"
import PageWrapper from "@/components/shared/PageWrapper"
import { ReferralDialog } from "@/components/shared/ReferralDialog"
import React from "react"

export default function page({
  searchParams,
}: {
  searchParams: { stakeRef: string | undefined }
}) {
  return (
    <PageWrapper>
      <AlertDialog stakeRef={searchParams.stakeRef} />
      <ReferralDialog stakeRef={searchParams.stakeRef} />
      <DashboardContainer />
    </PageWrapper>
  )
}
