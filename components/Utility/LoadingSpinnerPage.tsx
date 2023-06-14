import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingSpinnerProps {
	color?: string
}
export default function LoadingSpinnerPage({color}:LoadingSpinnerProps) {
  	return (
			<div className={`absolute w-full h-full flex flex-col justify-center items-center py-40 ${color || 'text-white'}`}>
				<LoadingSpinner />
				<span className='font-bold text-2xl py-10'>Loading ...</span>
			</div>
	);
}
