import React from 'react'

interface TitleProps {
	title: string
	className?: string
	color?: string
}
export default function Title({ title, className, color }: TitleProps) {
	return (
		<div className={`title-${color} relative py-2 px-10 text-center text-xl text-white ${className} `}>
			<span className='z-10 relative font-black'>{title}</span>
		</div>
	)
}
