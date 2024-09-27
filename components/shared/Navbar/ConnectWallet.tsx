"use client"

import Image from "next/image"
import { Fragment, ReactNode, useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  Transition,
} from "@headlessui/react"
import { CgSpinner } from "react-icons/cg"
import Link from "next/link"
import { useAccount, useDisconnect } from "wagmi"
// import { useRouter, useSearchParams } from "next/navigation"
// import StatusDialog from "../StatusDialog";
import { ChainSelect } from "./ChainSelect"
import { classNames, smallAddress } from "@/libs/utils"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { EmailDialog } from "../EmailDialog"
import { useWallet } from "@/hooks/useWallet"
import { IoIosArrowDown } from "react-icons/io"
// import { useWallet } from "@/hooks/useWallet";
// import EmailDialog from "../EmailDialog";

const ConnectWallet = ({ drawer }: { drawer?: boolean }) => {
  const { address, isConnected }: any = useAccount()
  const { openWallet, disconnectWallet, isEmailPopup, setIsEmailPopup } =
    useWallet()
  const [dialog, setDialog] = useState(false)
  const [type, setType] = useState<"SUCCESS" | "FAIL">("FAIL")
  const [message, setMessage] = useState<string | ReactNode>("")
  const { disconnect } = useDisconnect()
  const [loading, setLoading] = useState(false)
  const { open } = useWeb3Modal()
  return (
    <>
      {/* <EmailDialog open={isEmailPopup} setIsEmailPopup={setIsEmailPopup} /> */}
      {drawer
        ? !isConnected && (
            <button
              // onClick={() => open()}
              disabled={loading}
              className="z-10 w-full h-10 font-medium text-center text-transparent bg-white rounded-xl hover:shadow-lg"
            >
              {loading ? (
                <CgSpinner className="text-xl animate-spin" />
              ) : (
                <span className=" bg-clip-text">CONNECT WALLET</span>
              )}
            </button>
          )
        : !isConnected && (
            <>
              <button
                onClick={() => open()}
                disabled={loading}
                className="z-10  h-10 px-8 bg-green-500 font-medium text-white rounded-xl bg-themeOrange hover:shadow-lg flex min-w-[170px] justify-center items-center"
              >
                {loading ? (
                  <CgSpinner className="text-xl animate-spin" />
                ) : (
                  "CONNECT WALLET"
                )}
              </button>
              {/* <button onClick={() => open()} className="visible xl:hidden">
                <Image
                  src="/images/wallet.svg"
                  alt="wallet"
                  width={24}
                  height={24}
                />
              </button> */}
            </>
          )}
      {isConnected && (
        // <>
        //   <button className="inline-flex truncate w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        //     {smallAddress(address)}
        //   </button>
        // </>
        <Listbox>
          <ListboxButton className="inline-flex relative truncate w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 z-[200]">
            <div className="flex items-center gap-1 w-full">
              <div className="truncate block"> {smallAddress(address)}</div>
            </div>
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className="w-24 absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[200]"
          >
            <ListboxOption
              onClick={() => disconnect()}
              value={"Logout"}
              className="inline-flex truncate w-full cursor-pointer justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 z-[200]"
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    Logout
                  </span>
                </>
              )}
            </ListboxOption>
          </ListboxOptions>
        </Listbox>
      )}
      {/* {!drawer && isConnected && (
        <div className="flex items-center gap-4 w-fit">
          <ChainSelect />
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex truncate w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {smallAddress(address)}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/buy-token#dashboard"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm w-full text-left"
                        )}
                      >
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          disconnect()
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm w-full text-left"
                        )}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )} */}
      {/* <StatusDialog
        open={dialog}
        setOpen={setDialog}
        type={type}
        message={message}
        title="User Login"
      /> */}
    </>
  )
}

export default ConnectWallet
