import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ABI from '../../abi'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import CollectionGridWallet from '../../components/Wallet/CollectionGridWallet'
import HatchyCardInfo from '../../components/Wallet/HatchyCardInfo'
import PageLayout from '../../components/PageLayout'
import ShareModal from '../../components/Wallet/ShareModal'
import TokenItem from '../../components/Wallet/TokenItem'
import useContract from '../../hooks/useContract'
import useFetchMetadatas from '../../hooks/useFetchMetadatas'
import useTokensOfOwner from '../../hooks/useTokensOfOwner'
import HatchiesData from "../../public/static/characters.json";
import { HatchyStatsObject, Metadata } from '../../types'
import { getHatchyNFTAddress } from '../../utils/addressHelpers'
import WalletCollectionFilters from '../../components/Wallet/WalletCollectionFilters'
import Checkbox from '../../components/Checkbox'
import useStakedUserInfo from '../../hooks/useStakedUserInfo'
import WalletConnectionValidation from '../../components/WalletConnect/WalletConnectionValidation'
import GenSelector from '../../components/Utility/GenSelector'
import { getHatchieData, getHatchieFilteredCount, getHatchiesFilteredByMonsterID } from '../../utils/metadataArraysUtils'
import { useWallet } from '../../contexts/WalletContext'
import useFetchGen2NFTMetadatas from '../../hooks/gen2/useFetchGen2NFTMetadatas'
import { useHatchyPocketGen2Contract } from '../../hooks/gen2/useGen2Contract'
import useGen2StakedUserInfo from '../../hooks/gen2/useGen2StakedUserInfo'
import WalletStatsTable from '../../components/Wallet/WalletStatsTable'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context'


