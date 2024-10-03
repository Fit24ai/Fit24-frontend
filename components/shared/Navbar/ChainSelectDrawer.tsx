"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccount, useSwitchChain } from "wagmi"
import { getChain } from "@/libs/chains"
import { useEffect, useState } from "react"

export function ChainSelectDrawer() {
  const { chain } = useAccount()
  const { error, switchChain, chains } = useSwitchChain()
  const [selected, setSelected] = useState(getChain(chain))

  useEffect(() => {
    if (!selected) return
    switchChain({ chainId: selected.id })
  }, [selected])

  useEffect(() => {
    if (!error) return
    setSelected(getChain(chain))
  }, [error])

  const handleChange = (e: string) => {
    const selectedItem = chains.find((chain) => chain.id === parseInt(e))
    if (!selectedItem) return
    setSelected(selectedItem)
  }

  useEffect(() => {
    if (!chain) return
    if (selected.id === chain.id) return
    setSelected(chain)
  }, [chain])
  return (
    <Select value={selected.id.toString()} onValueChange={handleChange}>
      <SelectTrigger className="w-full bg-[#020c2b] border-none outline-none ring-0 focus:outline-none focus:ring-0">
        <SelectValue className="border-none outline-none">{selected.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {chains.map((chain, idx) => (
            <SelectItem key={idx} value={chain.id.toString()}>
              {chain.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
