import { getAuthToken } from "@/libs/utils"
import axios from "axios"

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export async function getRaisedAmount() {
  try {
    return (await http.get("/token/raised-amount")).data
  } catch (error) {
    console.log(error)
  }
}

export async function getPhaseDetails() {
  try {
    return (await http.get("/token/current-stage")).data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllStageInfo() {
  try {
    return (await http.get("/token/all-stage-info")).data
  } catch (error) {
    console.log(error)
  }
}

export async function getUserTokens() {
  try {
    return (
      await http.get("/token/user-tokens", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
    ).data
  } catch (error) {
    console.log(error)
  }
}

export async function getUserRefIncome() {
  try {
    return (
      await http.get("/token/user-referral-income", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      })
    ).data
  } catch (error) {
    console.log(error)
  }
}
