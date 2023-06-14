import {isAddress} from "@ethersproject/address";
import {useState} from "react";
import {useActiveWeb3React} from "..";
import ABI from "../../abi";
import { SelectedHatchiesAmount } from "../../types";
import {getHatchyNFTAddress} from "../../utils/addressHelpers";
import {displayWarn} from "../../utils/ErrorMessage";
import useContract from "../useContract";

export default function useGen2BatchTransfer() {
	const gen2Contract = useContract(getHatchyNFTAddress(2), ABI.HatchyPocketGen2, true);
	const {account} = useActiveWeb3React();
	const [loadingTransfer, setLoadingTransfer] = useState(false);

	const getIdsAndAmounts = (amountsData: SelectedHatchiesAmount) => {
		const ids: number[] = [];
		const amounts: number[] = [];
		let count = 0;
		for (const key in amountsData) {
			if (Object.prototype.hasOwnProperty.call(amountsData, key)) {
				const amountData = amountsData[key];
				count += parseInt(amountData.commonAmount);
				count += parseInt(amountData.shinyAmount);
        /*
				if (count > 50) {
					displayWarn("Cannot transfer more than 50 hatchies at once");
					return { ids: null, amounts: null }
				}
        */
				const id = amountData.monsterId;
				const shinyId = (id * 1000) + 888;
				// max quantity available
				const commonQuantity = parseInt(amountData.commonAmount);
				const shinyQuantity = parseInt(amountData.shinyAmount);
				if (id < 137) { // elemental set
					if (commonQuantity > 0) {
						ids.push(id);
						amounts.push(commonQuantity);
					}
					if (shinyQuantity > 0) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else if (id < 143) { // dragons
					if (shinyQuantity > 0) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else { // void
					if (shinyQuantity > 0) {
						ids.push(id);
						amounts.push(shinyQuantity);
					}
				}
			}
		}
		return { ids, amounts }
	}

  const batchTransfer = async (
    receiverAddress: string,
    hatchieTransferData: SelectedHatchiesAmount
  ) => {
    const receiver = receiverAddress.trim();
    if (!isAddress(receiver) || gen2Contract == null || account == null) {
      	displayWarn("Connect your wallet!");
        return;
    }
    if (receiver?.toLowerCase() === account?.toLowerCase()) {
      	displayWarn("Cannot transfer to yourself.");
        return;
    }
    if (!hatchieTransferData) {
      displayWarn("No Hatchy Selected!");
      return;
    }
    setLoadingTransfer(true);
    try {
		  const { ids, amounts } = getIdsAndAmounts(hatchieTransferData);
		  if (ids == null || amounts == null) return;
      
      const tx = await gen2Contract.safeBatchTransferFrom(
          account,
          receiver,
          ids,
          amounts,
          0x0
      );
      const receipt = await tx.wait();
      if (receipt?.confirmations >= 1) {
          setLoadingTransfer(false);
          return true;
      }
    } catch (e: any) {
      console.log(e);
      setLoadingTransfer(false);
			throw new Error(e.message);
    }
  };
	
	return {
		batchTransfer,
		loadingTransfer,
	}
}