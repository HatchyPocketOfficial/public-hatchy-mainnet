import React, { ReactNode, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Checkbox from '../Checkbox'
import { useWallet } from '../../contexts/WalletContext'
import { useStake } from '../../contexts/StakeContext'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context'

interface DropdownProps {
	children?: ReactNode
	title: string,
	element?: string,
	className?: string,
	maxHeight?: string,
	onSelectAll?: VoidFunction,
	stakeMode?: boolean
}

export default function CollapsableElementSelection({
	children,
	title,
	element,
	className,
	maxHeight,
	onSelectAll,
	stakeMode
}: DropdownProps) {

	const [down, goDown] = useState(false)
	const [hatchiesLength, setHatchiesLength] = useState(0)

	const {
		metadatas,
		gen,
		gen2Metadatas } = useWallet()

	const { stakedMetadatas } = useStake()

	const { gen2StakedMetadatas } = useStakeGen2()

	useEffect(() => {

		let length = 0
		if (gen == 1) {
			if (stakeMode && metadatas)
				length = metadatas.filter(walletHatchy => walletHatchy.element == element).length
			else if (!stakeMode && stakedMetadatas)
				length = stakedMetadatas.filter(stakeHatchy => stakeHatchy.element == element).length
		} else {
			if (stakeMode && gen2Metadatas)
				gen2Metadatas.filter(walletHatchy => walletHatchy.element == element).forEach(hatchie => {
					if (hatchie.quantity) length += hatchie.quantity
				})
			else if (!stakeMode && gen2StakedMetadatas)
				gen2StakedMetadatas.filter(walletHatchy => walletHatchy.element == element).forEach(hatchie => {
					if (hatchie.quantity) length += hatchie.quantity
				})
		}
		setHatchiesLength(length)

	}, [stakeMode, metadatas, stakedMetadatas, gen, gen2Metadatas, gen2StakedMetadatas, element])

	return (
		<div className={className + " select-none w-full text-left text-white border border-gray-dark2"}>
			<div className="bg-gray-dark2 bg-opacity-60 w-full p-2 flex justify-between items-center hover:cursor-pointer"
				onClick={() => goDown(!down)}
			>
				<div className='flex flex-row items-center'>
					<div className={`bg-${element?.toLowerCase()} w-5 h-5 mr-3 border-2 border-white`} />
					<h1 className='font-bold'>
						{title}
					</h1>
					<h1 className='font-bold pl-3'>
						X {hatchiesLength}
					</h1>
				</div>
				<div className='flex flex-row space-x-3 items-center'>
					{onSelectAll &&
						<span className='underline'
							onClick={onSelectAll}
						>Select set</span>
					}
					<div>
						{down ?
							<Icon icon="fe:drop-up" width={25} />
							:
							<Icon icon="fe:drop-down" width={25} />
						}
					</div>
				</div>
			</div>
			<div className={`overflow-y-auto transition-max-height
				${down ? (maxHeight || 'max-h-[100rem]') : 'max-h-0'} duration-300 ease-in-out `}>
				{children}
			</div>
		</div>
	)
}
