import React, { ReactNode, useState } from 'react'
import { Icon } from '@iconify/react'

interface DropdownProps {
	children?: ReactNode
	title: string,
	answer?: string,
	className?: string,
}

export default function Dropdown({ children, title, answer, className }: DropdownProps) {
	const [down, goDown] = useState(false)
	return (
		<div className={className + " select-none my-3 md:w-1/2 w-3/4 text-left"}>
			<div onClick={() => goDown(!down)} className="bg-gray-dark2 w-full p-2 flex justify-between items-center hover:cursor-pointer">
				<div className='flex flex-row items-center'>
					<Icon icon="akar-icons:question-fill" className='text-green-dark mr-4 ml-2' />
					<h1 className='text-yellow font-bold'>
						{title}
					</h1>
				</div>
				<div>
					{down ?
						<Icon icon="fe:drop-up" className='text-yellow' />
						:
						<Icon icon="fe:drop-down" className='text-yellow' />
					}
				</div>
			</div>
			<div className={`border border-yellow bg-gray-dark2 overflow-hidden transition-max-height
                 ${down ? 'max-h-[100rem]' : 'max-h-0'} duration-300 ease-in-out `}>
				<div className='text-yellow font-light px-3 py-1'>
					{children}
				</div>
			</div>
		</div>
	)
}
