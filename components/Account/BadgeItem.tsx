import React, { ButtonHTMLAttributes } from 'react'

interface BadgeItemProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  	/** append styling */
  	className?: string
  	/** Button type */
  	selected?: boolean 
}
export default function BadgeItem({className, selected=false, ...defaultProps}:BadgeItemProps) {
  return (
    <button className={`w-12 h-12 bg-green-dark border-yellow border-4 mx-1 ${selected?'bg-opacity-50 border-opacity-50 ':''}`}>
									
    </button>
  )
}
