import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import { HatchyStats, Metadata } from '../../types'
import Tooltip from '../Tooltip';

interface HatchyIconStakePreviewProps {
	hatchy: Metadata
	hatchyStats?: HatchyStats
	className?: string
	inStaking?: number
	total?: number
	gen: number
	owned?: boolean
	stats?: {
		inStake: number
		inWallet: number
		total: number
		owned: boolean
	}
	hideTooltip?: boolean
}

export default function HatchyIconStakePreview({ hatchy, hatchyStats, gen, className, stats, hideTooltip }: HatchyIconStakePreviewProps) {
	const { metadatas } = useWallet();
	const [isClicked, setIsClicked] = useState(false)
	const [statsAux, setStatsAux] = useState(0)


	useEffect(() => {
		setIsClicked(false)
	}, [hatchyStats])


	/*Display checkmark, close or default state */
	function renderStakingQuantity() {
		if (!hatchyStats) return <></>
		return <div className='absolute bg-black bottom-0 right-0 h-6 border-2 border-black'>
			{gen == 1 ?
				<div className={`border-2 border-double px-1 h-full flex items-center text-sm justify-center font-bold
				${hatchyStats.stakedCount > 0 ? 'border-yellow text-yellow' : 'border-green text-green'} `}>
					{hatchyStats.stakedCount}/{hatchyStats.count}
				</div>
				:
				<div className={`border-2 border-double px-1 h-full flex items-center text-sm justify-center font-bold
					${hatchyStats.stakedCount > 0 ? 'border-yellow text-yellow' : 'border-green text-green'} `}>
					{hatchyStats.stakedCount > 0 ?
						<span>{hatchyStats.stakedCount}/{hatchyStats.count} </span>
						:
						<span>{statsAux}/{hatchyStats.count}</span>
					}
				</div>
			}
		</div>

	}

	const content = (
		<button className={`group relative w-16 h-16 flex m-1 ${className} `}
			disabled={hatchyStats == null || hatchyStats.stakedCount > 0}>
			{
				isClicked && gen == 1 &&
				<div className='absolute z-10 bg-black bg-opacity-40 top-0 m-1 w-14 h-14 flex items-center text-xs justify-center'>
					<Icon icon="carbon:checkmark-filled" width={40} />
				</div>
			}
			<div className={`absolute inset-0 w-16 hidden hatchy-mini-selector ${hatchyStats ? 'group-hover:flex' : ''}`}>
				<div className='relative w-full h-full'>
					<Image src={"/static/effects/select.png"} alt='' layout='fill' />
				</div>
			</div>
			{hatchyStats ?
				<div className='m-auto '>
					<div className={`pixelate w-16 h-16 relative `} >
						<Image
							src={`/static/hatchy-icons/gen${gen}/default/${hatchy.element}/${hatchy.name}.png`}
							alt={hatchy.name} layout='fill' unoptimized />
					</div>
					{renderStakingQuantity()}
				</div>
				:
				<div className={`m-auto ${gen === 1 && 'card-frame-icon before:bg-white'}`}>
					<div className={`pixelate w-16 h-16 relative  ${gen === 1 && 'border-white border-2'} `} >
						<Image
							src={`/static/hatchy-icons/gen${gen}/grayscale/${hatchy.element}/${hatchy.name}.png`}
							alt={hatchy.name} layout='fill' unoptimized />
					</div>
					{renderStakingQuantity()}
				</div>
			}
		</button>
	)
	if (hideTooltip) {
		return content;
	} else {
		return (
			<Tooltip text={`${hatchy.name} - #${hatchy.monsterId}`}
				place={hatchy.element == 'Dark' ? 'right' : hatchy.element == 'Light' ? 'left' : 'top'}
			>
				{content}
			</Tooltip>
		)
	}
}
