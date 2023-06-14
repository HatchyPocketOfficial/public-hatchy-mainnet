import React, { ReactElement, useState, useEffect } from 'react'

interface TooltipProps {
	children: ReactElement,
	text: string,
	place?: "top" | "bottom" | "right" | "left"
	selectMode?: boolean
	selected?: boolean
}
export default function Tooltip({ children, text, place = "top", selectMode=false, selected=false}: TooltipProps) {
	const [show, setShow] = useState(false);
	const [displayTooltip, setDisplayTooltip] = useState(false);
	const newChildren = React.cloneElement(children, {
		onMouseOver: () => {
			if (!selectMode) setShow(true)
		},
		onMouseLeave: () =>{
			if (!selectMode) {
				setShow(false)
				setDisplayTooltip(false);
			}
		}
	});

	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				setDisplayTooltip(true);
			}, 300);
			return () => clearTimeout(timer)
		}
	}, [show])
	
	useEffect(() => {
		if (selectMode) {
			if (selected) {
				setShow(true);	
			} else {
				setShow(false)
				setDisplayTooltip(false);
			}
		}
	}, [selected])
	
	return (
		<div className='relative '>
			{newChildren}
			{ show &&
				<div className={`absolute tooltip-${place} px-3 py-2 rounded-md bg-gray-dark2 text-white z-10
				drop-shadow-opaque
				w-max left-1/2 -mt-4 ${displayTooltip ? 'opacity-100' : 'opacity-0'} transition duration-300`}>
					<span className=''>
						{text}
					</span>
				</div>
			}
		</div>
	)
}