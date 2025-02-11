"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { X } from "lucide-react"

export function BreakdwonPopup({ open, setOpen, breakdown }: any) {
  // useEffect(() => {
  //   if (isEmailPopup === true) {
  //     if (openBox === true) setOpenBox(false)
  //   }
  // }, [isEmailPopup])
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[80vh] max-w-[90vw] w-fit overflow-auto outline-none border-none text-white bg-gray-800 shadow-lg p-6">
        {breakdown && (
          // <div className="w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
          //   <h2 className="text-lg font-bold mb-4">Breakdown Details</h2>

          //   <div>
          //     <p>
          //       <strong>Qualifier Type:</strong> {breakdown.qualifierType}
          //     </p>

          //     {breakdown.qualifierType === "FORTYTHIRTY" && (
          //       <>
          //         <div className="flex flex-col flex-nowrap mt-2">
          //           <strong>Max Business Leg:</strong>
          //           <div className="flex flex-nowrap">
          //             Address - {breakdown.MaxBusinessLeg.referee}
          //           </div>
          //           <div>
          //             Total Business - $
          //             {breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
          //           </div>
          //           <div>
          //             Allocated 30% - $
          //             {breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
          //           </div>
          //         </div>
          //         <div className="flex flex-col flex-nowrap mt-2">
          //           <strong>Second Max Business Leg:</strong>
          //           <div className="flex flex-nowrap">
          //             Address - {breakdown.SecondMaxBusinessLeg.referee}
          //           </div>
          //           <div>
          //             Total Business - $
          //             {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
          //           </div>
          //           <div>
          //             Allocated 30% - $
          //             {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
          //           </div>
          //         </div>
          //         <p className="mt-2">
          //           <strong>Rest of Members:</strong> ${" "}
          //           {breakdown.restOfMembers.totalUsdAmount.toLocaleString()}{" "}
          //           (Allocated 30%: $
          //           {breakdown.restOfMembers.allocated30_2.toLocaleString()})
          //         </p>
          //       </>
          //     )}

          //     {/* <p className="mt-2">
          //       <strong>Second Max Business Leg:</strong>{" "}
          //       {breakdown.SecondMaxBusinessLeg.referee} - $
          //       {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}{" "}
          //       (Allocated 30%: $
          //       {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()})
          //     </p> */}

          //     <h3 className="mt-4 font-bold">Referee Business:</h3>
          //     <ul className="list-disc list-inside">
          //       {breakdown.refereeBusiness.map((ref: any, index: any) => (
          //         <li key={index}>
          //           {ref.referee}: ${ref.USDAmount.toLocaleString()}
          //         </li>
          //       ))}
          //     </ul>
          //   </div>
          //   <button
          //     onClick={() => {
          //       setOpen(false)
          //     }}
          //     className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition"
          //   >
          //     Close
          //   </button>
          // </div>
          // <div className="w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
          //   <h2 className="text-lg font-bold mb-4">Qualification Details</h2>

          //   <div className="w-full flex flex-col gap-4">
          //     <p>
          //       <strong>Qualifier Type:</strong> {breakdown.qualifierType}
          //     </p>

          //     {breakdown.qualifierType === "FORTYTHIRTY" && (
          //       <div className="w-full flex flex-col gap-6">
          //         {/* Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-20 p-4 rounded-lg shadow-md">
          //           <h3 className="text-lg font-bold mb-2">Highest Leg</h3>
          //           <p>
          //             <strong>Address:</strong>{" "}
          //             {breakdown.MaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong>Total Business:</strong> $
          //             {breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong>Allocated 40%:</strong> $
          //             {breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Second Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-20 p-4 rounded-lg shadow-md">
          //           <h3 className="text-lg font-bold mb-2">
          //             Second Highest Leg
          //           </h3>
          //           <p>
          //             <strong>Address:</strong>{" "}
          //             {breakdown.SecondMaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong>Total Business:</strong> $
          //             {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong>Allocated 30%:</strong> $
          //             {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Rest of Members */}
          //         <div className="w-full text-center">
          //           <p>
          //             <strong>Rest of Members:</strong> $
          //             {breakdown.restOfMembers.totalUsdAmount.toLocaleString()}
          //             (Allocated 30%: $
          //             {breakdown.restOfMembers.allocated30_2.toLocaleString()})
          //           </p>
          //         </div>
          //       </div>
          //     )}

          //     {/* Referee Business Table */}
          //     <div className="w-full">
          //       <h3 className="text-lg font-bold mt-4 mb-2">
          //         Referee Business
          //       </h3>
          //       <div className="overflow-x-auto">
          //         <table className="w-full border border-gray-700 rounded-lg text-left">
          //           <thead>
          //             <tr className="bg-gray-800 text-gray-300">
          //               <th className="px-4 py-2">S. No</th>
          //               <th className="px-4 py-2">Address</th>
          //               <th className="px-4 py-2">Business ($)</th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             {breakdown.refereeBusiness.map(
          //               (ref: any, index: number) => (
          //                 <tr key={index} className="border-b border-gray-700">
          //                   <td className="px-4 py-2">{index + 1}</td>
          //                   <td className="px-4 py-2">{ref.referee}</td>
          //                   <td className="px-4 py-2">
          //                     {ref.USDAmount.toLocaleString()}
          //                   </td>
          //                 </tr>
          //               )
          //             )}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>

          //   {/* Close Button */}
          //   <button
          //     onClick={() => setOpen(false)}
          //     className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition"
          //   >
          //     Close
          //   </button>
          // </div>
          // <div className="w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
          //   <h2 className="text-lg font-bold mb-4">Qualification Details</h2>

          //   <div className="w-full flex flex-col gap-4">
          //     <p>
          //       <strong>Qualifier Type -</strong>{" "}
          //       {breakdown.qualifierType === "FORTYTHIRTY"
          //         ? "40 : 30 : 30"
          //         : "ALL DIRECT REFERRALS"}
          //     </p>

          //     {breakdown.qualifierType === "FORTYTHIRTY" && (
          //       <div className="w-full flex flex-col gap-6">
          //         {/* Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-20 p-4 rounded-lg shadow-md">
          //           <h3 className="text-lg font-bold mb-2">Highest Leg</h3>
          //           <p>{breakdown.MaxBusinessLeg.referee}</p>
          //           <p>
          //             <strong>Total Business:</strong> $
          //             {breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong>Allocated 40%:</strong> $
          //             {breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Second Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-20 p-4 rounded-lg shadow-md">
          //           <h3 className="text-lg font-bold mb-2">
          //             Second Highest Leg
          //           </h3>
          //           <p>{breakdown.SecondMaxBusinessLeg.referee}</p>
          //           <p>
          //             <strong>Total Business:</strong> $
          //             {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong>Allocated 30%:</strong> $
          //             {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Rest of Members - Now inside a Box */}
          //         <div className="w-full bg-green-300 bg-opacity-20 p-4 rounded-lg shadow-md">
          //           <h3 className="text-lg font-bold mb-2">Rest of Members</h3>
          //           <p>
          //             <strong>Total Business:</strong> $
          //             {breakdown.restOfMembers.totalUsdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong>Allocated 30%:</strong> $
          //             {breakdown.restOfMembers.allocated30_2.toLocaleString()}
          //           </p>
          //         </div>
          //       </div>
          //     )}

          //     {/* Referee Business Table */}
          //     <div className="w-full">
          //       <h3 className="text-lg font-bold mt-4 mb-2">
          //         Referee Business
          //       </h3>
          //       <div className="overflow-x-auto">
          //         <table className="w-full border border-gray-700 rounded-lg text-left">
          //           <thead>
          //             <tr className="bg-gray-800 text-gray-300">
          //               <th className="px-4 py-2 whitespace-nowrap">S. No</th>
          //               <th className="px-4 py-2 whitespace-nowrap">Address</th>
          //               <th className="px-4 py-2 whitespace-nowrap">
          //                 Business ($)
          //               </th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             {breakdown.refereeBusiness.map(
          //               (ref: any, index: number) => (
          //                 <tr key={index} className="border-b border-gray-700">
          //                   <td className="px-4 py-2">{index + 1}</td>
          //                   <td className="px-4 py-2">{ref.referee}</td>
          //                   <td className="px-4 py-2">
          //                     {ref.USDAmount.toLocaleString()}
          //                   </td>
          //                 </tr>
          //               )
          //             )}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>

          //   {/* Close Button */}
          //   <button
          //     onClick={() => setOpen(false)}
          //     className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition"
          //   >
          //     Close
          //   </button>
          // </div>
          // <div className="w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
          //   <h2 className="text-xl font-extrabold underline underline-offset-4 decoration-themeGreen mb-4">
          //     Qualification Details
          //   </h2>

          //   <div className="w-full flex flex-col gap-4">
          //     <p className="text-lg font-semibold">
          //       <strong className="text-themeGreen">Qualifier Type -</strong>{" "}
          //       {breakdown.qualifierType === "FORTYTHIRTY"
          //         ? "40 : 30 : 30"
          //         : "ALL DIRECT REFERRALS"}
          //     </p>

          //     {breakdown.qualifierType === "FORTYTHIRTY" && (
          //       <div className="w-full flex flex-col gap-6">
          //         {/* Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
          //           <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
          //             Highest Leg
          //           </h3>
          //           <p className="text-gray-300">
          //             {breakdown.MaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Total Business:
          //             </strong>{" "}
          //             ${breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Allocated 40%:
          //             </strong>{" "}
          //             ${breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Second Highest Leg */}
          //         <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
          //           <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
          //             Second Highest Leg
          //           </h3>
          //           <p className="text-gray-300">
          //             {breakdown.SecondMaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Total Business:
          //             </strong>{" "}
          //             $
          //             {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Allocated 30%:
          //             </strong>{" "}
          //             $
          //             {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Rest of Members */}
          //         <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
          //           <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
          //             Rest of Members
          //           </h3>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Total Business:
          //             </strong>{" "}
          //             ${breakdown.restOfMembers.totalUsdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-themeGreen">
          //               Allocated 30%:
          //             </strong>{" "}
          //             ${breakdown.restOfMembers.allocated30_2.toLocaleString()}
          //           </p>
          //         </div>
          //       </div>
          //     )}

          //     {/* Referee Business Table */}
          //     <div className="w-full">
          //       <h3 className="text-xl font-extrabold underline underline-offset-4 decoration-themeGreen mt-4 mb-2">
          //         Referee Business
          //       </h3>
          //       <div className="overflow-x-auto">
          //         <table className="w-full border border-gray-700 rounded-lg text-left">
          //           <thead>
          //             <tr className="bg-gray-900 text-gray-300">
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 S. No
          //               </th>
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 Address
          //               </th>
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 Business ($)
          //               </th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             {breakdown.refereeBusiness.map(
          //               (ref: any, index: number) => (
          //                 <tr
          //                   key={index}
          //                   className="border-b border-gray-700 hover:bg-gray-800 transition"
          //                 >
          //                   <td className="px-4 py-2">{index + 1}</td>
          //                   <td className="px-4 py-2">{ref.referee}</td>
          //                   <td className="px-4 py-2">
          //                     {ref.USDAmount.toLocaleString()}
          //                   </td>
          //                 </tr>
          //               )
          //             )}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>

          //   {/* Close Button */}
          //   <button
          //     onClick={() => setOpen(false)}
          //     className="h-12 px-6 text-lg font-semibold text-white bg-themeGreen bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-lg transition transform hover:scale-105"
          //   >
          //     Close
          //   </button>
          // </div>

          <div className="relative w-full flex flex-col items-center gap-6 rounded-lg text-gray-200">
            {/* Close Icon in Top Right */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition transform hover:scale-110"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-extrabold underline underline-offset-4 decoration-themeGreen mb-4">
              Qualification Details
            </h2>

            <div className="w-full flex flex-col gap-4">
              <p className="text-lg font-semibold">
                <strong className="text-themeGreen">Qualifier Type -</strong>{" "}
                {breakdown.qualifierType === "FORTYTHIRTY"
                  ? "40 : 30 : 30"
                  : "ALL DIRECT REFERRALS"}
              </p>

              {breakdown.qualifierType === "FORTYTHIRTY" && (
                <div className="w-full flex flex-col gap-6">
                  {/* Highest Leg */}
                  <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
                    <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
                      Highest Leg
                    </h3>
                    <p className="text-gray-300">
                      {breakdown.MaxBusinessLeg.referee}
                    </p>
                    <p>
                      <strong className="text-themeGreen">
                        Total Business:
                      </strong>{" "}
                      ${breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
                    </p>
                    <p>
                      <strong className="text-themeGreen">
                        Allocated 40%:
                      </strong>{" "}
                      ${breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
                    </p>
                  </div>

                  {/* Second Highest Leg */}
                  <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
                    <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
                      Second Highest Leg
                    </h3>
                    <p className="text-gray-300">
                      {breakdown.SecondMaxBusinessLeg.referee}
                    </p>
                    <p>
                      <strong className="text-themeGreen">
                        Total Business:
                      </strong>{" "}
                      $
                      {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
                    </p>
                    <p>
                      <strong className="text-themeGreen">
                        Allocated 30%:
                      </strong>{" "}
                      $
                      {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
                    </p>
                  </div>

                  {/* Rest of Members */}
                  <div className="w-full bg-green-300 bg-opacity-25 p-5 rounded-lg shadow-md border border-green-500">
                    <h3 className="text-lg font-extrabold underline underline-offset-4 decoration-green-400 mb-2">
                      Rest of Members
                    </h3>
                    <p>
                      <strong className="text-themeGreen">
                        Total Business:
                      </strong>{" "}
                      ${breakdown.restOfMembers.totalUsdAmount.toLocaleString()}
                    </p>
                    <p>
                      <strong className="text-themeGreen">
                        Allocated 30%:
                      </strong>{" "}
                      ${breakdown.restOfMembers.allocated30_2.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Referee Business Table */}
              <div className="w-full">
                <h3 className="text-xl font-extrabold underline underline-offset-4 decoration-themeGreen mt-4 mb-2">
                  Direct Business
                </h3>
                <div className="overflow-x-auto md:text-base text-sm">
                  <table className="w-full border border-gray-700 rounded-lg text-left">
                    <thead>
                      <tr className="bg-gray-900 text-gray-300">
                        <th className="md:px-4 px-2 py-2 border-b border-gray-600  whitespace-nowrap">
                          S. No
                        </th>
                        <th className="md:px-4 px-2 py-2 border-b border-gray-600">
                          Address
                        </th>
                        <th className="md:px-4 px-2 py-2 border-b border-gray-600 whitespace-nowrap">
                          Business ($)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.refereeBusiness.map(
                        (ref: any, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-gray-700 hover:bg-gray-800 transition"
                          >
                            <td className="md:px-4 px-2 py-2">{index + 1}</td>
                            <td className="md:px-4 px-2 py-2">{ref.referee}</td>
                            <td className="md:px-4 px-2 py-2">
                              {ref.USDAmount.toLocaleString()}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          // <div className="relative w-full flex flex-col items-center gap-6 rounded-lg text-gray-200 p-6">
          //   {/* Close Icon in Top Right */}
          //   <button
          //     onClick={() => setOpen(false)}
          //     className="absolute top-4 right-4 text-gray-400 hover:text-white transition transform hover:scale-110"
          //   >
          //     <X size={24} />
          //   </button>

          //   <h2 className="text-xl font-extrabold border-b-2 border-gray-600 pb-2">
          //     Qualification Details
          //   </h2>

          //   <div className="w-full flex flex-col gap-4">
          //     <p className="text-lg font-semibold">
          //       <strong className="text-gray-400">Qualifier Type -</strong>{" "}
          //       {breakdown.qualifierType === "FORTYTHIRTY"
          //         ? "40 : 30 : 30"
          //         : "ALL DIRECT REFERRALS"}
          //     </p>

          //     {breakdown.qualifierType === "FORTYTHIRTY" && (
          //       <div className="w-full flex flex-col gap-6">
          //         {/* Highest Leg */}
          //         <div className="w-full bg-gray-800 p-5 rounded-lg shadow-md border border-gray-600">
          //           <h3 className="text-lg font-extrabold border-b border-gray-500 pb-1 mb-2">
          //             Highest Leg
          //           </h3>
          //           <p className="text-gray-300">
          //             {breakdown.MaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong className="text-gray-400">Total Business:</strong>{" "}
          //             ${breakdown.MaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-gray-400">Allocated 40%:</strong>{" "}
          //             ${breakdown.MaxBusinessLeg.allocated40.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Second Highest Leg */}
          //         <div className="w-full bg-gray-800 p-5 rounded-lg shadow-md border border-gray-600">
          //           <h3 className="text-lg font-extrabold border-b border-gray-500 pb-1 mb-2">
          //             Second Highest Leg
          //           </h3>
          //           <p className="text-gray-300">
          //             {breakdown.SecondMaxBusinessLeg.referee}
          //           </p>
          //           <p>
          //             <strong className="text-gray-400">Total Business:</strong>{" "}
          //             $
          //             {breakdown.SecondMaxBusinessLeg.usdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-gray-400">Allocated 30%:</strong>{" "}
          //             $
          //             {breakdown.SecondMaxBusinessLeg.allocated30_1.toLocaleString()}
          //           </p>
          //         </div>

          //         {/* Rest of Members */}
          //         <div className="w-full bg-gray-800 p-5 rounded-lg shadow-md border border-gray-600">
          //           <h3 className="text-lg font-extrabold border-b border-gray-500 pb-1 mb-2">
          //             Rest of Members
          //           </h3>
          //           <p>
          //             <strong className="text-gray-400">Total Business:</strong>{" "}
          //             ${breakdown.restOfMembers.totalUsdAmount.toLocaleString()}
          //           </p>
          //           <p>
          //             <strong className="text-gray-400">Allocated 30%:</strong>{" "}
          //             ${breakdown.restOfMembers.allocated30_2.toLocaleString()}
          //           </p>
          //         </div>
          //       </div>
          //     )}

          //     {/* Referee Business Table */}
          //     <div className="w-full">
          //       <h3 className="text-xl font-extrabold border-b-2 border-gray-600 pb-2 mt-4 mb-2">
          //         Referee Business
          //       </h3>
          //       <div className="overflow-x-auto">
          //         <table className="w-full border border-gray-700 rounded-lg text-left">
          //           <thead>
          //             <tr className="bg-gray-900 text-gray-300">
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 S. No
          //               </th>
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 Address
          //               </th>
          //               <th className="px-4 py-2 border-b border-gray-600">
          //                 Business ($)
          //               </th>
          //             </tr>
          //           </thead>
          //           <tbody>
          //             {breakdown.refereeBusiness.map(
          //               (ref: any, index: number) => (
          //                 <tr
          //                   key={index}
          //                   className="border-b border-gray-700 hover:bg-gray-800 transition"
          //                 >
          //                   <td className="px-4 py-2">{index + 1}</td>
          //                   <td className="px-4 py-2">{ref.referee}</td>
          //                   <td className="px-4 py-2">
          //                     {ref.USDAmount.toLocaleString()}
          //                   </td>
          //                 </tr>
          //               )
          //             )}
          //           </tbody>
          //         </table>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
