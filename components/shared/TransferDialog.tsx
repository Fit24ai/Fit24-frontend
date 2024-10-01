import { Dialog, Transition } from "@headlessui/react"
import { Dispatch, Fragment } from "react"
import { AddressString } from "@/libs/chains"
import TransactionPollingService from "./TransactionPolling"

const TransferDialog = ({
  open,
  setOpen,
  hash,
}: {
  open: boolean
  setOpen: Dispatch<boolean>
  hash: AddressString | undefined
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transition-all transform h-fit p-8 bg-white rounded-3xl shadow-sm`}
              >
                <TransactionPollingService
                  action={() => setOpen(false)}
                  hash={hash}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default TransferDialog
