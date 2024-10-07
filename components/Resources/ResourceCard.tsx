"use client"
import { Download } from "lucide-react"
import React from "react"
import { HiOutlineDownload } from "react-icons/hi"

interface ResourceCardProps {
  title: string
  fileUrl: string
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, fileUrl }) => {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = title
    link.click()
  }

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg shadow-md cursor-pointer flex justify-between items-center hover:bg-gray-100 hover:text-black"
      onClick={handleDownload}
    >
      <div>{title}</div>
      <div>
        <HiOutlineDownload />
      </div>
    </div>
  )
}

export default ResourceCard
