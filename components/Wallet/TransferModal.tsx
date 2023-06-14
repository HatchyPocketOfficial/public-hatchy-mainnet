import { Icon } from '@iconify/react';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react'
import ABI from '../../abi';
import { useWallet } from '../../contexts/WalletContext';
import useContract from '../../hooks/useContract';
import useTransferHatchy from '../../hooks/useTransferHatchy';
import { Metadata } from '../../types';
import { getHatchyNFTAddress } from '../../utils/addressHelpers';
import { shortenHex } from '../../utils/numberFormatterHelper';
import Button from '../Button';
import QuantitySelector from '../Home/QuantitySelector';
import Input from '../Input';
import LoadingModal from '../LoadingModal';
import Modal, { ModalProps } from '../Modal';

interface TransferModalProps extends ModalProps {
	hatchy: Metadata
	ownedHatchies?: any
}

export default function TransferModal({ hatchy, ownedHatchies, ...modalProps }: TransferModalProps) {
	const { account, provider: library, chainId } = useWeb3React();
	const [receiverAddress, setReceiverAddress] = useState('');
	const hatchyContract = useContract(getHatchyNFTAddress(), ABI.Hatchy, true);
	const gen2Contract = useContract(getHatchyNFTAddress(2), ABI.HatchyPocketGen2, true);
	const { gen, refreshWallet, gen2Wallet } = useWallet();

	const [commonTransferAmount, setCommonTransferAmount] = useState("0")
	const [shinyTransferAmount, setShinyTransferAmount] = useState("0")

	useEffect(() => {
		setReceiverAddress('')
		setCommonTransferAmount('0')
		setShinyTransferAmount('0')
	}, [hatchy])

	const { transferHatchy, loadingTransfer, tranferHatchyGen2 } = useTransferHatchy(hatchyContract, gen2Contract, account);
	//0x553B0c574246fab38Ff449146E1B57310f3E0D31
	const transferHatchyAux = () => {
		if (gen == 1 && hatchyContract && account && hatchy.tokenId) {
			transferHatchy(receiverAddress, hatchy.tokenId, () => {
				refreshWallet();
				gen2Wallet.refreshWallet();
				modalProps.closeModal();
			});
		}
		if (gen == 2 && hatchyContract && account && hatchy.monsterId) {
			if (hatchy.commonQuantity && hatchy.commonQuantity > 0 && parseInt(commonTransferAmount) > 0
				|| hatchy.shinyQuantity && hatchy.shinyQuantity > 0 && parseInt(shinyTransferAmount) > 0) {
				tranferHatchyGen2(receiverAddress, hatchy.monsterId, parseInt(commonTransferAmount), parseInt(shinyTransferAmount), () => {
					refreshWallet();
					gen2Wallet.refreshWallet();
					modalProps.closeModal();
				});
			}
		}
	}
	return (
		<Modal {...modalProps} className='bg-cyan max-h-max w-full max-w-2xl'>
			{loadingTransfer && <LoadingModal />}
			<div className='text-white'>
				<div className='flex justify-center w-full text-xl py-5 relative'>
					<h1 className='font-bold'>Transfer</h1>
					<button onClick={modalProps.closeModal} className={'absolute top-0 right-0'}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div className='flex flex-col w-full justify-center items-center'>
					{gen == 1 &&
						<>
							<span>
								Do you want to transfer {hatchy.name} #{hatchy.tokenId} to {shortenHex(receiverAddress, 8)}?
							</span>
							<Input value={receiverAddress} onChange={setReceiverAddress} min={0.0} step={0.1}
								className={'w-full h-10 max-w-md text-black my-2'}
								placeholder={'Enter a valid C-Chain Address'} />
							<div className='flex space-x-5'>
								<Button label='CANCEL' color='red' onClick={modalProps.closeModal} />
								<Button label='SEND' color='green' onClick={transferHatchyAux} />
							</div>
						</>
					}
					{gen == 2 &&
						<>
							<span>
								Do you want to transfer {hatchy.name} to {shortenHex(receiverAddress, 8)}?
							</span>
							<Input value={receiverAddress} onChange={setReceiverAddress} min={0.0} step={0.1}
								className={'w-full h-10 max-w-md text-black my-2'}
								placeholder={'Enter a valid C-Chain Address'} />
							{(hatchy.shinyQuantity != null && hatchy.shinyQuantity > 0) &&
								<div className='flex flex-row w-1/2 justify-between items-center'>
									<div className='mr-2 text-lg font-bold'>
										Shiny:
									</div>
									<div className='ml-2'>
										<QuantitySelector
											quantity={shinyTransferAmount}
											setQuantity={setShinyTransferAmount}
											min={0}
											max={hatchy.shinyQuantity || 0} />
									</div>
								</div>
							}
							{(hatchy.commonQuantity != null && hatchy.commonQuantity > 0) &&
								<div className='flex flex-row w-1/2 justify-between items-center'>
									<div className='mr-2 text-lg font-bold'>
										Common:
									</div>
									<div className='ml-2'>
										<QuantitySelector
											quantity={commonTransferAmount}
											setQuantity={setCommonTransferAmount}
											min={0}
											max={hatchy.commonQuantity || 0} />
									</div>
								</div>
							}
							<div className='flex space-x-5'>
								<Button label='CANCEL' color='red' onClick={modalProps.closeModal} />
								<Button label='SEND' color='green' onClick={transferHatchyAux} />
							</div>
						</>
					}
				</div>
			</div>
		</Modal>
	)
}
