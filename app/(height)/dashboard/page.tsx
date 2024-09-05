import DashboardContainer from "@/components/Dashboard/DashboardContainer"
import PageWrapper from "@/components/shared/PageWrapper"
import { ReferralDialog } from "@/components/shared/ReferralDialog"
import React from "react"

export default function page() {
  return (
    <PageWrapper>
      <ReferralDialog />
      <DashboardContainer />
    </PageWrapper>
  )
}
