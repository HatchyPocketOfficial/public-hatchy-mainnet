import React, { useRef } from 'react'
import LoadingSpinner from '../Utility/LoadingSpinner';
import Title from '../Title'
import { Metadata } from '../../types'
import Image from 'next/image'
import Router from 'next/router';
import { getCommonCardFilename, getShinyCardFilename } from '../../utils/metadataArraysUtils';
import { useWallet } from '../../contexts/WalletContext';

interface HatchyCardSmallProps {
	hatchy: Metadata
	className?: string
	showShiny?: boolean
}

export default function HatchyCardSmall({ hatchy, className = '', showShiny = false }: HatchyCardSmallProps) {
	const { gen } = useWallet();
	const audioRef = useRef<HTMLAudioElement>(null);
	// const hatchy = useMetadata(tokenId);
	const playAudio = () => {
		if (audioRef == null || audioRef.current == null) return;
		audioRef.current.volume = 0.4;
		audioRef.current.play()
	}

	const redirect = () => {
		if (hatchy && hatchy.tokenId)
			Router.push(`/hatchy/${hatchy.tokenId}`)
	}

	if (hatchy == null) return (
		<div className={`w-80  m-5 ${className}`}>
			<div className='flex items-center justify-center h-80'>
				<LoadingSpinner />
			</div>
		</div>
	)
	return (
		<div className={`card-shadow hover:scale-110 ease-in duration-300 w-56 m-5  ${className}`} >
			<div className={`flex flex-col justify-center card-frame border-4  relative
			${(hatchy.isShiny || showShiny) ? 'border-light card-frame-light' : 'border-white'} `}>
				<div className="relative flex py-5 overflow-visible justify-center w-full" >
					<div className="flex flex-row h-6 absolute top-0 right-0">
						<span className="w-14 text-gray-dark bg-white pb-1 border-2 border-white">Gen {hatchy.monsterId < 40 ? '1' : '2'}</span>
						{hatchy.tokenId &&
							<span className="bg-gray-dark w-24 flex flex-row justify-between pr-2 pl-4 relative id-label border-2 border-white	">
								<span className=" text-gray-light ">ID</span>
								<span className=" text-white">{hatchy.tokenId ? hatchy.tokenId : hatchy.monsterId}</span>
							</span>
						}
					</div>
					<div className='flex justify-center items-center w-52 h-52 overflow-visible'>
						<div className={`shiny m-auto pixelate ${hatchy.monsterId < 40 ? 'min-w-[13rem] h-52' : 'min-w-[18rem] h-72'} relative cursor-pointer`} onClick={redirect}>
							<Image alt={hatchy.name} layout='fill' objectFit='contain'
								src={(hatchy.isShiny || showShiny) ? getShinyCardFilename(hatchy) : getCommonCardFilename(hatchy)} />
						</div>
					</div>
					<audio ref={audioRef} className={"audio mx-auto"}
						src={hatchy.monsterId < 40 ? `/static/sounds/${hatchy.sound}` : '/static/sounds/sujin.wav'} />
					<div className="absolute bottom-0 right-0 m-3 cursor-pointer hover:scale-125 ease-in duration-300" onClick={playAudio} title={`Listen to ${hatchy.name}`}>
						<div className='relative w-8 h-8'>
							<Image src={"/static/misc/audio-waves.png"} alt={`Listen to ${hatchy.name}`} layout='fill' />
						</div>
					</div>
				</div>
				<Title title={hatchy.name} color={hatchy.element.toLowerCase()} />
				<div className='flex justify-between bg-gray-light text-gray-dark text-xs text-left px-2 py-3'>
					<div className='flex flex-row justify-between'>
						<span>Height: &nbsp;</span>
						<span>{hatchy.height} cm</span>
					</div>
					<div className='flex flex-row justify-between'>
						<span>Weight: &nbsp;</span>
						<span>{hatchy.weight} kg</span>
					</div>
				</div>
			</div>
		</div>
	)
}
