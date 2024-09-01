import Navbar from "@/components/shared/Navbar/Navbar"
import Sidebar from "@/components/shared/Sidebar/Sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" h-screen flex overflow-hidden">
      {/* <Navbar /> */}
      <Sidebar />
      {children}
    </div>
  )
}
