import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import useMetadata from '../../hooks/useMetadata';
import { Metadata } from '../../types';
import { getCommonCardFilename, getShinyCardFilename, isShinyHatchy } from '../../utils/metadataArraysUtils';
import LoadingSpinner from '../Utility/LoadingSpinner';


interface HatchyCardLatestProps {
	hatchy?: Metadata
	tokenId?: number
	className?: string
	count?: string
	isCollapse?: boolean
	hideCount?: boolean
}
export default function HatchyCardLatest({ hatchy, tokenId, className = '', count, isCollapse = false, hideCount=false}: HatchyCardLatestProps) {
	const {gen} = useWallet();
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
	
	const renderCount = ()=>{
		if (hideCount) return <></>;
		if(isCollapse){
			if (gen==1){
				return <span>X{count}</span>
			} else {
				if (hatchy) {
					return (
						<div className='flex flex-row space-x-5 justify-center'>
							{hatchy.commonQuantity!=null &&
								hatchy.commonQuantity>0 &&
								<span className='font-bold text-xl'>
									x{hatchy.commonQuantity}
								</span>
							}
							{isShinyHatchy(hatchy) &&
								<span className='font-bold text-xl text-shiny'>
									x{hatchy.shinyQuantity}
								</span>
							}
						</div>	
					)
				} else return <></>
			}
		} else {
			return <span>#{hatchyInfo?.tokenId}</span>
		}
	}
	if (hatchyInfo == null) return <LoadingSpinner />
		
	return (
		<div className={`flex flex-col items-center font-bold ${isCollapse && "pt-6"} `}>
			{/*card-shadow claim-egg border-4 border-white m-2 */}
			<div className='flex justify-center items-center w-32 h-32 overflow-visible'>
				<div className={`${hatchyInfo.monsterId<40?'min-w-[8rem] h-32':'min-w-[13rem] h-52'} relative shiny pixelate cursor-pointer hover:scale-125 ease-in duration-300`} onClick={redirect}>
					{isShinyHatchy(hatchyInfo)?
						<Image alt="Hatchy Pocket card" layout='fill'
						src={getShinyCardFilename(hatchyInfo)} />
					:
						<Image alt="Hatchy Pocket card" layout='fill'
						src={getCommonCardFilename(hatchyInfo)} />
					}
				</div>
			</div>
			{renderCount()}
		</div>
	)
}
