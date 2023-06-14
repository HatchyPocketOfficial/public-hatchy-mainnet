import { isAddress } from "@ethersproject/address";
import { Contract } from "ethers";
import { useState } from "react";

export default function useTransferHatchy(
    contract: Contract | null,
    gen2Contract: Contract | null,
    account?: string | null
) {
    const [loadingTransfer, setLoadingTransfer] = useState(false);

    const transferHatchy = async (
        receiverAddress: string,
        tokenId: number,
        onConfirm: () => void = () => { }
    ) => {
        const receiver = receiverAddress?.trim();
        if (!isAddress(receiver) || contract == null || account == null) {
            return;
        }

        if (receiver?.toLowerCase() === account?.toLowerCase()) {
            alert("Cannot transfer to yourself.");
            return;
        }

        setLoadingTransfer(true);
        try {
            const tx = await contract.transferFrom(account, receiver, tokenId);
            const receipt = await tx.wait();
            if (receipt?.confirmations >= 1) {
                setLoadingTransfer(false);
                onConfirm();
                return true;
            }
        } catch (e) {
            console.log(e);
            setLoadingTransfer(false);
        }
    };
    const tranferHatchyGen2 = async (
        receiverAddress: string,
        monsterId: number,
        commonQuantity: number,
        shinyQuantity: number,
        onConfirm: () => void = () => { }
    ) => {
        const receiver = receiverAddress?.trim();
        if (!isAddress(receiver) || gen2Contract == null || account == null) {
            return;
        }
        if (receiver?.toLowerCase() === account?.toLowerCase()) {
            alert("Cannot transfer to yourself.");
            return;
        }
        setLoadingTransfer(true);
        try {
            if (commonQuantity > 0 && shinyQuantity == 0) {
                const tx = await gen2Contract.safeTransferFrom(
                    account,
                    receiver,
                    monsterId,
                    commonQuantity,
                    0x0
                );
                const receipt = await tx.wait();
                if (receipt?.confirmations >= 1) {
                    setLoadingTransfer(false);
                    onConfirm();
                    return true;
                }
            }
            if (shinyQuantity > 0 && commonQuantity == 0) {
                let shinyId = monsterId.toString();
                if (monsterId < 143) shinyId = monsterId.toString() + "888"; //elemental set and dragons
                const tx = await gen2Contract.safeTransferFrom(
                    account,
                    receiver,
                    parseInt(shinyId),
                    shinyQuantity,
                    0x0
                );
                const receipt = await tx.wait();
                if (receipt?.confirmations >= 1) {
                    setLoadingTransfer(false);
                    onConfirm();
                    return true;
                }
            }
            const IdArray = [monsterId, parseInt(monsterId.toString() + "888")];
            const amountArray = [commonQuantity, shinyQuantity];
            const tx = await gen2Contract.safeBatchTransferFrom(
                account,
                receiver,
                IdArray,
                amountArray,
                0x0
            );
            const receipt = await tx.wait();
            if (receipt?.confirmations >= 1) {
                setLoadingTransfer(false);
                onConfirm();
                return true;
            }
        } catch (e) {
            console.log(e);
            setLoadingTransfer(false);
        }
    };

    return { transferHatchy, tranferHatchyGen2, loadingTransfer };
}
