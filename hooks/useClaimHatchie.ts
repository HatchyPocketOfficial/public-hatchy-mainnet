import { BigNumber, Contract } from "ethers";
import { useState } from "react";
import { sleep } from "../utils/contracts";

export default function useClaimHatchie(
    contract: Contract | null
) {
    const [loadingClaim, setLoadingClaim] = useState(false);

    const claimHatchie =async (
        amount: number,
        onConfirm: ()=>void = ()=>{}
    ) => {
        if(contract == null) return;

        try {
            setLoadingClaim(true)
            const price = await contract.calculatePrice()
            if(!price) return;
            const total = price.mul(BigNumber.from(amount));
            console.log(total.toString());
            
            const tx = await contract.claimHatchie(amount, {value: total.toString()});
            const receipt = await tx.wait()
            await sleep(1000);
            if (receipt?.confirmations > 0) {
                setLoadingClaim(false)
                onConfirm()
            }
        } catch (e) {
            console.log(e);
            if(e instanceof Error) console.log(e.message)
            setLoadingClaim(false)
        } finally{
            //if(loadingClaim) setLoadingClaim(false)
        }
    } 
    return {claimHatchie, loadingClaim};
}