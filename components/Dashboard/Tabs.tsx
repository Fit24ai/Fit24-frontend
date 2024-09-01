import Image from "next/image"
import Link from "next/link"

export default function Tabs({ tab }: { tab: string | undefined }) {
  return (
    <div className="flex pb-2 items-center gap-4 overflow-x-auto z-10 relative">
      {/* <Link
        href="/stake?tab=STATS"
        scroll={false}
        className={`px-6 py-2 border-2 text-sm shadow-md rounded-xl w-full text-center text-white transition-all whitespace-nowrap ${
          tab === "STATS" || tab === undefined
            ? "bg-gradient-to-r border-gray-700"
            : "bg-white bg-opacity-10 border-themeGreen"
        } from-themeGreen to-themeLightBlue  hover:shadow-lg`}
      >
        Statistics
      </Link> */}
      <Link
        href="/stake?tab=STAKING"
        scroll={false}
        className={`px-6 py-2 border-2 text-sm shadow-md rounded-xl text-center text-white transition-all whitespace-nowrap w-32 border-themeGreen ${
          tab === "STAKING"  || tab === undefined
            ? "bg-gradient-to-r border-gray-700"
            : "bg-white bg-opacity-10 "
        } from-themeGreen to-themeLightBlue  hover:shadow-lg`}
      >
        Staking
      </Link>
      <Link
        href="/stake?tab=HISTORY"
        scroll={false}
        className={`px-6 py-2 border-2 text-sm shadow-md rounded-xl w-32 text-center text-white transition-all whitespace-nowrap border-themeGreen ${
          tab === "HISTORY" 
            ? "bg-gradient-to-r border-gray-700"
            : "bg-white bg-opacity-10 "
        } from-themeGreen to-themeLightBlue  hover:shadow-lg`}
      >
        Tx History
      </Link>
      {/* <Link
        href="/stake?tab=STATS"
        scroll={false}
        className={`px-6 py-2 border-2 text-sm shadow-md rounded-xl w-full text-center text-white transition-all whitespace-nowrap ${
          tab === "STATS" || tab === undefined
            ? "bg-gradient-to-r border-gray-700"
            : "bg-white bg-opacity-10 border-themeGreen"
        } from-themeGreen to-themeLightBlue  hover:shadow-lg`}
      >
        Statistics
      </Link>
      <Link
        href="/stake?tab=STATS"
        scroll={false}
        className={`px-6 py-2 border-2 text-sm shadow-md rounded-xl w-full text-center text-white transition-all whitespace-nowrap ${
          tab === "STATS" || tab === undefined
            ? "bg-gradient-to-r border-gray-700"
            : "bg-white bg-opacity-10 border-themeGreen"
        } from-themeGreen to-themeLightBlue  hover:shadow-lg`}
      >
        Statistics
      </Link> */}
    </div>
  )
}
