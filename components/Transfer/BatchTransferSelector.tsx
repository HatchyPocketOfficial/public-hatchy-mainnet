import React, { useEffect, useState } from 'react'
import { Metadata } from '../../types'
import { displayWarn } from '../../utils/ErrorMessage'
import Checkbox from '../Checkbox'
import HatchyCardLatest from '../Wallet/HatchyCardLatest'
import TokenItem from '../Wallet/TokenItem'

interface BatchTransferSelectorProps {
	hatchy: Metadata
	transferTokens: number[]
	toggleTransferTokens: (tokens: number[])=>void	
	hatchyTokens: any[]
}
export default function BatchTransferSelector({
	hatchy,
	transferTokens,
	toggleTransferTokens,
	hatchyTokens
}: BatchTransferSelectorProps) {
	const [allSelected, setAllSelected] = useState(false);
	const auxToggleAll = ()=>{
		const hatchyTokensAux: number[] = hatchyTokens.map(tokenData=>tokenData.token);
		toggleTransferTokens(hatchyTokensAux)
	}
	useEffect(() => {
		let checker = hatchyTokens.every(token => transferTokens.includes(token.token));
		setAllSelected(checker);
	}, [transferTokens])
	
	return (
		<div className='flex flex-row bg-black bg-opacity-30 w-full py-5 pr-5'>
			<HatchyCardLatest hatchy={hatchy} hideCount />
			<div className=' border border-white w-full h-32 overflow-y-auto'>
				<div className={`flex flex-row justify-between items-center bg-gray-dark2 bg-opacity-70 border-b border-white  px-3 py-1 mb-3 z-10 sticky top-0`}>
					<div className='flex flex-row items-center space-x-2'>
						{hatchy.name}
					</div>
					<div className='flex flex-row items-center space-x-2'>
						<span>Select all</span>
						<Checkbox
							allSelected={allSelected}
							onClick={()=>auxToggleAll()}
						/>
					</div>
				</div>
				<div className='flex flex-row justify-start items-center space-x-3 pl-3'>
					{hatchyTokens.map(tokenData=>(
						<TokenItem key={tokenData.token}
							token={tokenData.token}
							selectedForTransfer={transferTokens.includes(tokenData.token)}
							onClick={()=>toggleTransferTokens([tokenData.token])}
							element={tokenData.element}
							shiny={tokenData.shiny}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
