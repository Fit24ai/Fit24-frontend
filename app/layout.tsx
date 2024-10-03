import type { Metadata } from "next"
import { Readex_Pro } from "next/font/google"
import "./globals.css"
import Web3ModalProvider from "@/providers/Web3ModalProvider"
import Navbar from "@/components/shared/Navbar/Navbar"
import Sidebar from "@/components/shared/Sidebar/Sidebar"
import { WalletProvider } from "@/hooks/useWallet"
import Footer from "@/components/shared/Footer"
import { ParamsProvider } from "@/context/useParams"

// Importing the Readex Pro font
const readexPro = Readex_Pro({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FIT24 Staking",
  description: "FIT24 Staking",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ParamsProvider>
      <html lang="en">
        <body className={`${readexPro.className}   max-w-[1730px] mx-auto`}>
          <Web3ModalProvider>
            <WalletProvider>
              <div className="image-bg">
                {/* <Navbar /> */}
                {children}
              </div>
              {/* <Footer /> */}
            </WalletProvider>
          </Web3ModalProvider>
        </body>
      </html>
    </ParamsProvider>
  )
}
