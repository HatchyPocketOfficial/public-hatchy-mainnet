import { Icon } from '@iconify/react'
import React from 'react'
import { Badge, BadgeProgress } from '../../types';
import Modal, { ModalProps } from '../Modal';
import BadgeItemCircle from './BadgeItemCircle';

interface BadgeInfoModalProps extends ModalProps {
	badgeData: Badge | undefined,
	badgeProgress: BadgeProgress | undefined
}

export default function BadgeInfoModal({ badgeData, badgeProgress, ...modalProps }: BadgeInfoModalProps) {

	if (!badgeData || !badgeProgress) return <></>
	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-2xl'>
			<div className='flex justify-end w-full absolute top-1 right-1 text-white'>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<div className='w-full px-7 text-white h-full flex flex-col items-center text-center'>
				<div className='w-1/3 mt-10'>
					{badgeData && badgeData.name && badgeData.counter && badgeData.counter * 100 &&
						<BadgeItemCircle name={badgeData.name}
							badgeData={badgeData}
							progress={badgeProgress.progress / badgeData.counter * 100}
							unlocked={badgeProgress.unlocked}
						/>
					}
				</div>
				{!badgeData.name?.includes('VIP') &&
					<div className='w-full flex flex-row justify-between'>
						<h1 className='text-2xl font-bold'>{badgeData.name}</h1>
						<h1 className='text-2xl font-bold'>+{badgeData.points} pts</h1>
					</div>
				}
				<div className='w-full text-left'>
					<p>
						{badgeData.description}
					</p>
				</div>
				<div className='w-full text-left mt-5'>
					<h1 className='text-2xl font-bold'>Scoring Rules</h1>
					<p>
						{badgeData.rule}
					</p>
				</div>
			</div>
		</Modal>
	)
}
