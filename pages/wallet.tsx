import type { NextPage } from 'next'
import React, { useEffect, useState, useRef } from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import CollectionGridWallet from '../components/Wallet/CollectionGridWallet'
import HatchyCardBuy from '../components/Wallet/HatchyCardBuy'
import HatchyCardInfo from '../components/Wallet/HatchyCardInfo'
import LoadingModal from '../components/LoadingModal'
import PageLayout from '../components/PageLayout'
import ShareModal from '../components/Wallet/ShareModal'
import TokenItem from '../components/Wallet/TokenItem'
import TransferModal from '../components/Wallet/TransferModal'
import { useWallet } from '../contexts/WalletContext'
import HatchiesData from "../public/static/characters.json";
import { HatchyStatsObject, Metadata } from '../types'
import { useStake } from '../contexts/StakeContext'
import WalletCollectionFilters from '../components/Wallet/WalletCollectionFilters'
import WalletConnectionValidation from '../components/WalletConnect/WalletConnectionValidation'
import GenSelector from '../components/Utility/GenSelector'
import { getHatchieData, getHatchieFilteredCount, getHatchiesFilteredByMonsterID } from '../utils/metadataArraysUtils'
import { useStakeGen2 } from '../contexts/gen2/StakeGen2Context'
import WalletStatsTable from '../components/Wallet/WalletStatsTable'
import LoadingSpinner from '../components/Utility/LoadingSpinner'

