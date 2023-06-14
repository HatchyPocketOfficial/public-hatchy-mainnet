import React, { useState } from 'react';
import { ELEMENTS } from '../../constants';
import { useStakeTokens } from '../../contexts/StakeTokensContext';
import { useWallet } from '../../contexts/WalletContext';
import { Element, Metadata } from '../../types';
import { getDragonData, getHatchiesDataArray } from '../../utils/metadataArraysUtils';
import HatchyIcon from '../HatchyIcon';
import HatchyIconStakePreview from '../Staking/HatchyIconStakePreview';
import HatchySearchBar from '../Utility/HatchySearchBar';

interface CollectionGridWalletProps {
	setSelectedHatchyID: (id: number) => void
	//showShinyCollection?: boolean
	selectedMonsterID?: number
	rowClassName?: string
	ownedHatchies?: any
	stakingView?: boolean
	setShowEditDetail?: (value: string) => void
	onClickStakingHatchy?: (ids: number[]) => void
}

export default function CollectionGridWallet({
	setSelectedHatchyID,
	selectedMonsterID,
	ownedHatchies,
	rowClassName,
	stakingView,
	setShowEditDetail = () => { }
}: CollectionGridWalletProps) {
	const [searchValue, setSearchValue] = useState('');
	const { gen } = useWallet();
	const hatchiesData = getHatchiesDataArray(gen);
	const {
	} = useStakeTokens();
	
	const onSearchChange = (value: string) => {
		setSearchValue(value);
	}

	const renderHatchyIcon = (hatchy: Metadata, hideTooltip=false) => {
		if (ownedHatchies && ownedHatchies[hatchy.monsterId] != null) {
			if (stakingView) return (
				<HatchyIconStakePreview hatchy={hatchy} gen={gen} key={hatchy.monsterId}
					// onClick={addStakeTokens}
					hatchyStats={ownedHatchies[hatchy.monsterId]} />
			)
			return (
				<HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
					showShinyCollection={ownedHatchies[hatchy.monsterId].shiny} showCount
					count={ownedHatchies[hatchy.monsterId].count} showFrame={hatchy.monsterId == selectedMonsterID}
					shinyCount={ownedHatchies[hatchy.monsterId].shinyCount} key={hatchy.monsterId} colored
					hideTooltip={hideTooltip}/>
			)
		} else {
			if (stakingView) return (
				<HatchyIconStakePreview hatchy={hatchy} gen={gen} key={hatchy.monsterId}
				/>
			)
			return (
				<HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
					key={hatchy.monsterId} colored={false} showFrame={hatchy.monsterId == selectedMonsterID}
					hideTooltip={hideTooltip}/>
			)
		}
	}

	const renderDragon = (element: string) => {
		if (gen < 2) return <></>
		const hatchy = getDragonData(gen, element as Element);

		return (
			<HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
				key={hatchy.monsterId} showFrame={hatchy.monsterId == selectedMonsterID}
				colored={ownedHatchies && (ownedHatchies[hatchy.monsterId] != null ||
					ownedHatchies[hatchy.monsterId + '888'] != null)} />
		)
	}

	const renderCommonHatchies = (element: string) => {
		return hatchiesData.filter(hatchy => hatchy.element === element && (gen == 1 || hatchy.rarity == 'Common'))
			.map((metadata)=>renderHatchyIcon(metadata));
	}
	
	const renderSearchResults = () => {
		const searchResult = hatchiesData.filter(hatchy =>
			hatchy.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			hatchy.monsterId.toString().includes(searchValue.toLowerCase()) ||
			searchValue.split(' ').some(id => hatchy.monsterId== parseInt(id)) ||
			searchValue.split(', ').some(id => hatchy.monsterId== parseInt(id))
		);
		if (searchResult.length>0 && searchValue!='') {
			return (
				<div className="flex flex-col justify-center items-center mt-2">
					<div className='flex flex-row w-auto max-w-[18rem]
					overflow-x-auto overflow-y-hidden p-1 border-b
					md:max-w-lg'>
						{
							// 40 41 74 82 85 109 115 118 119 122 132 135
							searchResult.map(( metadata)=>(
								<div className='flex flex-col items-center min-w-[4.5rem] max-w-[4.5rem]' key={metadata.name}>
									<span className='bg-gray-dark2 text-white px-2 rounded-md text-xs'>
										{metadata.name}
									</span>
									{renderHatchyIcon(metadata, true)}
								</div>
							))
						}
					</div>
				</div>
			)	
		}
		return <></>
	}

	return (
		<div className="w-full pb-5 pt-2 overflow-x-clip">
			<HatchySearchBar value={searchValue} onChange={onSearchChange} gen={gen} />
			{renderSearchResults()}
			<div className="flex flex-row justify-center mb-5 mt-5">
				{renderDragon('Void')}
			</div>
			<div className={`flex flex-row justify-center w-full max-w-7xl m-auto ${rowClassName}`}>
				{ELEMENTS.map((element, i) => {
					const elementLowerCase = element.toLowerCase();
					const pos = i < 2 ? 'end' :
						i > 2 ? 'start' : 'center';
					return (
						<div className='flex flex-col justify-start items-center w-full space-y-5' key={element}>
							{renderDragon(element)}
							<div className={`flex flex-wrap self-start justify-${pos} w-full`}>
								{renderCommonHatchies(element)}
							</div>
						</div>
					)
				})}
			</div>
			<div className={`grid ${gen == 2 ? 'grid-cols-6' : 'grid-cols-1'} mt-5 `}>
				<div className='w-full' />
				{
					hatchiesData.filter(hatchy => (hatchy.element === 'Void' && hatchy.monsterId != 142)).map((hatchy) => {
						return (
							<div key={hatchy.monsterId}
								className='flex justify-center w-full'>
								{renderHatchyIcon(hatchy)}
							</div>
						)
					})
				}
				<div className='w-full' />
			</div>
		</div>
	);
}
