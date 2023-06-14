import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SplashScreenProps {
}
export default function SplashScreen({ }: SplashScreenProps) {
	const [show, setShow] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, 500);
		return () => clearTimeout(timer)
	}, []);

	return (
		<div className={`fixed inset-0  min-h-full flex flex-col justify-center items-center py-40 bg-white text-neutral-800
		${show ? 'opacity-100 z-30' : 'opacity-0 z-0'} ease-in-out transition-all duration-500`}>
			<LoadingSpinner />
		</div>
	);
}
