import { redirect } from "next/navigation"

export default function Home({
  searchParams,
}: {
  searchParams: { stakeRef: string | undefined }
}) {
  if (searchParams.stakeRef) {
    redirect(`/dashboard?stakeRef=${searchParams.stakeRef}`)
  }
  redirect("/dashboard")
}
