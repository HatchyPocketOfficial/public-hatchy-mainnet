import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import useMetadata from '../../hooks/useMetadata';
import { Gen2AmountData, Metadata } from '../../types';
import { getCommonCardFilename, getShinyCardFilename, isShinyHatchy } from '../../utils/metadataArraysUtils';
import QuantitySelector from '../Home/QuantitySelector';
import LoadingSpinner from '../Utility/LoadingSpinner';


interface HatchyGen2SelectionCard {
	hatchy: Metadata
	tokenId?: number
	className?: string
	stakeAmount: Gen2AmountData
	setShinyAmount: (value: string)=>void
	setCommonAmount: (value: string)=>void
}
export default function HatchyGen2SelectionCard({ hatchy, tokenId, stakeAmount, setShinyAmount, setCommonAmount}: HatchyGen2SelectionCard) {
	const {gen} = useWallet();
	const [quantity, setQuantity] = useState('0');
	const hatchyFetch = useMetadata(tokenId?tokenId:0);	
	const [hatchyInfo, setHatchyInfo] = useState<Metadata>();
	const redirect = () => {
		if (hatchyInfo && hatchyInfo.tokenId)
			Router.push(`/hatchy/${hatchyInfo.tokenId}`)
	}
	
	useEffect(() => {
		if (hatchy) {
			setHatchyInfo(hatchy);
		} else if (tokenId && hatchyFetch) {
			setHatchyInfo(hatchyFetch);
		}
	}, [hatchy, hatchyFetch])
	if (hatchyInfo == null) return <LoadingSpinner />
		
	return (
		<div className={`flex flex-col items-center font-bold mb-5`}>
			{/*card-shadow claim-egg border-4 border-white m-2 */}
			<div className='flex justify-center items-center w-36 h-36 overflow-hidden'>
				<div className={`min-w-[20rem] min-h-[15rem] relative shiny pixelate`} onClick={redirect}>
					{isShinyHatchy(hatchyInfo)?
						<Image alt="Hatchy Pocket card" layout='fill'
						src={getShinyCardFilename(hatchyInfo)} objectFit='contain' />
					:
						<Image alt="Hatchy Pocket card" layout='fill'
						src={getCommonCardFilename(hatchyInfo)} objectFit='contain' />
					}
				</div>
			</div>
			<div className='flex flex-col w-auto h-32'>
				{hatchy.commonQuantity!=null && hatchy.commonQuantity>0 &&
					<button className='underline'
					onClick={()=>setCommonAmount((hatchy.commonQuantity || 0).toString())}>
						MAX {hatchy.commonQuantity}
					</button>
				}
				{hatchy.shinyQuantity!=null && hatchy.shinyQuantity>0 &&
					<button className='underline text-shiny'
					onClick={()=>setShinyAmount((hatchy.shinyQuantity || 0).toString())}>
						MAX {hatchy.shinyQuantity}
					</button>
				}
				{(hatchy.commonQuantity!=null && hatchy.commonQuantity>0) &&
					<div className='bg-gray-dark2 bg-opacity-50 flex px-2'>
						<QuantitySelector className='text-xs py-1'
							min={0} max={hatchy.commonQuantity}
							quantity={stakeAmount.commonAmount}
							setQuantity={setCommonAmount}
						/>
					</div>
				}
				{hatchy.shinyQuantity!=null && hatchy.shinyQuantity>0 &&
					<div className='bg-shiny flex px-2'>
						<QuantitySelector className='text-gray-dark2
						text-xs py-1'
							min={0} max={hatchy.shinyQuantity}
							quantity={stakeAmount.shinyAmount}
							setQuantity={setShinyAmount}
						/>
					</div>
				}
			</div>
		</div>
	)
}

/*
						<input type={'number'} className='w-20'
							value={stakeAmount?.commonAmount || 0}
							onChange={(e)=>setCommonAmount(parseInt(e.target.value))}
						/>
*/