import { Icon } from '@iconify/react';
import React from 'react'

interface LoadingModalProps {
	text?: string
}

export default function LoadingModal({ text }: LoadingModalProps) {
	return (
		<div className={` w-full h-screen z-20 bg-black bg-opacity-50 fixed top-0 left-0 flex justify-center items-center`}>
			<div className={`w-80 max-w-3xl p-5 pt-2 max-h-2xl overflow-y-auto shadow-xl bg-cyan`}>
				<div className='text-white'>
					<div className='flex justify-center w-full text-xl py-5'>
						<h1>Loading...</h1>
					</div>
					<div className='flex justify-center w-full py-5'>
						<Icon icon="uiw:loading" className='animate-spin' width={100} />
					</div>
					<span className='flex justify-center'>
						{text}
					</span>
				</div>
			</div>
		</div>
	)
}
