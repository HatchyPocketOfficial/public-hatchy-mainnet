import Router from 'next/router'
import React from 'react'
import ABI from '../abi'
import useContract from '../hooks/useContract'
import useOwnerOf from '../hooks/useOwnerOf'
import { Metadata } from '../types'
import { getHatchyNFTAddress } from '../utils/addressHelpers'
import { shortenHex } from '../utils/numberFormatterHelper'
import HatchyIcon from './HatchyIcon'
import Title from './Title'

interface HatchyCardInfoDetailProps {
	hatchy: Metadata
}
export default function HatchyCardInfoDetail({ hatchy, }: HatchyCardInfoDetailProps) {

	const serial = hatchy.isShiny ? hatchy.serial : (hatchy.serial || 25) - 25;
	//const contract = useContract(HATCHY_CONTRACT, HatchyABI, false)
	const hatchyContract = useContract(getHatchyNFTAddress(), ABI.Hatchy);
	const owner = useOwnerOf(hatchyContract, hatchy.tokenId)
	return (
		<div className=' card-shadow max-w-xs w-full self-start'>
			<div className='flex flex-col justify-center claim-egg border-4 border-white relative'>
				<div className={`flex flex-row p-4 space-x-5 title-${hatchy.element.toLowerCase()} relative`}>
					<HatchyIcon hatchy={hatchy} />
					<Title title={`#${serial}`} className='w-2/3 pt-5 my-1' />
				</div>
				<div className='bg-white text-gray-dark px-6 py-3 flex flex-col relative space-y-2'>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Owner</span>
						{owner ?
							<span className='cursor-pointer text-blue-500 ml-3' onClick={() => Router.push('/address/' + owner)}>{shortenHex(owner, 8)}</span>
							:
							<span>...</span>
						}
					</div>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Egg number</span>
						<span>{hatchy.tokenId}</span>
					</div>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>MonsterId</span>
						<span>{hatchy.monsterId}</span>
					</div>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Element</span>
						<span >{hatchy.element}</span>
					</div>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Shiny</span>
						<span>{hatchy.isShiny ? 'Yes' : 'No'}</span>
					</div>
				</div>
			</div>
		</div>
	)
}


