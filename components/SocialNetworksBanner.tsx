import Image from 'next/image'
import React from 'react'

export default function SocialNetworksBanner() {
	return (
		<div className='fixed left-0 top-60 z-10'>
			<div className='flex flex-col bg-black bg-opacity-30 p-2 py-5  w-12 space-y-3 social-bar'>
				<a href="https://twitter.com/HatchyPocket" target="_blank" rel="noreferrer">
					<div className='w-8 h-7 relative hover:scale-125'>
						<Image src={"/static/misc/social_twitter.png"} alt="Hatchy Pocket Twitter" layout='fill' />
					</div>
				</a>
				<a href="https://discord.gg/cW378HVjyY" target="_blank" rel="noreferrer">
					<div className='w-8 h-7 relative hover:scale-125'>
						<Image src={"/static/misc/social_discord.png"} alt="Hatchy Pocket Discord" layout='fill' />
					</div>
				</a>
				<a href="https://medium.com/@hatchypocket" target="_blank" rel="noreferrer">
					<div className='w-8 h-8 relative hover:scale-125'>
						<Image src={"/static/misc/social_m.png"} alt="Hatchy Pocket M&M" layout='fill' />
					</div>
				</a>
			</div>
			<div className='social-bar-shadow -z-10 absolute left-0 top-1 w-full h-full' />
		</div>
	)
}
