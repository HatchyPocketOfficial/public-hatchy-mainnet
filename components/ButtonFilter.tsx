import React, { ButtonHTMLAttributes } from 'react'

interface ButtonFilterProps extends ButtonHTMLAttributes<HTMLButtonElement>{
	/** Button content */
  	label: string;
  	/** append styling */
  	className?: string
  	/** Button type */
  	selected?: boolean 
}

export default function ButtonFilter({label, className, selected=false, ...defaultProps}:ButtonFilterProps) {
	return (
		<button className={`border border-white  py-1  px-2 
		${selected?'bg-white text-black':'bg-black bg-opacity-40 text-white hover:bg-opacity-60 '} ${className}`}
		{...defaultProps}>
			{label}	
		</button>
	)
}
