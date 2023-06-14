import { useWeb3React } from '@web3-react/core'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ABI from '../../abi'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import HatchyCardInfo from '../../components/Wallet/HatchyCardInfo'
import HatchyCardInfoDetail from '../../components/HatchyCardInfoDetail'
import LoadingModal from '../../components/LoadingModal'
import LoadingSpinner from '../../components/Utility/LoadingSpinner'
import PageLayout from '../../components/PageLayout'
import ShareModal from '../../components/Wallet/ShareModal'
import { useWallet } from '../../contexts/WalletContext'
import useBazaar from '../../hooks/useBazaar'
import useBuyToken from '../../hooks/useBuyToken'
import useCancelTokenSale from '../../hooks/useCancelTokenSale'
import useContract from '../../hooks/useContract'
import { Metadata } from '../../types'
import { APP_URL } from '../../utils'
import { getHatchyNFTAddress } from '../../utils/addressHelpers'
import { formatHatchyPrice } from '../../utils/numberFormatterHelper'
import { DefaultChainID } from '../../constants'
import ConnectWalletModalWrapper from '../../components/WalletConnect/ConnectWalletModalWrapper'
import Head from 'next/head'

interface HatchyPageProps {
	hatchy?: Metadata
	token?: string | string[]
}
const HatchyPage: NextPage<HatchyPageProps> = ({ hatchy, token }) => {
	const { account, provider: library, chainId } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;
	const router = useRouter();
	const [owned, setOwned] = useState(false);
	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy, true);
	const { buyToken, loadingBuy } = useBuyToken(contract);
	const { cancelTokenSale, loadingCancelTokenSale } = useCancelTokenSale(contract);
	const { refreshWallet, tokens } = useWallet();
	const { onSale, price } = useBazaar(contract, hatchy?.tokenId);
	const [showModal, setShowModal] = useState(false)
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	const onBuyToken = () => {
		if (hatchy && hatchy.tokenId && onSale) {
			//hardcoded
			//buyToken("110", "1000000000000000000", ()=>{
			buyToken(hatchy.tokenId.toString(), price, () => {
				refreshWallet();
				console.log("acquired hatchy");
				router.push("/wallet");
			})
		}
	}

	const onCancelTokenSale = () => {
		if (hatchy && hatchy.tokenId && onSale)
			cancelTokenSale(hatchy.tokenId, () => {
				refreshWallet();
				router.push("/marketplace");
			})
	}
	useEffect(() => {
		if (hatchy && hatchy.tokenId && tokens) {
			console.log(tokens);
			console.log(hatchy.tokenId);
			setOwned(tokens?.indexOf(hatchy.tokenId + "") != -1)
		}
	}, [hatchy, tokens])

	function renderMarketplaceButtons() {
		if (onSale && isConnected && chainId === DefaultChainID) {
			if (owned) {
				return <Button label='CANCEL SALE' color='yellow' className='w-full' onClick={onCancelTokenSale} />
			} else {
				return <Button label='BUY NOW' color='green' className='w-full' onClick={onBuyToken} />
			}
		}
		return '';
	}

	return (
		<PageLayout className={hatchy && !hatchy.error ? '' : 'h-screen'}>
			<Head>
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="@hatchypocket" />
				<meta name="twitter:title" content={`HatchyPocket - ${hatchy?.name} - ${hatchy?.tokenId}`} />
				<meta name="twitter:creator" content="@hatchypocket" />
				<meta name="twitter:description" content={`${hatchy?.description}`} />
				<meta name="twitter:image" content={hatchy?.image} />
				<meta property="og:url" content={`https://www.hatchypocket.com/hatchy/${hatchy?.tokenId}`} />
				<meta property="og:title" content={`HatchyPocket - ${hatchy?.name} - ${hatchy?.tokenId}`} />
				<meta property="og:description"
					content={`${hatchy?.description}`} />
				<meta property="og:image"
					content={hatchy?.image} />
			</Head>
			<ShareModal isOpen={showModal} closeModal={closeModal} token={hatchy?.tokenId} />
			{loadingBuy && <LoadingModal text='Processing the purchase' />}
			{loadingCancelTokenSale && <LoadingModal text='Canceling the token sale' />}
			<section className='h-full flex-grow min-h-fit bg-kingdom bg-cover w-full flex flex-col justify-center items-center py-20'>
				{
					hatchy == null ?
						<>
							<span className='h-full text-center text-3xl px-14 py-10 text-white'>{"Loading ..."}</span>
							<LoadingSpinner className='text-white h-full ' />
						</>
						: hatchy.error ?
							<span className='text-center text-3xl px-14 py-10 text-red-400'>{`Hatchy with ID ${token} does not exist`}</span>
							:
							<>
								<Banner title={hatchy.name} />
								<div className='flex flex-col mt-5 justify-center items-center max-w-xs  space-y-10
				  					md:max-w-full lg:flex-row lg:space-x-5'>
									<div className='flex flex-col space-y-5
										md:flex-row  md:space-x-20 md:space-y-0'>
										<HatchyCardInfo hatchy={hatchy} />
										<div className='flex flex-col mb-5'>
											<HatchyCardInfoDetail hatchy={hatchy} />
											<div className='py-3 space-y-3'>
												{onSale &&
													<div className='w-full bg-white text-gray-dark flex flex-row  
															px-6 py-2 justify-between text-lg'>
														<span>Price:</span>
														<span className='flex flex-row'>
															{/*formatHatchyPrice(price)*/}
															{formatHatchyPrice(price)} AVAX
															<div className='w-7 h-7 relative ml-3'>
																<Image src={'/static/avax.png'} alt='Powered by Avalanche' layout='fill' />
															</div>
														</span>
													</div>
												}
												{renderMarketplaceButtons()}
												<Button label='SHARE' color='cyan' className='w-full max-w-xs' onClick={openModal} />
												{!isConnected &&
													<div className='w-full max-w-xs'>

														<ConnectWalletModalWrapper />														</div>
												}
											</div>
										</div>
									</div>
								</div>
							</>
				}
			</section>
		</PageLayout>
	)
}

HatchyPage.getInitialProps = async ({ query }) => {
	const id = query.id || "0"
	const data = await fetch(`${APP_URL}/api/token/${id}`)
	if (!data) return { token: id };
	const json = await data.json();
	if (json) {
		return {
			hatchy: json,
			token: id
		}
	}
	return { token: id };
}


export default HatchyPage