import { useEffect, useState } from "react";
import { BasicGen2Metadata, Metadata } from "../../types";
import { BigNumber, Contract, ethers } from "ethers";
import { createRangeArray, getGen2ShinyIds, getHatchiesData } from "../../utils/metadataArraysUtils";
import { useActiveWeb3React } from "..";
import { DefaultChainID } from "../../constants";

export default function useFetchGen2NFTMetadatas(
	contract: Contract | null,
	user?: string | null,
) {
  const { account, chainId } = useActiveWeb3React()
	const gen2Metadata = getHatchiesData(2);
	const [totalTokens, setTotalTokens] = useState(0);
	const [shinyTokensQuantity, setShinyTokensQuantity] = useState(0);
	const [commonTokensQuantity, setCommonTokensQuantity] = useState(0);
	const [metadatas, setMetadatas] = useState<Array<Metadata> | null>(null);
	const [newMetadatas, setNewMetadatas] = useState<Array<Metadata> | null>(null);
	const [loadingMetadatas, setLoadingMetadatas] = useState(true);
	const firstGen2Id = 40;
	const voidIds = [10011001, 10101001, 10100101, 11111111];
	const gen2MonsterIds = createRangeArray(firstGen2Id,137).concat(getGen2ShinyIds()).concat(voidIds);
	const getNewHatchy = (oldMetadatas: Metadata[] | null, hatchy: Metadata)=>{
		let oldMetadata = null;
		if (oldMetadatas) {
			for (let i = 0; i < oldMetadatas.length; i++) {
				// check if hatchy is already owned
				if (oldMetadatas[i].monsterId==hatchy.monsterId){
					oldMetadata = oldMetadatas[i];
					break;
				}
			}
		}
		
		if (oldMetadata!=null) { 
			if (hatchy.quantity && oldMetadata.quantity &&
					hatchy.quantity > oldMetadata.quantity) { // same hatchie but more quantity
				const newHatchy = {...hatchy};
				newHatchy.newQuantity = hatchy.quantity-oldMetadata.quantity;
				if (hatchy.commonQuantity) 
					newHatchy.newCommonQuantity = hatchy.commonQuantity- (oldMetadata.commonQuantity || 0);
				if (hatchy.shinyQuantity) 
					newHatchy.newShinyQuantity = hatchy.shinyQuantity - (oldMetadata.shinyQuantity || 0);
				return newHatchy;
			}
			return false;
		} else { // New hatchie
			const newHatchy = {...hatchy};
			newHatchy.newQuantity = hatchy.quantity;
			newHatchy.newCommonQuantity = hatchy.commonQuantity;
			newHatchy.newShinyQuantity = hatchy.shinyQuantity;
			return newHatchy;
		}
	}

	// shiny and common stats
	const countWalletTokens = (tokensBalance: Array<BigNumber>)=>{
		const walletMetadata: Metadata[] = [];
		let totalTokensQuantity = 0;
		let totalShinyQuantity = 0;
		let totalCommonQuantity = 0;
		const gen2HatchiesQuantity = 136-40+1;
		// common and shiny
		for (let i = 0; i < gen2HatchiesQuantity; i++) {
			const idCommon = i;
			const idShiny = i+gen2HatchiesQuantity;
			const idGen2 = idCommon+40;
			const singleCommonQuantity = tokensBalance[idCommon].toNumber();
			const singleShinyQuantity = tokensBalance[idShiny].toNumber();
			const singleTotalQuantity =singleShinyQuantity+singleCommonQuantity; 
			if (singleTotalQuantity>0) {
				totalTokensQuantity += singleTotalQuantity;	
				totalShinyQuantity += singleShinyQuantity;
				totalCommonQuantity += singleCommonQuantity;
				const hatchy: Metadata = {
					...gen2Metadata[idGen2],
					quantity: singleTotalQuantity,
					commonQuantity: singleCommonQuantity,
					shinyQuantity: singleShinyQuantity
				}
				walletMetadata.push(hatchy);
			}
		};
		// dragons and voids
		for (let i = 194; i < 194+10; i++) {
			const idShiny = i;
			const idGen2 = i<200?idShiny-57:voidIds[idShiny-200];
			const singleShinyQuantity = tokensBalance[idShiny].toNumber();
			if (singleShinyQuantity>0) {
				totalTokensQuantity += singleShinyQuantity;	
				totalShinyQuantity += singleShinyQuantity;
				const hatchy: Metadata = {
					...gen2Metadata[idGen2],
					quantity: singleShinyQuantity,
					commonQuantity: 0,
					shinyQuantity: singleShinyQuantity
				}
				walletMetadata.push(hatchy);
			}
		};
		//console.log('new:',totalTokensQuantity);
		setTotalTokens(totalTokensQuantity);
		setCommonTokensQuantity(totalCommonQuantity);
		setShinyTokensQuantity(totalShinyQuantity);
		return walletMetadata;
	}

	const fetchBalance = async (contract: Contract | null, user?: string | null) => {
		//console.log('old:', totalTokens);
    if (chainId!=DefaultChainID) return;
		if (contract == null || user == null || !ethers.utils.isAddress(user)) return;
		try {
			setLoadingMetadatas(true);
			const tokensBalance: Array<BigNumber> = await contract.accountBalanceBatch(user, gen2MonsterIds);
			
			if (tokensBalance && tokensBalance.length>0) {
				const walletMetadata = countWalletTokens(tokensBalance);
				if (walletMetadata && walletMetadata.length > 0) {
					const newMetadatasAux = [];
					// check new metadatas after last refresh
					for (let i = 0; i < walletMetadata.length; i++) {
						const newHatchy = getNewHatchy(metadatas, walletMetadata[i])
						if(newHatchy!=false){
							newMetadatasAux.push(newHatchy);
						} 	
					}
					if (newMetadatasAux.length>0) {
						//setNewMetadatas(newMetadatasAux);	
					}
					setMetadatas(walletMetadata);
				} else {
					setMetadatas([])
				}
			}
		} catch (e) {
			console.log(e)
		} finally{
			setLoadingMetadatas(false);
		}
	}

	const addNewHatchies = (hatchiesData: BasicGen2Metadata[]) => {
		try {
			setLoadingMetadatas(true);
			if (hatchiesData && hatchiesData.length>0) {
				const newWalletMetadata: {[key: string]: Metadata} = {};
				for (let i = 0; i < hatchiesData.length; i++) {
					let monsterId = hatchiesData[i].monsterId;
					let quantity = hatchiesData[i].quantity;
					//commmon
					if (monsterId>=40 && monsterId<=136) {
						if (newWalletMetadata[monsterId]!=null) {
							if (newWalletMetadata[monsterId].newQuantity)
							newWalletMetadata[monsterId].newQuantity=(newWalletMetadata[monsterId].newQuantity || 0)+quantity;
							newWalletMetadata[monsterId].newCommonQuantity=(newWalletMetadata[monsterId].newCommonQuantity || 0)+quantity;
						} else {
							newWalletMetadata[monsterId] = {
								...gen2Metadata[monsterId],
								newQuantity: quantity,
								newCommonQuantity: quantity
							}
						}						
					} else { //shiny
						if (monsterId>=40888 && monsterId<=142888) {
							monsterId = (monsterId-888)/1000;
						}
						if (newWalletMetadata[monsterId]!=null) {
							newWalletMetadata[monsterId].newQuantity=(newWalletMetadata[monsterId].newQuantity || 0)+quantity;
							newWalletMetadata[monsterId].newShinyQuantity=(newWalletMetadata[monsterId].newShinyQuantity || 0)+quantity;
						} else {
							newWalletMetadata[monsterId] = {
								...gen2Metadata[monsterId],
								newQuantity: quantity,
								newShinyQuantity: quantity
							}
						}
					}
				}
				var newMetadatasAux = Object.keys(newWalletMetadata).map((key) => newWalletMetadata[key]);
				if (newMetadatasAux.length>0) {
					setNewMetadatas(newMetadatasAux);	
				}
			}
		} catch (e) {
			console.log(e)
		} finally{
			setLoadingMetadatas(false);
		}
	}

	/**Refresh Function that can be called after a change like a transaction, buy, staking, unstaking etc */
	const refreshWallet = () => fetchBalance(contract, user);
	useEffect(() => {
		fetchBalance(contract, user)
	}, [user, chainId])


	return {
		loadingMetadatas,
		totalTokens,
		shinyTokensQuantity,
		commonTokensQuantity,
		metadatas,
		newMetadatas,
		refreshWallet,
		addNewHatchies
	}
}
