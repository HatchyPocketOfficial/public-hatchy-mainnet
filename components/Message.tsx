import React, { ReactNode } from 'react'

interface MessageProps {
	children: ReactNode
}
export default function Message({children}:MessageProps) {
  return (
	<div className='py-52 flex justify-center items-center text-center'>
		<p className='text-2xl'>{children}</p>
	</div>
  )
}
