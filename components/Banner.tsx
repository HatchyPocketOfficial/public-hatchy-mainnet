import React from 'react'

interface TitleProps {
	title: string,
	white?: boolean,
	className?: string,
	opacity?: string
}

export default function Banner({ title, white = false, className, opacity }: TitleProps) {
	return (
		<div className={`${white ? 'text-white' : 'text-yellow'} font-government text-2xl relative  
		w-full justify-center items-center flex h-20  ${className}`}>
			{white ?
				<img className={`absolute left-auto w-80 -z-0 opacity-40 ${opacity}`} src="/static/bg/bg_banner_white.png" alt="hatchy pockets logo" />
				:
				<img className='absolute left-auto w-80 -z-0 ' src="/static/bg/bg_banner.png" alt="hatchy pockets logo" />
			}
			<span className='absolute top-7'>{title}</span>
		</div>
	)
}
