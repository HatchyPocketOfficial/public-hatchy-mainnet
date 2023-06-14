import { useWeb3React } from '@web3-react/core';

import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { DefaultChainID } from '../../constants'
import { Metadata, SetsInfo } from '../../types'
import { getHatchiesData } from '../../utils/metadataArraysUtils'
import { formatHatchyTokenToString, getBigNumber } from '../../utils/numberFormatterHelper'
import { useGen2StakeContract } from '../useHatchyContract'

export const useGen2StakedUserInfo = (refresh: string, account?: string | null) => {

	const { chainId } = useWeb3React()
	const stakeContract = useGen2StakeContract();
	const gen2Metadata = getHatchiesData(2);
	const [gen2UserSetsInfo, setUserSetsInfo] = useState<SetsInfo>({
		total: 0,
		plant: 0,
		water: 0,
		fire: 0,
		light: 0,
		dark: 0,
	})
	const [gen2UserShinySetsInfo, setUserShinySetsInfo] = useState<SetsInfo>({
		total: 0,
		plant: 0,
		water: 0,
		fire: 0,
		light: 0,
		dark: 0,
		dragons: 0,
		voids: 0
	})
	const [gen2UserWeight, setUserWeight] = useState(getBigNumber('0'))
	const [gen2UserShinyCount, setUserShinyCount] = useState(getBigNumber('0'))
	const [gen2StakedMetadatas, setGen2StakedMetadatas] = useState<Metadata[]>();
	const [totalTokens, setTotalTokens] = useState(0);
	const [shinyTokensQuantity, setShinyTokensQuantity] = useState(0);
	const [commonTokensQuantity, setCommonTokensQuantity] = useState(0);
	const [stakedERC20, setStakedERC20] = useState(getBigNumber('0'));

	const updateHatchyAmounts = (
		walletMetadata: Metadata[],
		id: number,
		newCommon: number,
		newShiny: number
	) => {
		const index = walletMetadata.findIndex((hatchy) => (hatchy.monsterId == id));
		if (index == -1) {
			const hatchy: Metadata = {
				...gen2Metadata[id],
				isShiny: gen2Metadata[id].rarity == 'Common' ? 0 : 1,
				quantity: newCommon + newShiny,
				commonQuantity: newCommon,
				shinyQuantity: newShiny
			}
			walletMetadata.push(hatchy);
		} else {
			const hatchy = walletMetadata[index];
			hatchy.commonQuantity = (hatchy.commonQuantity || 0) + newCommon;
			hatchy.shinyQuantity = (hatchy.shinyQuantity || 0) + newShiny;
			hatchy.quantity = (hatchy.commonQuantity || 0) + (hatchy.shinyQuantity || 0);
		}
	}

	const countStakeTokens = (tokenIds: Array<BigNumber>, amounts: Array<BigNumber>) => {
		const walletMetadata: Metadata[] = [];
		let totalTokensQuantity = 0;
		let totalShinyQuantity = 0;
		let totalCommonQuantity = 0;
		for (let i = 0; i < tokenIds.length; i++) {
			const id = tokenIds[i].toNumber();
			const quantity = amounts[i].toNumber();
			totalTokensQuantity += quantity;
			if (id < 137) { // elemental collection
				totalCommonQuantity += quantity;
				updateHatchyAmounts(walletMetadata, id, quantity, 0);
			} else if (id < 143888) { // elemental shiny
				const idGen2 = (id - 40888) / 1000 + 40;
				totalShinyQuantity += quantity;
				updateHatchyAmounts(walletMetadata, idGen2, 0, quantity);
			} else {
				totalShinyQuantity += quantity;
				updateHatchyAmounts(walletMetadata, id, 0, quantity);
			}
		}
		setTotalTokens(totalTokensQuantity);
		setCommonTokensQuantity(totalCommonQuantity);
		setShinyTokensQuantity(totalShinyQuantity);
		return walletMetadata;
	}

	const fetch = async () => {
		if (stakeContract == null) return;
		if (account) {
			const userStakedNFT: Array<BigNumber[]> = await stakeContract.userStakedNFT(account)
			const tokenIds = userStakedNFT[0];
			const amounts = userStakedNFT[1];
			if (tokenIds.length > 0 && amounts.length > 0) {
				const walletMetadata = countStakeTokens(tokenIds, amounts);
				if (walletMetadata && walletMetadata.length > 0) {
					setGen2StakedMetadatas(walletMetadata);
				} else {
					setGen2StakedMetadatas([])
				}
			} else {
				setGen2StakedMetadatas([])
			}

			const userSetInfo = await stakeContract.userSetInfo(account)
			const formattedSetInfo = {
				total: userSetInfo[0].toNumber(),
				plant: userSetInfo[1].toNumber(),
				water: userSetInfo[2].toNumber(),
				fire: userSetInfo[3].toNumber(),
				light: userSetInfo[4].toNumber(),
				dark: userSetInfo[5].toNumber(),
			}
			setUserSetsInfo(formattedSetInfo)

			const userShinySetInfo = await stakeContract.userShinySetInfo(account)
			const shinySetsInfo = userShinySetInfo[1];
			const formattedShinySetInfo = {
				total: userShinySetInfo[0].toNumber(),
				plant: shinySetsInfo[0].toNumber(),
				water: shinySetsInfo[1].toNumber(),
				fire: shinySetsInfo[2].toNumber(),
				light: shinySetsInfo[3].toNumber(),
				dark: shinySetsInfo[4].toNumber(),
				dragons: shinySetsInfo[5].toNumber(),
				voids: shinySetsInfo[6].toNumber(),
			}
			setUserShinySetsInfo(formattedShinySetInfo)

			const userStakedWeight = await stakeContract.calculateWeight(account)
			setUserWeight(userStakedWeight[0])

			setUserShinyCount(userStakedWeight[1])

			try {
				const stakedERC20Amount = await stakeContract.getStakedTokens(account);
				setStakedERC20(stakedERC20Amount);
			} catch (error) {
				console.log("Cannot get staked $HATCHY");
			}
		}
	}
	useEffect(() => {
		if (stakeContract && chainId === DefaultChainID) {
			fetch()
		}
	}, [account, stakeContract, refresh])

	return {
		gen2UserWeight,
		gen2UserSetsInfo,
		gen2UserShinySetsInfo,
		gen2UserShinyCount,
		gen2StakedMetadatas,
		totalTokens,
		shinyTokensQuantity,
		commonTokensQuantity,
		stakedERC20
	}
}


export default useGen2StakedUserInfo
