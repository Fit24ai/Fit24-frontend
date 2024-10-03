import { AddressString, ChainEnum } from "@/libs/chains"
import { getAuthToken } from "@/libs/utils"
import axios from "axios"

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/webhook`,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function paymentReceived(
  body: {
    amount: string
    token: AddressString
    user: AddressString
    transaction_hash: AddressString
  },
  chain: ChainEnum
) {
  return (
    await http.post("/payment-received", body, {
      params: {
        chain,
      },
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
  ).data
}
