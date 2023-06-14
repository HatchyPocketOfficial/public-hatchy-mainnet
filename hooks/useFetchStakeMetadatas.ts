import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getSignMessage } from "../utils/contracts";
import { STAKING_BASE_URL } from "../constants";
import { StakeMetadata } from "../types";

let globalMetadatas: Array<StakeMetadata> | null = null;
export default function useFetchStakeMetadatas(tokens?: Array<string> | null) {

	const [metadatas, setMetadatas] = useState<StakeMetadata[]>();
	//const [isSent, setIsSent] = useState(false);
	const { account } = useWeb3React();
	const [prevIds, setPrevIds] = useState<Array<string>>([]);

	useEffect(() => {
		(async () => {
			const json1 = prevIds?.toString()
			const json2 = tokens?.toString()
			if (tokens && account && tokens.length > 0 && prevIds !== tokens && json1 !== json2) {
				await fetchMetadata(tokens, setMetadatas, account);
				setPrevIds(tokens)
			} else if (globalMetadatas || tokens?.length == 0) {
				setMetadatas([]);
			}
		})();
	}, [tokens]);

	return useMemo(() => {
		let plant: StakeMetadata[] = [];
		let water: StakeMetadata[] = [];
		let fire: StakeMetadata[] = [];
		let dark: StakeMetadata[] = [];
		let light: StakeMetadata[] = [];
		let first: StakeMetadata[] = [];
		const stakedHatchies = { plant, water, fire, dark, light }
		if (metadatas && metadatas.length > 0) {
			for (let i = 0; i < metadatas.length; i++) {
				const item = metadatas[i];
				if (item.elementId === 1) {
					plant.push(item);
				} else if (item.elementId === 2) {
					water.push(item);
				} else if (item.elementId === 3) {
					fire.push(item);
				} else if (item.elementId === 4) {
					dark.push(item);
				} else if (item.elementId === 5) {
					light.push(item);
				} else {
					first.push(item)
				}
			}
		}
		return stakedHatchies
	}, [metadatas]);
}

const fetchMetadata = async (
	tokenIds: Array<string>,
	setMetadata: (metadata: Array<StakeMetadata>) => void,
	//setIsSent: (isSent:boolean)=>void, 
	account: string
) => {
	try {
		//setIsSent(true);
		const curTimeStamp = +new Date();
		const signMessage = getSignMessage(String(curTimeStamp), account);
		const rawSig = signMessage;

		axios.post(
			`${STAKING_BASE_URL}/api/hatchy/tokens`,
			{
				curTimeStamp: String(curTimeStamp),
				account,
				rawSig,
				tokenIds,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
			.then((res) => {
				if (res.status === 200) {
					const tokens = res.data.tokens;
					setMetadata(tokens);
					globalMetadatas = tokens;
				} else {
					setMetadata([]);
					//setIsSent(false);
				}
			})
			.catch(e => {
				console.log(e.toJSON());
				//setIsSent(false);
			});
	} catch (e) {
		console.log(e);
		//setIsSent(false);
	}
};
