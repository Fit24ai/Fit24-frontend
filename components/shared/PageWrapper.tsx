import { IChildren } from "@/types/generics"
import { ScrollArea } from "../ui/scroll-area"

export default function PageWrapper({ children }: IChildren) {
  return (
    // <ScrollArea className="h-screen w-full max-w-[100vw]">
    <div className="min-h-screen text-white w-full max-w-screen items-center justify-center overflow-y-auto bg-secondarybg md:rounded-tl-xl hide-scrollbar">
      {children}
    </div>
    // </ScrollArea>
  )
}
