import Image from 'next/image'
import React from 'react'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import { useStake } from '../../contexts/StakeContext';
import { useWallet } from '../../contexts/WalletContext';

interface props{
}

export default function StakingInfoTable({
}:props) {
	const {
		stakedShinyTokensGen1,
		stakedCommonTokensGen1,
		totalStakedTokensGen1
	} = useStake();

	const {
		stakedShinyTokensGen2,
		stakedCommonTokensGen2,
		totalStakedTokensGen2
	} = useStakeGen2();
	
	const {
		gen2Wallet,
		totalTokensGen1,
	} = useWallet();
	return (
			<table className=' bg-black bg-opacity-40 w-full max-w-xs text-white
			border-white border-4'>
				<tbody className='text-base'>
					<tr >
						<td colSpan={2} className='py-2 pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50 text-xl'>
							<div className='flex flex-row justify-start items-center'>
								<div className='relative w-5 h-8 mr-2'>
									<Image
										src={"/static/gen1egg.png"}
										alt="egg" layout='fill'
										objectFit='contain'
									/>
								</div>
								<span>
									GEN 1 STAKED
								</span>
								<span className='text-base font-normal mr-2 m-auto'>
									{(totalTokensGen1+totalStakedTokensGen1) > 0 &&
										`${(totalStakedTokensGen1 / 
										(totalTokensGen1+totalStakedTokensGen1) * 100).toFixed(2)} %`
									}
								</span>
							</div>
						</td>
					</tr>
					<tr >
						<td className='pt-2 text-left pl-5'>COMMON TOKENS</td>
						<td className='font-bold text-right pr-5'>
							{stakedCommonTokensGen1}
						</td>
					</tr>
					<tr >
						<td className='text-left pl-5 text-shiny'>SHINY TOKENS</td>
						<td className='font-bold text-shiny text-right pr-5'>
							{stakedShinyTokensGen1}
						</td>
					</tr>
					<tr >
						<td className='pb-2 text-left pl-5'>TOTAL</td>
						<td className='font-bold text-right pr-5'>
							{totalStakedTokensGen1}
						</td>
					</tr>
					<tr >
						<td colSpan={2} className='py-2 pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50 text-xl'>
							<div className='flex flex-row justify-start items-center'>
								<div className='relative w-8 h-8 mr-2'>
									<Image
										src={"/static/gen2egg.png"}
										alt="egg" layout='fill'
										objectFit='contain'
									/>
								</div>
								<span>
									GEN 2 STAKED
								</span>
								<span className='text-base font-normal mr-2 m-auto'>
									{(gen2Wallet.totalTokens+totalStakedTokensGen2) > 0 &&
										`${(
												(totalStakedTokensGen2 || 0) / 
												(gen2Wallet.totalTokens+totalStakedTokensGen2) * 100).toFixed(2)} %`
									}
								</span>
							</div>
						</td>
					</tr>
					<tr >
						<td className='pt-2 text-left pl-5'>COMMON TOKENS</td>
						<td className='font-bold text-right pr-5'>
							{stakedCommonTokensGen2}
						</td>
					</tr>
					<tr className=''>
						<td className='text-left pl-5 text-shiny'>SHINY TOKENS</td>
						<td className='font-bold text-shiny text-right pr-5'>
							{stakedShinyTokensGen2}
						</td>
					</tr>
					<tr >
						<td className='pb-2 text-left pl-5'>TOTAL</td>
						<td className='font-bold text-right pr-5'>
							{totalStakedTokensGen2}
						</td>
					</tr>
					<tr className='border-t font-bold'>
						<td className='py-2 text-left pl-5'>TOTAL TOKENS</td>
						<td className='text-right pr-5'>
							{totalStakedTokensGen1+totalStakedTokensGen2}
						</td>
					</tr>
				</tbody>
			</table> 
	)
}
