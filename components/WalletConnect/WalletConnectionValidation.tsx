import { useWeb3React } from '@web3-react/core';
import React, { ReactNode } from 'react'
import { DefaultChainID } from '../../constants';
import { setupNetwork } from '../../utils/wallet';
import Button from '../Button';
import PageLayout from '../PageLayout';
import LoadingOverlay from '../Utility/LoadingOverlay';
import ConnectWalletModalWrapper from './ConnectWalletModalWrapper';

interface WalletConnectionValidationProps{
	children: ReactNode	
	unconnectedMessage?: string
	wrongNetworkMessage?: string
	keepLoading?: boolean
}

export default function WalletConnectionValidation({
	children,
	unconnectedMessage,
	wrongNetworkMessage,
	keepLoading=false
}:WalletConnectionValidationProps) {
	const { account, provider: library, chainId, isActivating } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;

/*
	if (isActivating || keepLoading){
		return (
			<LoadingOverlay loading={isActivating || keepLoading==true}/>
		);
	}
	*/

	if (!isConnected) {
		return (
			<PageLayout className='bg-kingdom bg-cover'>
				<LoadingOverlay loading={isActivating}/>
				<div className='min-h-full flex flex-col justify-center items-center py-40'>
					<span className='text-whit text-9xl py-10'>:(</span>
					<ConnectWalletModalWrapper message={unconnectedMessage} />
				</div>
			</PageLayout>
		);
	} else {
		if (chainId !== DefaultChainID) {
			return (
				<PageLayout className='bg-kingdom bg-cover'>
					<LoadingOverlay loading={isActivating}/>
					<div className='min-h-full flex flex-col justify-center items-center py-40'>
						<span className='text-whit text-5xl py-10'>Wrong Network</span>
						<Button label={wrongNetworkMessage || 'Switch Network to view your Hatchies'} onClick={setupNetwork} />
					</div>
				</PageLayout>
			);
		} else {
			return(
				<>
					<LoadingOverlay loading={isActivating || keepLoading}/>
					{children}
				</>
			)
		}
	}
}
