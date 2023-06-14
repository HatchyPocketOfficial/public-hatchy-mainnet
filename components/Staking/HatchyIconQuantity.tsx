import Image from 'next/image';
import React from 'react'
import { useWallet } from '../../contexts/WalletContext';
import { Hatchy } from '../../types'

interface HatchyIconQuantityProps {
	hatchy: Hatchy
	className?: string
	quantity?: number
}

export default function HatchyIconQuantity({ hatchy, className, quantity = 0 }: HatchyIconQuantityProps) {
	const { gen } = useWallet();
	return (
		<div className={`group relative w-16 h-16 flex m-1 ${className} `}>
			<div className={`absolute inset-0 w-16 hidden hatchy-mini-selector `}>
				<div className='relative w-full h-full'>
					<Image src={"/static/effects/select.png"} alt='' layout='fill' />
				</div>
			</div>
			<div className='m-auto relative'>
				<div className={`hatchy-image pixelate border-0 h-16 w-16 relative 
				border-${hatchy.element.toLowerCase()} ${quantity > 0 ? '' : 'filter grayscale'}`} >
					<Image
						src={`/static/hatchy-icons/gen${gen}/default/${hatchy.element}/${hatchy.name}.png`}
						alt={hatchy.name} layout='fill' unoptimized />
				</div>
				<div className='absolute bg-black bg-opacity-70 bottom-0 right-0 h-5 px-1 flex items-center text-l justify-center'>
					x{quantity}
				</div>
				{/**
				<div className='absolute -bottom-5 -left-1 bg-black bg-opacity-70  ml-1 mt-1 h-5 w-16 flex items-center text-xs justify-center'>
					{hatchy.name}
				</div>
				 */}
			</div>
		</div>
	)
}
