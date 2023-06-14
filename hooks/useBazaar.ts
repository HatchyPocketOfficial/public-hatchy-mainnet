import { BigNumber, Contract } from "ethers";
import {useState} from "react";

const fetchBazaar = async (
    contract: Contract, 
    tokenId: number,
    setPrice: (price: string)=>void, 
    setOnSale: (onSale: boolean)=>void, 
    ) => {
    try {
        
        const resp = await contract.Bazaar(tokenId)
        if(resp) {
            const token: BigNumber = resp[0];
            const price: BigNumber = resp[1];
            const onSale = resp[2]===1;
            setPrice(price.toString())
            setOnSale(onSale)
        }
    } catch (e) {
        console.log(e)
    }
}

export default function useBazaar(contract: Contract | null, tokenId?: number ) {
    const [price, setPrice] = useState("0");
    const [onSale, setOnSale] = useState(false);
    if(contract && tokenId) {
        fetchBazaar(contract, tokenId, setPrice, setOnSale)
    }
    return {price, onSale}
}