import Image from 'next/image'
import React, { useState } from 'react'
import Button from '../Button'
import { useWeb3React } from '@web3-react/core';
import { DefaultChainID } from '../../constants';
import { setupNetwork } from '../../utils/wallet';
import { MAX_HATCHIES } from '../../utils';
import QuantitySelector from './QuantitySelector';
import ConnectWalletModalWrapper from '../WalletConnect/ConnectWalletModalWrapper';
import { BigNumber, ethers } from 'ethers';

interface EggClaimCardProps {
	totalClaimed: number,
	totalUnclaimed: number,
	price: number,
	currentPrice: string | null,
	balance: number,
	collection: string,
	onClickClaim: (quantity: number) => void
}

export default function EggClaimCard({ totalClaimed, totalUnclaimed, price, currentPrice, balance, collection, onClickClaim }: EggClaimCardProps) {
	const [buyAmount, setBuyAmount] = useState("1")
	const buyAmountNumber = parseInt(buyAmount);
	const bigNumberPrice = currentPrice?BigNumber.from(currentPrice):null;
  const currentPriceFormatted = bigNumberPrice?ethers.utils.formatEther(bigNumberPrice.mul(BigNumber.from(buyAmountNumber))):'0';
	const { account, provider: library, chainId } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;

	const [showShareModal, setShowShareModal] = useState(false)
	const openShareModal = () => setShowShareModal(true);
	const closeShareModal = () => setShowShareModal(false);

	return (
		<div className='flex flex-col justify-center claim-egg border-4 border-white relative w-72'>
			<span className="bg-gray-dark w-20 absolute top-0 right-0">#{totalClaimed + 1 || 0}</span>
			<div className="relative flex py-10">
				<div className="m-auto pixelate w-48 h-48 relative">
					<Image src={"/static/egg-border2.jpg"} alt='' layout='fill' />
				</div>
				<div className="absolute inset-0 -top-2 m-auto pixelate w-40 h-40 flex justify-center items-center">
					<div className='relative w-32 h-32'>
						<Image src={"/static/egg_Default.gif"} alt="egg" layout='fill' />
					</div>
				</div>
			</div>

				<div className='bg-gray-light text-black flex flex-col px-4 pb-3'>
					{isConnected && chainId === DefaultChainID &&
						<>
							<QuantitySelector
								quantity={buyAmount}
								setQuantity={setBuyAmount}
								min={1}
								max={20}
							/>
							<span className='text-neutral-600 text-xs'>
								<button onClick={()=>setBuyAmount('20')} className='text-blue-500 underline'>
									Maximum 20
								</button>
								&nbsp;per transaction
							</span>	
						</>
					}
					{isConnected ?
						chainId === DefaultChainID ?
							<Button
								label={buyAmount == '' ? 'Set a quantity' : `CLAIM FOR ${currentPriceFormatted} AVAX`}
								onClick={() => onClickClaim(buyAmountNumber)}
								color={`${buyAmount == '' ? 'black' : 'yellow'}`}
								disabled={buyAmount == ''}
							/>
							:
							<div>
								<Button label='Switch Network to claim a Hatchie' onClick={setupNetwork} />
							</div>
						:
						<div>
							<ConnectWalletModalWrapper />
						</div>
					}
				</div>
				{isConnected && chainId === DefaultChainID &&
					<div className='bg-white text-gray-dark px-3 py-2 h-full flex flex-col justify-center'>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Total Claimed</span>
							<span>{totalClaimed}</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Total Unclaimed</span>
							<span>{totalClaimed ? MAX_HATCHIES - (totalClaimed || 0) : 0}</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Current Price</span>
							<span>{currentPriceFormatted} AVAX</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Your Balance</span>
							<span>{balance} AVAX</span>
						</div>
						<div className='flex flex-row justify-between'>
							<span className='font-bold'>Owned Hatchies</span>
							<span>{collection}</span>
						</div>
					</div>
				}
		</div>
	)
}
