import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'
import { FriendModel } from '../../types'
import { shortenHex } from '../../utils'

interface FriendRequestCardProps{
	friend: FriendModel
	index: number
	showFriendMessage?: boolean
	showCompleteMessage?: boolean
	acceptRequest?: (id: string, i: number)=>void
	declineRequest?: (id: string, i: number)=>void
	cancelRequest?: (id: string, i: number)=>void
}

export default function FriendRequestCard({
	friend,
	index,
	showFriendMessage=false,
	showCompleteMessage=false,
	acceptRequest,
	declineRequest,
	cancelRequest
}:FriendRequestCardProps) {
	return (
		<div className='w-full bg-white bg-opacity-25 pt-3 px-4 flex flex-col space-x-3
		sm:flex-row sm:py-3'>
			<div className='w-full flex flew-row space-x-3'>
				<div className='flex items-center '>
					<div className="relative">
						{friend.avatar ?
							<div className="m-auto w-14 h-14 relative rounded-full overflow-hidden bg-purple-400">
								<Image src={`https://account-test.hatchypocket.com/images/${friend.avatar}`}
									alt="egg"
									objectFit='cover'
									layout='fill' />
							</div>
							:
							<div className="m-auto pixelate w-14 h-14 relative rounded-full bg-purple-400">
								<Image src={"/static/egg.gif"} alt="egg" layout='fill' />
							</div>
						}
						<div className="w-3 h-3 bg-green-dark rounded-full absolute bottom-0 right-0" />
					</div>
				</div>
				<div className='flex flex-col '>
					<span className='font-bold text-lg'>{friend.username}</span>
					<span className='text-sm'>Address: {shortenHex(friend.address)}</span>
					<span className='text-sm'>{friend.userId}</span>
				</div>
			</div>
			{acceptRequest && declineRequest &&
				<>
					<div className='flex-row justify-start items-center space-x-2 hidden sm:flex'>
						<button onClick={() => acceptRequest(friend.userId, index)} className='text-green'>
							<Icon icon={"akar-icons:check"} width={30} className='w-16' />
							<span className=''>Accept</span>
						</button>
						<button onClick={() => declineRequest(friend.userId, index)} className='text-red-700'>
							<Icon icon={"akar-icons:cross"} width={30} className='w-16' />
							Decline
						</button>
					</div>
					<div className='flex flex-row justify-start items-center space-x-5 pl-14 pb-2
					sm:hidden'>
						<button onClick={() => acceptRequest(friend.userId, index)} 
						className='text-gree flex flex-row items-center'>
							<Icon icon={"akar-icons:check"} width={30} className='w-6' />
							<span className=''>Accept</span>
						</button>
						<button onClick={() => declineRequest(friend.userId, index)}
						className='text-red-7 flex flex-row items-center '>
							<Icon icon={"akar-icons:cross"} width={30} className='w-5' />
							<span className=''>Decline</span>
						</button>
					</div>
				</>
			}
		</div >
	)
}
