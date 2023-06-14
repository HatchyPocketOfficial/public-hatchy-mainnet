import Image from "next/image";
import { useEffect, useState } from "react";
import { useWallet } from "../../contexts/WalletContext";
import LoadingSpinner from "./LoadingSpinner";

interface Props{
	loading: boolean
}
export default function LoadingOverlay({loading}:Props) {
	const {splashScreenLoaded, setSplashScreenLoaded} = useWallet();
	const [startAnimation, setStartAnimation] = useState(false);
	const [disable, setDisable] = useState(false);
	const delayForImageLoading = 300;
	const delayForHideOverlay = 500;
	useEffect(() => {
		if(!loading){
			const timer = setTimeout(() => {
				setStartAnimation(true);
			}, delayForImageLoading);
			return () => clearTimeout(timer)
		}
	}, [loading])
	useEffect(() => {
		if(startAnimation){
			const timer = setTimeout(() => {
				setDisable(true);
				setSplashScreenLoaded(true)
			}, delayForHideOverlay);
			return () => clearTimeout(timer)
		}
	}, [startAnimation]);
	
	if (splashScreenLoaded) return <></>;
	return (
		<div className={`fixed w-full h-screen bg-neutral-100 z-30 transition-opacity duration-500 justify-center items-center
		${(!startAnimation)?'opacity-100':'opacity-0'} ${disable?'hidden':'flex'}
		 flex-col`}>
			<div className='w-full h-48 relative flex justify-center items-center
			md:h-60'>
				<Image src={"/hatchy_logo.png"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
			</div>
			<div className="flex flex-row justify-center items-center w-auto mr-8">
				<LoadingSpinner width={40} className='mr-6 text-neutral-700 flex' />
				<span className='font-black text-3xl py-5 text-neutral-700 flex'>Loading</span>
			</div>
		</div>
	)
}
