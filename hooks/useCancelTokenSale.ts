import { Contract } from "ethers";
import { useState } from "react";

export default function useCancelTokenSale(
	contract: Contract | null,
) {
	const [loadingCancelTokenSale, setLoadingCancelTokenSale] = useState(false);

	const cancelTokenSale = async (
		tokenId: number,
		onConfirm: () => void = () => { }
	) => {
		if (contract == null) return;
		setLoadingCancelTokenSale(true)
		try {
			const tx = await contract.cancelTokenSale(tokenId)
			const receipt = await tx.wait()

			if (receipt.confirmations >= 1) {
				setLoadingCancelTokenSale(false)
				onConfirm();
				return true
			}
		} catch (e) {
			console.log(e);
			setLoadingCancelTokenSale(false)
		}
	}
	return { cancelTokenSale, loadingCancelTokenSale }
}