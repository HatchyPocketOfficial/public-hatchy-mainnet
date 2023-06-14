import { useEffect, useState } from "react";
import { Metadata } from "../../types";
import { BigNumber } from "ethers";
import { getHatchiesData } from "../../utils/metadataArraysUtils";
import { getHatchyPocketGen2Address } from "../../utils/addressHelpers";
import axios from "axios";
import { DefaultChainID } from "../../constants";

export default function useLatestGen2Metadatas() {
	const topic0 = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62';
	const gen2Metadata = getHatchiesData(2);
	const [latestMetadatas, setLatestMetadatas] = useState<Array<Metadata> | null>(null);
	const [loadingMetadatas, setLoadingMetadatas] = useState(true);
	
	const fetchLatest = async () => {
		try {
			setLoadingMetadatas(true);
			const timestamp = Math.floor(Date.now()/1000);
			const blockNumber = (await axios.get(`https://api${DefaultChainID==43113?'-testnet':''}.snowtrace.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`)).data.result;
				
	    const minimumRequired = 10;
	    let step = 1000;
			let walletMetadata: Metadata[] = [];
			let minLimit = blockNumber-step;
			let maxLimit = blockNumber;
			while (DefaultChainID==43114 && (walletMetadata.length<minimumRequired || minLimit<0 || maxLimit<0)) {
				//const urlEvents = `https://api${DefaultChainID==43113?'-testnet':''}.snowtrace.io/api?module=logs&action=getLogs&fromBlock=${minLimit}&toBlock=${maxLimit}&address=${
				const urlEvents = `https://api.snowtrace.io/api?module=logs&action=getLogs&fromBlock=${minLimit}&toBlock=${maxLimit}&address=${
					getHatchyPocketGen2Address()}&topic0=${topic0}`
				await axios.get(urlEvents,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					if (res.status === 200 && res.data.result && res.data.result[0]!=null) {
						const logsArray = res.data.result;
						if (logsArray && logsArray.length>0) {
							logsArray.reverse().forEach((log:any)=>{
								const logData = log.data;
								const dataDivider = 66;
								const idHex = BigNumber.from(logData.substring(0, dataDivider));
								const quantityHex = BigNumber.from('0x'+logData.substring(dataDivider, logData.length+1));
								const quantity = quantityHex.toNumber();
								const idGen2 = idHex.toNumber();
								const staticMetadata = gen2Metadata[idGen2];
								if (quantity>0 && staticMetadata){
									const hatchy: Metadata = {
										...staticMetadata,
										isShiny: gen2Metadata[idGen2].rarity=='Common'?0:1,
										quantity: quantity
									}
									walletMetadata.push(hatchy);
								}
							});
						}
					}
				}).catch(()=>{});
				step+=5000;
				maxLimit=minLimit-1;
				minLimit=maxLimit-step;
			}
			walletMetadata = walletMetadata.splice(0, Math.min(10, walletMetadata.length));
			setLatestMetadatas(walletMetadata);
		} catch (e) {
			console.log(e)
		} finally{
			setLoadingMetadatas(false);
		}
	}

	/**Refresh Function that can be called after a change like a transaction, buy, staking, unstaking etc */
	const refreshLatest = () => fetchLatest();
	useEffect(() => {
		fetchLatest()
	}, [])

	return { loadingMetadatas, latestMetadatas, refreshLatest }
}
