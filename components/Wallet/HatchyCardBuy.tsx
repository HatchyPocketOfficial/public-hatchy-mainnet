import Image from 'next/image'
import Router from 'next/router'
import React, { useState } from 'react'
import ABI from '../../abi'
import { useWallet } from '../../contexts/WalletContext'
import useBazaar from '../../hooks/useBazaar'
import useBuyToken from '../../hooks/useBuyToken'
import useCancelTokenSale from '../../hooks/useCancelTokenSale'
import useContract from '../../hooks/useContract'
import useFetchGraphMarket from '../../hooks/useFetchGraphMarket'
import useSellToken from '../../hooks/useSellToken'
import { Metadata } from '../../types'
import { shortenHex } from '../../utils'
import { getHatchyNFTAddress } from '../../utils/addressHelpers'
import { formatHatchyPrice } from '../../utils/numberFormatterHelper'
import Button from '../Button'
import ConfimationModal from '../Utility/ConfimationModal'
import HatchyIcon from '../HatchyIcon'
import Input from '../Input'
import LoadingModal from '../LoadingModal'
import Title from '../Title'
import Link from 'next/link'
import { isShinyHatchy } from '../../utils/metadataArraysUtils'

interface HatchyCardBuyProps {
	hatchy: Metadata
	owned: boolean
	shiny: boolean
	onTransfer: () => void
	onBuyHatchy: () => void
	price: number
	setPrice: (num: number) => void
	className?: string
	isStaked?: boolean
}
export default function HatchyCardBuy({ hatchy, owned, shiny, onTransfer, onBuyHatchy, price, setPrice, className = '', isStaked }: HatchyCardBuyProps) {
	//console.log(hatchy);
	/*Fetch marketplace data */
	const { listings, total: totalPages } = useFetchGraphMarket(hatchy.monsterId.toString(), 1, "asc", "ALL", shiny ? true : "ALL");
	/*Fetch only the first hatchy on sale */
	const hatchyOnSale = listings[0];
	const ref = React.useRef<HTMLDivElement>(null);

	const [showConfirmSell, setShowConfirmSell] = useState(false);
	// const [showMarketplaceInfo, setShowMarketplaceInfo] = useState(false);

	const hatchyContract = useContract(getHatchyNFTAddress(), ABI.Hatchy, true);
	const { sellToken, loadingSell } = useSellToken(hatchyContract);
	const { buyToken, loadingBuy } = useBuyToken(hatchyContract);
	const { cancelTokenSale, loadingCancelTokenSale } = useCancelTokenSale(hatchyContract);

	const { onSale, price: ownedHatchyPrice } = useBazaar(hatchyContract, hatchy.tokenId);
	const { refreshWallet, gen } = useWallet();

	const getSerial = () => {
		if (owned) {
			return hatchy.isShiny ? hatchy.serial : (hatchy.serial || 25) - 25;
		} else {
			if (hatchyOnSale == null) return 0;
			return hatchyOnSale.isShiny ? hatchyOnSale.serial : (hatchyOnSale.serial || 25) - 25;
		}
	}
	const onConfirmSell = () => {
		if (hatchy.tokenId)
			sellToken(price, hatchy.tokenId, () => {
				setShowConfirmSell(false);
			});
	}
	const onBuyToken = () => {
		//hardcoded
		//buyToken("110", "1000000000000000000", ()=>{
		buyToken(hatchyOnSale.tokenId, hatchyOnSale.price, () => {
			refreshWallet();
		})
	}

	const onCancelTokenSale = () => {
		if (hatchy.tokenId)
			cancelTokenSale(hatchy.tokenId, () => {
				refreshWallet();
			})
	}

	return (
		<div className=' max-w-xs w-full min-w-xs self-start' ref={ref}>
			<ConfimationModal isOpen={showConfirmSell} closeModal={() => setShowConfirmSell(false)} onConfirm={onConfirmSell}
				message={`Are you sure you want to SELL ${hatchy.name} #${hatchy.tokenId} for ${price} AVAX?`} />
			{loadingSell && <LoadingModal text='Selling your hatchie' />}
			{loadingBuy && <LoadingModal text='Processing the purchase' />}
			{loadingCancelTokenSale && <LoadingModal text='Canceling the token sale' />}
			<div className='card-shadow'>
				<div className='flex flex-col justify-center claim-egg border-4 border-white relative
				 card-shadow'>
					<div className={`flex flex-row p-4 title-${hatchy.element.toLowerCase()} relative`}>
						<HatchyIcon hatchy={hatchy} gen={gen} hideTooltip />
						<Title title={`#${getSerial() || hatchy.name}`} className='w-2/3 pt-5 my-1' />
					</div>
					{owned ?
						<div className='bg-white text-gray-dark px-6 py-3 flex flex-col relative space-y-2'>
							<h1 className='text-left text-2xl font-black'>Owned</h1>
							{
							gen == 1 ? 
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Egg number</span>
									<span>{hatchy.tokenId}</span>
								</div>
							:
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Hatchie ID</span>
									<span>{hatchy.monsterId}</span>
								</div>
							}
							
							{
							gen == 1 && 
							<div className='flex flex-row justify-between'>
								<span className='font-bold'>Shiny</span>
								<span>{isShinyHatchy(hatchy) ? "Yes" : "No"}</span>
							</div>
							}
							
							{isStaked &&
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Staked</span>
									<span>Yes</span>
								</div>
							}
							{onSale ?
								<>
									<h1 className='text-left text-2xl pt-3'>On Sale</h1>
									<div className='flex flex-row justify-between items-center '>
										<span>Current Price:</span>
										<div className='flex flex-row space-x-3'>
											<div className='w-7 h-7 relative'>
												<Image src={'/static/avax.png'} alt='Powered by Avalanche' layout='fill' />
											</div>
											<span className='text-lg'>
												{/*formatHatchyPrice(ownedHatchyPrice)*/}
												{formatHatchyPrice(ownedHatchyPrice)}
											</span>
										</div>
									</div>
									<div className='flex flex-row justify-between items-center'>
										<Input value={price} type='number' onChange={setPrice} min={0.0} step={1} />
										<Button label='CHANGE PRICE' color='green' className='w-44 px-0' onClick={() => setShowConfirmSell(true)} />
									</div>
									<Button label='CANCEL SALE' color='yellow' className='w-full' onClick={onCancelTokenSale} />
								</>
								:
								isStaked ?
									<span className='text-neutral-500'>
										<span className='text-blue-500 underline-offset-2 underline'>
											<Link href={'/staking'}>Unstake</Link>
										</span>
										&nbsp;hatchie in order to sell or transfer
									</span>
									:
									gen == 1 ?
										<>
											<div className='flex flex-row justify-between items-center'>
												<Input value={price} type='number' onChange={setPrice} min={0.0} />
												<Button label='SELL' color='green' className='w-32 px-0' onClick={() => setShowConfirmSell(true)} />
											</div>
											<Button label='Transfer' color='yellow' className='w-full' onClick={onTransfer} />
											<span className='text-blue-500 underline-offset-1 underline text-sm text-center'>
												<Link href={'/transfer-gen1'}>view advanced batch transfer</Link>
											</span>
										</>
										:
										<>
											<Button label='Transfer' color='yellow' className='w-full' onClick={onTransfer} />
											<span className='text-blue-500 underline-offset-1 underline text-sm text-center'>
												<Link href={'/transfer-gen2'}>view advanced batch transfer</Link>
											</span>
										</>
							}
						</div>
						: ''}
					{hatchyOnSale ?
						<div className='bg-gray-light text-gray-dark text-left px-6 py-3 '>
							<div className='flex flex-row justify-between'>
								<h1 className='text-left text-xl font-black'>Marketplace</h1>
							</div>
							<div className={'max-h-56 transition-max-height duration-300'}>
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Egg number</span>
									<span>{hatchyOnSale.tokenId}</span>
								</div>
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Shiny</span>
									<span>{hatchyOnSale.isShiny ? 'Yes' : 'No'}</span>
								</div>
								<div className='flex flex-row justify-between'>
									<span className='font-bold'>Owner</span>
									<span className='cursor-pointer' onClick={() => Router.push('/address/' + hatchyOnSale.owner)}>{shortenHex(hatchyOnSale.owner, 8)}</span>
								</div>
								<div className='flex flex-row justify-between items-center'>
									<div className='w-7 h-7 relative'>
										<Image src={'/static/avax.png'} alt='Powered by Avalanche' layout='fill' />
									</div>
									<span className='px-6 font-black text-xl'>{formatHatchyPrice(hatchyOnSale.price)}</span>
									<Button label='BUY NOW' color='green' className='w-32 px-0' onClick={onBuyToken} />
								</div>
							</div>
						</div>
						: <span className='bg-white py-2 px-5'>No {hatchy.name} hatchies for sale</span>}
				</div>
			</div>
			{/*
				<div className='flex justify-center items-center mt-5'>
					<Button label='Batch Transfer' className='w-full' color='green' />
				</div>
			*/}
		</div>
	)
}
