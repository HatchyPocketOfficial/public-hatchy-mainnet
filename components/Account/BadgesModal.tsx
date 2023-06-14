import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Badge, UserModel, BadgeObject } from '../../types'
import Banner from '../Banner'
import Modal, { ModalProps } from '../Modal'
import BadgeItem from './BadgeItem'
import { badgesData } from '../../constants/badgesData';

interface BadgesModal extends ModalProps {
	setBadges: (badges: Badge[]) => void,
	userInfo?: UserModel
}
export default function BadgesModal({ userInfo, setBadges, ...modalProps }: BadgesModal) {
	const [selectedBadges, setSelectedBadges] = useState([0]);
	const [badgesList, setBadgesList] = useState<Badge[]>()
	const [progressList, setProgressList] = useState<BadgeObject>()
	const [availableBadges, setAvailableBadges] = useState<Badge[]>()

	useEffect(() => {
		if (userInfo) {
			setProgressList(userInfo.badges)
			setBadgesList(badgesData)
			if (progressList && badgesList) {
				const progressAsArray = Object.entries(progressList)
				const unlockedBadges = progressAsArray.filter(([key, value]) => {
					return value.unlocked
				})
				const progressAsObject = Object.fromEntries(unlockedBadges)
				setProgressList(progressAsObject)
			}
		}
	}, [userInfo])

	const selectBadge = (i: number) => {
		const auxBadges = [...selectedBadges];
		auxBadges.push(i);
		setSelectedBadges(auxBadges);
	}

	const unselectBadge = (i: number) => {
		const auxBadges = selectedBadges.filter(element => element != i);
		setSelectedBadges(auxBadges);
	}

	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-md'>
			<div className='text-white'>
				<div>
					<div className='flex justify-end w-full mb-3 absolute top-1 right-1'>
						<button onClick={modalProps.closeModal}>
							<Icon icon={"carbon:close"} width={30} />
						</button>
					</div>
					<div className='flex justify-between w-full lg:pl-5'>
						<Banner title='Badges' white />
					</div>
				</div>
				<div className='flex flex-col'>
					<section className='flex justify-center bg-white bg-opacity-40 p-1 mt-2'>
						Showcase
					</section>
					<section className='flex flex-row mb-5 border border-white border-opacity-40 py-2'>
						<BadgeItem />
						<BadgeItem />
						<BadgeItem />
					</section>
					<section className='flex p-1 my-2 mx-1 border-b'>
						Hatchys Gen 1
					</section>
					<section className='flex flex-row'>
						<BadgeItem />
					</section>
					{/* <section className='flex p-1 my-2 mx-1 border-b'>
						Hatchys Gen 2
					</section> */}
					<section className='flex flex-row'>
						<BadgeItem />
						<BadgeItem selected />
					</section>
					<section className='flex p-1 my-2 mx-1 border-b'>
						Summoners
					</section>
					<section className='flex flex-row'>
						<BadgeItem />
						<BadgeItem selected />
						<BadgeItem selected />
					</section>
				</div>
			</div>
		</Modal>
	)
}
