import { Contract } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";

export default function useBuyToken(
	contract: Contract | null
) {
	const [loadingBuy, setLoadingBuy] = useState(false);
	const router = useRouter();

	const buyToken = async (
		tokenId: string,
		price: string,
		onConfirm: () => void = () => { }) => {

		if (contract == null) return;

		try {
			setLoadingBuy(true)
			const tx = await contract.buy(tokenId, { value: price })
			const receipt = await tx.wait()
			if (receipt.confirmations >= 1) {
				setLoadingBuy(false)
				onConfirm();
				//router.push("/wallet").then(() => location.reload())
				return true
			}
		} catch (e) {
			console.log(e)
			setLoadingBuy(false)
		}
	}
	return { buyToken, loadingBuy }
}

