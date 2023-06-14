import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { Icon } from '@iconify/react';
import SingleHatchyEditCollection from './SingleHatchyEditCollection';
import Checkbox from '../Checkbox';
import { useWallet } from '../../contexts/WalletContext';
import { ElementLower, Hatchy, StakeMetadata, Metadata } from '../../types';
import { useStake } from '../../contexts/StakeContext';
import { getHatchiesDataArray } from '../../utils/metadataArraysUtils';
import { ELEMENTS } from '../../constants';
import { useStakeTokens } from '../../contexts/StakeTokensContext';
import CollapsableElementSelection from '../Transfer/CollapsableElementSelection';
import GenSelector from '../Utility/GenSelector';

interface StakingEditDetailProps {
	setShowEditDetail: (value: string) => void
	showEditDetail: string,
}
export default function StakingEditDetail({
	showEditDetail,
	setShowEditDetail
}: StakingEditDetailProps) {

	/*Staked Hatchies filtered by element */
	const [stakedHatchiesGen1, setStakedHatchiesGen1] = useState({});
	const { metadatas, gen } = useWallet();
	const [selectAllElement, setSelectAllElement] = useState(false);
	const [selectedElement, setSelectedElement] = useState('')
	const [stakeMode, setStakeMode] = useState(true);

	const stakedHatchies: any = stakedHatchiesGen1

	const {
		handleStakeAndUnstake,
		stakeTokens,
		setStakeTokens,
		unstakeTokens,
		setUnstakeTokens,
		cancelAll
	} = useStakeTokens();

	/*Sort Filter */
	const [sortFilter, setSortFilter] = useState(false)

	/*Stake NFT Info */
	const {
		stakedMetadatas,
		hadaapproved,
		approve,
		isProcessing
	} = useStake();

	useEffect(() => {
		let plant: Metadata[] = [];
		let water: Metadata[] = [];
		let fire: Metadata[] = [];
		let dark: Metadata[] = [];
		let light: Metadata[] = [];
		let first: Metadata[] = [];
		const stakedHatchiesAux = { plant, water, fire, dark, light }
		if (stakedMetadatas && stakedMetadatas.length > 0) {
			for (let i = 0; i < stakedMetadatas.length; i++) {
				const item = stakedMetadatas[i];
				if (item.element === "Plant") {
					plant.push(item);
				} else if (item.element === 'Water') {
					water.push(item);
				} else if (item.element === 'Fire') {
					fire.push(item);
				} else if (item.element === 'Dark') {
					dark.push(item);
				} else if (item.element === 'Light') {
					light.push(item);
				} else {
					first.push(item)
				}
			}
			setStakedHatchiesGen1(stakedHatchiesAux)
		}
		setSelectAllElement(false);
	}, [stakedMetadatas, showEditDetail])

	useEffect(() => {
		setSelectAllElement(false)
		setStakeTokens([])
		setUnstakeTokens([])
	}, [stakeMode])

	function clearPage() {
		cancelAll();
		setShowEditDetail("");
	}

	function selectAllHatchies(element: string) {
		if (selectAllElement) {
			if (stakeMode) setStakeTokens([]);
			else setUnstakeTokens([])
			setSelectAllElement(false);
			setSelectedElement('')
		} else {
			setSelectAllElement(true);
			setSelectedElement(element)
			let elementTokens: Metadata[] | undefined = []
			let newStakeTokens: string[] | undefined = []
			if (stakeMode) elementTokens = metadatas?.filter(hatchy => hatchy.element.toLowerCase() === element)
			else elementTokens = stakedHatchies[element]
			if (elementTokens) {
				if (elementTokens.length <= 20) newStakeTokens = elementTokens.map(hatchy => hatchy.tokenId?.toString() || "");
				else newStakeTokens = elementTokens.slice(0, 20).map(hatchy => hatchy.tokenId?.toString() || "");
			}
			if (newStakeTokens) {
				if (stakeMode) setStakeTokens(newStakeTokens);
				else setUnstakeTokens(newStakeTokens)
			}
		}
	}

	const renderSort = (element: string) => {

		let elementHatchies = getHatchiesDataArray(gen).filter(hatchy => hatchy.element.toLowerCase() == element)

		if (sortFilter && elementHatchies) {
			elementHatchies.sort((a: any, b: any) => {
				if (a.name < b.name) return -1
				if (a.name > b.name) return 1
				return 0
			})
		}
		return elementHatchies?.map(hatchy => (
			<SingleHatchyEditCollection
				hatchy={hatchy}
				showStaked={stakeMode}
				key={hatchy.monsterId}
			/>
		))
	}

	const renderElementsSection = () => {
		return (
			<div className='flex flex-col w-full mb-5'>
				{ELEMENTS.concat('Void').map(element => {
					return (
						<CollapsableElementSelection key={element} title={element} element={element}
							stakeMode={stakeMode}
							maxHeight='max-h-[110rem]'>
							<div className={`flex flex-row justify-between items-center bg-gray-dark2 bg-opacity-70 border-b border-white px-3 py-1 mb-3 z-10 sticky top-0`}>
								<div className='flex flex-row items-center space-x-2'>
									<button onClick={() => setSortFilter(!sortFilter)} className={"bg-black bg-opacity-0 hover:bg-opacity-40 "} >
										<Icon icon='ic:baseline-sort' width={30} />
									</button>
									<span>Sort</span>
								</div>
								<div className='flex flex-row items-center space-x-2'>
									<span>Select all</span>
									<Checkbox allSelected={selectAllElement && element.toLowerCase() == selectedElement}
										onClick={() => selectAllHatchies(element.toLowerCase())} />
								</div>
							</div>
							<div>
								{renderSort(element.toLowerCase())}
							</div>
						</CollapsableElementSelection>
					)
				})}
			</div>
		)
	}

	const renderButton = () => {
		if (!hadaapproved) return (
			<Button label={`APPROVE FOR STAKING`} color='yellow' onClick={approve} className='w-full h-full my-5' />
		)
	}

	return (
		<div className={`w-full flex flex-col justify-center items-center relative
		bg-black bg-opacity-10 p-6 text-white card-frame`}>
			<div className='mt-5 -mb-5'>
				<GenSelector />
			</div>
			<div className='flex w-full max-w-4xl justify-start items-center absolute
			text-white text-xl font-bold top-1 left-4'>
				<button
					onClick={clearPage}
					className='flex flex-row items-center text-xl visible
					hover:text-neutral-200 ease-in-out transition-colors'
				>
					<Icon icon="bx:left-arrow-alt" width={40} />
					Back
				</button>
			</div>
			<div className='flex flex-col justify-center  p-3 my-2 w-full '>
				{/* md:flex-row md:space-x-3 md:max-w-md lg:max-w-lg */}
				<div className='flex flex-col min-w-full max-w-md'>
					<div className='flex flex-col my-5 w-full justify-center
			sm:space-x-5 sm:flex-row'>
						<Button label={`Stake`} color={stakeMode ? 'yellow' : 'black'} onClick={() => setStakeMode(true)} />
						<Button label={`Unstake`} color={!stakeMode ? 'yellow' : 'black'} onClick={() => setStakeMode(false)} />
					</div>
					<div className='w-full overflow-y-auto'>
						{renderElementsSection()}
					</div>
					<div className={`flex flex-col space-x-0 justify-center  bg-gray-dark bg-opacity-90 
						md:flex-row md:space-x-5`}>
						{stakeTokens.length > 0 &&
							<span className='text-green py-1'>To stake ({stakeTokens.length}):
								{stakeTokens.map((token, i) => {
									if (i === stakeTokens.length - 1) return ' ' + token;
									return ' ' + token + ',';
								})}
							</span>
						}
						{unstakeTokens.length > 0 &&
							<span className='text-red-400 py-1'>To unstake ({unstakeTokens.length}):
								{unstakeTokens.map((token, i) => {
									if (i === unstakeTokens.length - 1) return ' ' + token;
									return ' ' + token + ',';
								})}
							</span>
						}
					</div>
				</div>
			</div>
			{renderButton()}
			{hadaapproved && stakeTokens.length + unstakeTokens.length > 0 ?
				<div className='flex flex-col w-full space-y-3 my-3 justify-between 
				md:flex-row md:max-w-md md:space-y-0'>
					<Button label={`Cancel`} color='red'
						onClick={() => {
							cancelAll()
							setSelectAllElement(false)
						}
						}
					/>
					<Button label={`Confirm`} color='green' onClick={handleStakeAndUnstake} />
				</div>
				:
				<Button label={`Go back`} color='yellow' onClick={clearPage} />
			}

		</div>
	)
}