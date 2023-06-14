import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import Input from '../components/Input'
import LoadingModal from '../components/LoadingModal'
import PageLayout from '../components/PageLayout'
import Title from '../components/Title'
import BatchTransferModal from '../components/Transfer/BatchTransferModal'
import BatchTransferSelector from '../components/Transfer/BatchTransferSelector'
import CollapsableElementSelection from '../components/Transfer/CollapsableElementSelection'
import GenSelector from '../components/Utility/GenSelector'
import LoadingOverlay from '../components/Utility/LoadingOverlay'
import LoadingSpinner from '../components/Utility/LoadingSpinner'
import LoadingSpinnerPage from '../components/Utility/LoadingSpinnerPage'
import TokenItem from '../components/Wallet/TokenItem'
import WalletConnectionValidation from '../components/WalletConnect/WalletConnectionValidation'
import { ELEMENTS } from '../constants'
import { useWallet } from '../contexts/WalletContext'
import useGen1BatchTransfer from '../hooks/transfer/useGen1BatchTransfer'
import { ElementLower, elementsLimits } from '../types'
import { displayError, displaySuccess } from '../utils/ErrorMessage'
import { getHatchiesDataArray } from '../utils/metadataArraysUtils'

const TransferPage: NextPage = () => {
	const router = useRouter();
	const gen1Metadatas = getHatchiesDataArray(1);
	const {metadatas, loadingMetadatas, refreshWallet, gen} = useWallet();
	const [transferTokens, setTransferTokens] = useState<number[]>([]);
	const [tokensByMonsterId, setTokensByMonsterId] = useState<Array<any[]>>([]);
	const [tokensByElement, setTokensByElement] = useState<Array<any[]>>([[],[],[],[],[],[]]);
	const [allSelected, setAllSelected] = useState(false);
	const [receiverAddress, setReceiverAddress] = useState('');
	const [safeTransfer, setSafeTransfer] = useState(true);
	const [loadingApproval, setLoadingApproval] = useState(false);
	const {batchTransfer, loadingTransfer, approve, isApproved, loadingApproval: auxLoading} = useGen1BatchTransfer();
	const [showModal, setShowModal] = useState(false);
	const closeModal = () => setShowModal(false);
	const approveHandler = ()=>{
		setLoadingApproval(true);
		approve().then(()=>{
			displaySuccess('transfer contract approved!')
		}).catch(()=>{
			displayError('transaction error!')
		}).finally(()=>{
			setLoadingApproval(false);
		})
	}
	const transferHandler = ()=>{
		batchTransfer(receiverAddress, transferTokens, safeTransfer).then((success)=>{
			if (success) {
				refreshWallet();
				displaySuccess('Hatchies successfully transfered')
				setShowModal(true);
			}
		}).catch(()=>{
			displayError('transaction error');
		})
	}

	const deselectAll = ()=>{
		setTransferTokens([]);
		setAllSelected(false);
	}

	const selectSet = (element: string)=>{
		if (metadatas) {
			let allTokens: number[]	= []
			let selectedTokens:any = {};
			metadatas.forEach(metadata=>{
				if (metadata.tokenId && metadata.element==element &&
					selectedTokens[metadata.monsterId]==null) {
					allTokens.push(metadata.tokenId)
					selectedTokens[metadata.monsterId]=true;
				}
			});
			toggleTransferTokens(allTokens);
		}
	}
	
	const selectAll = ()=>{
		if (metadatas) {
			let allTokens: number[]	= []
			metadatas.forEach(metadata=>{
				if (metadata.tokenId) {
					allTokens.push(metadata.tokenId)
				}
			});
			toggleTransferTokens(allTokens);
			setAllSelected(!allSelected);
		}
	}

	const toggleTransferTokens = (newTokens: number[])=>{
		let newTransferTokens = [...transferTokens];
		const deselectTokens:number[] = [];
		newTokens.forEach(newToken => {
			if (newTransferTokens.indexOf(newToken)==-1) {
				newTransferTokens.push(newToken);			
			} else {
				deselectTokens.push(newToken);
			}
		});
		newTransferTokens = newTransferTokens.filter(token=>deselectTokens.indexOf(token)==-1);
		setTransferTokens(newTransferTokens);
	}

	useEffect(() => {
		if (metadatas) {
			const newTokensByMonsterId:Array<any[]> = Array.from(Array(40), () => new Array());
			const newTokensByElement:Array<any[]> = Array.from(Array(6), () => new Array());
			metadatas.forEach(hatchy => {
				if (hatchy.tokenId){
					const tokenData = {
						token: hatchy.tokenId,
						element: hatchy.element.toLowerCase(),
						shiny: hatchy.isShiny
					}
					newTokensByMonsterId[hatchy.monsterId].push(tokenData);
					const elementIndex = ELEMENTS.concat('Void').findIndex(element=>element==hatchy.element);
					if (elementIndex!=-1) {
						newTokensByElement[elementIndex].push(tokenData);
					}
				}
			});
			setTokensByMonsterId(newTokensByMonsterId);
			setTokensByElement(newTokensByElement);
			setTransferTokens([]);
			setReceiverAddress('');
		}
	}, [metadatas])
	
	useEffect(() => {
		if (gen==2) {
			router.push('/transfer-gen2');
		} else {
			router.push('/transfer-gen1');
		}
	}, [gen])
	
	
	const renderHatchyTokens = ()=>{
		return (
			<div className='flex flex-col w-full '>
				{ELEMENTS.concat('Void').map(element =>{
					return (
						<CollapsableElementSelection key={element} title={element} element={element}
						onSelectAll={()=>selectSet(element)} stakeMode>
							{gen1Metadatas.filter(hatchy=>hatchy.element==element).map(hatchy=>{
								if (tokensByMonsterId[hatchy.monsterId] &&
									tokensByMonsterId[hatchy.monsterId].length>0) {
									return (
										<BatchTransferSelector
											key={hatchy.monsterId}
											hatchy={hatchy}
											hatchyTokens={tokensByMonsterId[hatchy.monsterId]}
											transferTokens={transferTokens}
											toggleTransferTokens={toggleTransferTokens}
										/>
									)	
								} else {
									return  <Fragment key={hatchy.monsterId} />
								}
							})}
						</CollapsableElementSelection>
					)
				})}
			</div>
		);
	}
	
	const renderSelectedTokens = ()=>{
		return ELEMENTS.concat('Void').map((element, i)=>{
			const elementLower = element.toLowerCase();
			const elementHatchies = elementsLimits.gen1[elementLower as ElementLower].max -
				elementsLimits.gen1[elementLower as ElementLower].min;
			return (
				<div key={element} className='w-full bg-gray-dark2 bg-opacity-90
				flex flex-col'>
					<div className='bg-black bg-opacity-80 w-full flex flex-row space-x-5 justify-center'>
						<span>
							{element}
						</span>
						<span>
							{tokensByElement[i].filter(tokenData=>transferTokens.includes(tokenData.token)).length}
							/
							{elementHatchies}
						</span>
					</div>	
					<div className='w-40 h-28 flex flex-row overflow-x-auto
					space-x-5 px-5 py-2 items-center'>
						{tokensByElement[i].map(tokenData=>{
							if (transferTokens.includes(tokenData.token)) {
								return (
									<TokenItem	
										key={tokenData.token}
										token={tokenData.token}
										element={element.toLowerCase()}
										shiny={tokenData.shiny}
									/>
								)
							}	
							return <Fragment key={tokenData.token} />;
						})}
					</div>
				</div>
			)
		}
		)	
	}
	
	const renderContent = ()=>{
		if (auxLoading) {
			return (
				<div className='w-full max-w-xl py-60 flex flex-col justify-center items-center'>
					<LoadingSpinner />
					<span>Loading...</span>
				</div>
			)
		}
		if (!metadatas || metadatas.length==0) {
			return (
				<div className='w-full max-w-xl py-60 flex flex-col justify-center items-center'>
					<span className='text-xl mb-8'>
						{`You don't have any hatchies in your wallet`}
					</span>
					<Link href='/claim'>
						<a>
							<Button label='Go to Claim' />
						</a>
					</Link>
				</div>
			)	
		} else {
			if (isApproved) {
				return (
					<div className='w-full max-w-3xl min-h-[30rem] mb-10'>
						<h2 className='text-xl font-bold py-3'>
							Select hatchy tokens to transfer
						</h2>
						<h3 className='text-lg font-bold mb-5 text-yellow'>
							WARNING: you can transfer max. 20 hatchies per transaction
						</h3>
						<GenSelector />
						<div className='fixed top-14 right-0  text-white flex-col z-20 hidden
						md:flex'>
							<span className='bg-black w-full py-1 font-bold'>
								Total: {transferTokens.length}
							</span>
							{renderSelectedTokens()}
						</div>
						<div className={`flex flex-row justify-end items-center bg-gray-dark2 bg-opacity-70 border-b border-white  px-3 py-1`}>
							<div className='flex flex-row items-center space-x-2'>
								<span className='underline cursor-pointer hover:text-neutral-200' onClick={deselectAll}>Deselect all</span>
								<span>Select all</span>
								<Checkbox allSelected={allSelected} onClick={selectAll} />
							</div>
						</div>
						{renderHatchyTokens()}
						<div className='w-full bg-black bg-opacity-30 pb-5 flex flex-col justify-center items-center'>
							<span className='font-bold'>RECEIVER ADDRESS</span>
							<div className='w-full max-w-md'>
								<Input
									value={receiverAddress}
									onChange={setReceiverAddress}
									placeholder='0x0000...0000'
									className='w-full h-10'/>
							</div>
							<div className='w-full justify-center space-x-3 flex flex-row py-3'>
								<span>Safe Transfer (cannot transfer to contracts)</span>	
								<Checkbox allSelected={safeTransfer} onClick={()=>setSafeTransfer(!safeTransfer)} />
							</div>
							<Button label={`Transfer ${transferTokens.length} tokens`} 
							color={(transferTokens.length<1 || transferTokens.length>20)?'black':'green'}
							disabled={transferTokens.length<1 || transferTokens.length>20}
							onClick={transferHandler}/>
						</div>
					</div>
				)
			} else {
				return (
					<div className='w-full max-w-xl py-60 flex justify-center items-center'>
						<Button color='yellow' label='Approve batch transfer contract' 
						onClick={approveHandler}/>
					</div>
				)
			}
		}
	}

	return (
		<WalletConnectionValidation
			unconnectedMessage='Connect your wallet to transfer your Hatchies'
			keepLoading={!metadatas}
		>
		<PageLayout className={"text-center"}>
			{(loadingApproval || loadingTransfer) && <LoadingModal />}
			<LoadingOverlay loading={metadatas==null}/>
			<BatchTransferModal isOpen={showModal} closeModal={closeModal} />
			<div className={`bg-purple-image bg-cover w-auto text-center pt-14 flex flex-col items-center text-white
			${loadingMetadatas?'hidden':'visible'}`}>
				<Banner title='TRANSFER' className='mt-20 md:mt-16'/>
				<div className='w-full max-w-xl'>
					<Title title='Disclaimer' />
					<p>Batch transfer is an experimental feature. Use at your own risk.</p>
				</div>
				{renderContent()}
			</div>
		</PageLayout>
		</WalletConnectionValidation>
	)
}

export default TransferPage

