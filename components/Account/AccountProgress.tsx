import React, { useEffect, useState } from 'react'
import { UserModel, Badge, BadgeProgress, BadgeObject } from '../../types';
import { Icon } from '@iconify/react'
import BadgeItemCircle from './BadgeItemCircle';
import BadgeInfoModal from './BadgeInfoModal';
import useAdminFunctions from '../../hooks/admin/useAdminFunctions';
import { badgesData } from '../../constants/badgesData';

interface AccountGeneral {
	userInfo?: UserModel,
	isFriend?: boolean
}

export default function AccountProgress({ userInfo, isFriend = false }: AccountGeneral) {
	const [showBadgesInfoModal, setShowBadgesInfoModal] = useState(false);
	const openBadgesInfoModal = () => setShowBadgesInfoModal(true);
	const closeBadgesInfoModal = () => setShowBadgesInfoModal(false);
	const { fetchBadgeList } = useAdminFunctions()
	const [currentOption, setCurrentOption] = useState('COLLECTION');
	const [tablePage, setTablePage] = useState(0);
	const [selectedBadge, setSelectedBadge] = useState<Badge>();
	const [selectedBadgeProgress, setSelectedBadgeProgress] = useState<BadgeProgress>();

	const [badgesList, setBadgesList] = useState<Badge[]>()
	const [progressList, setProgressList] = useState<BadgeObject>()

	const selectBadge = (badgeData: Badge, badge: BadgeProgress) => {
		if (progressList) {
			setSelectedBadge(badgeData);
			setSelectedBadgeProgress(badge)
			openBadgesInfoModal();
		}
	}

	useEffect(() => {
		if (userInfo) {
			setProgressList(userInfo.badges)
			setBadgesList(badgesData)
		}
	}, [userInfo])

	const options = [
		{
			name: 'COLLECTION',
		},
		{
			name: 'SURVIVORS',
		},
		{
			name: 'SUMMONERS',
		}
	];

	const renderProgress = () => {
		if (!badgesList || !progressList) return <></>;
		return (
			Object.keys(progressList).map((key: any) => {
				const badge: BadgeProgress = progressList[key];
				const badgeData = badgesList.find(badgeData => badgeData.id == badge.id);
				if (isFriend) {

					return (badgeData && badgeData.name && badgeData.counter && badge.progress / badgeData.counter * 100 == 100 && badge.unlocked &&
						<BadgeItemCircle
							name={badgeData.name}
							badgeData={badgeData}
							progress={badge.progress / badgeData.counter * 100}
							key={badge.id}
							selectBadge={() => selectBadge(badgeData, badge)}
							unlocked={badge.unlocked}
						/>
					)
				}
				return (badgeData && badgeData.name && badgeData.counter && badge.unlocked &&
					<BadgeItemCircle
						name={badgeData.name}
						badgeData={badgeData}
						progress={badge.progress / badgeData.counter * 100}
						key={badge.id}
						selectBadge={() => selectBadge(badgeData, badge)}
						unlocked={badge.unlocked}
					/>
				)
			})
		)
	}
	if (!userInfo) return <></>
	return (
		<div className='w-full border-4 border-white  py-2 px-7 text-white h-full'>
			<BadgeInfoModal isOpen={showBadgesInfoModal} closeModal={closeBadgesInfoModal} badgeData={selectedBadge} badgeProgress={selectedBadgeProgress} />
			<div className='w-full flex flex-row my-3 relative'>
				<span>POINTS</span>
				<div className='relative w-full ml-5 flex justify-center bg-white border-2 border-white bg-opacity-40 '>
					<div className='absolute z-10 flex justify-center items-center inset-0 '>
						{userInfo.points | 0} / 1000 points
					</div>
					<div style={{ width: `${(userInfo.points | 0) / 1000 * 100}%` }} className='absolute left-0 bg-green-dark  h-full'>
					</div>
				</div>
				<span className=' flex justify-center items-center absolute -right-3 inset-y-0'>
					<Icon icon="mdi:police-badge" width={40} />
				</span>
			</div>
			<div className='flex flex-col md:flex-row pb-5'>
				<section className='w-full h-full'>
					<div className='flex flex-row justify-start items-start w-full space-x-1	 '>
						{options.map(option => (
							<button key={option.name}
								className={`${currentOption === option.name ? 'bg-white text-gray-dark2 ' : 'bg-white bg-opacity-40 '} 
							py-1 px-1 font-bold rounded-t-sm text-xs sm:text-base`}
								onClick={() => { setCurrentOption(option.name); setTablePage(0) }}>
								{option.name}
							</button>
						))}
					</div>
					{currentOption == 'COLLECTION' ?
						(badgesList && progressList) ?
							<div className='overflow-y-auto max-h-80 grid grid-rows-9 grid-cols-3 md:grid-rows-7 md:grid-cols-5 border border-white w-full space-x-2 p-4'>
								{renderProgress()}
							</div> :
							<div className='border border-white p-3'>
								You have not unlocked badges yet
							</div>
						:
						<div className='flex justify-center items-center py-20 my-2 bg-black bg-opacity-40'>
							<span className='font-black text-yellow text-4xl  px-5 py-2'>Coming Soon!</span>
						</div>
					}
				</section>
			</div >
		</div >
	)
}
