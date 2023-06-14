import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import { Metadata } from '../types'
import Tooltip from './Tooltip'

interface HatchyIconProps {
	hatchy: Metadata
	gen?: number
	setSelectedHatchyID?: (id: number) => void
	showShinyCollection?: boolean
	colored?: boolean
	count?: number
	shinyCount?: number
	showCount?: boolean
	showFrame?: boolean
	hideTooltip?: boolean 
}

export default function HatchyIcon({
	hatchy,
	gen = 1,
	showShinyCollection,
	showFrame,
	colored = true,
	showCount = false,
	count = 0,
	shinyCount = 0,
	setSelectedHatchyID = (id: number) => { },
	hideTooltip
}: HatchyIconProps) {
	const isDesktop = useMediaQuery('(min-width:1225px)');

	const renderIcon = () => {
		if (colored) {
			if (showShinyCollection || hatchy.isShiny || hatchy.element=='Void' || hatchy.monsterId>=137) {
				/* Shiny Icon */
				return (
					<div className={`relative `}>
						{/** shiny count */}
						<div className="flex flex-row space-x-1 absolute right-5 bottom-0 text-white z-40">
							{shinyCount > 1 && Array.from(Array((shinyCount - 1) > 5 ? 5 : (shinyCount - 1)).keys()).map((i) => {
								return <div className='bg-yellow w-1 h-3' key={i} />
							})}
						</div>
						<div className={`${gen == 1 && 'border-2 border-yellow '} w-16 h-16 relative pixelate`}>
							<Image
								src={`/static/hatchy-icons/gen${gen}/shiny/${hatchy.element}/${hatchy.name}.png`}
								alt={hatchy.name} layout='fill' unoptimized />
						</div>
					</div>
				)
			}
			/* Default Colored Icon */
			return (
				<div className={`flex justify-center items-center w-16 h-16 relative pixelate`}>
					<Image
						src={`/static/hatchy-icons/gen${gen}/default/${hatchy.element}/${hatchy.name}.png`}
						layout='fill' alt={hatchy.name} unoptimized />
				</div>
			)
		}
		/* Gray Icon */
		return (
			<div className={`flex w-16 h-16 relative pixelate 
			${gen === 1 && 'border-2 border-white '}`}>
				<Image
					src={`/static/hatchy-icons/gen${gen}/grayscale/${hatchy.element}/${hatchy.name}.png`}
					alt={hatchy.name} layout='fill' unoptimized />
			</div>
		)
	}

	const content = (
		<button className={`group relative w-16 h-16 flex m-1 ${hatchy.isShiny ? 'bg-yellow' : ''}
			ease-in-out transition-transform
			${showFrame && 'scale-125 z-10 drop-shadow-opaque'}`}
			onClick={() => setSelectedHatchyID(hatchy.monsterId)}>
			{!showFrame &&
				<div className="absolute inset-0 w-16 hidden group-hover:flex hatchy-mini-selector pixelate">
					<div className='relative w-full h-full'>
						<Image src={'/static/effects/select.png'} alt='' layout='fill' unoptimized />
					</div>
				</div>
			}
			{colored && showCount &&
				<div className={`text-black absolute bottom-0 right-0  font-bold w-4 h-4 z-10 flex justify-center items-center ${showShinyCollection ? 'bg-yellow' : 'bg-white'}`}>
					{count}
				</div>
			}
			<div className={`m-auto 
			${(!colored && !showFrame) && 'card-frame-icon before:bg-white'} 
			${(showShinyCollection && !showFrame) && 'card-frame-icon before:bg-yellow'}`}>
				{renderIcon()}
			</div>
		</button >
	)
	
	if (hideTooltip) {
		return content;	
	} else {
		return (
			<Tooltip text={`${hatchy.name} - #${hatchy.monsterId}`}
				place={hatchy.element=='Dark'?'right':hatchy.element=='Light'?'left':'top'}
				selectMode={!isDesktop} selected={showFrame}>
				{content}
			</Tooltip>
		)
	}
}
