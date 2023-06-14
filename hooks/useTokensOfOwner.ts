import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

export default function useTokensOfOwner(contract: Contract | null, user?: string | null) {
	const [tokens, setTokens] = useState<Array<string>>()
	const [loadingTokens, setLoadingTokens] = useState(true);

	useEffect(() => {
		const fetchBalance = async (contract: Contract, user: string) => {
			try {
				const tokens: Array<BigNumber> = await contract.tokensOfOwner(user)
				if (tokens) {
					const formattedTokens = tokens.map(token => token.toString()).reverse()
					setTokens(formattedTokens)
					setLoadingTokens(false);
				}
			} catch (e) {
				console.log(e)
			}
		}

		if (contract && !tokens && user) {
			fetchBalance(contract, user)
		}

	}, [user, contract]);

	return { loadingTokens, tokens }
}