import React, { useState, useEffect } from 'react'
import { useStake, } from '../../contexts/StakeContext';
import { useStakeTokens } from '../../contexts/StakeTokensContext';
import { useWallet } from '../../contexts/WalletContext';
import { ElementLower, Hatchy, StakeMetadata, Metadata } from '../../types'
import { countQuantity, getAction } from '../../utils/metadataArraysUtils';
import Checkbox from '../Checkbox'
import HatchyIconStake from './HatchyIconStake'

interface SingleHatchyEditCollectionProps {
	hatchy: Hatchy | null
	showStaked: boolean
}

export default function SingleHatchyEditCollection({
	hatchy,
	showStaked
}: SingleHatchyEditCollectionProps) {
	const { metadatas } = useWallet();
	/*Stake NFT Info */
	const {
		stakedMetadatas,
	} = useStake();

	const {
		setAllSelectedUnstake,
		stakeTokens,
		setStakeTokens,
		addStakeTokens,
		addUnstakeTokens,
		unstakeTokens,
		setUnstakeTokens,
	} = useStakeTokens();

	/*Stack all items that are not staked*/
	const [allSelected, setAllSelected] = useState(false);

	useEffect(() => {
		setAllSelected(false)
	}, [stakedMetadatas, metadatas, showStaked])

	function selectAllHatchies() {
		if (metadatas == null) return;
		if (allSelected) {
			if (showStaked) setStakeTokens([]);
			else setUnstakeTokens([])
			setAllSelected(false);
		} else {
			setAllSelected(true);
			let elementTokens: Metadata[] | undefined = []
			let newStakeTokens: string[] | undefined = []
			if (showStaked) elementTokens = metadatas.filter(walletHatchy => walletHatchy.monsterId == hatchy?.monsterId)
			else elementTokens = stakedMetadatas?.filter(walletHatchy => walletHatchy.monsterId == hatchy?.monsterId)
			if (elementTokens) {
				if (elementTokens.length <= 20) newStakeTokens = elementTokens.map(hatchy => hatchy.tokenId?.toString() || "");
				else newStakeTokens = elementTokens.slice(0, 20).map(hatchy => hatchy.tokenId?.toString() || "");
			}
			if (newStakeTokens) {
				if (showStaked) setStakeTokens(newStakeTokens);
				else setUnstakeTokens(newStakeTokens)
			}
		}
	}

	const onClickHandler = (token: number, unstakeMode = false) => {
		if (unstakeMode) {
			if (token == null) return;
			if (!unstakeTokens.includes(token.toString())) {
				const newUnstakeTokens = [...unstakeTokens];
				newUnstakeTokens.push(token.toString());
				setUnstakeTokens(newUnstakeTokens);
			} else {
				const newStakeTokens = unstakeTokens.filter(value => value !== token.toString());
				setUnstakeTokens(newStakeTokens);
				setAllSelectedUnstake(false);
			}
		} else {
			addStakeTokens([token]);
		}
	}

	function renderList() {
		/*Render Staked Hatchies of one type of monster */
		const hatchiesByElement = stakedMetadatas?.filter(stakedHatchy => stakedHatchy.monsterId == hatchy?.monsterId)
		const hatchiesInWallet = metadatas?.filter(walletHatchy => walletHatchy.monsterId == hatchy?.monsterId)
		return (
			<>
				{!showStaked ?
					hatchiesByElement && hatchiesByElement.length > 0 ?
						hatchiesByElement.map(stakedHatchy => {
							return (
								<HatchyIconStake
									hatchy={stakedHatchy}
									key={stakedHatchy.tokenId}
									staked={true}
									action={getAction(stakedHatchy, true, unstakeTokens)}
									className='flex-none'
									onClick={() => onClickHandler(stakedHatchy.tokenId || stakedHatchy.monsterId, true)}
								/>
							)
						})
						:
						<div className='flex justify-center items-center w-full'>
							<span className='font-bold text-lg'>No hatchies to unstake</span>
						</div>
					:
					hatchiesInWallet && hatchiesInWallet.length > 0 ?
						hatchiesInWallet.map(walletHatchy => {
							if (walletHatchy)
								return (
									<HatchyIconStake
										hatchy={walletHatchy}
										key={walletHatchy.tokenId}
										staked={false}
										action={getAction(walletHatchy, false, stakeTokens)}
										className='flex-none'
										onClick={() => onClickHandler(walletHatchy.tokenId || walletHatchy.monsterId)}
									/>
								)
							return <></>
						})
						:
						<div className='flex justify-center items-center w-full'>
							<span className='font-bold text-lg'>No hatchies to stake</span>
						</div>
				}
			</>
		)
	}

	if (hatchy == null) return <></>;
	//const stakedHatchiesElement = stakedMetadatas;
	//if the user don't have the hatchy staked or in wallet don't render anything
	const hatchyQuantity = countQuantity(hatchy.monsterId, stakedMetadatas as StakeMetadata[], metadatas);
	// if (hatchyQuantity < 1) return <></>	
	return (
		<div className='flex flex-col justify-center px-2'>
			<div className='flex flex-row justify-between items-center  px-0 py-1 border-b border-white'>
				<span className='font-bold'>{hatchy?.name}</span>
				<div className='flex flex-row items-center space-x-2'>
					<span>Select all</span>
					<Checkbox onClick={selectAllHatchies} allSelected={allSelected} />
					{/* <div className='w-5 h-5 bg-white' onClick={handleSelect}></div> */}
				</div>
			</div>
			<div className='flex flex-row overflow-x-auto overflow-y-hidden items-center h-24 w-full py-3 pr3 '>
				{renderList()}
			</div>
		</div>
	)
}
