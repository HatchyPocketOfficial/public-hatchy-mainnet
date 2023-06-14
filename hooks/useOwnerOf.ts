import { Contract } from "ethers";
import {useState} from "react";

const fetchOwner = async (
    contract: Contract, 
    callback: (owner: string)=>void, 
    tokenId: number
) => {
    try {
        const owner = await contract.ownerOf(tokenId)
        if (owner) {
            callback(owner)
        }
    } catch (e) {
        console.log(e)
    }
}
export default function useOwnerOf(
    contract: Contract | null, 
    tokenId?: number
) {
    const [owner, setOwner] = useState<string | null>(null)
    if (contract && !owner && tokenId) {
        fetchOwner(contract, setOwner, tokenId)
    }
    return owner
}