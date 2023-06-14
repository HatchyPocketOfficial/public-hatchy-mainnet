import React, { useEffect, useState } from 'react'
import { COMMON_STAKE_MULTIPLIER, COMPLETE_SET_STAKE_MULTIPLIER, COMPLETE_SHINY_SET_STAKE_MULTIPLIER, SHINY_STAKE_MULTIPLIER } from '../../constants';
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import { useWallet } from '../../contexts/WalletContext';
import { ElementLower, Metadata, StakeMetadata } from '../../types';
import { countHatchies, getHatchiesDataArray, isShinyHatchy} from '../../utils/metadataArraysUtils';
import HatchyIconFramed from './HatchyIconFramed';

interface ElementalStakeInfo {
	hatchies: StakeMetadata[] | Metadata[] | undefined
	element: string
	completeSetAmount?: number
	completeShinySetAmount?: number
	showHatchyIcons?: boolean
}

export default function ElementalStakeInfo({
		hatchies,
		element,
		completeSetAmount,
		completeShinySetAmount,
		showHatchyIcons=true,
	}: ElementalStakeInfo) {
	const [shinys, setShinys] = useState(0)
	const [commons, setCommons] = useState(0)
	const [commonCollections, setCommonCollections] = useState(0)
	const [shinyCollections, setShinyCollections] = useState(0)
	const { gen } = useWallet();
	const {gen2StakedMetadatas} = useStakeGen2();

	useEffect(() => {
		if (hatchies) {
			const [commonCollections, shinyCollections, shinyCount, commonCount] = countHatchies(hatchies, element.toLowerCase() as ElementLower, gen)
			
			setCommonCollections(completeSetAmount || commonCollections)
			setShinyCollections(completeShinySetAmount || shinyCollections)
			setCommons(commonCount)
			setShinys(shinyCount)
		}
	}, [hatchies])

	const getTotal = () => commons * COMMON_STAKE_MULTIPLIER +
		shinys * SHINY_STAKE_MULTIPLIER +
		COMPLETE_SET_STAKE_MULTIPLIER * commonCollections +
		 COMPLETE_SHINY_SET_STAKE_MULTIPLIER * shinyCollections;

	const isStaked = (monsterId: number, array?: StakeMetadata[] | null, gen2StakedMetadatas?: Metadata[] | null) => {
		if (gen == 1) {
			if (array == null) return false;
			const found = array.find(hatchy => hatchy.id === monsterId);
			return found ? true : false;
		}
		else {
			if (gen2StakedMetadatas == null) return false;
			const found = gen2StakedMetadatas.find(hatchy => hatchy.monsterId === monsterId);
			return found ? true : false;
		}
	}
	
	const matchFilter = (hatchy:Metadata)=>{
		if (gen==2) {
			if (element=='Dragon') {
				return hatchy.monsterId>=137 && hatchy.monsterId<=142;
			}
			if (element=='Void') {
				return hatchy.element == element && hatchy.monsterId!=142;
			}
		}
		return hatchy.element == element && hatchy.monsterId<137;
	}

	return (
		<div className={`flex flex-row justify-between card-frame frame-${element?.toLowerCase()} p-3 my-3`}>
			{showHatchyIcons &&
				<div className='flex flex-wrap w-full'>
					{getHatchiesDataArray(gen).filter(hatchy => matchFilter(hatchy)).map((hatchy, id) => (
						<HatchyIconFramed hatchy={hatchy} key={hatchy.monsterId} owned={isStaked(hatchy.monsterId, hatchies as StakeMetadata[], gen2StakedMetadatas)} />
					))}
				</div>
			}
			<div className='bg-gray-dark text-sm px-2 py-2 my-2 w-full self-start'>
				<div className='flex flex-col'>
					<div className='flex flex-row justify-between py-1'>
						<span>Common x{commons}</span>
						<span>{commons * COMMON_STAKE_MULTIPLIER}</span>
					</div>
					<div className='flex flex-row justify-between py-1'>
						<span>Shiny x{shinys}</span>
						<span>{shinys * SHINY_STAKE_MULTIPLIER}</span>
					</div>
				</div>

				{commonCollections>0 &&
					<div className='flex flex-row justify-between py-1'>
						<span className='mr-1'>Complete Elemental Set x{commonCollections}</span>
						<span>{commonCollections * COMPLETE_SET_STAKE_MULTIPLIER}</span>
					</div>
				}
				{shinyCollections>0 &&
					<div className='flex flex-row justify-between py-1'>
						<span className='mr-1'>Complete Shiny Elemental Set x{shinyCollections}</span>
						<span>{shinyCollections * COMPLETE_SHINY_SET_STAKE_MULTIPLIER}</span>
					</div>
				}
				<div className='flex h-1 border-dashed border-t border-white w-full' />
				<div className='mt-2 flex flex-row justify-between font-bold'>
					<span>Total</span>
					<span>{getTotal()}</span>
				</div>
			</div>
		</div>
	)
}