const AddressPage: NextPage = () => {
	const address = useRouter().query.address as string;
	const [selectedHatchy, setSelectedHatchy] = useState<Metadata | null>(null);
	const [hatchieTokens, setHatchieTokens] = useState<Metadata[]>([]);
	//share modal
	const [showShinyOnly, setShowShinyOnly] = useState(false)
	const [showShareModal, setShowShareModal] = useState(false)
	const openShareModal = () => setShowShareModal(true);
	const closeShareModal = () => setShowShareModal(false);

	const [gen1Stats, setGen1Stats] = useState({
		collectionCommon: 0,
		collectionShiny: 0,
		stakingCommon: 0,
		stakingShiny: 0,
	})
	const {gen2StakedMetadatas, stakedShinyTokensGen2: shinyStakedTokensQuantity, totalStakedTokensGen2: totalStakedTokens, stakedCommonTokensGen2: commonStakedTokensQuantity } = useStakeGen2();

	/*Get metadata with url address */
	const { gen } = useWallet();
	const contract = useContract(getHatchyNFTAddress(), ABI.Hatchy);
	const hatchyGen2Contract = useHatchyPocketGen2Contract();
	const tokensOfOwner = useTokensOfOwner(contract, address);
	const metadatas = useFetchMetadatas(tokensOfOwner.tokens);
	const gen2Wallet = useFetchGen2NFTMetadatas(hatchyGen2Contract, address);
	const gen2Metadatas = gen2Wallet.metadatas;
	
	/*Metadata REPLACE*/
  const {userStakedNFT} = useStakedUserInfo('', address);
	const stakedMetadatas = useFetchMetadatas(userStakedNFT);
	//const {gen2StakedMetadatas, totalTokens: totalStakedTokens} = useGen2StakedUserInfo('', address);
	const [filteredHatchies, setFilteredHatchies] = useState<HatchyStatsObject>();

	function renderSameTokens() {
		if(hatchieTokens){
			const tokens = hatchieTokens.map((hatchy, i) => {
				return (
					<TokenItem key={hatchy.tokenId} token={hatchy.tokenId} shiny={hatchy?.isShiny == 1} 
					element={hatchy?.element.toLowerCase()} staked={hatchy.isStaked}
					selected={hatchy.tokenId==selectedHatchy?.tokenId}
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

	const selectHatchy = (id: number) => {
		const filteredHatchies = getHatchiesFilteredByMonsterID(
			showShinyOnly,
			id,
			gen==1?metadatas:gen2Metadatas,
			gen==1?stakedMetadatas:gen2StakedMetadatas,
		)
		if (filteredHatchies && filteredHatchies.length > 0) {
			const hatchy = filteredHatchies[0];
			setSelectedHatchy(hatchy);
		} else {
			setSelectedHatchy(getHatchieData(id));
		}
	}

	useEffect(() => {
		const auxStats = {
			collectionCommon: 0,
			collectionShiny: 0,
			stakingCommon: 0,
			stakingShiny: 0,
		}
		if (metadatas) {
			let commonAmount = 0;
			let shinyAmount = 0;
			metadatas.forEach(hatchy=>{
				if (hatchy.isShiny) {
					shinyAmount++;	
				} else {
					commonAmount++;
				}
			});
			auxStats.collectionCommon = commonAmount;
			auxStats.collectionShiny = shinyAmount;
		}
		if (stakedMetadatas) {
			let commonAmount = 0;
			let shinyAmount = 0;
			stakedMetadatas.forEach(hatchy=>{
				if (hatchy.isShiny) {
					shinyAmount++;	
				} else {
					commonAmount++;
				}
			});
			auxStats.stakingCommon = commonAmount;
			auxStats.stakingShiny = shinyAmount;
		}
		setGen1Stats(auxStats);
	}, [metadatas, stakedMetadatas])

	useEffect(() => {
		if(gen==1){
			if (stakedMetadatas && stakedMetadatas.length>0) {
				const auxMetadataStaked = stakedMetadatas[0]
				auxMetadataStaked.isStaked=true;
				setSelectedHatchy(auxMetadataStaked);
				return;
			}
			if(metadatas) setSelectedHatchy(metadatas[0]);
		}
		if(gen==2){
			if (gen2Metadatas && gen2Metadatas.length<1 ) {
				setSelectedHatchy(getHatchieData(40))
				return;
			}
			if(gen2Metadatas) setSelectedHatchy(gen2Metadatas[0]);
		};
	}, [gen, metadatas, gen2Metadatas, stakedMetadatas])

	/*Filter Management*/
	useEffect(() => {
		let filteredMetadatasAux = getHatchieFilteredCount(
			showShinyOnly,
			gen,
			gen==1?metadatas:gen2Metadatas,
			gen==1?stakedMetadatas:gen2StakedMetadatas,
		);
		setFilteredHatchies(filteredMetadatasAux);
	}, [showShinyOnly, metadatas, gen2Metadatas, stakedMetadatas, gen]);

	useEffect(() => {
		if (selectedHatchy)
			selectHatchy(selectedHatchy?.monsterId);
	}, [showShinyOnly])

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
		}
	}, [selectedHatchy?.monsterId, metadatas, stakedMetadatas, showShinyOnly])

	const isGen2HatchyOwned = (hatchy:Metadata | null)=>{
		if (hatchy && hatchy.quantity && hatchy.quantity>0) {
			return true;	
		}	
		return false;	
	}


	return (
		<WalletConnectionValidation
			unconnectedMessage='Connect your wallet to view the hatchies'
			wrongNetworkMessage='Switch network to view the hatchies'
			keepLoading={!metadatas || !stakedMetadatas}
		>
			<PageLayout>
				{selectedHatchy &&
					<ShareModal isOpen={showShareModal} closeModal={closeShareModal} token={selectedHatchy.tokenId} />
				}
				<section className='bg-kingdom bg-cover w-full flex flex-col justify-center items-center space-y-8 pt-20'>
					<Banner title='WALLET' />
					<div className='flex flex-col text-white bg-black bg-opacity-30 px-3 py-2 text-center '>
						<span className='text-sm md:text-xl'>{address}</span>
						<span>Owns {gen==1?metadatas?.length:gen2Wallet.totalTokens} Hatchies</span>
					</div>
					<div className='flex flex-col justify-center items-center max-w-xs  space-y-10 w-full
			  md:max-w-xl lg:max-w-5xl lg:flex-row lg:space-x-16 lg:space-y-0'>
						<div className='flex flex-col space-y-5
				md:flex-row  md:space-x-3 md:space-y-0 lg:space-x-16'>
							<HatchyCardInfo
								hatchy={selectedHatchy || HatchiesData[1]}
								isStaked={selectedHatchy?.isStaked} />
						</div>
						<div className='flex flex-col w-full  self-start
								lg:max-w-sm'>
							<div className='flex flex-col  bg-white text-gray-dark py-1 px-3 '>
								<div className='flex flex-row items-center justify-center space-x-3'>
									<Checkbox allSelected={showShinyOnly} color="shiny"
										onClick={() => setShowShinyOnly(!showShinyOnly)} />
									<span className='text-xl font-bold cursor-pointer select-none'
										onClick={() => setShowShinyOnly(!showShinyOnly)} >
										ONLY SHINY
									</span>
								</div>
							</div>
							{hatchieTokens.length > 0 &&
								<>
									<span className='text-gray-dark px-3 py-1 bg-white text-center font-governmen text-lg font-black mt-5'>
										{showShinyOnly ? 'SHINY ' : ''}OWNED TOKENS: {hatchieTokens.length}
									</span>
									<div className='h-28 w-auto border-2 border-white overflow-x-auto flex flex-row items-center p-2 space-x-3 text-white mb-2' >
										{renderSameTokens()}
									</div>
									<Button label='SHARE HATCHY' color='cyan' onClick={openShareModal} />
								</>
							}
							{selectedHatchy?.quantity && selectedHatchy.quantity > 0 &&
								<>
									<span className=' text-gray-dark px-3 py-1 bg-white text-center font-governmen text-lg font-black mt-5'>
										{showShinyOnly ? 'SHINY ' : ''} OWNED TOKENS: {selectedHatchy.quantity}
									</span>

								</>
							}									
							<WalletStatsTable 
									collectionCommon={gen==1?gen1Stats.collectionCommon:gen2Wallet.commonTokensQuantity}
									collectionShiny={gen==1?gen1Stats.collectionShiny:gen2Wallet.shinyTokensQuantity}
									stakingCommon={gen==1?gen1Stats.stakingCommon:commonStakedTokensQuantity}
									stakingShiny={gen==1?gen1Stats.stakingShiny:shinyStakedTokensQuantity}
									/>
						</div>
					</div>
					<div className='w-full max-w-7xl pb-5'>
						<GenSelector />
						<CollectionGridWallet
							setSelectedHatchyID={selectHatchy}
							selectedMonsterID={selectedHatchy?.monsterId} 
							ownedHatchies={filteredHatchies}
						/>
						
					</div>
				</section>
				<WalletCollectionFilters
					metadatas={gen==1?metadatas:gen2Metadatas}
					stakedHatchies={gen==1?stakedMetadatas:gen2StakedMetadatas}
					isAddress={true}
					address={address}
					gen2Wallet={gen2Wallet}
					totalStakedTokens={totalStakedTokens}
				/>
			</PageLayout>
		</WalletConnectionValidation>
	)
}

export default AddressPage