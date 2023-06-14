import React, { ReactNode, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import Banner from '../Banner'
import Button from '../Button'
import EggClaimGen2 from './EggClaimGen2'
import { ethers } from 'ethers'
import { useEgg } from '../../contexts/gen2/EggContext'
import { useEffect } from 'react'
import ClaimGen2Modal from './ClaimGen2Modal'
import LoadingModal from '../LoadingModal'
import { displayError, displaySuccess, displayWarn } from '../../utils/ErrorMessage'
import Image from 'next/image'
import LoadingSpinner from '../Utility/LoadingSpinner'
import HatchyCardLatest from '../Wallet/HatchyCardLatest'
import useSupply from '../../hooks/useTotalSupply'
import useContract from '../../hooks/useContract'
import { getHatchyNFTAddress, getHatchyPocketEggsGen2Address, getPockyAddress, getUSDTAddress } from '../../utils/addressHelpers'
import ABI from '../../abi'
import { useWeb3React } from '@web3-react/core'
import { DefaultChainID } from '../../constants';
import { Icon } from '@iconify/react'
import useLatestGen2Metadatas from '../../hooks/gen2/useLatestGen2Metadatas'
import Input from '../Input'
import { approveTokens } from '../../utils/contracts'
import useTokenSale from '../../hooks/useTokenSale'
import { formatHatchyTokenToInt } from '../../utils/numberFormatterHelper'
import HatchyApproveForm from './hatchyApproveForm'
import { useAccount } from '../../contexts/AccountContext'

export default function ClaimGen2Section() {
	const { login, userInfo, loadingLogging, loadingData } = useAccount();
	const [showApproval, setShowApproval] = useState(false);
	const [eggType, setEggType] = useState('Lunar')
	const [hatchAmount, setHatchAmount] = useState(1);
	const { tokenBalance, refreshTokenBalance, gen2Metadatas } = useWallet();
	const hatchyBalance = parseInt(ethers.utils.formatEther(tokenBalance.toString()));
	// 0: CLAIM, 1: HATCH 
	const [gen2ModeSelection, setGen2ModeSelection] = useState(0);
	const [lunarQuantity, setLunarQuantity] = useState('1');
	const [solarQuantity, setSolarQuantity] = useState('1');
	const [totalUserEggs, setTotalUserEggs] = useState(0);
	const { latestMetadatas, refreshLatest } = useLatestGen2Metadatas();
	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy);
	const totalClaimed = useSupply(contract)
	const { account, chainId, provider } = useWeb3React();
	const {
		buyTokens,
		claimTokens,
		approveTokenSale,
		isTokenSaleApproved,
		loading: loadingTokenSale,
		availableTokens,
		claimableAmount,
		soldAmount,
		active: tokenSaleActive
	} = useTokenSale();
	
	const [tokenBuyAmount, setTokenBuyAmount] = useState(2000);

	const {
		userLunarEggs,
		userSolarEggs,
		lunarEggsAvailable,
		solarEggsAvailable,
		buyEggs,
		hatchEggs,
		eggPrice,
		isApproved,
		isProcessing
	} = useEgg();

	const [showModal, setShowModal] = useState(false);
	const closeModal = () => setShowModal(false);

	const claimEgg = (eggType: string, amount: number) => {
		if (eggPrice.mul(amount).gt(tokenBalance)) {
			displayError("Insufficient token balance!");
			return;
		}
		const type = (eggType == 'Solar') ? 0 : 1;
		buyEggs(type, amount).then((data) => {
			if (data.success) {
				displaySuccess(`Successful claim of ${amount} eggs`)
				setSolarQuantity('1');
			} else {
				displayError("Transaction cancelled");
			}
		}).catch(err => {
			displayError("Transaction error");
		});
	}

	const hatchEgg = (eggType: string, amount: number) => {
		const type = (eggType == 'Solar') ? 0 : 1;
		hatchEggs(type, amount).then((data) => {
			if (data && data.success) {
				setEggType(eggType);
				setShowModal(true);
				setHatchAmount(amount);
				displaySuccess(`${amount} eggs hatched successfully`)
				setLunarQuantity('1');
				refreshLatest();
			} else {
				displayWarn(`Hatch cancelled.`);
			}
		}).catch(err => {
			displayError("Transaction error");
		});
	}

	useEffect(() => {
		if (gen2ModeSelection == 0) {
			const price = parseFloat(parseFloat(ethers.utils.formatEther(eggPrice.toString())).toFixed(3));
			const availableBalance = Math.floor(hatchyBalance / price);

			const updatedQuantity = availableBalance > 0 ? '1' : '0';
			setSolarQuantity(updatedQuantity);
			setLunarQuantity(updatedQuantity);
		} else {
			setSolarQuantity(userSolarEggs.toNumber() > 0 ? '1' : '0');
			setLunarQuantity(userLunarEggs.toNumber() > 0 ? '1' : '0');
		}
	}, [gen2ModeSelection, hatchyBalance])

	useEffect(() => {
		refreshTokenBalance();
	}, [isProcessing])

	useEffect(() => {
		setTotalUserEggs(userSolarEggs.toNumber() + userLunarEggs.toNumber());
	}, [userSolarEggs, userLunarEggs]);

	function renderLatestHatched() {
		if (latestMetadatas == null) return < LoadingSpinner />
		if (latestMetadatas.length == 0) return <span className='ml-5'>No hatch yet</span>
		let latest: ReactNode[] = []
		for (let i = 0; i < latestMetadatas.length; i++) {
			latest.push(
				<HatchyCardLatest key={i}
					hatchy={latestMetadatas[i]}
					count={latestMetadatas[i].quantity?.toString()}
					isCollapse />
			)
		}
		return latest;
	}
	const renderInitialMessage = () => {
		if (userInfo) return <></>
		if (loadingLogging)
			return (
				<div className='flex flex-col justify-center items-center py-48 w-full'>
					<span className='text-white pb-5 font-bold text-center w-52'>Logging in ...</span>
				</div>
			)
		if (loadingData)
			return (
				<div className='flex flex-col justify-center items-center py-48 w-full'>
					<span className='text-white pb-5 font-bold text-center w-52'>Loading info...</span>
				</div>
			)

		return (
			<div className='flex flex-col justify-center items-center py-48 w-full'>
				<span className='text-white font-bold text-center text-xl 
				 py-1 px-3 mb-10'>
					Please login to claim/hatch your eggs
				</span>
				<Button onClick={login} color='green' label={'LOG IN'} />
			</div>
		)
	}

	return (
		<section className='bg-purple-image flex flex-col px-8 text-center text-gray-200 items-center py-20 space-y-2
			 w-full'>
			{(isProcessing || loadingTokenSale) && <LoadingModal />}
			<ClaimGen2Modal isOpen={showModal} closeModal={closeModal} eggType={eggType} />
			<Banner title='GEN 2' />
			<a href={`https://snowtrace.io/address/${getHatchyNFTAddress(2)}`}
				target='_blank' rel='noreferrer'
				className='flex flex-row text-yellow bg-black bg-opacity-40 px-4 py-1
				justify-center items-center w-full max-w-xs md:max-w-xl '>
				<p className='font-bold mr-2'>
					Hatchy Pocket Gen 2 contract
				</p>
				<Icon icon='akar-icons:arrow-up-right' width={20} />
			</a>
			<div className='flex flex-col justify-center items-center w-full 
			md:space-y-0 
			lg:max-w-5xl '>
				<div className='flex flex-col w-full max-w-xs
				md:space-x-5 md:flex-row md:max-w-full justify-center'>
					<div className='flex flex-col'>
						<a href={`https://snowtrace.io/address/${getPockyAddress()}`}
							target='_blank' rel='noreferrer'
							className='flex flex-row text-yellow bg-black bg-opacity-40 px-4 py-1
						justify-center items-center w-full mb-2'>
							<p className='font-bold mr-2'>
								View $HATCHY contract
							</p>
							<Icon icon='akar-icons:arrow-up-right' width={20} />
						</a>
						<div className='text-white  bg-black bg-opacity-80 border border-white px-5 py-2 mb-7
							flex flex-col items-center '>
							<div className='flex flex-row items-center text-xl font-bold'>
								<span className='text-green'>$HATCHY&nbsp; </span>
								{parseFloat(ethers.utils.formatEther(tokenBalance.toString())).toFixed(3)}
							</div>
							<span className='underline cursor-pointer text-sm font-medium'
								onClick={()=>setShowApproval(!showApproval)}>
								{showApproval?'Hide':'Show'} Advanced
							</span>
							{showApproval &&
								<HatchyApproveForm />
							}
						</div>
					</div>
					<div className='flex flex-col'>
						<a href={`https://snowtrace.io/address/${getHatchyPocketEggsGen2Address()}`}
							target='_blank' rel='noreferrer'
							className='flex flex-row text-yellow bg-black bg-opacity-40 px-4 py-1
						justify-center items-center w-full mb-2'>
							<p className='font-bold mr-2'>
								View Eggs contract
							</p>
							<Icon icon='akar-icons:arrow-up-right' width={20} />
						</a>
						<div className='text-white text-xl font-bold bg-black bg-opacity-80 border border-white mb-7
						flex flex-row justify-between w-full h-16
						md:w-72'>
							<div className='flex flex-row items-center w-1/2 justify-center bg-wate'>
								<div className='relative w-8 h-10 mr-3'>
									<Image src={"/static/egg_Solar.gif"} alt="egg" layout='fill' objectFit='contain' />
								</div>
								<span className='text-2xl'>{userSolarEggs.toNumber()}</span>
							</div>
							<div className='w-[1px] h-full bg-white flex' />
							<div className='flex flex-row items-center w-1/2 justify-center bg-gree'>
								<div className='relative w-8 h-10 mr-3'>
									<Image src={"/static/egg_Lunar.gif"} alt="egg" layout='fill' objectFit='contain' />
								</div>
								<span className='text-2xl'>{userLunarEggs.toNumber()}</span>
							</div>
						</div>
					</div>
				</div>
				{/* 
				<div className='w-full flex flex-col justify-center items-center text-white max-w-xs
				md:max-w-xl'>
					<div className='text-white bg-black border flex flex-col py-2 px-5 pb-3'>
						<span className='text-xl font-bold'>$HATCHY SALE</span>
						Claim $HATCHY Tokens at a discount now! All Tokens will be released and redeemable when the Token sale is completed.
						<br />Check the progress below:
					</div>
					<div className='w-full flex flex-row my-3 relative h-8'>
						<div className='relative w-full flex justify-center bg-white border-2 border-white bg-opacity-40 '>
							<div className='absolute z-10 flex justify-center items-center inset-0 '>
								{formatHatchyTokenToInt(soldAmount).toLocaleString()} / {(50000000).toLocaleString()}
							</div>
							{availableTokens.gt(0) &&
								<div
									style={{
										width: `${formatHatchyTokenToInt(soldAmount) / 50000000 * 100}%`
									}}
									className='absolute left-0 bg-green-dark  h-full' />
							}
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center items-center space-y-5 w-full max-w-xs pb-5 bg-blue-30
				md:flex-row md:space-y-0 md:space-x-5 md:max-w-xl'>
					{isTokenSaleApproved ?
						<div className='flex flex-col justify-center items-center space-y-5 w-full max-w-xs pb-5 bg-blue-30
							md:flex-row md:space-y-0 md:space-x-5 md:max-w-xl'>
							{tokenSaleActive &&
								<div>
									<Input
										value={tokenBuyAmount}
										onChange={setTokenBuyAmount}
										className='w-full h-10'
									/> 
									<Button
										label={`Buy $HATCHY for ${tokenBuyAmount*0.001} USDT`}
										className='md:w-80'
										color={
											tokenBuyAmount<=formatHatchyTokenToInt(availableTokens.sub(soldAmount))?
											'yellow': 'black'
										}
										disabled={
											tokenBuyAmount>formatHatchyTokenToInt(availableTokens.sub(soldAmount))
										}
										onClick={()=>buyTokens(tokenBuyAmount)}
									/>
								</div>
							}
							<div>
								<Button
									label={`Claim ${formatHatchyTokenToInt(claimableAmount)} $HATCHY`}
									color={claimableAmount.eq(0) ? 'black' : 'green'}
									disabled={claimableAmount.eq(0)}
									className='md:w-80'
									onClick={claimTokens}
								/>
							</div>
						</div> :
						<Button label='Approve USDT to buy $HATCHY' className='md:w-80' onClick={approveTokenSale} />
					}
				</div>
				*/}
				<>
					<div className='flex flex-col md:flex-row mb-5 w-full max-w-xl
				lg:max-w-3xl'>
						{/*PROBABILITIES */}
						<div className='flex flex-col text-black md:w-full bg-black bg-opacity-20'>
							<span className='w-full text-white bg-purple-dark text-left px-5 py-1 font-bold'>PROBABILITIES</span>
							<div className='w-full p-5 flex flex-col space-y-4 '>
								<span className='w-full border border-black text-left px-2 py-1 font-bold bg-purple-light text-white'>All monsters are equal odds</span>
								<span className='w-full border border-black text-left px-2 py-1 bg-purple-light text-white'>2.8% chance for shiny</span>
							</div>
						</div>
					</div>
					{/*LATEST HATCHED */}
					<div className='flex flex-col w-full max-w-xl
				lg:max-w-3xl'>
						<div className='flex flex-row text-white bg-purple-dark px-5 py-1 w-full'>
							<span className='m-auto ml-0 font-bold'>LATEST HATCHED</span>
						</div>
						<div className='flex flex-row overflow-x-auto overflow-y-hidden py-3 bg-purple-light w-full'>
							{chainId === DefaultChainID ? (
								totalClaimed ? renderLatestHatched() :
									<p className='pl-5 pb-10'>
										Connect to your wallet to see the latest hatched eggs.
									</p>
							) :
								<p className='pl-5 pb-10'>
									Switch network to see the latest hatched eggs.
								</p>
							}
						</div>
					</div>
				</>
				<div className='flex flex-col md:flex-row justify-center pb-5'>
					<div className={`w-full md:w-1/3 mb-5 bg-black bg-opacity-60 mt-3 p-4 border border-white
					${gen2ModeSelection == 0 ? 'text-yellow' : 'text-white'}
					sm:mx-3`}>
						<p className='mb-4'>
							Claim:<br />
							Claim an egg exclusively with $HATCHY currency, get some through staking or from secondary markets.
						</p>
						<Button label='CLAIM' color='black' selected={gen2ModeSelection == 0} onClick={() => setGen2ModeSelection(0)} />
					</div>
					<div className={`w-full md:w-1/3 mb-5 bg-black bg-opacity-60 mt-3 p-4 border border-white relative
					${gen2ModeSelection == 1 ? 'text-yellow' : 'text-white'} 
					sm:mx-3`}>
						<p className='mb-4'>
							Hatch:<br />
							Hatch one of the claimed eggs for an all new gen 2 monster! Over 100 to collect! lets hatch!
						</p>
						<div className='relative'>
							<Button label='HATCH' color='black' selected={gen2ModeSelection == 1} onClick={() => setGen2ModeSelection(1)} />
						</div>
						{totalUserEggs > 0 &&
							<span className='absolute -top-3 -right-3 font-bold text-white w-7 h-7 text-xl flex justify-center items-center
							bg-fire rounded-full'>
								{totalUserEggs}
							</span>
						}
					</div>
				</div>
				<div className='flex flex-col space-y-10 bg-opacity-20 bg-black p-5 lg:w-full max-w-3xl
				lg:p-10 lg:flex-row lg:space-y-0 lg:space-x-10 lg:pt-10 '>
					{renderInitialMessage()}
					{userInfo &&
						<>
							<EggClaimGen2 mode={gen2ModeSelection} eggType={'Solar'} onClaim={claimEgg} onHatch={hatchEgg}
								available={gen2ModeSelection == 0 ? solarEggsAvailable : userSolarEggs} eggPrice={eggPrice} quantity={solarQuantity} setQuantity={setSolarQuantity} />

							<EggClaimGen2 mode={gen2ModeSelection} eggType={'Lunar'} onClaim={claimEgg} onHatch={hatchEgg}
								available={gen2ModeSelection == 0 ? lunarEggsAvailable : userLunarEggs} eggPrice={eggPrice} quantity={lunarQuantity} setQuantity={setLunarQuantity} />
						</>
					}
				</div>
			</div>
			{/*<Button label='test modal' color='cyan' onClick={()=>setShowModal(true)}	/>
	*/}
		</section>
	)
};