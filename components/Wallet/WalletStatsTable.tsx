import React from 'react'

interface WalletStatsTableProps{
	collectionCommon: number
	collectionShiny: number
	stakingCommon: number
	stakingShiny: number
}
export default function WalletStatsTable({
	collectionCommon,
	collectionShiny,
	stakingCommon,
	stakingShiny,
}:WalletStatsTableProps) {
	return (
		<table className=' bg-black bg-opacity-40 w-full  text-white mb-3 mt-5
		border-white border-4'>
			<thead>
				<tr className='text-center bg-white text-gray-dark font-black text-lg'>
					<td colSpan={2}>
						WALLET	
					</td>
				</tr>
			</thead>
			<tbody className='text-base'>
				<tr className=''>
					<td colSpan={2} className='py-2 text-left pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50'>COLLECTION</td>
				</tr>
				<tr >
					<td className='pt-2 text-left pl-5'>COMMON TOKENS</td>
					<td className='font-bold text-right pr-5'>
						{collectionCommon}
					</td>
				</tr>
				<tr className=''>
					<td className='text-left pl-5 text-shiny'>SHINY TOKENS</td>
					<td className='font-bold text-shiny text-right pr-5'>
						{collectionShiny}
					</td>
				</tr>
				<tr >
					<td className='pb-2 text-left pl-5'>TOTAL</td>
					<td className='font-bold text-right pr-5'>
						{collectionCommon+collectionShiny}
					</td>
				</tr>
				<tr className=''>
					<td colSpan={2} className='py-2 text-left pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50'>STAKING</td>
				</tr>
				<tr >
					<td className='pt-2 text-left pl-5'>COMMON TOKENS</td>
					<td className='font-bold text-right pr-5'>{stakingCommon}</td>
				</tr>
				<tr className=''>
					<td className='text-left pl-5 text-shiny'>SHINY TOKENS</td>
					<td className='font-bold text-shiny text-right pr-5'>{stakingShiny}</td>
				</tr>
				<tr >
					<td className='pb-2 text-left pl-5'>TOTAL</td>
					<td className='font-bold text-right pr-5'>{stakingCommon+stakingShiny}</td>
				</tr>
				<tr className='border-t font-bold'>
					<td className='py-2 text-left pl-5'>TOTAL TOKENS</td>
					<td className='text-right pr-5'>
						{collectionCommon + collectionShiny + stakingCommon + stakingShiny}
					</td>
				</tr>
			</tbody>
		</table> 
	)
}
