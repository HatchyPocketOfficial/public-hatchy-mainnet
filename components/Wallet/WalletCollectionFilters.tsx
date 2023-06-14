import { useWeb3React } from '@web3-react/core'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useWallet } from '../../contexts/WalletContext'
import { Metadata } from '../../types'
import { APP_URL } from '../../utils'
import Button from '../Button'
import ButtonFilter from '../ButtonFilter'
import LoadingSpinner from '../Utility/LoadingSpinner'
import Message from '../Message'
import HatchyCardInfo from './HatchyCardInfo'
import HatchyCardLatest from './HatchyCardLatest'
import Pagination from 'react-js-pagination'
import GenSelector from '../Utility/GenSelector'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context'
import { isShinyHatchy } from '../../utils/metadataArraysUtils'
import useCopyText from '../../hooks/useCopyText'

interface WalletCollectionFiltersProps {
	metadatas: Metadata[] | null
	stakedHatchies?: Metadata[] | null
	isAddress?: boolean
	address?: string
	gen2Wallet: {
		loadingMetadatas: boolean;
		totalTokens: number;
		shinyTokensQuantity: number;
		commonTokensQuantity: number;
		metadatas: Metadata[] | null;
		newMetadatas: Metadata[] | null;
	}
	totalStakedTokens: number
}

