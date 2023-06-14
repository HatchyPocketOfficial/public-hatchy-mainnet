import {Icon} from '@iconify/react'
import type {NextPage} from 'next'
import {useEffect, useState} from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import PageLayout from '../components/PageLayout'
import StakingEditDetail from '../components/Staking/StakingEditDetail'
import StakingEditSection from '../components/Staking/StakingEditSection'
import TotalStakingBonus from '../components/Staking/TotalStakingBonus'
import {useStake} from '../contexts/StakeContext'
import {useWallet} from '../contexts/WalletContext'
import LoadingModal from '../components/LoadingModal'
import Tooltip from '../components/Tooltip'
import {useWeb3React} from '@web3-react/core'
import GenSelector from '../components/Utility/GenSelector'
import {useStakeGen2} from '../contexts/gen2/StakeGen2Context'
import {useAccount} from '../contexts/AccountContext'
import {getStakerAddress} from '../utils/addressHelpers'
import WalletConnectionValidation from '../components/WalletConnect/WalletConnectionValidation'
import {filter, formatHatchyTokenToBigNumber, formatHatchyTokenToInt, formatHatchyTokenToString} from "../utils/numberFormatterHelper";
import StakingEditDetailGen2 from '../components/Staking/StakingEditDetailGen2'
import WeightsTable from '../components/Staking/WeightsTable'
import StakingInfoTable from '../components/Staking/StakingInfoTable'
import Input from '../components/Input'
import {displayError} from '../utils/ErrorMessage'
import StakingClaimReward from '../components/Staking/StakingClaimReward'
import { BigNumber } from 'ethers'
/*
Hierarchy:
staking
	StakingEditSection (default)
		CollectionGridStake
		StakeFromWallet
		UnstakeFromPool

	Advanced View

	StakingEditDetail
		SingleHatchyEditCollection
*/
const StakingPage: NextPage = () => {
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
	const [showEditDetail, setShowEditDetail] = useState("");
	const [totalNFTCount, setTotalNFTCount] = useState(0);
	const [totalNFTCountGen2, setTotalNFTCountGen2] = useState(0);
	const [canClaim, setCanClaim] = useState(false);
	const { login, userInfo, loadingLogging, loadingData } = useAccount();

	const [stakeAmountHatchy, setStakeAmountHatchy] = useState("")
	const [unstakeAmountHatchy, setUnstakeAmountHatchy] = useState("")
	const [loadingModalText, setLoadingModalText] = useState('');

	/*Wallet Data */
	const {
		tokenBalance,
		tokens,
		metadatas,
		gen2Metadatas,
		gen,
		refreshTokenBalance
	} = useWallet();
	/* staking */

	/*Stake NFT Info */
	const {
		userWeight,
		userTotalWeight,
		referralBonus,
		userStakedNFTCount,
		pendingReward,
		communityWeeklyRewards,
		userWeeklyRewards,
		stakedHatchies,
		stakedMetadatas,
		isProcessing,
		hatchyHarvest,
		refreshStake
	} = useStake();

	const {
		isProcessingGen2,
		gen2StakedMetadatas,
		gen2UserWeight,
		stakeSAmountHatchy,
		isTokenApproved,
		approveTokenStaking,
		stakedERC20,
		refreshStakeGen2
	} = useStakeGen2();

	/* Stake $HATCHY */
	const handleStakeAmountHatchy = () => {
		if (stakeAmountHatchy=='') return;
		let amount = formatHatchyTokenToBigNumber(parseFloat(stakeAmountHatchy));
		if (amount.gt(0) ) {
			if(amount.gte(tokenBalance)){
				amount = tokenBalance;
				setStakeAmountHatchy(formatHatchyTokenToString(tokenBalance));
			} 
			setLoadingModalText(`Staking ${formatHatchyTokenToString(amount)} $HATCHY`);
			stakeSAmountHatchy(true, amount).then(() => {
				refreshTokenBalance();
				refreshStakeGen2();
				refreshStake();
			}).catch(() => {
				displayError("Transaction error!")
			}).finally(()=>{
				setStakeAmountHatchy("");
				setLoadingModalText(``);
			})
		} else {
			displayError(`Stake amount cannot be 0`);
		}
	}
	const handleUnstakeAmountHatchy = () => {
		if (unstakeAmountHatchy=='') return;
		let amount = formatHatchyTokenToBigNumber(parseFloat(unstakeAmountHatchy));
		if (amount.gt(0)) {
			if(amount.gte(stakedERC20)){
				amount = stakedERC20;				
				setUnstakeAmountHatchy(formatHatchyTokenToString(stakedERC20));
			}
			setLoadingModalText(`Unstaking ${formatHatchyTokenToString(amount)} $HATCHY`);
			stakeSAmountHatchy(false, amount).then(() => {
				refreshTokenBalance();
				refreshStakeGen2();
			}).catch(() => {
				displayError("Transaction error!")
			}).finally(()=>{
				setUnstakeAmountHatchy("")
				setLoadingModalText(``);
			})
		} else {
			displayError(`Unstake amount cannot be 0`);
		}
	}
	
	const setMaximumStakeToken = ()=>{
		setStakeAmountHatchy(formatHatchyTokenToString(tokenBalance));
	}
	const setMaximumUnstakeToken = ()=>{
		setUnstakeAmountHatchy(formatHatchyTokenToString(stakedERC20));
	}

	const handleClaimReward = async ()=>{
		await hatchyHarvest();
		refreshTokenBalance();
	}

	useEffect(() => {
		if (tokens && userStakedNFTCount) {
			setTotalNFTCount(tokens?.length + userStakedNFTCount.toNumber());
		}
	}, [tokens, userStakedNFTCount]);

	useEffect(() => {
		setTotalNFTCountGen2((gen2Metadatas?.length || 0) + (gen2StakedMetadatas?.length || 0));
	}, [gen2Metadatas, gen2StakedMetadatas]);

	useEffect(() => {
		if (pendingReward) {
			if (pendingReward < 0.005) {
				setCanClaim(false);
			} else {
				setCanClaim(true)
			}
		}
	}, [pendingReward]);

	const renderInitialMessage = () => {
		if (userInfo) return <></>
		if (loadingLogging)
			return (
				<div className='flex flex-col justify-center items-center py-48 '>
					<span className='text-white pb-5 font-bold text-center w-52'>Logging in ...</span>
				</div>
			)
		if (loadingData)
			return (
				<div className='flex flex-col justify-center items-center py-48 '>
					<span className='text-white pb-5 font-bold text-center w-52'>Loading info...</span>
				</div>
			)

		return (
			<div className='flex flex-col justify-center items-center py-48 '>
				<span className='text-white font-bold text-center text-xl 
				bg-black bg-opacity-30 py-1 px-3 mb-10'>
					Please Login before start staking your hatchies
				</span>
				<Button onClick={login} color='green' label={'LOG IN'} />
			</div>
		)
	}

	const { account, provider: library, chainId, isActivating } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;

	let keepLoading = false;
	if (gen == 1) {
		keepLoading = (!metadatas || !stakedMetadatas);
	} else {
		keepLoading = (!gen2Metadatas || !gen2StakedMetadatas);
	}

	return (
		<WalletConnectionValidation
			unconnectedMessage='Connect your wallet to stake your Hatchies'
			keepLoading={keepLoading}
		>
			<PageLayout className='bg-kingdom bg-no-repeat bg-[#141623] pt-20'>
				<div className=" flex flex-col text-center items-center w-full relative 
					h-auto text-white">
					{renderInitialMessage()}
					{/* test-only, should be userInfo && */}
					{userInfo &&
						<section className='w-full flex flex-col justify-center items-center pb-10 mb-10'>
							{(isProcessing || isProcessingGen2) && 
								<LoadingModal text={loadingModalText} />
							}
							<Banner title='STAKING' />
							<a href={`https://snowtrace.io/address/${getStakerAddress(gen)}`}
								target='_blank' rel='noreferrer'
								className='flex flex-row text-yellow bg-black bg-opacity-40 px-4 py-1
									justify-center items-center w-full max-w-xs mb-3 md:max-w-md'>
								<p className='font-bold mr-2'>
									View Staking contract
								</p>
								<Icon icon='akar-icons:arrow-up-right' width={20} />
							</a>
							<div className={`transition-all duration-1000 w-full  flex flex-col justify-center items-center 
								${showEditDetail == "" ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
								<div className={`flex flex-col justify-center items-center w-full px-5 space-y-3 
									max-w-md
									md:max-w-3xl `}>
									<div className='card-frame flex flex-col p-3 w-full items-center
										md:flex-row md:space-x-5 md:justify-between'>
										{/* Claim Reward*/}
										<StakingClaimReward 
											handleClaimReward={handleClaimReward}
											canClaim={canClaim}
										/>
										{/* Gens stats and info*/}
										<StakingInfoTable />
									</div>
								</div>
								<div className='flex flex-col items-center w-full 
									px-10 border-4 border-white mt-5 bg-black bg-opacity-50
									max-w-sm py-5 space-y-5
									md:flex-row md:max-w-2xl md:space-x-20 md:space-y-0'>
									{isTokenApproved?
										<>
											<div className='flex flex-col w-full justify-center'>
												<div className='text-white text-xl font-bold bg-black bg-opacity-80 border border-white px-5 py-2 mb-3
													flex flex-col items-center'>
													<span className={formatHatchyTokenToInt(tokenBalance)<1?`text-neutral-500`:`text-green`}>
														Available $HATCHY&nbsp; 
													</span>
													{formatHatchyTokenToString(tokenBalance)}
													<button
														className='underline font-light text-sm'
														onClick={setMaximumStakeToken}
														disabled={formatHatchyTokenToInt(tokenBalance)<1}
													>
															maximum
													</button>
												</div>
												<Input
													value={stakeAmountHatchy}
													onChange={setStakeAmountHatchy}
													className='w-full p-2 mb-2' placeholder='Amount for stake'
													type="number" min={1}
													disabled={formatHatchyTokenToInt(tokenBalance)<1}
												/>
												<Button
													label='Stake'
													color={formatHatchyTokenToInt(tokenBalance)<1?`black`:`green`}
													disabled={formatHatchyTokenToInt(tokenBalance)<1}
													onClick={handleStakeAmountHatchy}
												/>
											</div>
											<div className='flex flex-col w-full justify-center'>
												<div className='text-white text-xl font-bold bg-black bg-opacity-80 border border-white px-5 py-2 mb-3
													flex flex-col items-center'>
													<span className={stakedERC20.eq(0)?`text-neutral-500`:`text-water`}>
														Staked $HATCHY&nbsp; 
													</span>
													<span>
														{formatHatchyTokenToString(stakedERC20)}
													</span>
													<button
														className='underline font-light text-sm'
														onClick={setMaximumUnstakeToken}
														disabled={stakedERC20.eq(0)}
													>
															maximum
													</button>
												</div>
												<Input
													value={unstakeAmountHatchy}
													onChange={setUnstakeAmountHatchy}
													className='w-full p-2 mb-2' placeholder='Amount for unstake'
													type="number" min={1}
													disabled={stakedERC20.eq(0)}
												/>
												<Button
													label='Unstake'
													color={stakedERC20.eq(0)?`black`:`cyan`}
													disabled={stakedERC20.eq(0)}
													onClick={handleUnstakeAmountHatchy} />
											</div>
										</>
									:
										<div className='w-full'>
											<span>It seems you have not approved token staking.</span><br/>
											<span>Approve it in order to Stake/Unstake your tokens</span>
											<Button label='Approve Token Staking' color='yellow' onClick={approveTokenStaking} />
										</div>
									}
								</div>
								<WeightsTable />
								{/**Instructions */}
								<div className='bg-black bg-opacity-70 p-3 border-yellow border-2 flex w-full max-w-2xl'>
									<p>- Click the green button below to select all the available amount/tokens of hatchies for Staking</p>
									{/* <div className='w-5 h-5 bg-dark border border-white' /> */}
								</div>
								<div className='flex flex-col w-full max-w-xl my-3 justify-between px-2
								md:flex-row'>
									<Button
										label='Stake Hatchies'
										color='green'
										onClick={() => setShowEditDetail('fire')}
									/>
									<Button
										label='Weight Overview'
										color='yellow'
										onClick={() => setShowAdvancedSettings(true)}
									/>
								</div>
								{/* Quick Stake and Unstake (default view) */}
								<div className={`transition-all duration-1000 mb-5
										${!showAdvancedSettings ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
									{stakedHatchies &&
										<StakingEditSection setShowEditDetail={setShowEditDetail} />
									}
								</div>

								{/*showTopSection && */}
								{showAdvancedSettings &&
									<Button label='RETURN' color='green' onClick={() => setShowAdvancedSettings(false)} className='w-full max-w-xl mb-5' />
								}
								{/*Total Staking Bonus*/}
								<div className={`w-full max-w-xl transition-all duration-1000 mb-5 flex flex-col items-center px-2
									${showAdvancedSettings ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
									<div className='flex flex-col  justify-center items-center border border-white h-28 w-full'>
										<span className='w-full md:w-full'>GEN {gen} WEIGHT</span>
										<span className='text-5xl relative'>
											<span className='font-bold'>{gen == 1 ? filter((userWeight.toNumber())) : filter((gen2UserWeight.toNumber()))}</span>
										</span>
									</div>
									<GenSelector />
									{stakedHatchies && <TotalStakingBonus />}
								</div>
							</div>
							{/*EDIT DETAIL SECTION*/}
							<div className={`transition-all duration-1000 mb-5 w-full max-w-4xl px-5
									${showEditDetail != "" ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
								{gen == 1 ?
									<StakingEditDetail setShowEditDetail={setShowEditDetail} showEditDetail={showEditDetail} /> :
									<StakingEditDetailGen2 setShowEditDetail={setShowEditDetail} showEditDetail={showEditDetail} />
								}
							</div>
						</section>
					}
				</div>
			</PageLayout>
		</WalletConnectionValidation>
	)
}

export default StakingPage

