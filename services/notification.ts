import { getAuthToken } from "@/libs/utils"
import axios from "axios"

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function getNotifications() {
  try {
    return (await http.get("/notification")).data
  } catch (error) {
    console.log(error)
  }
}
