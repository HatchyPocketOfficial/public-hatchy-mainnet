import { BigNumber, Contract } from "ethers";
import { useState } from "react";

const fetchTotalSupply = async (
	contract: Contract,
	callback: (token: number) => void
) => {
	try {
		const tokens: BigNumber = await contract.totalSupply()

		if (tokens) {
			callback(tokens.toNumber())
		}
	} catch (e) {
		console.log(e)
	}
}
export default function useSupply(contract: Contract | null) {
	const [tokens, setTokens] = useState<number | null>(null)
	if (contract && !tokens) {
		fetchTotalSupply(contract, setTokens)
	}

	return tokens
}