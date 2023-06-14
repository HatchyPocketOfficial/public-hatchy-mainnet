import React from 'react'
import {
	COMPLETE_COLLECTION_STAKE_MULTIPLIER,
	COMPLETE_SHINY_COLLECTION_STAKE_MULTIPLIER,
	COMPLETE_SHINY_SET_STAKE_MULTIPLIER,
	SHINY_STAKE_MULTIPLIER
} from '../../constants'

interface StakingCollectionStatsProps {
	completeCollections: number
	completeShinyCollections: number
	completeVoidCollection: number
	dragonsCount: number
	completeDragonCollections: number
	voidCount: number
}
export default function StakingCollectionStats({
	completeCollections,
	completeShinyCollections,
	completeVoidCollection,
	dragonsCount,
	completeDragonCollections,
	voidCount
}: StakingCollectionStatsProps) {
	return (

		<div className={`bg-black bg-opacity-70 p-3 border-yellow border-2 w-full
			${completeCollections == 0 && completeShinyCollections == 0 && completeVoidCollection == 0 &&
			completeDragonCollections == 0 &&
			'hidden'}`}>
			{completeCollections > 0 &&
				<div className='flex justify-between'>
					<span>Complete Collection Bonus x{completeCollections}</span>
					<span>{COMPLETE_COLLECTION_STAKE_MULTIPLIER*completeCollections}</span>
				</div>
			}
			{completeShinyCollections > 0 &&
				<div className='flex justify-between'>
					<span>Complete Shiny Collection Bonus x{completeShinyCollections}</span>
					<span>{COMPLETE_SHINY_COLLECTION_STAKE_MULTIPLIER*completeShinyCollections}</span>
				</div>
			}
		</div>
	)
}
