import { useWeb3React } from '@web3-react/core';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import ABI from '../../abi';
import { useWallet } from '../../contexts/WalletContext';
import useClaimHatchie from '../../hooks/useClaimHatchie';
import useContract from '../../hooks/useContract';
import useCurrentPrice from '../../hooks/useCurrentPrice';
import useETHBalance from '../../hooks/useETHBalance';
import useSupply from '../../hooks/useTotalSupply';
import { MAX_HATCHIES } from '../../utils';
import { getHatchyNFTAddress } from '../../utils/addressHelpers';
import Banner from '../../components/Banner';
import Button from '../../components/Button';
import ClaimModal from '../../components/Home/ClaimModal';
import EggClaimCard from '../../components/Home/EggClaimCard';
import HatchyCardLatest from '../../components/Wallet/HatchyCardLatest';
import LoadingModal from '../../components/LoadingModal';
import LoadingSpinner from '../../components/Utility/LoadingSpinner';
import { DefaultChainID } from '../../constants';
import { Icon } from '@iconify/react';
import { ethers } from 'ethers';
//temporary solution
declare let window: any;
export default function ClaimGen1Section() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const priceRef = useRef<HTMLTableDataCellElement>(null);
	const { account, chainId } = useWeb3React();
	const avaxBalance = useETHBalance(account)
	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy);
	const priceBigNumber = useCurrentPrice(contract);
  const currentPrice = priceBigNumber?ethers.utils.formatEther(priceBigNumber):'0';
	const totalClaimed = useSupply(contract)
	const [buyAmount, setBuyAmount] = useState(0)

	//const pickCurrentPrice = (a, b) => {
	//    return totalClaimed !== null && a <= totalClaimed ? "current-price" : ""
	//}
	const prices = [
		[0, 4000, 0.65],
		[4000, 8000, 0.72],
		[8000, 12000, 0.79],
		[12000, 16000, 0.87],
		[16000, 20000, 0.95],
		[20000, 24000, 1.05],
		[24000, 28000, 1.15],
		[28000, 32000, 1.27],
		[32000, 36000, 1.39],
		[36000, 37000, 1.55],
		[37000, 38000, 2],
		[38000, 39000, 2.5],
		[39000, 39900, 3],
		[39900, 39990, 6],
		[39990, 39999, 10],
		[40000, 40000, 100],
	]

	//claim Hatchie
	const signer = useContract(getHatchyNFTAddress(), ABI.Hatchy, true)
	const [showModal, setShowModal] = useState(false)
	const { refreshWallet, metadatas } = useWallet();
	const { claimHatchie, loadingClaim } = useClaimHatchie(signer);
	const closeModal = () => setShowModal(false);
	
	useEffect(() => {
		if (scrollRef.current && priceRef.current) {
			scrollRef.current.scrollTop = priceRef.current.offsetTop - 100;
		}
	}, [scrollRef, priceRef, totalClaimed])
	

	function claimHatchieAux(buyAmount: number) {
		setBuyAmount(buyAmount)
		if (buyAmount) {
			claimHatchie(buyAmount, () => {
				refreshWallet();
				setShowModal(true);
			})
		}
	}

	function renderLatestHatched() {
		if (totalClaimed == null) return < LoadingSpinner />
		let latest: ReactNode[] = []
		for (let i = 1; i < (totalClaimed > 20 ? 20 : totalClaimed); i++) {
			latest.push(
				<HatchyCardLatest tokenId={totalClaimed - i} key={i} />
			)
		}
		return latest;
	}

	function renderPriceTable() {
		return <table className='bg-gray-dark text-sm w-full'>
			<tbody >
				{prices.reverse().map(([rangeMin, rangeMax, price]) => (
					<tr key={price}>
						{totalClaimed && rangeMin < totalClaimed && totalClaimed <= rangeMax ?
							<>
								{rangeMin == rangeMax ?
									<td className='py-1 bg-yellow-400/80'>#{rangeMin}</td>
									:
									<td className='py-1 bg-yellow-400/80'>#{rangeMin} - #{rangeMax}</td>
								}
								<td className='text-white bg-yellow-400/80' ref={priceRef}> {'>'} </td>
								<td className="bg-yellow-400/80">
									{price}
									<small> AVAX</small>
								</td>
							</>
							:
							<>
								{totalClaimed && totalClaimed > rangeMin ?
									<>
										{rangeMin == rangeMax ?
											<td className='line-through py-1 text-gray'>#{rangeMin}</td>
											:
											<td className='line-through py-1 text-gray'>#{rangeMin} - #{rangeMax}</td>
										}
										<td className='text-gray '> {'>'} </td>
										<td className="line-through text-gray">
											{price}
											<small> AVAX</small>
										</td>
									</>
									:
									<>
										{rangeMin == rangeMax ?
											<td className=' py-1'>#{rangeMin}</td>
											:
											<td className=' py-1'>#{rangeMin} - #{rangeMax}</td>
										}
										<td className='text-white '> {'>'} </td>
										<td className="">
											{price}
											<small> AVAX</small>
										</td>
									</>
								}
							</>
						}
					</tr>
				))}
			</tbody>
		</table>
	}
	return (
		<section className='bg-claim bg-center bg-cover pt-20 flex flex-col
			px-8 text-center text-gray-200 items-center py-5 space-y-5 w-full '>
			{loadingClaim && <LoadingModal />}
			<ClaimModal isOpen={showModal} closeModal={closeModal} buyAmount={buyAmount} />
			<Banner title='GEN 1' />
			<a href={`https://snowtrace.io/address/${getHatchyNFTAddress()}`}
				target='_blank' rel='noreferrer'
				className='flex flex-row text-yellow bg-black bg-opacity-40 px-4 py-1
				justify-center items-center w-full max-w-xs md:max-w-md '>
				<p className='font-bold mr-2'>
					Hatchy Pocket Gen 1 contract
				</p>
				<Icon icon='akar-icons:arrow-up-right' width={20} />
			</a>
			<div className='flex flex-col space-y-10 justify-center items-center max-w-6xl
          md:items-start md:flex-row  md:space-y-0 md:space-x-5 md:w-full '>
				<EggClaimCard totalClaimed={totalClaimed || 0} price={0.5}
					totalUnclaimed={totalClaimed ? MAX_HATCHIES - (totalClaimed || 0) : 0}
					currentPrice={priceBigNumber} balance={avaxBalance.data}
					collection={`${metadatas ? metadatas.length : 0}`}
					onClickClaim={quantity => claimHatchieAux(quantity)} />
				<div className='flex flex-col w-full max-w-xs 
            		md:w-1/2 md:max-w-full lg:w-2/3'>
					<div className='flex flex-col md:flex-row mb-5'>
						{/*PRICES */}
						<div className=' bg-white flex flex-col text-white h-52 md:w-1/2 '>
							<span className='w-full bg-gray text-left px-5 py-1 font-bold'>PRICES</span>
							<div className='overflow-y-auto w-full' ref={scrollRef}>
								{renderPriceTable()}
							</div>
						</div>
						{/*PROBABILITIES */}
						<div className='flex flex-col text-black md:w-1/2 bg-black bg-opacity-20'>
							<span className='w-full text-white bg-turquoise-dark text-left px-5 py-1 font-bold'>PROBABILITIES</span>
							<div className='w-full p-5 flex flex-col space-y-4 '>
								<span className='w-full border border-black text-left px-2 py-1 font-bold bg-turquoise text-white'>All monsters are equal odds</span>
								<span className='w-full border border-black text-left px-2 py-1 bg-turquoise text-white'>2.5% chance for shiny</span>
							</div>
						</div>
					</div>
					{/*LATEST HATCHED */}
					<div className='flex flex-row text-white bg-turquoise-dark px-5 py-1 '>
						<span className='m-auto ml-0 font-bold'>LATEST HATCHED</span>
						<span className='m-auto mr-0 '>Total Remaining: {totalClaimed ? MAX_HATCHIES - (totalClaimed || 0) : 0}</span>
					</div>
					<div className='flex flex-row overflow-x-auto overflow-y-hidden w-full py-3 bg-turquoise'>
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
					<div className='flex justify-end mt-16'>
						<Button label='MARKETPLACE' color='green' className='w-full md:w-auto' onClick={() => Router.push('/marketplace')} />
					</div>
				</div>
			</div>
		</section>
	)
};