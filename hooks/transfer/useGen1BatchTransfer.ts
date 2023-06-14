import { isAddress } from "@ethersproject/address";
import { useEffect, useState } from "react";
import { useActiveWeb3React } from "..";
import { DefaultChainID } from "../../constants";
import { getBatchTransferAddress, getHatchyNFTAddress } from "../../utils/addressHelpers";
import { approveBatchTransfer, getBatchTransferContract } from "../../utils/contracts";
import { displayError, displayWarn } from "../../utils/ErrorMessage";
import { useHatchyNFTContract } from "../useHatchyContract";

export default function useGen1BatchTransfer() {
	const [loadingApproval, setLoadingApproval] = useState(false);
	const [isApproved, setIsApproved] = useState(false);
	const {provider, account, chainId} = useActiveWeb3React();
	const [loadingTransfer, setLoadingTransfer] = useState(false);
	const hatchyContract = useHatchyNFTContract(false);

	const fetchApproval = async ()=>{
		if (hatchyContract) {
			setLoadingApproval(true);
			const fetch = async () => {
				const allowed = await hatchyContract.isApprovedForAll(account, getBatchTransferAddress());
				setIsApproved(allowed);
				setLoadingApproval(false);
			}
			if (account && chainId === DefaultChainID ) {
				fetch()
			}
		}
	}

  const approve = async () => {
      try {
          if (!account || !provider) return;
          await approveBatchTransfer(account, provider.getSigner());
					await fetchApproval();
      } catch (error) {
        console.log(error);
        displayError("Approve error!");
      }
  };

	const batchTransfer = async (
		receiverAddress: string,
		tokenIds: number[],
		safeMode: boolean
	) => {
    if (!account || !provider) {
        displayWarn("Connect your wallet!");
        return;
    }
		const receiver = receiverAddress?.trim()
		const batchTransferContract = getBatchTransferContract(provider.getSigner());
		if (!isAddress(receiver) || batchTransferContract == null) {
			return
		}

		if (receiver?.toLowerCase() === account?.toLowerCase()) {
			displayWarn('Cannot transfer to yourself.')
			return
		}

		setLoadingTransfer(true)
		const gen1Address = getHatchyNFTAddress();
		const receiverAddresses = new Array(tokenIds.length).fill(receiver);
		try {
			let tx;
			console.log({gen1Address, receiverAddresses, tokenIds, gasLimit: 300000});
			const tokenIdsStrings = tokenIds.map(token=>token.toString());
			if (safeMode) {
				tx = await batchTransferContract.batchSafeTransfer(gen1Address, receiverAddresses, tokenIdsStrings, {gasLimit: 3000000});
			} else {
				tx = await batchTransferContract.batchTransfer(gen1Address, receiverAddresses, tokenIdsStrings, {gasLimit: 3000000});
			}
			const receipt = await tx.wait()
			if (receipt?.confirmations >= 1) {
				setLoadingTransfer(false)
				return true;
			}
		} catch (e: any) {
			console.log(e);
			setLoadingTransfer(false)
			throw new Error(e.message);
		}
	}

	useEffect(() => {
		fetchApproval();
	}, [account])
	
	return {
		batchTransfer,
		loadingTransfer,
		approve,
		isApproved,
		loadingApproval
	}
}