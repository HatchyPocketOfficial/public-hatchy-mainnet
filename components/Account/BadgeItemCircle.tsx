import React from 'react'
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css";
import { Badge } from '../../types';
import Image from 'next/image';
import { badgesImgs } from '../../constants/badgesData';
interface BadgeItemCircleProps {
	name?: string | undefined,
	progress?: number,
	badgeData?: Badge
	unlocked?: boolean,
	selectBadge?: () => void
}

export default function BadgeItemCircle({ name, progress = 0, badgeData, unlocked, selectBadge }: BadgeItemCircleProps) {
	return (
		<button className='flex flex-col justify-center items-center space-y-3 pb-3
		hover:scale-105 transition-transform'
			onClick={selectBadge}>
			<CircularProgressbarWithChildren value={progress} strokeWidth={5} background
				styles={
					unlocked &&
						progress == 100 ?
						buildStyles({
							pathColor: "#95DC26",
							backgroundColor: "#319B19",
						})
						:
						buildStyles({
							pathColor: "white",
							trailColor: "gray",
							backgroundColor: "#a0a0a0",
						})
				}>
				{
					badgeData?.propertyName && badgesImgs.includes(badgeData.propertyName) &&
					<div className="m-auto w-full h-full relative" >
						<Image src={`/static/badges/${badgeData?.propertyName}.png`}
							alt="egg"
							objectFit='cover'
							layout='fill' />
					</div>
				}
				{/* {unlocked ?
					<div className='text-lime-400'>
						<Icon icon="mdi:police-badge" width={55} />
					</div>
					:
					<Icon icon="ant-design:lock-filled" width={55}></Icon>
				} */}

			</CircularProgressbarWithChildren>
			<span className='h-10 text-xs md:text-base'>{name}</span>
		</button>
	)
}
