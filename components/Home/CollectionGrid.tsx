import React from 'react'
import { useWallet } from '../../contexts/WalletContext';
import { Element } from '../../types';
import { getDragonData, getHatchiesData, getHatchiesDataArray } from '../../utils/metadataArraysUtils';
import HatchyIcon from '../HatchyIcon';

const checkIfShiny = (charId: number) => {
	return false;
}

interface CollectionGridProps {
	setSelectedHatchyID: (id: number) => void
	gen?: number
	showShinyCollection?: boolean
	selectedHatchy?: number
	rowClassName?: string
}

export default function CollectionGrid({ setSelectedHatchyID, showShinyCollection, selectedHatchy, rowClassName }: CollectionGridProps) {
	const { gen } = useWallet();
	const hatchiesData = getHatchiesData(gen);

	const renderDragon = (element: string) => {
		if (gen < 2) return <></>
		const hatchy = getDragonData(gen, element as Element);
		return <HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
			key={hatchy.monsterId} showShinyCollection={showShinyCollection}
			showFrame={hatchy.monsterId === selectedHatchy} />
	}

	const renderCommonHatchies = (element: string) => {
		return getHatchiesDataArray(gen).filter(hatchy => hatchy.element === element && (gen == 1 || hatchy.rarity == 'Common')).map((hatchy, id) => {
			return (
				<HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
					key={hatchy.monsterId} showShinyCollection={showShinyCollection}
					showFrame={hatchy.monsterId === selectedHatchy} />
			)
		})
	}

	return (
		<div className="w-full max-w-7xl py-5">
			<div className="flex flex-row justify-center mb-5">
				{renderDragon('Void')}
			</div>
			<div className={`flex flex-row justify-center w-full max-w-7xl ${rowClassName}`}>
				<div className='flex flex-col justify-start items-center w-full space-y-5'>
					{renderDragon('Light')}
					<div className='flex flex-wrap justify-center w-full'>
						{renderCommonHatchies('Light')}
					</div>
				</div>
				<div className='flex flex-col justify-start items-center w-full space-y-5'>
					{renderDragon('Plant')}
					<div className='flex flex-wrap justify-center w-full'>
						{renderCommonHatchies('Plant')}
					</div>
				</div>
				<div className='flex flex-col justify-start items-center w-full space-y-5'>
					{renderDragon('Water')}
					<div className='flex flex-wrap justify-center w-full'>
						{renderCommonHatchies('Water')}
					</div>
				</div>
				<div className='flex flex-col justify-start items-center w-full space-y-5'>
					{renderDragon('Fire')}
					<div className='flex flex-wrap justify-center w-full'>
						{renderCommonHatchies('Fire')}
					</div>
				</div>
				<div className='flex flex-col justify-start items-center w-full space-y-5'>
					{renderDragon('Dark')}
					<div className='flex flex-wrap justify-center w-full'>
						{renderCommonHatchies('Dark')}
					</div>
				</div>
			</div>
			<div className={`grid ${gen == 2 ? 'grid-cols-6' : 'grid-cols-1'} mt-5`}>
				<div className='w-full' />
				{
					getHatchiesDataArray(gen).filter(hatchy => hatchy.element === 'Void' &&
						hatchy.monsterId != 142).map((hatchy, id) => {
							return (
								<div key={hatchy.monsterId}
									className='flex justify-center w-full'>
									<HatchyIcon hatchy={hatchy} gen={gen} setSelectedHatchyID={setSelectedHatchyID}
										key={hatchy.monsterId} showShinyCollection={showShinyCollection}
										showFrame={hatchy.monsterId === selectedHatchy} />
								</div>
							)
						})
				}
				<div className='w-full' />
			</div>
		</div>
	)
}
