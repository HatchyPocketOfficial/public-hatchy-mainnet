import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
	/** Button content */
  label: string
	/** Width full */
	full?: boolean
  /** append styling */
  className?: string
  /** Button type */
  selected?: boolean 
  /** Button type */
  color?: 'yellow' | 'green' | 'cyan' | 'black' | 'red'
  /** onClick handler*/
}

export default function Button({label, full=false, className, selected=false, color='yellow', ...defaultProps}:ButtonProps) {
	return (
		<button className={`btn-hatchy ${color} ${selected?'selected':''} pb-2 pt-4 px-10 ${className} ${full?'w-full':''} `}
		{...defaultProps}>
			{label}	
		</button>
	)
}
