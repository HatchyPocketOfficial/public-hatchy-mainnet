import React from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';
interface FooterProps{
	colored?: boolean
}
export default function Footer({colored=false}: FooterProps) {
	return (
		<footer className={`absolute bottom-0 w-full py-5 ${colored && 'bg-black'}`}>
			<div className='w-full relative'>
				<div className='flex m-auto justify-center'>
					<a
					href='https://twitter.com/HatchyPocket'
					target="_blank"
					rel="noopener noreferrer">
						<Icon icon="logos:twitter" className='mx-1' width={25}/>
					</a>
					<a
					href='https://discord.com/invite/cW378HVjyY'
					target="_blank"
					rel="noopener noreferrer">
						<Icon icon="logos:discord-icon" className='text-white mx-1' width={25}/>
					</a>
				</div>  
				<div className='text-white text-center font-bold mt-5 text-sm
				sm:mt-2'>
					<p className=''>Hatchy Pockets 2023 ©</p>
				</div>
				<div className='absolute inset-0 left-3 w-min'>
					<a className='w-40 h-10 relative flex ' href='https://www.avax.network/'
					target="_blank" rel='noreferrer'>
						<Image src={'/static/poweredbyNew.png'} alt='Powered by Avalanche' layout='fill'
						objectFit='contain'/>
					</a>
				</div>
			</div>
		</footer>
	)
}
	