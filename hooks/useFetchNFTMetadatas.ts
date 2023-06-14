import { useEffect, useState } from "react";
import axios from "axios";
import { Metadata } from "../types";
import { DefaultChainID, METADATA_BASE_URL } from "../constants";
import { BigNumber, Contract, ethers } from "ethers";
import { useActiveWeb3React } from ".";

//let globalMetadatas: Array<Metadata> | null = null;
export default function useFetchNFTMetadatas(
	contract: Contract | null,
	user?: string | null,
	callback?: (metadatas: Array<Metadata>) => void
) {
	const { account, chainId } = useActiveWeb3React()
	const [metadatas, setMetadatas] = useState<Array<Metadata> | null>(null)
	const [tokens, setTokens] = useState<Array<string> | null>(null)
	const [loadingMetadatas, setLoadingMetadatas] = useState(true);

	/**1. Request tokens on blockchain*/
	const fetchBalance = async (contract: Contract | null, user?: string | null) => {
		if (chainId != DefaultChainID || !account || !ethers.utils.isAddress(account)) return;
		if (contract == null || user == null) return;
		try {
			setLoadingMetadatas(true);
			const tokens: Array<BigNumber> = await contract.tokensOfOwner(user)
			if (tokens) {
				const formattedTokens = tokens.map(token => token.toString()).reverse()
				setTokens(formattedTokens)
				//if (formattedTokens && !metadatas && !isSent && formattedTokens.length>0) {
				if (formattedTokens && formattedTokens.length > 0) {
					await fetchMetadata(formattedTokens, setMetadatas)
				} else {
					//} else if(globalMetadatas) {
					//setMetadatas(globalMetadatas)
					setMetadatas([])
				}
			}
		} catch (e) {
			console.log(e)
		} finally {
			setLoadingMetadatas(false);
		}
	}

	/**2. Request Metadata Based on tokens */
	const fetchMetadata = async (
		tokenIds: Array<string>,
		setMetadata: (json: any) => void,
	) => {
		try {
			axios.post(
				`${METADATA_BASE_URL}/api/tokens`, tokenIds,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
				.then((res) => {
					if (res.status === 200) {

						const tokens = res.data;
						setMetadata(tokens);
						/**Finish Loading */
						if (callback) callback(tokens);
						//globalMetadatas = tokens;
					} else {
						setMetadata([]);
					}
				})
		} catch (e) {
			console.log(e)
		} finally {
		}
	}

	/**Refresh Function that can be called after a change like a transaction, buy, staking, unstaking etc */
	const refreshWallet = () => fetchBalance(contract, user);
	useEffect(() => {
		fetchBalance(contract, user)
	}, [contract, user])

	return { loadingMetadatas, metadatas, tokens, refreshWallet }
}
