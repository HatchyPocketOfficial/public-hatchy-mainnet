import Image from 'next/image';
import Router from 'next/router';
import React, { Ref, useRef } from 'react'
import useMetadata from '../../hooks/useMetadata';
import { formatHatchyPrice } from '../../utils/numberFormatterHelper';
import Button from '../Button'
import LoadingSpinner from '../Utility/LoadingSpinner';
import Title from '../Title'
import { useWeb3React } from '@web3-react/core';
import { getCommonCardFilename, getShinyCardFilename } from '../../utils/metadataArraysUtils';

interface HatchyCardMarketplaceProps {
	tokenId: number
	price: string
	className?: string
	owned: boolean
	buyToken?: () => void
	cancelSale?: () => void
	gen?: number
}
export default function HatchyCardMarketplace({ tokenId, price, className = '', owned, buyToken, cancelSale, gen = 1 }: HatchyCardMarketplaceProps) {
	const { account, provider: library, chainId } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;
	const audioRef = useRef<HTMLAudioElement>(null);
	const hatchy = useMetadata(tokenId);
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
		<div className={`card-shadow hover:scale-110 ease-in duration-300 w-80 m-5  ${className}`} >
			<div className='flex flex-col justify-center claim-egg border-4 border-white relative'>
				<div className="relative flex py-5 " >
					<div className="flex flex-row h-7 absolute top-0 right-0">
						<span className="w-14 text-gray-dark bg-white pb-1 pl-1 border-2 border-white font-bold">Gen 1</span>
						{hatchy.tokenId &&
							<span className="bg-gray-dark w-28 flex flex-row justify-between pr-2 pl-4 relative id-label border-2 border-white font-bold">
								<span className=" text-gray-light ">ID</span>
								<span className=" text-white">{hatchy.tokenId ? hatchy.tokenId : hatchy.monsterId}</span>
							</span>
						}
					</div>
					{hatchy.isShiny ?
						<div className="shiny m-auto pixelate w-52 h-52 relative cursor-pointer" onClick={redirect}>
							<Image alt={hatchy.name} layout='fill'
								src={getShinyCardFilename(hatchy)} />
						</div>
						:
						<div className="shiny m-auto pixelate w-52 h-52 relative cursor-pointer" onClick={redirect}>
							<Image alt={hatchy.name} layout='fill'
								src={getCommonCardFilename(hatchy)} />
						</div>
					}
					<audio ref={audioRef} className={"audio mx-auto"} src={`/static/sounds/${hatchy.sound}`} />
					<div className="w-8 h-8 absolute bottom-0 right-0 m-3 cursor-pointer hover:scale-125 ease-in duration-300" onClick={playAudio} title={`Listen to ${hatchy.name}`}>
						<Image src={"/static/misc/audio-waves.png"} alt={`Listen to ${hatchy.name}`} layout='fill' />
					</div>
				</div>
				<Title title={hatchy.name} color={hatchy.element.toLowerCase()} />
				<div className='flex flex-col justify-between bg-gray-light text-gray-dark text-left px-8 py-2 '>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Height: &nbsp;</span>
						<span>{hatchy.height} cm</span>
					</div>
					<div className='flex flex-row justify-between'>
						<span className='font-bold'>Weight: &nbsp;</span>
						<span>{hatchy.weight} kg</span>
					</div>
				</div>
				<div className='bg-white py-2 flex justify-between items-center text-gray-dark text-left px-8' >
					<div className='flex flex-row justify-center items-center space-x-4 text-xl'>
						<span className='font-black '>{formatHatchyPrice(price)} </span>
						<div className="coin w-8 h-8 relative">
							<Image src={"/static/avax2.png"} alt='avax' layout='fill' />
						</div>
					</div>
					{isConnected ?
						owned ?
							<Button label={`CANCEL SALE`} color={'cyan'} onClick={cancelSale} />
							:
							<Button label={`BUY`} onClick={buyToken} />
						:
						<></>
					}
				</div>
			</div>
		</div>
	)
}
