import { Icon } from '@iconify/react';
import React from 'react'
import Banner from '../Banner';
import Modal, { ModalProps } from '../Modal';
import Metamask from "./icons/Metamask";
import Core from "./icons/Core";
import { useWeb3React } from '@web3-react/core';
import useWalletConnect from '../../hooks/web3/useWalletConnect';


interface ConnectWalletModalProps extends ModalProps {
}

export default function ConnectWalletModal({ ...modalProps }: ConnectWalletModalProps) {
	const { chainId, connector, provider } = useWeb3React()
	const { getLastWallet, connectWithMetamask, connectWithCore } = useWalletConnect();

	const connectWithMetamaskHandler = () => {
		connectWithMetamask().then(res => {
			modalProps.closeModal();
		})
	}

	const connectWithCoreHandler = () => {
		connectWithCore().then(res => {
			modalProps.closeModal();
		})
	}

	return (
		<Modal {...modalProps} className='bg-turquoise w-full max-w-sm relative'>
			<Banner title={'Connect Your Wallet'} white />
			<div className='text-white p-5 -mt-10'>
				<div className='flex justify-end w-full mb-3 absolute top-2 right-1'>
					<button onClick={modalProps.closeModal}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div>
					<h2 className="font-medium text-lg mt-3 text-center">Connect with one of our available wallet providers below.</h2>
					<div className='flex flex-col justify-center items-center w-full space-y-5 mt-5'>
						<button
							className={`flex flex-row bg-white bg-opacity-25 px-3 py-2 items-center
							hover:bg-opacity-40 ease-in-out transition-colors w-52 h-12 border`}
							onClick={connectWithMetamaskHandler}>
							<span className="mr-4"><Metamask width="30" /></span>
							<span className="text-lg lg:text-xl text-center font-extrabold w-full">Metamask</span>
						</button>
						<button
							className={`flex flex-row bg-white bg-opacity-25 px-3 py-2 items-center
							hover:bg-opacity-40 ease-in-out transition-colors w-52 h-12 border`}
							onClick={connectWithCoreHandler}>
							<span className="mr-4"><Core width="60" /></span>
							<span className="text-lg lg:text-xl text-center font-extrabold w-full">Core</span>
						</button>
					</div>
					<p className="text-neutral-200 mt-8 text-xs text-center">We do not own your private keys and cannot access your funds without your confirmation</p>
				</div>
			</div>
		</Modal>
	)
}
