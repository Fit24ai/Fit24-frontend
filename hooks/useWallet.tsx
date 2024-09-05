"use client"
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { loginUser } from "@/services/login"
import { useSearchParams } from "next/navigation"
import { WalletContextProps } from "./types"

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const search = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isEmailPopup, setIsEmailPopup] = useState<boolean>(false)
  const { disconnect } = useDisconnect()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const { address, isConnected } = useAccount()
  const { open, close } = useWeb3Modal()

  const login = async (email?: string, number?: string) => {
    if (!address) return
    try {
      const response = await loginUser(address, email, number)
      if (response) {
        if (response.email === false) {
          setIsEmailPopup(true)
          setError(response.error)
          return response
        }
        localStorage.setItem("authToken", response.accessToken)
        setIsLoggedIn(true)
        setIsEmailPopup(false)
        return response
      }
    } catch (error) {
      console.log(error)
      setIsLoggedIn(false)
    }
  }

  const openWallet = () => {
    open()
  }

  const disconnectWallet = () => {
    disconnect()
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setIsLoggedIn(false)
    close()
    disconnect()
  }

  useEffect(() => {
    if (address) {
      login()
      return
    }
    if (!address) {
      logout()
      return
    }
  }, [isConnected, address])

  return (
    <WalletContext.Provider
      value={{
        isLoggedIn,
        login,
        openWallet,
        logout,
        disconnectWallet,
        isEmailPopup,
        setIsEmailPopup,
        error,
        setError,
        setIsLoggedIn,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
