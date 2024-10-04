import type { Metadata } from "next"
import { Readex_Pro } from "next/font/google"
import "./globals.css"
import Web3ModalProvider from "@/providers/Web3ModalProvider"
import { WalletProvider } from "@/hooks/useWallet"
import { ParamsProvider } from "@/context/useParams"
import { headers } from "next/headers"

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
  const cookies = headers().get("cookie")
  return (
    <ParamsProvider>
      <html lang="en">
        <body className={`${readexPro.className}   max-w-[1730px] mx-auto`}>
          <Web3ModalProvider cookies={cookies}>
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
