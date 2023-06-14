import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingModal from '../components/LoadingModal'
import PageLayout from '../components/PageLayout'
import HatchyGen2SelectionCard from '../components/Staking/HatchyGen2SelectionCard'
import CollapsableElementSelection from '../components/Transfer/CollapsableElementSelection'
import GenSelector from '../components/Utility/GenSelector'
import LoadingOverlay from '../components/Utility/LoadingOverlay'
import LoadingSpinner from '../components/Utility/LoadingSpinner'
import WalletConnectionValidation from '../components/WalletConnect/WalletConnectionValidation'
import { ELEMENTS } from '../constants'
import { useWallet } from '../contexts/WalletContext'
import useGen2BatchTransfer from '../hooks/transfer/useGen2BatchTransfer'
import { Metadata, SelectedHatchiesAmount } from '../types'
import { displayError, displaySuccess } from '../utils/ErrorMessage'

const TransferPage: NextPage = () => {
	const router = useRouter();
	const {gen2Metadatas, gen2Wallet, gen} = useWallet();
	const [receiverAddress, setReceiverAddress] = useState('');
	const {batchTransfer, loadingTransfer } = useGen2BatchTransfer();
	const [selectedHatchiesAmount, setSelectedHatchiesAmount] = useState<SelectedHatchiesAmount>({});
	const [totalAmountSelected, setTotalAmountSelected] = useState(0);

	const transferHandler = ()=>{
		batchTransfer(receiverAddress, selectedHatchiesAmount).then((success)=>{
			if (success) {
				gen2Wallet.refreshWallet();
				displaySuccess('Hatchies successfully transfered')
			}
		}).catch(()=>{
			displayError('transaction error');
		})
	}

	const deselectAll = ()=>{
		setTotalAmountSelected(0);
		if (gen2Metadatas) {
			initializeStakedAmounts(gen2Metadatas);
		}
	}

	const setShinyAmount = (monsterId: number, amount: string) => {
		const aux = { ...selectedHatchiesAmount };
		aux[monsterId].shinyAmount = amount;
		setSelectedHatchiesAmount(aux);
	}

	const setCommonAmount = (monsterId: number, amount: string) => {
		const aux = { ...selectedHatchiesAmount };
		aux[monsterId].commonAmount = amount;
		setSelectedHatchiesAmount(aux);
	}

	const initializeStakedAmounts = (metadatas: Metadata[]) => {
		const selectedHatchiesAmountAux: SelectedHatchiesAmount = {};
		metadatas.forEach(hatchy => {
			selectedHatchiesAmountAux[hatchy.monsterId] = {
				monsterId: hatchy.monsterId,
				commonAmount: '0',
				shinyAmount: '0'
			}
		});
		setSelectedHatchiesAmount(selectedHatchiesAmountAux);
	}

	const selectElementalSet = (element: string) => {
		let elementHatchies = getElementalSet(element);
		const selectedHatchiesAmountAux = {...selectedHatchiesAmount};
		if (elementHatchies && elementHatchies.length > 0) {
			elementHatchies.forEach(hatchy => {
				selectedHatchiesAmountAux[hatchy.monsterId] = {
					monsterId: hatchy.monsterId,
					commonAmount: '1',
					shinyAmount: '0'
				}
			});
			setSelectedHatchiesAmount(selectedHatchiesAmountAux);
		}
	}

	const getElementalSet = (element: string)=>{
		let elementHatchies: Metadata[] | null = null;
		
		if (gen2Metadatas) {
			const aux = gen2Metadatas.filter(hatchy => hatchy.element == element);
			elementHatchies = aux;
		}
		return elementHatchies;
	}
	useEffect(() => {
		if (selectedHatchiesAmount) {
			let totalTokens = 0;		
			for (const key in selectedHatchiesAmount) {
				if (Object.prototype.hasOwnProperty.call(selectedHatchiesAmount, key)) {
					const amounts = selectedHatchiesAmount[key];
					totalTokens += parseInt(amounts.commonAmount);	
					totalTokens += parseInt(amounts.shinyAmount);	
				}
			}
			setTotalAmountSelected(totalTokens);
		}
	}, [selectedHatchiesAmount]);
	

	useEffect(() => {
		if (gen2Metadatas) {
			initializeStakedAmounts(gen2Metadatas);
		}
	}, [gen2Metadatas]);

	useEffect(() => {
		if (gen==2) {
			router.push('/transfer-gen2');
		} else {
			router.push('/transfer-gen1');
		}
	}, [gen])
	
	
	function renderGrid(element: string) {
		let elementHatchies = getElementalSet(element);
		if (elementHatchies == null) return (
			<div className='flex justify-center items-center py-10'>
				<LoadingSpinner />
			</div>
		)
		if (elementHatchies.length == 0) return (
			<div className='flex justify-center items-center py-10'>
				<span className='font-bold text-lg'>No hatchies</span>
			</div>
		)
		return (
			<div className='grid grid-cols-1 w-full justify-center items-center
			py-5
			md:grid-cols-2 lg:grid-cols-4'>
				{elementHatchies.map((hatchy, id) => {
					return (
						<HatchyGen2SelectionCard hatchy={hatchy} key={hatchy.monsterId}
							setCommonAmount={(amount) => setCommonAmount(hatchy.monsterId, amount)}
							setShinyAmount={(amount) => setShinyAmount(hatchy.monsterId, amount)}
							stakeAmount={selectedHatchiesAmount[hatchy.monsterId]} />
					)
				})}
			</div>
		)
	}

	const renderHatchyTokens = ()=>{
		return (
			<div className='flex flex-col w-full '>
				{ELEMENTS.concat('Void').map(element =>{
					return (
						<CollapsableElementSelection key={element} title={element} element={element}
						onSelectAll={()=>selectElementalSet(element)} stakeMode>
							{renderGrid(element)}
						</CollapsableElementSelection>
					)
				})}
			</div>
		);
	}

	const renderContent = ()=>{
		if (!gen2Metadatas || gen2Metadatas.length==0) {
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
			return (
				<div className='w-full max-w-3xl min-h-[30rem] mb-10'>
					<h2 className='text-xl font-bold py-3'>
						Select hatchy tokens to transfer
					</h2>
					<GenSelector />
					<div className={`flex flex-row justify-end items-center bg-gray-dark2 bg-opacity-70 border-b border-white  px-3 py-1`}>
						<div className='flex flex-row items-center space-x-5'>
							<span className='underline cursor-pointer hover:text-neutral-200' onClick={deselectAll}>Deselect all</span>
							<span>
								Total Selected: {totalAmountSelected}
							</span>
						</div>
					</div>
					{renderHatchyTokens()}
					<div className='w-full bg-black bg-opacity-30 pb-5 flex flex-col justify-center items-center
					space-y-3'>
						<span className='font-bold mt-5'>RECEIVER ADDRESS</span>
						<div className='w-full max-w-md'>
							<Input
								value={receiverAddress}
								onChange={setReceiverAddress}
								placeholder='0x0000...0000'
								className='w-full h-10'/>
						</div>
						<Button label={`Transfer ${totalAmountSelected} tokens`} 
						color={(totalAmountSelected<1)?'black':'green'}
						disabled={totalAmountSelected<1}
						onClick={transferHandler}/>
					</div>
				</div>
			)
		}
	}

	return (
		<WalletConnectionValidation
			unconnectedMessage='Connect your wallet to transfer your Hatchies'
			keepLoading={!gen2Metadatas}
		>
		<PageLayout className={"text-center"}>
			{(loadingTransfer) && <LoadingModal />}
			<LoadingOverlay loading={gen2Metadatas==null}/>
			<div className={`bg-purple-image bg-cover w-auto text-center pt-14 flex flex-col items-center text-white
			${gen2Wallet.loadingMetadatas?'hidden':'visible'}`}>
				<Banner title='TRANSFER' className='mt-20 md:mt-16'/>
				{renderContent()}
			</div>
		</PageLayout>
		</WalletConnectionValidation>
	)
}

export default TransferPage

