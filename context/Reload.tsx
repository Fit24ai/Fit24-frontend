"use client"
import { ReactNode, createContext, useContext, useState } from "react"

interface ReloadContextType {
  reload: boolean
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}

const ReloadContext = createContext<ReloadContextType | undefined>(undefined)

export const ReloadProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reload, setReload] = useState(false)

  return (
    <ReloadContext.Provider value={{ reload, setReload }}>
      {children}
    </ReloadContext.Provider>
  )
}

export const useReloadContext = () => {
  const context = useContext(ReloadContext)
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider")
  }
  return context
}
