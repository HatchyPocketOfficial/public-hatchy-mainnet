import { BigNumber, ethers } from "ethers"
import { filter } from "../../utils/numberFormatterHelper"
import Tooltip from "../Tooltip"
import Image from "next/image"
import { useStake } from "../../contexts/StakeContext"
import { useState } from "react"
import { Icon } from "@iconify/react"

interface StakingClaimRewardProps {
  canClaim: boolean
  handleClaimReward: () => void
}

export default function StakingClaimReward({
  canClaim,
  handleClaimReward
}: StakingClaimRewardProps) {
	const [showTable, setShowTable] = useState(false);
	const {
		tokenPerShare,
		totalStakedWeight,
		userTotalWeight,
		pendingReward,
		communityWeeklyRewards,
		userWeeklyRewards,
	} = useStake();
	
	
  return (
		<div className='flex flex-col space-y-5 justify-between items-center text-white
			md:w-1/2'>
			<div className='flex flex-col justify-start bg-black bg-opacity-40 pt-2 w-72'>
				<span className="px-2">My Estimated Weekly Rewards</span>
				<div className='flex flex-row items-center justify-center space-x-3 px-2 '>
					<div className="flex flex-row justify-center items-center text-3xl font-bold space-x-1">
						<Image src='/static/token.png' width={30} height={30} alt='HATCHY' />
						<span>
							{filter(parseFloat(ethers.utils.formatEther(userWeeklyRewards)))}
						</span>
					</div>
					{!userTotalWeight.eq(0) && (
						<Tooltip text="yearly rewards/weight">
							<span>
								~ {filter(parseFloat(ethers.utils.formatEther(
									userWeeklyRewards.mul(52)
									.div(userTotalWeight)
									.mul(100)
								)))}%
							</span>
						</Tooltip>
					)}
				</div>
				<span className="w-full h-5 text-center flex justify-center items-center" onClick={()=>setShowTable(!showTable)}>
					<Icon icon={showTable?'mdi:chevron-up':'mdi:chevron-down'} width={30} />
				</span>
				<div className={`${showTable?'max-h-52':'max-h-0'} overflow-hidden transition-max-height
				w-full`}>
					<table className={`bg-black bg-opacity-40 text-left w-full`}>
						<tbody>
							<tr>
								<td className='py-1 pl-3'>Global Weekly Rewards</td>
								<td>{filter(parseFloat(ethers.utils.formatEther(communityWeeklyRewards)))}</td>
							</tr>
							<tr>
								<td className='py-1 pl-3'>Global Weight</td>
								<td>{filter(totalStakedWeight.toNumber())}</td>
							</tr>
							{!totalStakedWeight.eq(0) && (
								<tr>
									<td className='py-1 pl-3'>My Weight Percentage</td>
									<td>{filter(
										userTotalWeight.toNumber() / totalStakedWeight.toNumber() * 100,
										3
									)}%</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
				<button className={`rounded-full w-32 h-32 mb-4 border-2 ${canClaim ? 'hover:scale-105' : 'grayscale'}
					relative flex justify-center items-center transition-transform hover:drop-shadow-yellow`}
					onClick={handleClaimReward} disabled={!canClaim}>
					<div className="absolute w-40 h-40 ">
						<Image src='/static/token.png' layout="fill" objectFit="contain" alt='HATCHY'/>
					</div>	
					<div className="absolute bottom-0 flex flex-col justify-center items-center">
						<span className='flex flex-col justify-center items-center mt-5 bg-gray-dark bg-opacity-80 px-3
						border-white border'>
							<span className="text-4xl font-bold">
								{filter(pendingReward)}
							</span>
							<span className='w-52 '>CLAIM REWARD</span>
						</span>
					</div>
				</button>
		</div>
  )
}