import { Contract } from "ethers";
import {useState} from "react";

const fetchBalance = async (
    contract: Contract, 
    callback: (balance: number)=>void, 
    user: string
    ) => {
    try {
        const tokens = await contract.balanceOf(user)
        if(tokens) {
            callback(tokens)
        }
    } catch (e) {
        console.log(e)
    }
}

export default function useBalanceOf(contract: Contract | null, user?: string | null) {
    const [bal, setBal] = useState<number | null>(null)
    if(contract && user && !bal) {
        fetchBalance(contract, setBal, user)
    }
    return bal
}