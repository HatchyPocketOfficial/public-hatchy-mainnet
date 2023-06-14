
import { BigNumber, Contract, ethers } from "ethers";
import {useState} from "react";

const fetchPrice = async (contract: Contract, callback: (price:string)=>void) => {
    try {
        const price:BigNumber = await contract.calculatePrice()
        if(price) {
            callback(price.toString())
        }
    } catch (e) {
        console.log(e)
    }
}
export default function useCurrentPrice(contract: Contract | null) {
    const [currentPrice, setCurrentPrice] = useState<string | null>(null)
    if(contract && !currentPrice) {
        fetchPrice(contract, setCurrentPrice)
    }
    return currentPrice
}