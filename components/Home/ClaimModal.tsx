import { Icon } from '@iconify/react';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import Banner from '../Banner';
import Button from '../Button';
import HatchyCardSmall from './HatchyCardSmall';
import LoadingSpinner from '../Utility/LoadingSpinner';
import { ModalProps } from '../Modal';

interface ClaimModalProps extends ModalProps {
	buyAmount: number
}

export default function ClaimModal({ buyAmount, ...modalProps }: ClaimModalProps) {
	const { loadingMetadatas, metadatas, tokens, refreshWallet } = useWallet();
	const [showMetadatas, setShowMetadatas] = useState(false);
	useEffect(() => {
		refreshWallet();
	}, []);
	useEffect(() => {
		if (modalProps.isOpen) {
			const timer = setTimeout(() => {
				setShowMetadatas(true);
			}, 5000);
			return () => clearTimeout(timer)
		}
	}, [modalProps.isOpen])

	const closeModalAux = () => {
		modalProps.closeModal();
		setShowMetadatas(false);
	}

	if (!modalProps.isOpen) return (<></>)
	return (
		<div className={`${!modalProps.isOpen && 'hidden'} w-full h-screen z-20 transition-opacity duration-700 ${showMetadatas ? 'bg-opacity-80' : 'bg-opacity-100'} bg-hatchAnimation  fixed top-0 left-0 flex justify-center items-center`} >
			<button onClick={closeModalAux} className="absolute right-1 top-2 z-30">
				<Icon icon={"carbon:close"} width={30} />
			</button>
			{
				loadingMetadatas ?
					<LoadingSpinner />
					:
					<>
						<div className={`text-white flex justify-center flex-col transition-opacity duration-700 ${showMetadatas ? 'opacity-100' : 'opacity-0'} z-30`}>
							<div className='flex justify-center w-full mt-3'>
								<Banner title={buyAmount > 1 ? "YOUR NEW HATCHIES" : "YOUR NEW HATCHIE"} white />
							</div>
							<div className="flex overflow-x-auto w-full max-w-xs 
							sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
								<div className='flex flex-row w-auto'>
									{
										metadatas?.slice(0, buyAmount)?.map(hatchy => {
											return <HatchyCardSmall hatchy={hatchy} key={hatchy.tokenId} className='m-5' />
										})
									}
								</div>
							</div>
							<div className="flex flex-col justify-center items-center py-2 space-y-4">
								<Button label='View Wallet' onClick={() => {
									Router.push('/wallet')
								}} className="w-64" />
								<Button label='Stake for $HATCHY' color='cyan' onClick={() => {
									Router.push('/staking')
								}} className="w-64" />
							</div>
						</div>
						<div className={`fixed inset-0 w-full h-auto flex justify-center items-center transition-opacity duration-700 ${showMetadatas ? 'opacity-0' : 'opacity-100'} `}>
							<div className=''>
								<img src={'/static/effects/egg.gif'} alt='hatched egg' width={1000} className="pixelate z-30" />
							</div>
						</div>
					</>
			}
		</div>
	)
}

