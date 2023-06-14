import { Icon } from '@iconify/react';
import Router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext';
import Banner from '../Banner';
import Button from '../Button';
import HatchyCardSmall from './HatchyCardSmall';
import LoadingSpinner from '../Utility/LoadingSpinner';
import { ModalProps } from '../Modal';
import ElementParticles from '../Particles/ElementParticles';
import { Element } from '../../types';

interface ClaimGen2ModalProps extends ModalProps {
	eggType: string
}

export default function ClaimGen2Modal({ eggType, ...modalProps }: ClaimGen2ModalProps) {
	// animations
	const [showElementEffect, setShowElementEffect] = useState(false);
	const [showShinyEffect, setShowShinyEffect] = useState(false);
	const element = 'Plant';

	const { gen2Wallet } = useWallet();
	const { loadingMetadatas, newMetadatas, refreshWallet } = gen2Wallet;
	const buyAmount = newMetadatas?.length || 0;

	const [showMetadatas, setShowMetadatas] = useState(false);
	const [showState, setShowState] = useState<
		'moon-animation' |
		'sun-animation' |
		'single-hatchie' |
		'all-hatchies'
	>('moon-animation');

	const [currentHatchie, setCurrentHatchie] = useState(0);
	const currentHatchieMetadata = newMetadatas ? newMetadatas[currentHatchie] : null;
	const currentHatchieHaveShiny = currentHatchieMetadata != null &&
		currentHatchieMetadata.newShinyQuantity != null && currentHatchieMetadata.newShinyQuantity > 0;

	useEffect(() => {
		if (modalProps.isOpen) {
			resetState();
			const timer = setTimeout(() => {
				setShowState('single-hatchie');
			}, 14000);
			return () => clearTimeout(timer)
		}
	}, [modalProps.isOpen])

	const resetState = () => {
		if (eggType == 'Lunar') {
			setShowState('moon-animation');
		} else {
			setShowState('sun-animation');
		}
		setCurrentHatchie(0);
		setShowElementEffect(false);
	}

	const changePreviousHatchie = () => {
		if (currentHatchie === 0) return;
		setCurrentHatchie(currentHatchie - 1);
	}

	const changeNextHatchie = () => {
		if (currentHatchie === buyAmount - 1) {
			setShowState('all-hatchies');
			return;
		}
		setCurrentHatchie(currentHatchie + 1);
	}

	const closeModalAux = () => {
		refreshWallet();
		modalProps.closeModal();
		setShowMetadatas(false);
	}

	if (!modalProps.isOpen) return (<></>)
	return (
		<div className={`${!modalProps.isOpen && 'hidden'} w-full h-screen z-20 transition-opacity 
		duration-700 bg-black
		${(showState == 'moon-animation' || showState == 'sun-animation') ? 'bg-opacity-100' : 'bg-opacity-70'}
		fixed top-0 left-0 flex justify-center items-center`} >
			<button onClick={closeModalAux} className="absolute right-1 top-2 z-30">
				<Icon icon={"carbon:close"} width={30} />
			</button>
			{
				loadingMetadatas ?
					<LoadingSpinner />
					:
					<>
						{/** All Hatchies */}
						<div className={`text-white flex justify-center flex-col transition-opacity duration-700 
						${showState == 'all-hatchies' ? 'opacity-100 ' : 'opacity-0 hidden'} z-30`}>
							<div className='flex justify-center w-full mt-3'>
								<Banner title={buyAmount > 1 ? "YOUR NEW HATCHIES" : "YOUR NEW HATCHIE"} />
							</div>
							<div className="flex overflow-x-auto w-full max-w-xs 
							sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
								<div className='flex flex-row w-auto'>
									{
										newMetadatas?.map(hatchy => (
											<div key={hatchy.monsterId}>
												<HatchyCardSmall
													hatchy={hatchy}
													className='m-5 mb-2'
													showShiny={hatchy.newShinyQuantity != null && hatchy.newShinyQuantity > 0}
												/>
												{((hatchy.newCommonQuantity != null &&
													hatchy.newCommonQuantity > 1) ||
													(hatchy.newShinyQuantity != null &&
														hatchy.newShinyQuantity > 0)) &&
													<div className='flex flex-row space-x-5 justify-center'>
														{hatchy.newCommonQuantity != null &&
															hatchy.newCommonQuantity > 0 &&
															<span className={`font-bold text-2xl`}>
																x{hatchy.newCommonQuantity}
															</span>
														}
														{hatchy.newShinyQuantity != null && hatchy.newShinyQuantity > 0 &&
															<span className={`font-bold text-shiny text-2xl`}>
																x{hatchy.newShinyQuantity}
															</span>
														}
													</div>
												}
											</div>
										))
									}
								</div>
							</div>
							<div className="d-flex flex-column align-items-center justify-content-center py-2 ">
								<Button label='View Wallet' onClick={() => {
									refreshWallet();
									Router.push('/wallet')
								}} />
							</div>
						</div>

						{/** Single Hatchie Card */}
						<div className={`fixed inset-0  text-white flex justify-center items-center flex-col transition-opacity duration-700 
						${showState == 'single-hatchie' ? 'opacity-100 z-10' : 'opacity-0 '} `}>
							<div className='flex justify-center w-full mt-3'>
								<Banner title={`NEW HATCHIE `} />
							</div>
							<div className="flex justify-center items-center overflow-x-auto w-full max-w-xs 
							sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
								{currentHatchieMetadata &&
									<div>
										<HatchyCardSmall
											hatchy={currentHatchieMetadata}
											key={currentHatchieMetadata.tokenId}
											className='m-5 mb-2'
											showShiny={currentHatchieHaveShiny}
										/>
										{((currentHatchieMetadata.newCommonQuantity != null &&
											currentHatchieMetadata.newCommonQuantity > 1) ||
											(currentHatchieMetadata.newShinyQuantity != null &&
												currentHatchieMetadata.newShinyQuantity > 0)) &&
											<div className='flex flex-row space-x-5 justify-center'>
												{currentHatchieMetadata.newCommonQuantity != null &&
													currentHatchieMetadata.newCommonQuantity > 0 &&
													<span className={`font-bold text-2xl`}>
														x{currentHatchieMetadata.newCommonQuantity}
													</span>
												}
												{currentHatchieHaveShiny &&
													<span className={`font-bold text-shiny text-2xl`}>
														x{currentHatchieMetadata.newShinyQuantity}
													</span>
												}
											</div>
										}
									</div>
								}
							</div>
							<div className="flex flex-row w-44 items-center justify-between py-2 ">
								<button className={`${currentHatchie == 0 ? 'opacity-30' : ''} transition-opacity`}
									disabled={currentHatchie == 0}>
									<Icon icon="bx:left-arrow-alt" width={50} onClick={changePreviousHatchie} />
								</button>
								<span className='font-bold text-2xl'>
									{currentHatchie + 1}/{buyAmount}
								</span>
								<button>
									<Icon icon="bx:right-arrow-alt" width={50} onClick={changeNextHatchie} />
								</button>
							</div>
							<div className="d-flex flex-column align-items-center justify-content-center py-2  ">
								<Button label='Skip All' onClick={() => setShowState('all-hatchies')} full />
							</div>
						</div>

						{currentHatchieMetadata && (showState != 'moon-animation' && showState != 'sun-animation'
							&& showState != 'all-hatchies') &&
							<ElementParticles element={currentHatchieMetadata.element as Element} />
						}

						{/** Moon Egg animation */}
						<div className={`fixed inset-0 w-full h-auto flex justify-center items-center transition-opacity duration-700 
						${showState == 'moon-animation' ? 'opacity-100' : 'opacity-0'} `}>
							<video autoPlay loop muted playsInline className="max-w-none h-full">
								<source src={'/static/effects/claim-gen2/MoonEggClaim.mp4'} type="video/mp4" />
								Your Browser does not support video tag
							</video>
						</div>
						{/** Sun Egg animation */}
						<div className={`fixed inset-0 w-full h-auto flex justify-center items-center transition-opacity duration-700 
						${showState == 'sun-animation' ? 'opacity-100' : 'opacity-0'} `}>
							<video autoPlay loop muted playsInline className="max-w-none h-full">
								<source src={'/static/effects/claim-gen2/SunEggClaim.mp4'} type="video/mp4" />
								Your Browser does not support video tag
							</video>
						</div>

						{/** Element animation layer */}
						{showElementEffect &&
							<div className={`fixed inset-0 w-full h-auto flex justify-center items-center transition-opacity duration-700 ${showMetadatas ? 'opacity-0' : 'opacity-100'} `}>
								<video autoPlay loop muted playsInline className="max-w-none h-full">
									<source src={`/static/effects/claim-gen2/${element}Effect.mp4`} type="video/mp4" />
									Your Browser does not support video tag
								</video>
							</div>
						}

						{/** Shiny animation layer */}
						{showElementEffect &&
							<div className={`fixed inset-0 w-full h-auto flex justify-center items-center transition-opacity duration-700 ${showMetadatas ? 'opacity-0' : 'opacity-100'} `}>
								<video autoPlay loop muted playsInline className="max-w-none h-full">
									<source src={`/static/effects/claim-gen2/SparklingEffect.mp4`} type="video/mp4" />
									Your Browser does not support video tag
								</video>
							</div>
						}
					</>
			}
		</div>
	)
}

