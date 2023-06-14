import Image from 'next/image';
import Router from 'next/router';
import React, { useRef } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import { Metadata } from '../../types'
import { getCommonCardFilename, getShinyCardFilename, isShinyHatchy } from '../../utils/metadataArraysUtils';
import Title from '../Title'

interface HatchyCardInfoProps {
	hatchy: Metadata
	showShinyCollection?: boolean
	className?: string
	isStaked?: boolean
	onClick?: () => void
}
export default function HatchyCardInfo({ hatchy, showShinyCollection = false, isStaked, onClick = () => { }, className = '' }: HatchyCardInfoProps) {
	const { gen } = useWallet();

	const audioRef = useRef<HTMLAudioElement>(null);
	const ref = React.useRef<HTMLDivElement>(null);

	const playAudio = () => {
		if (audioRef == null || audioRef.current == null) return;
		audioRef.current.volume = 0.4;
		audioRef.current.play()
	}
	const redirect = () => {
		if (hatchy.tokenId)
			Router.push(`/hatchy/${hatchy.tokenId}`)
	}

	return (
		<div className={`card-shadow max-w-xs min-w-xs h-max  ${className}`} ref={ref}>
			<div className={`flex flex-col justify-center card-frame relative text-gray-dark
			${isShinyHatchy(hatchy) ? '' : ''}`}>
				<div className="relative flex py-5 overflow-hidden h-60">
					{isStaked &&
						<span className='absolute top-0 inset-x-0 h-5 w-full bg-white 
						flex justify-center items-center font-black z-10'>
							STAKED
						</span>
					}
					{showShinyCollection || hatchy.rarity == 'Shiny' || isShinyHatchy(hatchy) ?
						<div className='flex justify-center items-center w-full h-full'>
							<div className={`shiny pixelate cursor-pointer hover:scale-110 ease-in duration-300 relative
							${gen === 1 ? 'w-48 h-48' : 'w-80 h-80'}`}
								onClick={redirect}>
								<Image alt={hatchy.name} layout='fill' objectFit='contain'
									src={getShinyCardFilename(hatchy)} />
							</div>
						</div>
						:
						<div className='flex justify-center items-center w-full h-full'>
							<div className={`shiny pixelate cursor-pointer hover:scale-125 ease-in duration-300 relative
							${gen === 1 ? 'w-48 h-48' : 'w-80 h-80'}`}
								onClick={redirect}>
								<Image alt={hatchy.name} layout='fill' objectFit='contain'
									src={getCommonCardFilename(hatchy)} />
							</div>
						</div>
					}
					<audio ref={audioRef} className={"audio mx-auto"} src={gen == 1 ? `/static/sounds/${hatchy.sound}` : '/static/sounds/sujin.wav'} />
					<div className="w-8 h-8 absolute bottom-0 right-0 m-3 cursor-pointer hover:scale-125 ease-in duration-300" onClick={playAudio} title={`Listen to ${hatchy.name}`}>
						<div className='relative w-full h-full'>
							<Image src={"/static/misc/audio-waves.png"} alt={`Listen to ${hatchy.name}`} layout='fill' />
						</div>
					</div>
				</div>
				<Title title={hatchy.name} color={hatchy.element.toLowerCase()} />
				<div className='h-40 bg-gray-light text-left px-8 py-3 overflow-y-auto'>
					<p>
						{hatchy.description}
					</p>
				</div>
				<div className='bg-white px-8 py-2 text-gray-dark'>
					<div className='bg-white px-8 py-2 text-gray-dark'>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Height</span>
							<span >{hatchy.height} cm</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Weight</span>
							<span>{hatchy.weight} kg</span>
						</div>
					</div>
				</div>
				<div className=" flex flex-row p-2 justify-between w-full bg-white">
					<div className='flex flex-row'>
						<span className="w-12 text-gray-dark mr-2">Gen {gen}</span>
						<span className="bg-gray-dark w-24 flex flex-row justify-between pr-2 pl-4 absolute right-0 bottom-0 id-label font-bold">
							<span className=" text-gray-light">{hatchy.tokenId ? 'ID' : '#'}</span>
							<span className=" text-white ">{hatchy.tokenId ? hatchy.tokenId : hatchy.monsterId}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
