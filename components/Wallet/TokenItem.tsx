import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

interface TokenItemProps {
	token?: number
	shiny?: boolean
	element?: string
	staked?: boolean
	selected?: boolean
	selectedForTransfer?: boolean
	onClick?: () => void
}

export default function TokenItem({
	token,
	shiny,
	element="dark",
	staked,
	selected,
	selectedForTransfer,
	onClick
}: TokenItemProps) {
	return (
		<button className={`w-16 h-16 p-1 flex items-center justify-center flex-none border-2 text-xs border-white relative group 
			${shiny?'border-4 border-yellow-dark bg-light text-yellow-dark':`token-${element}`}
			ease-in-out transition-transform
			${selected && 'scale-110 drop-shadow-md'}`} 
			onClick={onClick} >
			<div className="absolute inset-0 w-15 h-15 hidden group-hover:flex hatchy-mini-selector ">
				<div className='relative w-full h-full'>
					<Image src={'/static/effects/select.png'} alt='' layout='fill'/>
				</div>
			</div>
			<div className={`border-2 border-white w-full h-full p-1 font-bold flex items-center justify-center
				${shiny?'border-yellow-dark ':'border-white'}`}>
				#{token}
			</div>
			{staked &&
				<span className='absolute bottom-1 right-3 text-base'>
					s
				</span>
			}
			{selectedForTransfer && 
				<div className='absolute bg-black bg-opacity-40 top-0 left-0 w-full h-full flex items-end justify-end text-white'>
					<Icon icon="carbon:checkmark-filled" width={30} />
				</div>
			}
		</button>
	)
}
