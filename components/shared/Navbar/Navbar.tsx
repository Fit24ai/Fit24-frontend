"use client"
import Link from "next/link"
import Image from "next/image"
import Menu from "./Menu"
import ConnectWallet from "./ConnectWallet"
import { usePathname } from "next/navigation"
import { NavbarDrawer } from "./NavbarDrawer"

const Navbar = () => {
  const pathname = usePathname()
  return (
    <nav className=" top-0 z-50 flex items-center justify-between  md:px-16 px-4 text-grey-700 h-20 2md:border-b border-gray-700 ">
      <div className="flex  items-end gap-32">
        <div className="flex h-[30px]  xl:h-[40px]">
          <Link href="/" className="items-center text-xl font-bold ">
            <Image
              src="/fitLogo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="h-full w-full"
            />
          </Link>
        </div>
        <div className="text-white font-semibold text-3xl xl:block hidden">
          {pathname.split("/")[1].charAt(0).toUpperCase() +
            pathname.split("/")[1].slice(1)}
        </div>
      </div>

      {/* <div className="visible md:hidden">
        <Link href="/" className="items-center ">
          <div className="flex justify-center">
            <Image
              src="/Fit24-logo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="h-14 w-auto"
            />
          </div>
        </Link>
      </div> */}

      <div className="xl:block hidden">
        <ConnectWallet />
      </div>

      <div className="xl:hidden">
        <NavbarDrawer />
      </div>
    </nav>
  )
}

export default Navbar
