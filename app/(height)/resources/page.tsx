"use client"
import ResourceCard from "@/components/Resources/ResourceCard"
import PageWrapper from "@/components/shared/PageWrapper"
import React from "react"

const resources = [
  { title: "BlockFit-WhitePaper", fileUrl: "/pdfs/blockfit-whitepaper.pdf" },
  { title: "BlockFit-Presentation", fileUrl: "/pdfs/blockfit-presentation.pdf" },
  { title: "Fit24-Global Business Deck", fileUrl: "/pdfs/fit24-business-dock.pdf" },
  { title: "Fit24-Litepaper", fileUrl: "/pdfs/fit24-litepaper.pdf" },
]

export default function ResourcesPage() {
  return (
    <PageWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {resources.map((resource, index) => (
          <ResourceCard key={index} title={resource.title} fileUrl={resource.fileUrl} />
        ))}
      </div>
    </PageWrapper>
  )
}