export default function WalletCollectionFilters({
	metadatas,
	stakedHatchies,
	isAddress = false,
	address,
	gen2Wallet,
	totalStakedTokens
}: WalletCollectionFiltersProps) {
	const { account, provider: library, chainId } = useWeb3React();
	const { gen } = useWallet();

	/*Show wallet or staked*/
	const [showWallet, setShowWallet] = useState(true)
	const [selectedElementFilter, setSelectedElementFilter] = useState(-1)
	const [selectedCollapseFilter, setSelectedCollapseFilter] = useState(-1)
	const [shinyFilterOn, setShinyFilterOn] = useState(false);
	const elementFilters = ['Fire', 'Water', 'Plant', 'Dark', 'Light']
	const collapseFilters = ['Collapse ID', 'Collapse Cards']
	/*Get metadata from WalletContextProvider */
	// const { loadingMetadatas, metadatas } = useWallet();
	const [filteredHatchies, setFilteredHatchies] = useState(metadatas);

	const [isCopied, setIsCopied] = useState(false)
	const {copy} = useCopyText();
	const copyText = async () => {
		if (isAddress) await copy(`${APP_URL}/address/${address}`, navigator, window);
		else  await copy(`${APP_URL}/address/${account}`, navigator, window);
		setIsCopied(true)
		setTimeout(() => {
			setIsCopied(false)
		}, 5000)
	}

	/*Pagination*/

	const [currentPage, setCurrentPage] = useState(1)
	const [perPage, setPerPage] = useState(9)
	const [totalPages, setTotalPages] = useState(1)
	const pagesVisited = currentPage * perPage
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)

	}

	function collapseHatchies() {
		let ownedHatchies: any = {};

		filteredHatchies?.forEach(hatchy => {
			if (ownedHatchies[hatchy.monsterId]) {
				ownedHatchies[hatchy.monsterId].count++;
				if (isShinyHatchy(hatchy)) ownedHatchies[hatchy.monsterId].isShiny = 1;
			} else {
				ownedHatchies[hatchy.monsterId] = {
					...hatchy,
					count: hatchy.quantity || 1
				}
			}
		});
		return ownedHatchies;
	}

	function renderWallet() {
		if (selectedCollapseFilter == -1) { //default filter
			if (filteredHatchies && filteredHatchies.length > 0) {

				return filteredHatchies.slice(pagesVisited - perPage, pagesVisited)?.map((hatchy: any) => (
					<HatchyCardInfo hatchy={hatchy} className='m-5' key={hatchy.tokenId || hatchy.monsterId} />
				));
			} else {
				return <Message>
					<span>You don&apos;t have any Hatchies that matches with this filters</span>
				</Message>
			}
		} else {// some collapse filter active
			let collapsedHatchies = collapseHatchies()
			let hatchies = Object.keys(collapsedHatchies)
			if (hatchies.length > 0) {
				if (selectedCollapseFilter == 0) {
					return hatchies?.slice(pagesVisited - perPage, pagesVisited).map((monsterId: any) => {
						const hatchie = collapsedHatchies[monsterId];
						return (
							<div className='flex flex-col items-center pb-4' key={hatchie.tokenId || hatchie.monsterId}>
								<HatchyCardInfo hatchy={hatchie} className='m-5' key={hatchie.tokenId} 
								showShinyCollection={hatchie.shinyQuantity!=null && hatchie.shinyQuantity>0}/>
								<span className='items-center '>
									X{hatchie.shinyQuantity ? hatchie.shinyQuantity : hatchie.count}
								</span>
							</div>
						)
					})
				} else if (selectedCollapseFilter == 1) {
					return hatchies?.map((monsterId: any) => {
						const hatchy = collapsedHatchies[monsterId];
						return (
							<HatchyCardLatest hatchy={hatchy} isCollapse={true}
								count={hatchy.shinyQuantity ? hatchy.shinyQuantity : hatchy.count}
								key={hatchy.tokenId || hatchy.monsterId} />
						)
					})
				}
			} else {
				return <Message>
					<span>You don&apos;t have any Hatchies that matches with this filters</span>
				</Message>
			}
		}
	}

	function onChangeElementFilter(i: number) {
		if (i == selectedElementFilter) setSelectedElementFilter(-1)
		else setSelectedElementFilter(i); setCurrentPage(1);

	}
	function onChangeCollapseFilter(i: number) {
		if (i == selectedCollapseFilter) {
			if (gen == 1) setSelectedCollapseFilter(-1)
		} else setSelectedCollapseFilter(i); setCurrentPage(1);
	}

	useEffect(() => {
		if (gen == 1)
			setSelectedCollapseFilter(-1)
		else
			setSelectedCollapseFilter(0);
	}, [gen])


	/*Filter Management*/
	useEffect(() => {
		let metadatasAux: Array<Metadata> | null | undefined;
		if (showWallet) metadatasAux = metadatas; //show wallet
		else metadatasAux = stakedHatchies; //show staked hatchies
		if (metadatasAux) {
			if (selectedElementFilter != -1) { //filter by element
				metadatasAux = metadatasAux.filter(hatchy => {
					return hatchy.element == elementFilters[selectedElementFilter];
				});
			}
			if (shinyFilterOn) { //filter by shiny
				metadatasAux = metadatasAux.filter(hatchy => {
					return isShinyHatchy(hatchy);
				});
			}
			setFilteredHatchies(metadatasAux)
			return;
		}
	}, [shinyFilterOn, selectedElementFilter, selectedCollapseFilter, metadatas, stakedHatchies, showWallet]);

	useEffect(() => {
		if (filteredHatchies) {
			setTotalPages(filteredHatchies.length)
			if (selectedCollapseFilter == 0) {
				let ownedHatchies = collapseHatchies()
				setTotalPages(Object.keys(ownedHatchies).length)
			}
		}
	}, [filteredHatchies]);

	return (
		<section className='bg-[#161425] w-full flex flex-col justify-center items-center text-white space-y-3 py-10'>
			<div className='flex space-x-5'>
				<Button label='WALLET' selected={showWallet} color={showWallet ? "yellow" : "black"} onClick={() => setShowWallet(true)} />
				<Button label='STAKED HATCHIES' selected={!showWallet} color={!showWallet ? "yellow" : "black"} onClick={() => setShowWallet(false)} />
			</div>
				{gen==1 &&
					<span className='text-white underline-offset-1 underline text-sm text-center'>
						<Link href={'/transfer'}>
								view advanced batch transfer
						</Link>
					</span>
				}
			<Button label={isCopied ? 'COPIED!' : 'SHARE YOUR WALLET'} onClick={copyText} color={isCopied ? 'green' : 'cyan'} />
			{showWallet ?
				<span className='font-bold text-xl'>
					{isAddress ? 'Owns ' : 'You Own '}
					{gen == 1 ? metadatas?.length : gen2Wallet.totalTokens} Hatchies
				</span>
				:
				<span className='font-bold text-xl'>
					{isAddress ? 'Owns ' : 'You Own '}
					{gen == 1 ? stakedHatchies?.length : totalStakedTokens} Staked Hatchies
				</span>
			}
			<div className='w-full max-w-3xl'>
				<GenSelector />
			</div>

			<div className='flex flex-col items-center space-y-2 w-full
		  		md:flex-row md:space-y-0 md:justify-between md:max-w-3xl'>
				<div className='flex flex-row space-x-2'>
					{elementFilters.map((element, i) =>
						<ButtonFilter label={element} key={element} selected={selectedElementFilter === i}
							onClick={() => onChangeElementFilter(i)} />
					)}
				</div>
				<div className='flex flex-row space-x-2'>
					<ButtonFilter label={'Shiny'} selected={shinyFilterOn}
						onClick={() => setShinyFilterOn(!shinyFilterOn)} />
				</div>
				<div className='flex flex-row space-x-2'>
					{collapseFilters.map((element, i) =>
						<ButtonFilter label={element} key={element} selected={selectedCollapseFilter === i}
							onClick={() => onChangeCollapseFilter(i)} />
					)}
				</div>
			</div>
			<div>
				{filteredHatchies && filteredHatchies.length > 9 && selectedCollapseFilter != 1 &&
					<div className='flex flex-col'>
						Page:
						<Pagination activePage={currentPage}
							itemsCountPerPage={perPage}
							totalItemsCount={totalPages}
							pageRangeDisplayed={3}
							onChange={handlePageChange}
							hideFirstLastPages={true}
							innerClass='flex'
							itemClass='bg-white text-indigo-500 px-2 mx-1 hover:bg-slate-300 '
							activeClass='bg-indigo-500'
							activeLinkClass='text-white' />
					</div>
				}
			</div>
			<div className='flex flex-wrap justify-center w-full max-w-7xl overflow-hidden'>
				{filteredHatchies ?
					filteredHatchies.length > 0 ?
						renderWallet()
						:
						<div className='h-96 flex flex-col justify-center items-center space-y-3'>
							<Image src={'/static/cards/gen1/fire/calidus.gif'} alt='Calidus' width={150} height={150} />
							{(metadatas && metadatas.length > 0) ?
								<>
									<span className='text-3xl mb-3 font-bold'>You don&apos;t have any Hatchy</span>
									<span className='text-2xl'>that match this filter</span>
								</> :
								<>
									<span className='text-2xl'>You don&apos;t have any Hatchies</span>
									<span className='text-3xl mb-3 font-bold'>Let&apos;s buy the first one!</span>
									<Link href='/claim'>
										<a>
											<Button label='Go to Claim' />
										</a>
									</Link>
								</>
							}
						</div>
					:
					<div className='h-80 flex justify-center items-center'>
						<LoadingSpinner />
					</div>
				}
			</div>
		</section>
	)
}
