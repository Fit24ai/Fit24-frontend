"use client"
import { LoginDialog } from "@/components/shared/LoginDialog"
import Navbar from "@/components/shared/Navbar/Navbar"
import Sidebar from "@/components/shared/Sidebar/Sidebar"
import { useWallet } from "@/hooks/useWallet"
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
  const [open, setOpen] = useState<boolean>(false)
  const { isConnected } = useAccount()
  useEffect(() => {
    console.log(!isConnected)
    setOpen(!isConnected)
  }, [isConnected])
  return (
    <div className={`h-screen flex overflow-hidden`}>
      {open && (
        <div className="w-[100vw] h-[100vh] bg-black fixed top-0 z-50"></div>
      )}
      <LoginDialog open={open} setOpen={setOpen} />
      {/* <Navbar /> */}
      <Sidebar />
      {children}
    </div>
  )
}
