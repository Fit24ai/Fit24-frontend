"use client"
import { AlertDialog } from "@/components/shared/AlertDialog"
import { EmailDialog } from "@/components/shared/EmailDialog"
import Footer from "@/components/shared/Footer"
import { LoginDialog } from "@/components/shared/LoginDialog"
import Navbar from "@/components/shared/Navbar/Navbar"
import { ReferralDialog } from "@/components/shared/ReferralDialog"
import Sidebar from "@/components/shared/Sidebar/Sidebar"
// import { useParams } from "@/context/useParams"
// import { useWallet } from "@/hooks/useWallet"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
// import { Metadata } from "next"

// export const metadata: Metadata = {
//   title: "",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { params } = useParams()
  // const { openWallet, disconnectWallet, isEmailPopup, setIsEmailPopup } =
  //   useWallet()
  const [open, setOpen] = useState<boolean>(false)
  const { isConnected } = useAccount()
  useEffect(() => {
    console.log(!isConnected)
    setOpen(!isConnected)
  }, [isConnected])
  // console.log("paramsHeight", params)

  return (
    <>
      <Navbar />
      <div className={`h-screen flex overflow-hidden`}>
        {open && (
          <div className="w-[100vw] h-[100vh] bg-black fixed top-0 z-50"></div>
        )}
        {/* <AlertDialog stakeRef= {}/> */}
        {/* <ReferralDialog stakeRef={params} /> */}
        <LoginDialog open={!isConnected} setOpen={setOpen} />
        {/* <EmailDialog open={isEmailPopup} setIsEmailPopup={setIsEmailPopup} /> */}
        {/* <Navbar /> */}
        <Sidebar />
        {children}
      </div>
      <Footer />
    </>
  )
}
