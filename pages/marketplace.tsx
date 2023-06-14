import type { NextPage } from 'next'
import PageLayout from '../components/PageLayout'
import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import HatchyCardMarketplace from '../components/Marketplace/HatchyCardMarketplace'
import { useWeb3React } from '@web3-react/core'
import useFetchGraphMarket from '../hooks/useFetchGraphMarket'
import useContract from '../hooks/useContract'
import { getHatchyNFTAddress } from '../utils/addressHelpers'
import HatchiesData from "../public/static/characters.json";
import ABI from '../abi'
import { useRouter } from 'next/router'
import Select from '../components/Select'
import Pagination from 'react-js-pagination'
import useBuyToken from '../hooks/useBuyToken'
import LoadingModal from '../components/LoadingModal'
import useCancelTokenSale from '../hooks/useCancelTokenSale'
import { useWallet } from '../contexts/WalletContext'
import Button from '../components/Button'
import { DefaultChainID } from '../constants'
import { setupNetwork } from '../utils/wallet'
import LoadingSpinnerPage from '../components/Utility/LoadingSpinnerPage'
import ConnectWalletModalWrapper from '../components/WalletConnect/ConnectWalletModalWrapper'
import Image from 'next/image'

const MarketplacePage: NextPage = () => {
	const { account, provider: library, chainId } = useWeb3React()
	const isConnected = typeof account === "string" && !!library;
	const [currentPage, setCurrentPage] = useState(1)
	const [perPage, setPerPage] = useState(12)
	const [isLoading, setIsLoading] = useState(true)

	/**Character Filter */
	const CharactersList = ['ALL', ...HatchiesData.map(value => { return value["name"] }).sort((a, b) => {
		if (a < b) return -1
		if (a > b) return 1
		return 0
	}).map(hatchy => hatchy)];
	const [charFilter, setCharFilter] = useState('ALL');
	/**Element Filter */
	const elementFilters = ['ALL', 'Fire', 'Water', 'Plant', 'Dark', 'Light']
	const [elementFilter, setElementFilter] = useState('ALL')
	/**Rarity Filter */
	const rarityFilters = ['ALL', 'Common', 'Shiny']
	const [rarityFilter, setRarityFilter] = useState('ALL');

	const getMonsterId = (name: string) => {
		if (name == 'ALL') return 'ALL';
		const hatchyFind = HatchiesData.find(hatchy => hatchy.name === name);
		if (hatchyFind == null) return 'ALL';
		return hatchyFind.monsterId.toString();
	}
	const getShinyFilter = () => {
		if (rarityFilter == 'ALL') return 'ALL';
		return rarityFilter === 'Shiny';
	}
	const changeChar = (character: string) => {
		setCharFilter(character);
		setRarityFilter("ALL")
		setElementFilter("ALL")
		//elemRef.current.selected = true;
		//shinyRef.current.selected = true;
	}
	const changeElement = (element: string) => {
		setCharFilter("ALL");
		setRarityFilter("ALL")
		setElementFilter(element)
		//elemRef.current.selected = true;
		//shinyRef.current.selected = true;
	}
	/*Fetch marketplace data */
	const { listings, total: totalPages } = useFetchGraphMarket(getMonsterId(charFilter), currentPage, "asc", elementFilter, getShinyFilter())

	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy, true);
	const router = useRouter();
	const { buyToken, loadingBuy } = useBuyToken(contract);
	const { cancelTokenSale, loadingCancelTokenSale } = useCancelTokenSale(contract);
	const { refreshWallet } = useWallet();

	useEffect(() => {
		if (listings.length != 0) {
			setIsLoading(false)
		}
		setTimeout(() => {
			setIsLoading(false)
		}, 2000)
	}, [listings])

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
	}
	const onBuyToken = (tokenId: string, price: string) => {
		buyToken(tokenId, price, () => {
			router.push("/wallet").then(() => location.reload())
		})
	}

	const onCancelTokenSale = (tokenId: number) => {
		cancelTokenSale(tokenId, () => {
			refreshWallet();
			router.push("/marketplace");
		})
	}

	return (
		<PageLayout className='bg-kingdom bg-cover'>
			{loadingBuy && <LoadingModal text='Buying hatchy!' />}
			{loadingCancelTokenSale && <LoadingModal text='Canceling the token sale' />}
			<section className=' w-full flex flex-col justify-top items-center text-white space-y-3 pb-10 h-full
			pt-20'>
				<Banner title='MARKETPLACE' />
				<div className='flex flex-wrap justify-center'>
					<div className='px-3 py-2 bg-black bg-opacity-40 border-white border'>
						<a href='https://joepegs.com/collections/hatchy-pocket' target='blank_' className='flex justify-between'>
							<div className='w-8 relative'>
								<Image src={"/static/marketplace/joepegs.png"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
							</div>
							<div>
								Joepegs
							</div>
						</a>
					</div>
					<div className='px-3 py-2 bg-black bg-opacity-40 border-white border'>
						<a href='https://nftrade.com/collection/hatchypocket?traitIds=' target='blank_' className='flex justify-between'>
							<div className='w-8 relative'>
								<Image src={"/static/marketplace/nftrade.png"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
							</div>
							<div>
								NFTrade
							</div>
						</a>
					</div>
					<div className='px-3 py-2 bg-black bg-opacity-40 border-white border'>
						<a href='https://opensea.io/collection/hatchypocket-avax' target='blank_' className='flex justify-between'>
							<div className='w-8 relative'>
								<Image src={"/static/marketplace/openSea.png"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
							</div>
							<div>
								OpenSea
							</div>
						</a>
					</div>
					<div className='px-3 py-2 bg-black bg-opacity-40 border-white border'>
						<a href='https://snowflake.market/collection/0x76dAAaf7711f0Dc2a34BCA5e13796B7c5D862B53/1' target='blank_' className='flex justify-between'>
							<div className='w-8 relative'>
								<Image src={"/static/marketplace/snowflake.jpg"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
							</div>
							<div>
								Snowflake
							</div>
						</a>
					</div>
					<div className='px-3 py-2 bg-black bg-opacity-40 border-white border'>
						<a href='https://tofunft.com/collection/hatchypocket/items' target='blank_' className='flex justify-between'>
							<div className='w-8 relative'>
								<Image src={"/static/marketplace/tofunft.jpg"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
							</div>
							<div>
								TofuNFT
							</div>
						</a>
					</div>
				</div>
				{!isConnected &&
					<div className='pb-5'>
						<ConnectWalletModalWrapper />
					</div>
				}
				{isConnected && chainId !== DefaultChainID &&
					<div className='pb-5'>
						<Button label='Switch network to claim a Hatchie' onClick={setupNetwork} />
					</div>
				}
				<div className='flex flex-col items-center space-y-2 w-full
          				md:flex-row md:space-y-0 md:justify-between md:max-w-3xl'>
					<div className='flex flex-col'>
						<span className='font-bold'>Page:</span>
						<Pagination activePage={currentPage}
							itemsCountPerPage={perPage}
							totalItemsCount={totalPages}
							pageRangeDisplayed={1}
							onChange={handlePageChange}
							hideFirstLastPages={true}
							innerClass='flex'
							itemClass='bg-white text-indigo-500 px-2 mx-1 hover:bg-slate-300 '
							activeClass='bg-indigo-500'
							activeLinkClass='text-white' />
					</div>
					<div className='flex flex-row space-x-2 text-gray-dark'>
						<div className='flex flex-col '>
							<span className='font-bold bg-white px-2'>Element:</span>
							<Select options={elementFilters} value={elementFilter} onChange={(e) => changeElement(e.target.value)} />
						</div>
						<div className='flex flex-col '>
							<span className='font-bold bg-white px-2'>Character:</span>
							<Select options={CharactersList} value={charFilter} onChange={(e) => changeChar(e.target.value)} />
						</div>
						<div className='flex flex-col '>
							<span className='font-bold bg-white px-2'>Rarity:</span>
							<Select options={rarityFilters} value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)} />
						</div>
					</div>
				</div>
				<div className='flex flex-wrap justify-center w-full max-w-7xl h-full'>
					{isLoading ?
						<LoadingSpinnerPage />
						:
						listings.length == 0 ?
							<div className='flex flex-col h-80 justify-center '>
								<span className='text-white font-government text-2xl'>LOOKS LIKE THIS PLACE IS EMPTY</span>
							</div>
							:
							listings?.map(hatchy => (
								<HatchyCardMarketplace tokenId={parseInt(hatchy.tokenId)} price={hatchy.price} key={hatchy.tokenId}
									buyToken={() => onBuyToken(hatchy.tokenId, hatchy.price)} cancelSale={() => onCancelTokenSale(hatchy.id)}
									owned={hatchy.owner.toLowerCase() == account?.toLowerCase()} />
							))
					}
				</div>
				{listings.length > 0 &&
					<div className='flex flex-col'>
						Page:
						<Pagination activePage={currentPage}
							itemsCountPerPage={perPage}
							totalItemsCount={totalPages}
							pageRangeDisplayed={1}
							onChange={handlePageChange}
							hideFirstLastPages={true}
							innerClass='flex'
							itemClass='bg-white text-indigo-500 px-2 mx-1 hover:bg-slate-300 '
							activeClass='bg-indigo-500'
							activeLinkClass='text-white' />
					</div>
				}
			</section>
		</PageLayout>
	)
}

export default MarketplacePage

