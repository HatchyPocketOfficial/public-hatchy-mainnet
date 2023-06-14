import { Icon } from '@iconify/react'
import React from 'react'

export default function AssetReview() {
	const reviews = [
		'user1',
		'user2',
		'user3',
		'user4',
	]
	return (
		<div className='flex flex-col p-2 md:p-8 justify-start'>
			{reviews ?
				<>
					<div className='flex flex-row justify-start items-center'>
						<span className='text-2xl font-bold mr-4'>Overall Rating: </span>
						<div className='flex flex-row space-x-3'>
							<Icon icon="bi:star-fill" width={25} />
							<Icon icon="bi:star-fill" width={25}/>
							<Icon icon="bi:star-fill" width={25}/>
							<Icon icon="bi:star-fill" width={25} className='opacity-40' />
							<Icon icon="bi:star-fill" width={25} className='opacity-40' />
						</div>
					</div>
					<span className='text-base flex text-gray-300'>
						{0} users ratings and {0} users reviews
					</span>
					<div className='max-h-80 overflow-y-auto flex flex-col space-y-3 pr-3 mt-5'>
						{
							
							reviews.map(user=>(
								<div key={user} className="flex flex-col">
									<span className='text-left w-full text-xl font-bold'>{user}</span>
									<p className='border border-white p-2 px-3 '>
										Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione, unde eveniet! Non quasi ab amet aperiam itaque neque, dignissimos minima maxime! Ab libero dolore incidunt neque quidem non dolorem numquaIm.
									</p>
								</div>
							))
						}
					</div>
				</>
					:
						<p className='border border-white p-2 px-3 py-10 w-full text-xl'>
							Rating and reviews will be available when the asset is added to the library
						</p>
				}
		</div>
	)
}
