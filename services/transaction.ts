import { AddressString, ChainEnum } from "@/libs/chains";
import { getAuthToken } from "@/libs/utils";
import axios from "axios";

const http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTransactions(tx: AddressString) {
  return (
    await http.get("/", {
      params: {
        tx,
      },
    })
  ).data;
}

export async function createTransaction(
  transactionHash: AddressString,
  chain: ChainEnum
) {
  return (
    await http.post(
      "/",
      {
        transactionHash,
        chain,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    )
  ).data;
}
export async function getAllTransaction() {
  return (
    await http.get("/get-all", {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
  ).data;
}
