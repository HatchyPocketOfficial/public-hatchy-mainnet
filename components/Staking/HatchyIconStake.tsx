import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { MouseEventHandler } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import { Metadata, StakeMetadata } from '../../types'
import { isShinyHatchy } from '../../utils/metadataArraysUtils';

interface HatchyIconStakeProps{
	hatchy: StakeMetadata | Metadata
	className?: string
	staked: boolean
	action?: string
	onClick: MouseEventHandler
}

/*Actually it is receiving the staked and action properties directly from the hatchy object but this could be separated in another two props */
export default function HatchyIconStake({ hatchy, className, staked, action='none', onClick }:HatchyIconStakeProps) {
	const {gen} = useWallet();
	/*Display checkmark, close or default state */
	function renderState() {
		if (action==='none') {
			if (staked)
				return <div className='absolute bg-black bg-opacity-40 top-0 m-1 w-14 h-14 flex items-center text-xs justify-center'>STAKED</div>
			return <></>
		}
		if (action==='unstake') {
			return <div className='absolute bg-black bg-opacity-40 top-0 m-1 w-14 h-14 flex items-center text-xs justify-center'>
						<Icon icon="carbon:close-filled" width={40}/>
					</div>
		}
		if (action==='stake') {
			return <div className='absolute bg-black bg-opacity-40 top-0 m-1 w-14 h-14 flex items-center text-xs justify-center'>
						<Icon icon="carbon:checkmark-filled" width={40}/>
					</div>
		}
	}

	return (
		<button className={`group relative w-16 h-16 flex m-1 ${className} `} onClick={onClick}>
			<div className="absolute top-1 left-1 w-14 h-14 hidden group-hover:flex hatchy-mini-selector">
				<div className='relative w-full h-full'>
					<Image src={"/static/effects/select.png"} alt='' layout='fill'/>
				</div>
			</div>
			<div className='m-auto relative'>
				{isShinyHatchy(hatchy)?
					<>
						<div className={`hatchy-image pixelate ${gen==1 && 'border-4 border-yellow'} w-16 h-16 relative`} >
							<Image 
							src={`/static/hatchy-icons/gen${gen}/shiny/${hatchy.element}/${hatchy.name}.png`}
							alt={hatchy.name} layout='fill' unoptimized/>
							<Image src={`/static/effects/stardust.gif`} alt='' width={100} height={100} />
						</div>
					</>
				:
					<div className="hatchy-image pixelate w-16 h-16 relative" >
						<Image 
						src={`/static/hatchy-icons/gen${gen}/default/${hatchy.element}/${hatchy.name}.png`}
						alt={hatchy.name} layout='fill' unoptimized/>
					</div>
				}
				{renderState()}
			</div>
		</button>
	)
}
