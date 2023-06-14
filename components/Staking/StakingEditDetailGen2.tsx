import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { Icon } from '@iconify/react';
import { useWallet } from '../../contexts/WalletContext';
import { Metadata, SelectedHatchiesAmount } from '../../types';
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import HatchyGen2SelectionCard from './HatchyGen2SelectionCard';
import LoadingSpinner from '../Utility/LoadingSpinner';
import { displayError, displaySuccess, displayWarn } from '../../utils/ErrorMessage';
import { ELEMENTS } from '../../constants';
import CollapsableElementSelection from '../Transfer/CollapsableElementSelection';
import GenSelector from '../Utility/GenSelector';
import { useStakeTokens } from '../../contexts/StakeTokensContext';

interface StakingEditDetailGen2Props {
	setShowEditDetail: (value: string) => void
	showEditDetail: string,
}

export default function StakingEditDetailGen2({
	showEditDetail: selectedElement,
	setShowEditDetail: setSelectedElement,
}: StakingEditDetailGen2Props) {

	/*Staked Hatchies filtered by element */
	const { gen2Metadatas } = useWallet();

	const {
		gen2StakedMetadatas,
		hadaapprovedGen2,
		batchHatchyStakeGen2Amounts,
	} = useStakeGen2();

	const {
		handleStakeAndUnstake,
	} = useStakeTokens();

	const [stakeMode, setStakeMode] = useState(true);
	const [displayHatchies, setDisplayHatchies] = useState<Metadata[] | null>(null);
	const [selectedHatchiesAmount, setSelectedHatchiesAmount] = useState<SelectedHatchiesAmount>({});
	const [totalAmountSelected, setTotalAmountSelected] = useState(0);
	const [isSetSelected, setIsSetSelected] = useState(false);
	const [updater, setUpdater] = useState('');
	const [stakedHatchiesGen2, setStakedHatchiesGen2] = useState({});

	const handleStake = async () => {
		const totalAmountAux = totalAmountSelected;
		batchHatchyStakeGen2Amounts(selectedHatchiesAmount, stakeMode).then(() => {
			displaySuccess(`${totalAmountAux} ${stakeMode ? 'staked' : 'unstaked'} succesfully`);
		}).catch(() => {
			displayError('transaction error!');
		});
	}

	const returnPage = () => {
		setSelectedElement("");
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

	const getElementalSet = (element: string) => {
		let elementHatchies: Metadata[] | null = null;
		if (stakeMode) {
			if (gen2Metadatas) {
				const aux = gen2Metadatas.filter(hatchy => hatchy.element.toLowerCase() == element);
				elementHatchies = aux;
			}
		} else {
			if (gen2StakedMetadatas) {
				const aux = gen2StakedMetadatas.filter(hatchy => hatchy.element.toLowerCase() == element);
				elementHatchies = aux;
			}
		}
		return elementHatchies;
	}
	const selectOneSet = () => {
		const selectedHatchiesAmountAux: SelectedHatchiesAmount = {};
		if (displayHatchies && displayHatchies.length > 0) {
			displayHatchies.forEach(hatchy => {
				selectedHatchiesAmountAux[hatchy.monsterId] = {
					monsterId: hatchy.monsterId,
					commonAmount: '1',
					shinyAmount: '0'
				}
			});
			setSelectedHatchiesAmount(selectedHatchiesAmountAux);
			setIsSetSelected(true);
		}
	}

	const selectElementalSet = (element: string) => {
		let elementHatchies = getElementalSet(element);

		const selectedHatchiesAmountAux = { ...selectedHatchiesAmount };
		if (elementHatchies && elementHatchies.length > 0) {
			elementHatchies.forEach(hatchy => {
				selectedHatchiesAmountAux[hatchy.monsterId] = {
					monsterId: hatchy.monsterId,
					commonAmount: '1',
					shinyAmount: '0'
				}
			});
			setSelectedHatchiesAmount(selectedHatchiesAmountAux);
			setIsSetSelected(true);
		}
	}
	const deselectAll = () => {
		setUpdater((new Date()).toString());
		setIsSetSelected(false);
	}

	useEffect(() => {
		if (stakeMode) {
			if (gen2Metadatas) {
				const aux = gen2Metadatas.filter(hatchy => hatchy.element.toLowerCase() == selectedElement);
				//initializeStakedAmounts(aux);
				initializeStakedAmounts(gen2Metadatas);
				setDisplayHatchies(aux);
			}
		} else {
			if (gen2StakedMetadatas) {
				const aux = gen2StakedMetadatas.filter(hatchy => hatchy.element.toLowerCase() == selectedElement);
				//initializeStakedAmounts(aux);
				initializeStakedAmounts(gen2StakedMetadatas);
				setDisplayHatchies(aux);
			}
		}
		setIsSetSelected(false);
	}, [stakeMode, gen2Metadatas, gen2StakedMetadatas, selectedElement, updater]);

	useEffect(() => {
		let plant: Metadata[] = [];
		let water: Metadata[] = [];
		let fire: Metadata[] = [];
		let dark: Metadata[] = [];
		let light: Metadata[] = [];
		let dragon: Metadata[] = [];
		let voids: Metadata[] = [];
		const stakedHatchiesAux = { plant, water, fire, dark, light, dragon, voids }
		if (gen2StakedMetadatas && gen2StakedMetadatas.length > 0) {
			for (let i = 0; i < gen2StakedMetadatas.length; i++) {
				const item = gen2StakedMetadatas[i];
				if (item.element === "Plant" && item.monsterId < 137) {
					plant.push(item);
				}
				if (item.element === 'Water' && item.monsterId < 137) {
					water.push(item);
				}
				if (item.element === 'Fire' && item.monsterId < 137) {
					fire.push(item);
				}
				if (item.element === 'Dark' && item.monsterId < 137) {
					dark.push(item);
				}
				if (item.element === 'Light' && item.monsterId < 137) {
					light.push(item);
				}
				if (item.monsterId >= 137 && item.monsterId <= 142) {
					dragon.push(item);
				}
				if (item.element === 'Void' && item.monsterId != 142) {
					voids.push(item)
				}
			}
			setStakedHatchiesGen2(stakedHatchiesAux)
		}
	}, [gen2StakedMetadatas])

	useEffect(() => {
		let count = 0;
		let messageDisplayed = false;
		for (const key in selectedHatchiesAmount) {
			if (Object.prototype.hasOwnProperty.call(selectedHatchiesAmount, key)) {
				const amountData = selectedHatchiesAmount[key];
				count += parseInt(amountData.commonAmount);
				count += parseInt(amountData.shinyAmount);
				if (count > 50 && !messageDisplayed) {
					displayWarn("Cannot Stake more than 50 hatchies at once");
					messageDisplayed = true;
					//return;
				}
			}
		}
		setTotalAmountSelected(count);
	}, [selectedHatchiesAmount]);


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

	const renderElementsSections = () => {
		return (
			<div className='flex flex-col w-full mb-5'>
				{ELEMENTS.concat('Void').map(element => {
					return (
						<CollapsableElementSelection key={element} title={element} element={element}
							maxHeight='max-h-[120rem]'
							stakeMode={stakeMode}
							onSelectAll={() => selectElementalSet(element.toLowerCase())}>
							{renderGrid(element.toLowerCase())}
						</CollapsableElementSelection>
					)
				})}
			</div>
		);
	}

	const renderButton = () => {
		if (!hadaapprovedGen2) return (
			<Button label={`APPROVE FOR STAKING`} color='yellow' onClick={handleStakeAndUnstake} className='w-full h-full my-5' />
		)
	}

	return (
		<div className={`w-full flex flex-col justify-center items-center relative
		bg-black bg-opacity-10 p-6 text-white card-frame`}>
			<div className='mt-5 -mb-5'>
				<GenSelector />
			</div>
			<div className='flex w-full max-w-4xl justify-start items-center absolute
			text-white text-xl font-bold top-1 left-4'>
				<button
					onClick={returnPage}
					className='flex flex-row items-center text-xl visible
					hover:text-neutral-200 ease-in-out transition-colors'
				>
					<Icon icon="bx:left-arrow-alt" width={40} />
					Back
				</button>
			</div>
			<div className='flex flex-col mt-10 mb-5 w-full justify-center
			sm:space-x-5 sm:flex-row'>
				<Button label={`Stake`} color={stakeMode ? 'yellow' : 'black'} onClick={() => setStakeMode(true)} />
				<Button label={`Unstake`} color={!stakeMode ? 'yellow' : 'black'} onClick={() => setStakeMode(false)} />
			</div>
			{/*Hatchies Grid*/}
			{renderElementsSections()}
			{renderButton()}
			{hadaapprovedGen2 && totalAmountSelected > 0 ?
				<div className='flex flex-col w-full space-y-3 my-3 justify-between 
				md:flex-row md:max-w-md md:space-y-0'>
					<Button label={`Cancel`} color='red'
						onClick={deselectAll}
					/>
					<Button label={`${stakeMode ? 'Stake' : 'Unstake'} ${totalAmountSelected} hatchies`} color='green' onClick={handleStake} />
				</div>
				:
				<Button label={`Go back`} color='yellow' onClick={returnPage} />
			}
		</div>
	)
}
