"use client"

import Image from "next/image"
import { useState } from "react"
// import Drawer from "./Drawer"

const Menu = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="visible md:hidden">
        <Image
          src="/images/hamburger.svg"
          alt="Hamburger Menu"
          width={24}
          height={24}
        />
      </button>
      {/* <Drawer isOpen={open} setIsOpen={setOpen} /> */}
    </>
  )
}

export default Menu
