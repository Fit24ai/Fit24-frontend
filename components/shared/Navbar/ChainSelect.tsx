"use client"

import { Fragment, useEffect, useState } from "react"
import { useAccount, useSwitchChain } from "wagmi"
import Image from "next/image"
// import { getChain, getChainLogo } from "@/libs/chains"
import { IoIosArrowDown } from "react-icons/io"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { getChain } from "@/libs/chains"

export function ChainSelect() {
  const { chain } = useAccount()
  const { error, switchChain, chains } = useSwitchChain()
  const [selected, setSelected] = useState(getChain(chain))

  useEffect(() => {
    if (!selected) return
    console.log(selected.id)
    switchChain({ chainId: selected.id })
  }, [selected])

  useEffect(() => {
    if (!error) return
    setSelected(getChain(chain))
  }, [error])

  useEffect(() => {
    if (!chain) return
    if (selected.id === chain.id) return
    setSelected(chain)
  }, [chain])

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton
        className={
          "relative px-2 py-1 md:max-w-[200px] max-w-[150px] cursor-pointer gap-1 rounded-xl text-left flex items-center text-white focus:outline-none focus:ring-0 focus:border-none font-medium"
        }
      >
        <div className="flex items-center gap-1 w-full">
          {/* <div className="relative h-4 w-4">
            <Image
              src={getChainLogo(selected!.id)}
              alt=""
              fill
              className="w-full h-full object-contain"
            />
          </div> */}
          <div className="truncate block">{selected?.name}</div>
          {/* <div>
            <IoIosArrowDown />
          </div> */}
        </div>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="w-48 absolute mt-1 max-h-60 z-[1000] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
      >
        {chains.map((person, idx) => (
          <ListboxOption
            key={idx}
            value={person}
            className={({ active }) =>
              `relative mmd:text-base text-sm mmd:py-2  mmd:px-4 cursor-pointer select-none py-1 px-2 ${
                active ? "bg-amber-100 text-amber-900" : "text-gray-900"
              }`
            }
          >
            {({ selected }) => (
              <>
                <span
                  className={`block truncate ${
                    selected ? "font-medium" : "font-normal"
                  }`}
                >
                  {person.name}
                </span>
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}

// export function ChainSelect({ className }: { className?: string }) {
//   const { chain } = useAccount()
//   const { error, switchChain, chains } = useSwitchChain()
//   const [selected, setSelected] = useState(getChain(chain))

//   useEffect(() => {
//     if (!selected) return
//     switchChain({ chainId: selected.id })
//   }, [selected])

//   useEffect(() => {
//     if (!error) return
//     setSelected(getChain(chain))
//   }, [error])

//   useEffect(() => {
//     if (!chain) return
//     if (selected.id === chain.id) return
//     setSelected(chain)
//   }, [chain])

//   return (
//     <Listbox value={selected} onChange={setSelected}>
//       <div className={"relative"}>
//         <ListboxButton
//           className={`relative text-xs xl:text-lg md:w-48 w-20 cursor-pointer gap-1 rounded-lg text-left flex items-center text-white focus:outline-none focus:ring-0 focus:border-none font-medium ${className}`}
//         >
//           <div className="relative h-4 w-4">
//             <Image
//               src={getChainLogo(selected!.id)}
//               alt=""
//               fill
//               className="w-full h-full object-contain"
//             />
//           </div>
//           <span className="block truncate">{selected?.name}</span>
//         </ListboxButton>
//         {/* <Transition
//           as={Fragment}
//           leave="transition ease-in duration-100"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         > */}
//         <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
//           {chains.map((person, personIdx) => (
//             <ListboxOption
//               key={personIdx}
//               className={({ active }) =>
//                 `relative mmd:text-base text-sm mmd:py-2 mmd:px-4 cursor-pointer select-none py-1 px-2 ${
//                   active ? "bg-amber-100 text-amber-900" : "text-gray-900"
//                 }`
//               }
//               value={person}
//             >
//               {({ selected }) => (
//                 <>
//                   <span
//                     className={`block truncate ${
//                       selected ? "font-medium " : "font-normal"
//                     }`}
//                   >
//                     {person.name}
//                   </span>
//                 </>
//               )}
//             </ListboxOption>
//           ))}
//         </ListboxOptions>
//         {/* </Transition> */}
//       </div>
//     </Listbox>
//   )
// }
