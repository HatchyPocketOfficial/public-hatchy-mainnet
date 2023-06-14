import { BigNumber, Contract } from "ethers";
import { useState } from "react";

export default function useSellToken(
	contract: Contract | null,
) {
	const [loadingSell, setLoadingSell] = useState(false);

	const sellToken = async (
		price: number,
		tokenId: number,
		onConfirm: () => void = () => { }
	) => {
		if (price == 0) {
			alert('Price cannot be 0')
			return
		}

		if (contract == null) return;

		setLoadingSell(true)
		try {
			//let price$ = BigNumber.from(price)
			//const pow = 18;
			let price$ = BigNumber.from(price*100);
			const pow = 16;
			price$ = price$.mul(BigNumber.from("10").pow(pow))
			const tx = await contract.setTokenPrice(tokenId, price$)
			//setBusyText("Listing Hatchy on marketplace.")
			const receipt = await tx.wait()

			if (receipt.confirmations >= 1) {
				setLoadingSell(false)
				onConfirm();
				//router.push("/wallet").then(() => location.reload())
				//setBusyText("Transaction is completed!")
				return true
			}
		} catch (e) {
			console.log(e);
			setLoadingSell(false)
		}
	}
	return { sellToken, loadingSell }
}
