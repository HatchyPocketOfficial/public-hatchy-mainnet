import { Icon } from '@iconify/react';
import Image from 'next/image';
import React from 'react'
import { ACCOUNTS_IMAGES_URL } from '../../constants';
import { Avatar, Badge } from '../../types'
interface AvatarCardProps {
	avatarHover: Avatar | undefined
	badgeList: Badge[] | undefined
}
export default function AvatarCard({ avatarHover, badgeList }: AvatarCardProps) {
	return (
		<div className='w-full h-full flex flex-col lg:flex-row space-y-2 justify-center pb-5 space-x-3'>
			<div className='lg:w-1/3 h-1/3'>
				<div className="m-auto pixelate relative overflow-hidden rounded-full border w-32 h-32 border-turquoise-dark">
					{
						!avatarHover?.unlocked &&
						<div className='absolute bg-white bg-opacity-50 flex justify-center w-full h-full items-center z-40 text-black'>
							<Icon icon="ant-design:lock-filled" width={40}></Icon>
						</div>
					}
					<div className='relative w-32 h-32'>
						<Image src={`${ACCOUNTS_IMAGES_URL}/${avatarHover?.image}`} alt="egg" objectFit='cover' layout='fill' />
					</div>
				</div>
			</div>
			<div className='lg:w-2/3 bg-white bg-opacity-25	pt-3 px-4 flex flex-col space-y-1'>
				{
					badgeList?.map((badge) => (
						badge.propertyName == avatarHover?.badge &&
						<span className='font-bold text-black' key={badge.id}>Badge: {badge?.name}</span>
					))
				}
				{avatarHover?.unlocked ?
					<span>{avatarHover?.name}</span>
					:
					<div className=''>
						<span className='text-black font-bold'>hatchy {avatarHover?.category} </span>
						<span className='text-red-500 font-bold'>[locked]</span>
					</div>
				}
				{avatarHover?.unlocked ?
					<span>{avatarHover?.description}</span>
					:
					<span>Unlocked by collecting all gen 1 hatchies </span>
				}
			</div>
		</div>
	)
}
