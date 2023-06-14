import { BigNumber, ethers } from 'ethers';
import Image from 'next/image'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useEgg } from '../../contexts/gen2/EggContext';
import { useWallet } from '../../contexts/WalletContext';
import Button from '../Button'
import Title from '../Title'
import QuantitySelector from './QuantitySelector';

interface EggClaimCardSimpleProps {
	available: BigNumber,
	eggType: string,
	eggPrice: BigNumber,
	mode: number,
	onClaim: (eggType: string, amount: number) => void,
	onHatch: (eggType: string, amount: number) => void,
	quantity: string
	setQuantity: (quantity: string) => void,
}
export default function EggClaimGen2({
	available, eggType, eggPrice, mode, onClaim, onHatch,
	quantity, setQuantity
}: EggClaimCardSimpleProps) {
	const { tokenBalance } = useWallet();
	const hatchyBalance = parseInt(ethers.utils.formatEther(tokenBalance.toString()));
	const [availableEggs, setAvailableEggs] = useState(parseInt(available.toString()));
	const [price, setEggPrice] = useState(parseFloat('0.0'));
	const [maximum, setMaximum] = useState(0);
	const { maxEggPerTx, isApproved, approve } = useEgg();
	const quantityNumber = parseInt(quantity);

	const onClickHandler = () => {
		if (mode == 0) {
			if (!isNaN(quantityNumber) && quantityNumber > 0)
				onClaim(eggType, quantityNumber);
		} else {
			if (!isNaN(quantityNumber) && quantityNumber > 0)
				onHatch(eggType, quantityNumber);
		}
	}

	useEffect(() => {
		const availableQuantity = parseInt(available.toString());
		if (quantityNumber > availableQuantity) {
			setQuantity(availableQuantity.toString());
		}
		setAvailableEggs(quantityNumber);
	}, [available])

	useEffect(() => {
		setEggPrice(parseFloat(parseFloat(ethers.utils.formatEther(eggPrice.toString())).toFixed(3)));
	}, [eggPrice])
	
	useEffect(() => {
		if (mode==0) {
			const availableBalance = Math.floor(hatchyBalance/price); 	
			setMaximum(Math.min(availableBalance, 40));
		} else {
			setMaximum(Math.min(10, parseInt(available.toString())));	
		}
	}, [mode, hatchyBalance, available, price]);
	
	return (
		<div className=' card-shadow'>
			<div className='flex flex-col justify-center claim-egg border-4 border-white relative filter '>
				<div className="relative flex pb-4 pt-2">
					<div className="m-auto w-28 h-28 relative pixelate">
						<Image src={`/static/egg_${eggType}.gif`} alt="egg" layout='fill' />
					</div>
				</div>
				<Title title={eggType} color={eggType.toLowerCase()} />
				<div className='bg-white text-black flex flex-col px-0 pb-3 space-y-3'>
					<div className=' w-full flex flex-row items-center justify-between py-3 px-4
					bg-gray-200 text-lg'>
						<span className='font-bold'>
							{mode == 0 ? 'Remaining:' : 'Your eggs:'}
						</span>
						<span>{parseInt(available.toString())}</span>
					</div>
					<div className='px-4 w-80 '>
						{(isApproved || mode==1) &&
							<>
								<QuantitySelector
									quantity={quantity}
									setQuantity={setQuantity}
									min={0}
									max={maximum}
									warnMessage={`You can only ${mode == 0 ? 'claim' : 'hatch'} max. 20 hatchies per transaction`}
								/>
								{
									maximum > 0 &&
									<span className='text-neutral-600 text-xs'>
										<button
											onClick={() => setQuantity(maximum.toString())}
											className='text-blue-500 underline'>
											Maximum {maximum}
										</button>
									</span>
								}
							</>
						}
						{mode==0?
							(
								isApproved?
									maximum > 0?
									(
										<Button label={quantity == '0' ? 'Claim an egg!' :
											mode == 0 ?
												`CLAIM FOR ${(quantityNumber * price).toFixed(1)} $HATCHY` :
												// `HATCH FOR ${quantity} $HATCHY` }  
												`HATCH ${quantity} EGGS`}
											color={quantity == '0' ? 'black' : mode == 0 ? 'green' : 'cyan'}
											className='w-full'
											onClick={onClickHandler}
											disabled={parseInt(quantity) == 0}
										/>
									):
									(
										<div className='w-full p-3 bg-black bg-opacity-60 border border-white'>
											<span className='text-yellow text-sm'>{price} $HATCHY per egg</span> <br/>
											<span className='text-yellow text-sm'>Stake hatchies in order to get $HATCHY</span>
										</div>
									)
								:<Button label='APPROVE' onClick={approve} />
							):
							(
								(maximum > 0) ?
									<Button label={quantity == '0' ? 'Claim an egg!' :
										mode == 0 ?
											`CLAIM FOR ${(quantityNumber * price).toFixed(1)} $HATCHY` :
											// `HATCH FOR ${quantity} $HATCHY` }  
											`HATCH ${quantity} EGGS`}
										color={quantity == '0' ? 'black' : mode == 0 ? 'green' : 'cyan'}
										className='w-full'
										onClick={onClickHandler}
										disabled={parseInt(quantity) == 0}
									/>:
									<div className='w-full p-3 bg-black bg-opacity-60 border border-white'>
										<span className='text-yellow text-sm'>Claim some eggs to hatch them</span>
									</div>
							)
						}
					</div>
				</div>
			</div>
		</div>
	)
}
