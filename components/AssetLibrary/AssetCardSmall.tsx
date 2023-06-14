import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Hatchy } from '../../types'
import { getCommonCardFilename } from '../../utils/metadataArraysUtils'

interface AssetCardInfoProps {
	hatchy: Hatchy
	fileSize: string
	stars: number
	className?: string
	gen?: number
}

export default function AssetCardSmall({ hatchy, fileSize, stars, className, gen=1 }: AssetCardInfoProps) {
	return (
			<Link href={`/asset_library/10`} >
		<div className={`w-28 lg:w-36 flex flex-col flex-none ${className}`}>
			<div className='border border-white rounded-'>
				<div className="m-auto pixelate cursor-pointer hover:scale-110 ease-in duration-300 w-28 h-28 relative lg:w-36 lg:h-36">
					<Image alt={hatchy.name} layout='fill'
					src={getCommonCardFilename(hatchy)} />
				</div>
			</div>
			<div className='bg-white text-black flex flex-col w-full justify-center items-center h-20 '>
				<div className='flex flex-row justify-between w-full pr-1 h-5'>
					<span className='ribbon w-10 left-0 text-white text-sm text-center font-bold'>#{hatchy.monsterId}</span>
					<span>{fileSize}</span>
				</div>
				<span className='h-full items-center justify-center flex'>{hatchy.name}</span>
				<div className='flex flex-row mb-1 space-x-1'>
					{[...Array(stars)].map((elem, i) => (
						<div className='w-4 h-4 relative' key={i}>
							<Image src={'/static/misc/star.png'} alt='Star' key={i} layout='fill'/>
						</div>
					))}
				</div>
			</div>
		</div>
			</Link>
	)
}
