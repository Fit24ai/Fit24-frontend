import { getAuthToken } from "@/libs/utils";
import axios from "axios";
const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        
    },
    
});

export const loginUser = async (walletAddress: string, email?: string, number?: string) => {
    const payload: any = { walletAddress };

    if (email) {
        payload.email = email;
    }

    if (number) {
        payload.number = Number(number);
    }

    return (await http.post("/users/login", payload)).data;
};

