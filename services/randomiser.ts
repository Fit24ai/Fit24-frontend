import axios from "axios";
const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const convertPoolToNumber = (pool:string)=>{
    if(pool === 'A'){
        return 1
    }else if(pool === 'B'){
        return 2
    }else if(pool === 'C'){
        return 3
    }
}

export const getAPR = async(pool:string)=>{
    const plan = convertPoolToNumber(pool);
    const res = await http.get(`/randomiser/getAPR?selectedPlan=${plan}`)
    return {apr:res.data.APR}
}