const WalletPage: NextPage = () => {
	const [automaticScroll, setAutomaticScroll] = useState(true);
	const [selectedHatchy, setSelectedHatchy] = useState<Metadata | null>(null);
	const [selectedStakedHatchy, setSelectedStakedHatchy] = useState<Metadata | null>(null);
	const [hatchieTokens, setHatchieTokens] = useState<Metadata[]>([]);
	const [selectedHatchyHaveShiny, setSelectedHatchyHaveShiny] = useState(false);
	const [displayShinyVersion, setDisplayShinyVersion] = useState(false);
	//offer price
	const [price, setPrice] = useState(1);
	//share modal
	const [showShinyOnly, setShowShinyOnly] = useState(false)
	const [showShareModal, setShowShareModal] = useState(false)
	const openShareModal = () => setShowShareModal(true);
	const closeShareModal = () => setShowShareModal(false);

	//HatchyCardBuy and offer
	const [showTransferModal, setShowTransferModal] = useState(false);

	/*Get metadata from WalletContextProvider */
	const {
		gen,
		metadatas,
		refreshWallet,
		gen2Metadatas,
		loadingMetadatas,
		gen2Wallet,
		totalTokensGen1,
		commonTokensGen1,
		shinyTokensGen1
	} = useWallet();

	const {
		stakedMetadatas,
		totalStakedTokensGen1,
		stakedCommonTokensGen1,
		stakedShinyTokensGen1
	} = useStake();
	const {
		gen2StakedMetadatas,
		stakedShinyTokensGen2,
		totalStakedTokensGen2,
		stakedCommonTokensGen2
	} = useStakeGen2();
	//manage filters
	const [filteredHatchies, setFilteredHatchies] = useState<HatchyStatsObject>();

	/*Loading */
	const [isProcessing, setIsProcessing] = useState(false);
	const onChangeGen = ()=>{
		//setIsProcessing(true);
	}

	function renderSameTokens() {
		if (hatchieTokens) {
			const tokens = hatchieTokens.map((hatchy, i) => {
				return (
					<TokenItem key={hatchy.tokenId} token={hatchy.tokenId} shiny={hatchy?.isShiny == 1}
						element={hatchy?.element.toLowerCase()} staked={hatchy.isStaked}
						selected={hatchy.tokenId == selectedHatchy?.tokenId}
						onClick={() => {
							if (hatchy) setSelectedHatchy(hatchy);
							//setSelectedHatchy(getHatchieData(id));
						}}
					/>
				)
			})
			return tokens;
		}
		return <></>;
	}

	const scrollTop = () =>{
		if (automaticScroll) {
			window.scrollTo({top: 0, behavior: 'smooth'});
		}
  };

	const selectHatchy = (id: number) => {
		scrollTop();
		
		const filteredHatchies = getHatchiesFilteredByMonsterID(
			showShinyOnly,
			id,
			gen == 1 ? metadatas : gen2Metadatas,
			gen == 1 ? stakedMetadatas : [],
		)
		if (filteredHatchies && filteredHatchies.length > 0) {
			const hatchy = filteredHatchies[0];
			setSelectedHatchy(hatchy);
		} else {
			setSelectedHatchy(getHatchieData(id));
		}
	}
	
	useEffect(() => {
		setIsProcessing(true);
	}, [gen]);

	useEffect(() => {
		if (gen == 1) {
			if (stakedMetadatas && stakedMetadatas.length > 0) {
				const auxMetadataStaked = stakedMetadatas[0]
				auxMetadataStaked.isStaked = true;
				setSelectedHatchy(auxMetadataStaked);
				return;
			}
			if (metadatas) setSelectedHatchy(metadatas[0]);
		}
		if (gen == 2) {
			if (gen2Metadatas && gen2Metadatas.length < 1) {
				setSelectedHatchy(getHatchieData(40))
				return;
			}
			if (gen2Metadatas) setSelectedHatchy(gen2Metadatas[0]);
		};
	}, [gen, metadatas, gen2Metadatas, stakedMetadatas])

	/*Filter Management*/
	useEffect(() => {
		let filteredMetadatasAux = getHatchieFilteredCount(
			showShinyOnly,
			gen,
			gen == 1 ? metadatas : gen2Metadatas,
			gen == 1 ? stakedMetadatas : gen2StakedMetadatas,
		);
		setFilteredHatchies(filteredMetadatasAux);
	}, [showShinyOnly, metadatas, gen2Metadatas, stakedMetadatas, gen]);

	useEffect(() => {
		if (filteredHatchies) {
			for (const key in filteredHatchies) {
				selectHatchy(parseInt(key));
			}
		}
	}, [filteredHatchies])

	// Update tokens with same monsterID
	useEffect(() => {
		if(selectedHatchy){
			const sameTokens = getHatchiesFilteredByMonsterID(
				showShinyOnly,
				selectedHatchy?.monsterId,
				metadatas,
				stakedMetadatas
			)
			if (sameTokens) setHatchieTokens(sameTokens);

			let stakedHatchy = null;
			if (gen==2 && gen2StakedMetadatas) {
				stakedHatchy = gen2StakedMetadatas.find(hatchy=>hatchy.monsterId==selectedHatchy.monsterId);
			}
			if (stakedHatchy!=null) setSelectedStakedHatchy(stakedHatchy);
			else setSelectedStakedHatchy(null);
			const selectedHatchyHaveShinyAux = (selectedHatchy?.shinyQuantity!=null && selectedHatchy.shinyQuantity>0) ||
			(stakedHatchy?.shinyQuantity!=null && stakedHatchy.shinyQuantity>0)
			setSelectedHatchyHaveShiny(selectedHatchyHaveShinyAux);
			setDisplayShinyVersion(selectedHatchyHaveShinyAux);
		}
		setIsProcessing(false);
	}, [selectedHatchy?.monsterId, metadatas, stakedMetadatas, showShinyOnly, gen])

	const isGen2HatchyOwned = (hatchy: Metadata | null) => {
		if (hatchy && hatchy.quantity && hatchy.quantity > 0) {
			return true;
		}
		return false;
	}
	
	const showShinyCard = ()=>{
		if (gen==1) {
			return selectedHatchy!=null && selectedHatchy.isShiny!=null && selectedHatchy.isShiny==1;	
		} else {
			if ((selectedHatchy!=null && selectedHatchy.shinyQuantity!=null && selectedHatchy.shinyQuantity>0) || 
					(selectedStakedHatchy!=null && selectedStakedHatchy.shinyQuantity!=null && selectedStakedHatchy.shinyQuantity>0)) {
				return displayShinyVersion;
			}
		}
		return false;
	}
	
	const totalSelectedHatchyQuantity = ()=>{
		let amount = 0;
		if (selectedHatchy && selectedHatchy.quantity) amount+=selectedHatchy.quantity;
		if (selectedStakedHatchy && selectedStakedHatchy.quantity) amount+=selectedStakedHatchy.quantity;
		return amount;
	}

	return (
		<WalletConnectionValidation
			unconnectedMessage='Connect your wallet to view your Hatchies'
			keepLoading={!metadatas || !stakedMetadatas}
		>
			<PageLayout>
				{selectedHatchy &&
					<ShareModal isOpen={showShareModal} closeModal={closeShareModal} token={selectedHatchy.tokenId} />
				}
				{(selectedHatchy?.tokenId || selectedHatchy?.monsterId) &&
					< TransferModal isOpen={showTransferModal} closeModal={() => setShowTransferModal(false)} hatchy={selectedHatchy}
						ownedHatchies={filteredHatchies} />
				}
				<section className='bg-kingdom bg-no-repeat bg-[#161425] w-full flex flex-col justify-center items-center pb-10 space-y-10
					pt-20'>
					<Banner title='WALLET' />
					{isProcessing && <LoadingSpinner className='text-white'/>}
					<div className={`flex flex-col justify-center items-start max-w-xs  space-y-10 w-full
					md:max-w-xl lg:max-w-5xl lg:flex-row lg:space-x-16 lg:space-y-0
					${isProcessing?'invisible':'visible'}`}>
						<div className='flex flex-col space-y-5
					md:flex-row  md:space-x-3 md:space-y-0 lg:space-x-16'>
						<div>
								<HatchyCardBuy hatchy={selectedHatchy || HatchiesData[1]} owned={selectedHatchy?.tokenId != null || isGen2HatchyOwned(selectedHatchy)}
									price={price} setPrice={setPrice} shiny={showShinyOnly}
									onTransfer={() => setShowTransferModal(true)}
									onBuyHatchy={() => { }}
									isStaked={selectedHatchy?.isStaked} />
								<div className='flex flex-row items-center justify-center space-x-3 bg-white mt-5 py-1 text-gray-dark'>
									<Checkbox allSelected={automaticScroll} color="shiny"
										onClick={() => setAutomaticScroll(!automaticScroll)} />
									<span className='text-xl font-bold cursor-pointer select-none'
										onClick={() => setAutomaticScroll(!automaticScroll)} >
										AUTOMATIC SCROLL
									</span>
								</div>
							</div>
								<HatchyCardInfo
									hatchy={selectedHatchy || HatchiesData[1]}
									isStaked={selectedHatchy?.isStaked}
									showShinyCollection={showShinyCard()}
									
								/>
								
								{/*getHatchieData(selectedHatchyID*/}
							</div>
							
							<div className='flex flex-col self-start
								min-w-[18rem] max-w-[18rem] '>
								{gen==2 &&
									<>
										{totalSelectedHatchyQuantity()>0 &&
											<table className=' bg-black bg-opacity-40 w-full max-w-xs  text-white mb-5 
											border-white border-4'>
												<thead>
													<tr className='border-none text-lg'>
														<td colSpan={2} className='border-none p-0'>
															<div className={`title-${selectedHatchy?.element.toLowerCase()} relative text-center text-white`}>
																<span className='z-10 relative font-black'>{selectedHatchy?.name.toUpperCase()}</span>
															</div>
														</td>
													</tr>
												</thead>
												<tbody className='text-base'>
												{
													selectedHatchy!=null &&
													<>
														<tr>
															<td colSpan={2} className='py-2 text-left pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50'>COLLECTION</td>
														</tr>
														<tr >
															<td className='pt-2 text-left pl-5 underline underline-offset-4
															cursor-pointer'
															onClick={()=>setDisplayShinyVersion(false)}>
																COMMON TOKENS
															</td>
															<td className='font-bold text-right pr-5'>{selectedHatchy?.commonQuantity || 0}</td>
														</tr>
														{selectedHatchy.shinyQuantity!=null && selectedHatchy.shinyQuantity>0 &&
															<tr>
																<td className={`pb-2 text-left pl-5 text-shiny
																underline underline-offset-4 cursor-pointer `}
																onClick={()=>setDisplayShinyVersion(true)}>
																	SHINY TOKENS
																</td>
																<td className='font-bold text-shiny text-right pr-5'>{selectedHatchy?.shinyQuantity}</td>
															</tr>
														}
													</>	
												}
												{
													selectedStakedHatchy!=null &&
													<>
														<tr>
															<td colSpan={2} className='py-2 text-left pl-5 font-bold w-full bg-gray-dark2 bg-opacity-50'>STAKING</td>
														</tr>
														<tr >
															<td className='pt-2 text-left pl-5 underline underline-offset-4
															cursor-pointer'
															onClick={()=>setDisplayShinyVersion(false)}>
																COMMON TOKENS
															</td>
															<td className='font-bold text-right pr-5'>{selectedStakedHatchy?.commonQuantity || 0}</td>
														</tr>
														{selectedStakedHatchy.shinyQuantity!=null && selectedStakedHatchy.shinyQuantity>0 &&
															<tr className=''>
																<td className={`pb-2 text-left pl-5 text-shiny
																underline underline-offset-4 cursor-pointer `}
																onClick={()=>setDisplayShinyVersion(true)}>
																	SHINY TOKENS
																</td>
																<td className='font-bold text-shiny text-right pr-5'>{selectedStakedHatchy?.shinyQuantity}</td>
															</tr>
														}
													</>	
												}
												<tr className='border-t font-bold '>
													<td className='py-2 text-left pl-5 '>TOTAL</td>
													<td className='text-right pr-5'>
														{totalSelectedHatchyQuantity()}
													</td>
												</tr>
												</tbody>
											</table> 
										}
									</>
								}
								
								{hatchieTokens.length > 0 &&
									<>
										<span className=' text-gray-dark px-3 py-1 bg-white text-center font-governmen text-lg font-black mt-5'>
											{showShinyOnly ? 'SHINY ' : ''} OWNED TOKENS: {hatchieTokens.length}
										</span>
										<div className='h-28 border-2 border-white overflow-x-auto flex flex-row items-center p-2 space-x-3 
										text-white mb-2' >
											{renderSameTokens()}
										</div>
										<Button label='SHARE HATCHY' color='cyan' onClick={openShareModal} />
									</>
								}
								<WalletStatsTable
									collectionCommon={gen==1?commonTokensGen1:gen2Wallet.commonTokensQuantity}
									collectionShiny={gen==1?shinyTokensGen1:gen2Wallet.shinyTokensQuantity}
									stakingCommon={gen==1?stakedCommonTokensGen1:stakedCommonTokensGen2}
									stakingShiny={gen==1?stakedShinyTokensGen1:stakedShinyTokensGen2}
								/>
								<div className={`flex flex-col bg-white text-gray-dark py-1 px-3 ${gen==2 && 'mt-5'}`}>
									<div className='flex flex-row items-center justify-center space-x-3'>
										<Checkbox allSelected={showShinyOnly} color="shiny"
											onClick={() => setShowShinyOnly(!showShinyOnly)} />
										<span className='text-xl font-bold cursor-pointer select-none'
											onClick={() => setShowShinyOnly(!showShinyOnly)} >
											ONLY SHINY
										</span>
									</div>

								</div>
							</div>
					</div>
					<div className={`w-full max-w-7xl
					${isProcessing?'invisible':'visible'}`}>
						<GenSelector onChange={onChangeGen} />
						<CollectionGridWallet
							setSelectedHatchyID={selectHatchy}
							selectedMonsterID={selectedHatchy?.monsterId} 
							ownedHatchies={filteredHatchies} />
					</div>
				</section>
				<WalletCollectionFilters
					metadatas={gen == 1 ? metadatas : gen2Metadatas}
					stakedHatchies={gen == 1 ? stakedMetadatas : gen2StakedMetadatas}
					gen2Wallet={gen2Wallet}
					totalStakedTokens={totalStakedTokensGen2}
				/>
			</PageLayout>
		</WalletConnectionValidation>
	)
}

export default WalletPage