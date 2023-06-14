import Image from 'next/image';
import React from 'react'
import ABI from '../abi';
import useContract from '../hooks/useContract';
import useSupply from '../hooks/useTotalSupply';
import { MAX_HATCHIES } from '../utils';
import { getHatchyNFTAddress } from '../utils/addressHelpers';

export default function HatchedInfo() {
	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy, true);
	const totalClaimed = useSupply(contract);
	if (totalClaimed) {
  		return (
			<div className="flex flex-row justify-center pr-5 pl-2 py-1 items-center bg-whit bg-opacity bg-black
			bg-opacity-40 text-white ">
					<div className="pixelate py-2">
						<div className='relative w-12 h-12 mr-2'>
							<Image src={"/static/egg_Default.gif"} alt="egg" layout='fill' />
						</div>
					</div>
					<div className='flex flex-col text-base items-start'>
						<div className='flex flex-row justify-between w-full'>
							<span className='font-bold pr-3'>Hatched: </span>
							<span>{totalClaimed}</span>
						</div>
						<div className='flex flex-row justify-between w-full'>
							<span className='font-bold pr-3'>Unhatched: </span>
							<span>{totalClaimed ? MAX_HATCHIES - (totalClaimed || 0) : 0}</span>
						</div>
					</div>
			</div>
  		)
	}else{
		return(<></>);
	}
}
